// =============================================================================
// AI utama setiap NPC.
// Setiap tick (1 menit dunia):
//   1. decay kebutuhan
//   2. derive label mood untuk display
//   3. kalau aktivitas berakhir → finalize (efek + log)
//   4. kalau idle/wandering → pickGoal()
//   5. kalau di-tengah perjalanan → countdown sampai sampai ke tujuan
//
// Goal types (string):
//   'goto_work', 'goto_home', 'goto_warung', 'goto_kafe', 'goto_toko',
//   'goto_taman', 'goto_klinik', 'goto_kampus', 'goto_jobsearch',
//   'goto_construction'
// =============================================================================

import { pushEvent, pushDrama } from '../simulation/eventSystem.js';
import {
  findBuildingByName, findBuildingsByType, pickBuildingFromTypes,
} from './npcBehavior.js';
import { decayNeeds, deriveMoodLabel } from './npcNeeds.js';
import { remember } from './npcMemory.js';

const TRAVEL_MINUTES = 5; // berapa menit dunia perjalanan dari bangunan ke bangunan
const MOOD_LABEL_EVERY = 6;

// Keluarkan satu NPC sebagai output dari engine. Mood disertakan sebagai string
// label supaya bisa langsung dipakai UI tanpa konversi tambahan.
export function projectNpc(npc) {
  return {
    id: npc.id,
    name: npc.nama,
    age: npc.umur,
    job: npc.pekerjaan,
    mood: deriveMoodLabel(npc.mood),
    money: Math.floor(npc.uang),
    location: npc.lokasi || '—',
    status: npc.aktivitas,
    // Field tambahan (siap dipakai owner drawer di tahap berikut)
    gender: npc.jenisKelamin,
    personality: npc.kepribadian,
    energy: Math.round(npc.energi),
    hunger: Math.round(npc.lapar),
    hygiene: Math.round(npc.kebersihan),
    health: Math.round(npc.kesehatan),
    stress: Math.round(npc.stres),
    skill: Math.round(npc.skill),
    reputation: Math.round(npc.reputasi),
    savings: Math.floor(npc.tabungan),
    home: npc.rumah,
    employer: npc._workplaceLabel,
    shirt: npc.warnaBaju,
  };
}

// Dipanggil engine setiap tick untuk semua NPC.
export function tickNpc(npc, world) {
  // 1. decay kebutuhan
  decayNeeds(npc);

  // 2. aktivitas berakhir?
  if (npc._activityUntil && world._minutesTotal >= npc._activityUntil) {
    finalizeActivity(npc, world);
  }

  // 3. dalam perjalanan? — count down sampai tiba.
  if (npc._pendingGoal && npc.aktivitas?.startsWith('Berjalan')) {
    if (world._minutesTotal >= npc._activityUntil) {
      arrive(npc, world);
    }
    return; // saat berjalan, tidak ambil keputusan baru
  }

  // 4. idle? cari goal baru.
  if (!npc._pendingGoal && (npc.aktivitas === 'Diam'
      || npc.aktivitas === 'Bersantai di rumah'
      || npc.aktivitas === 'Bersantai')) {
    const goal = pickGoal(npc, world);
    if (goal) startGoal(npc, world, goal);
  }
}

// =============================================================================
// Decision logic
// =============================================================================

function pickGoal(npc, world) {
  const jam = world.jam;
  const cuaca = world.cuaca;
  const malam = jam >= 22 || jam < 5;
  const bekerja_jam = jam >= 9 && jam < 17;
  const kuliah_jam = jam >= 8 && jam < 15;

  // 1. Mendesak: lapar tinggi → cari makan kalau punya uang
  if (npc.lapar < 30 && npc.uang >= 15000) {
    const target = pickBuildingFromTypes(world, ['warung', 'kafe']);
    if (target) return makeGoal(target.type === 'warung' ? 'goto_warung' : 'goto_kafe', target);
  }

  // 2. Energi rendah → pulang/tidur
  if (npc.energi < 25 && npc.rumah) {
    const home = findBuildingByName(world, npc.rumah);
    if (home) return makeGoal('goto_home', home);
  }

  // 3. Hujan deras / badai → masuk ke bangunan terdekat (rumah dulu)
  if ((cuaca === 'Hujan Deras' || cuaca === 'Badai') && npc.aktivitas !== 'Tidur' && npc.rumah) {
    const home = findBuildingByName(world, npc.rumah);
    if (home && Math.random() < 0.5) return makeGoal('goto_home', home);
  }

  // 4. Malam (22-04) → pulang tidur
  if (malam && npc.rumah) {
    const home = findBuildingByName(world, npc.rumah);
    if (home) return makeGoal('goto_home', home);
  }

  // 5. Pekerjaan
  if (bekerja_jam && npc.statusPekerjaan === 'Bekerja' && npc._workplaceLabel) {
    const wp = findBuildingByName(world, npc._workplaceLabel);
    if (wp) return makeGoal('goto_work', wp);
  }
  if (kuliah_jam && npc.pekerjaan === 'Mahasiswa') {
    const kampus = pickBuildingFromTypes(world, ['kampus']);
    if (kampus) return makeGoal('goto_kampus', kampus);
  }

  // 6. Tukang Bangunan → ke proyek dibangun
  if (npc.pekerjaan === 'Tukang Bangunan' && bekerja_jam) {
    const proj = world.buildings.find((b) => b.status === 'Dibangun');
    if (proj) return makeGoal('goto_construction', proj);
  }

  // 7. Pengangguran → cari kerja siang hari
  if (npc.pekerjaan === 'Pengangguran' && jam >= 9 && jam < 16 && Math.random() < 0.4) {
    return { kind: 'goto_jobsearch', target: null };
  }

  // 8. Mood rendah → ke taman atau kafe
  if (npc.mood < 35) {
    const target = pickBuildingFromTypes(world, ['taman', 'kafe']);
    if (target) return makeGoal(target.type === 'taman' ? 'goto_taman' : 'goto_kafe', target);
  }

  // 9. Sosial — sore/malam: nongkrong/belanja sesekali
  if (jam >= 17 && jam < 22 && Math.random() < 0.35) {
    const target = pickBuildingFromTypes(world, ['kafe', 'toko', 'taman']);
    if (target) {
      const kindByType = {
        kafe: 'goto_kafe',
        toko: 'goto_toko',
        taman: 'goto_taman',
      };
      return makeGoal(kindByType[target.type], target);
    }
  }

  // 10. Default: kembali ke rumah / bersantai
  if (npc.rumah) {
    const home = findBuildingByName(world, npc.rumah);
    if (home && npc.lokasi !== home.name) return makeGoal('goto_home', home);
  }
  return null; // biarkan idle
}

function makeGoal(kind, building) {
  return { kind, target: building.name };
}

// =============================================================================
// Movement & arrive
// =============================================================================

function startGoal(npc, world, goal) {
  npc._pendingGoal = goal;
  npc.tujuan = goal.target || null;

  // Kalau goal-nya cari kerja: kita render seperti "berjalan keliling kota"
  // dan setelah TRAVEL_MINUTES → coba diterima kerja di mana.
  npc.aktivitas = goal.target
    ? `Berjalan ke ${goal.target}`
    : 'Berjalan mencari kerja';

  npc._activityUntil = world._minutesTotal + TRAVEL_MINUTES;

  // Beberapa goal worth dilog di feed kota.
  const journeyEvent = describeJourneyStart(npc, world, goal);
  if (journeyEvent) pushEvent(world, journeyEvent.text, journeyEvent.kategori);
}

function describeJourneyStart(npc, world, goal) {
  switch (goal.kind) {
    case 'goto_work':
      return { text: `${npc.nama} pergi bekerja di ${goal.target}.`, kategori: 'PEKERJAAN' };
    case 'goto_kampus':
      return { text: `${npc.nama} berangkat kuliah.`, kategori: 'KOTA' };
    case 'goto_construction':
      return { text: `${npc.nama} berangkat ke proyek pembangunan.`, kategori: 'PEMBANGUNAN' };
    case 'goto_jobsearch':
      return { text: `${npc.nama} mencari pekerjaan.`, kategori: 'PEKERJAAN' };
    default:
      return null;
  }
}

function arrive(npc, world) {
  const goal = npc._pendingGoal;
  if (!goal) return;
  npc._pendingGoal = null;
  if (goal.target) npc.lokasi = goal.target;
  npc.tujuan = null;

  switch (goal.kind) {
    case 'goto_home': {
      // Malam → tidur, siang → bersantai sebentar
      if (world.jam >= 22 || world.jam < 5) {
        npc.aktivitas = 'Tidur';
        npc._activityUntil = world._minutesTotal + 6 * 60;
      } else {
        npc.aktivitas = 'Bersantai di rumah';
        npc._activityUntil = world._minutesTotal + 30;
      }
      break;
    }
    case 'goto_work': {
      npc.aktivitas = `Bekerja di ${goal.target}`;
      npc._activityUntil = world._minutesTotal + 4 * 60;
      break;
    }
    case 'goto_kampus': {
      npc.aktivitas = 'Belajar di kampus';
      npc._activityUntil = world._minutesTotal + 3 * 60;
      break;
    }
    case 'goto_kafe': {
      npc.aktivitas = `Nongkrong di ${goal.target}`;
      npc._activityUntil = world._minutesTotal + 30;
      pushEvent(world, `${npc.nama} membeli kopi di ${goal.target}.`, 'KOTA');
      break;
    }
    case 'goto_warung': {
      npc.aktivitas = `Makan di ${goal.target}`;
      npc._activityUntil = world._minutesTotal + 25;
      pushEvent(world, `${npc.nama} makan di ${goal.target}.`, 'KOTA');
      break;
    }
    case 'goto_toko': {
      npc.aktivitas = `Belanja di ${goal.target}`;
      npc._activityUntil = world._minutesTotal + 25;
      pushEvent(world, `${npc.nama} belanja di ${goal.target}.`, 'EKONOMI');
      break;
    }
    case 'goto_taman': {
      npc.aktivitas = 'Nongkrong di Taman Kota';
      npc._activityUntil = world._minutesTotal + 35;
      break;
    }
    case 'goto_construction': {
      npc.aktivitas = `Membangun ${goal.target}`;
      npc._activityUntil = world._minutesTotal + 4 * 60;
      pushEvent(world, `${npc.nama} mulai membangun ${goal.target}.`, 'PEMBANGUNAN');
      break;
    }
    case 'goto_jobsearch': {
      npc.aktivitas = 'Melamar pekerjaan';
      npc._activityUntil = world._minutesTotal + 30;
      break;
    }
    default:
      npc.aktivitas = 'Diam';
      npc._activityUntil = 0;
  }
}

// =============================================================================
// Finalize aktivitas (kasih efek ke kebutuhan + uang + log).
// =============================================================================

function finalizeActivity(npc, world) {
  const a = npc.aktivitas;

  // Tidur — pulihkan energi penuh.
  if (a === 'Tidur') {
    npc.energi = 100;
    npc.kesehatan = Math.min(100, npc.kesehatan + 5);
    npc.aktivitas = 'Bersantai di rumah';
    npc._activityUntil = world._minutesTotal + 5;
    return;
  }

  // Makan/minum — pulihkan lapar.
  if (a.startsWith('Makan')) {
    npc.lapar = 100;
    const cost = 18000;
    npc.uang = Math.max(0, npc.uang - cost);
    rememberAndIdle(npc, world, `Makan enak di ${npc.lokasi}.`, 'KEHIDUPAN');
    return;
  }
  if (a.startsWith('Nongkrong di Kafe') || a.startsWith('Nongkrong di Warung')) {
    npc.lapar = Math.min(100, npc.lapar + 25);
    npc.mood = Math.min(100, npc.mood + 6);
    npc.uang = Math.max(0, npc.uang - 22000);
    rememberAndIdle(npc, world, `Sempat ngopi di ${npc.lokasi}.`, 'KEHIDUPAN');
    return;
  }

  // Bekerja — kasih gaji + kurangi energi.
  if (a.startsWith('Bekerja')) {
    npc.energi = Math.max(15, npc.energi - 18);
    const wage = wageFor(npc.pekerjaan);
    if (wage > 0) {
      npc.uang += wage;
      // Hemat: 30% disisihkan ke tabungan.
      if (npc.kepribadian === 'Hemat') {
        const save = Math.floor(wage * 0.3);
        npc.uang -= save;
        npc.tabungan += save;
      }
      pushEvent(world, `${npc.nama} pulang kerja dari ${npc.lokasi}.`, 'PEKERJAAN');
    }
    npc.aktivitas = 'Diam';
    npc._activityUntil = 0;
    return;
  }

  // Membangun — kasih upah + kemajuan proyek dihitung di construction system.
  if (a.startsWith('Membangun')) {
    const wage = 60000 + Math.floor(Math.random() * 30000);
    npc.uang += wage;
    npc.energi = Math.max(20, npc.energi - 25);
    pushEvent(world, `${npc.nama} selesai shift di proyek ${npc.lokasi}.`, 'PEMBANGUNAN');
    npc.aktivitas = 'Diam';
    npc._activityUntil = 0;
    return;
  }

  // Belajar di kampus — naikkan skill + biaya kecil.
  if (a === 'Belajar di kampus') {
    npc.skill = Math.min(100, npc.skill + 1.5);
    npc.energi = Math.max(20, npc.energi - 8);
    if (Math.random() < 0.15) {
      pushDrama(world, `${npc.nama} mendapat nilai bagus di kampus.`, 'PRESTASI');
    }
    rememberAndIdle(npc, world, 'Selesai kuliah hari ini.', 'PRESTASI');
    return;
  }

  // Belanja
  if (a.startsWith('Belanja')) {
    const cost = 25000 + Math.floor(Math.random() * 25000);
    npc.uang = Math.max(0, npc.uang - cost);
    npc.kebersihan = Math.min(100, npc.kebersihan + 5);
    npc.aktivitas = 'Diam';
    npc._activityUntil = 0;
    return;
  }

  // Taman
  if (a === 'Nongkrong di Taman Kota') {
    npc.mood = Math.min(100, npc.mood + 12);
    npc.stres = Math.max(0, npc.stres - 8);
    rememberAndIdle(npc, world, 'Bersantai di taman kota.', 'KEHIDUPAN');
    return;
  }

  // Bersantai di rumah
  if (a === 'Bersantai di rumah' || a === 'Bersantai') {
    npc.aktivitas = 'Diam';
    npc._activityUntil = 0;
    return;
  }

  // Melamar pekerjaan
  if (a === 'Melamar pekerjaan') {
    const accepted = Math.random() < 0.4 + Math.min(0.4, npc.skill / 200);
    if (accepted) {
      // Cari workplace acak yang bukan kosong
      const wp = pickRandomEmployer(world);
      if (wp) {
        npc._workplaceLabel = wp.name;
        npc.pekerjaan = jobFor(wp.type);
        npc.statusPekerjaan = 'Bekerja';
        pushEvent(world, `${npc.nama} diterima kerja sebagai ${npc.pekerjaan} di ${wp.name}.`, 'PEKERJAAN');
        pushDrama(world, `${npc.nama} dapat pekerjaan baru di ${wp.name}.`, 'PRESTASI');
      }
    } else {
      pushDrama(world, `${npc.nama} ditolak melamar kerja hari ini.`, 'PEKERJAAN');
    }
    npc.aktivitas = 'Diam';
    npc._activityUntil = 0;
    return;
  }

  // Default: idle.
  npc.aktivitas = 'Diam';
  npc._activityUntil = 0;
}

function rememberAndIdle(npc, world, text, kategori) {
  remember(npc, world, text, kategori);
  npc.aktivitas = 'Diam';
  npc._activityUntil = 0;
}

// =============================================================================
// Helpers
// =============================================================================

function wageFor(pekerjaan) {
  switch (pekerjaan) {
    case 'Programmer':       return 80000  + Math.floor(Math.random() * 50000);
    case 'Pegawai Kantor':   return 60000  + Math.floor(Math.random() * 30000);
    case 'Barista':          return 40000  + Math.floor(Math.random() * 25000);
    case 'Pegawai Toko':     return 40000  + Math.floor(Math.random() * 20000);
    case 'Pedagang':         return 35000  + Math.floor(Math.random() * 30000);
    case 'Dokter':           return 110000 + Math.floor(Math.random() * 50000);
    case 'Perawat':          return 60000  + Math.floor(Math.random() * 30000);
    case 'Polisi':           return 75000  + Math.floor(Math.random() * 25000);
    default:                 return 0;
  }
}

function jobFor(buildingType) {
  switch (buildingType) {
    case 'kantor':   return 'Pegawai Kantor';
    case 'kafe':     return 'Barista';
    case 'toko':     return 'Pegawai Toko';
    case 'warung':   return 'Pedagang';
    case 'klinik':   return 'Perawat';
    case 'polisi':   return 'Polisi';
    default:         return 'Pegawai';
  }
}

function pickRandomEmployer(world) {
  const list = world.buildings.filter(
    (b) => ['kantor', 'kafe', 'toko', 'warung', 'klinik'].includes(b.type)
        && b.status !== 'Dibangun' && b.status !== 'Bangkrut',
  );
  if (!list.length) return null;
  return list[Math.floor(Math.random() * list.length)];
}

// Event sosial random — dipanggil dari engine sekali per beberapa tick.
// Memilih sepasang NPC yang berdekatan logis (idle / di lokasi sama) lalu
// memicu drama kecil. Dipisah dari tickNpc supaya tidak ditembak per-NPC.
export function tickSocialEncounters(world) {
  const npcs = world._npcs;
  if (!npcs || npcs.length < 2) return;
  // Probability rendah supaya tidak spam.
  if (Math.random() > 0.04) return;

  const a = npcs[Math.floor(Math.random() * npcs.length)];
  const candidates = npcs.filter((n) => n.id !== a.id && n.lokasi === a.lokasi);
  if (!candidates.length) return;
  const b = candidates[Math.floor(Math.random() * candidates.length)];

  // Hasil tergantung kepribadian.
  const aggressiveSet = new Set(['Mudah Marah', 'Drama Queen']);
  const helperSet = new Set(['Suka Menolong', 'Pemberani']);
  const romanticSet = new Set(['Romantis']);

  const r = Math.random();
  if ((aggressiveSet.has(a.kepribadian) || aggressiveSet.has(b.kepribadian)) && r < 0.35) {
    bumpRelation(a, b, -8);
    pushDrama(world, `${a.nama} dan ${b.nama} bertengkar di ${a.lokasi}.`, 'KONFLIK');
    return;
  }
  if (helperSet.has(a.kepribadian) && r < 0.2) {
    bumpRelation(a, b, +5);
    pushDrama(world, `${a.nama} membantu ${b.nama} di ${a.lokasi}.`, 'KEBAIKAN');
    return;
  }
  if (romanticSet.has(a.kepribadian) && r < 0.15) {
    bumpRelation(a, b, +8);
    pushDrama(world, `${a.nama} mulai dekat dengan ${b.nama}.`, 'CINTA');
    return;
  }
  if (r < 0.5) {
    bumpRelation(a, b, +2);
    pushDrama(world, `${a.nama} dan ${b.nama} ngobrol santai di ${a.lokasi}.`, 'KEHIDUPAN');
  }
}

function bumpRelation(a, b, delta) {
  a.relasi[b.id] = clamp((a.relasi[b.id] ?? 0) + delta, -100, 100);
  b.relasi[a.id] = clamp((b.relasi[a.id] ?? 0) + delta, -100, 100);
}

function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
