// Factory NPC awal NeoLife Indonesia.
// Membuat 20 warga dengan nama Indonesia tetap (sesuai spec), lalu mendistribusikan
// rumah dan tempat kerja sesuai daftar bangunan yang tersedia.
//
// Setiap NPC punya 24 field sesuai spec — lihat shape `createNpcShape()`.

const FIRST_NAMES = [
  'Rian', 'Salsa', 'Budi', 'Kevin', 'Dinda', 'Linda', 'Udin', 'Maya',
  'Arif', 'Siska', 'Deni', 'Putri', 'Raka', 'Nia', 'Joko', 'Lala',
  'Bagas', 'Wulan', 'Fajar', 'Tono',
];

const PERSONALITIES = [
  'Rajin', 'Pemalas', 'Mudah Marah', 'Romantis', 'Pendiam',
  'Suka Menolong', 'Drama Queen', 'Ambisius', 'Boros', 'Hemat',
  'Pemberani', 'Penakut', 'Suka Gosip', 'Pekerja Keras', 'Suka Santai',
];

// Pekerjaan yang cocok per tipe bangunan workplace.
const JOB_BY_BUILDING_TYPE = {
  kantor: ['Programmer', 'Pegawai Kantor'],
  kafe:   ['Barista'],
  toko:   ['Pegawai Toko'],
  warung: ['Pedagang'],
  klinik: ['Dokter', 'Perawat'],
  polisi: ['Polisi'],
};

const SHIRT_COLORS = [
  '#22d3ee', '#a855f7', '#ec4899', '#a3e635',
  '#fbbf24', '#60a5fa', '#f87171', '#34d399',
  '#f472b6', '#c084fc', '#fb923c', '#67e8f9',
  '#facc15', '#4ade80', '#818cf8', '#e879f9',
  '#22c55e', '#06b6d4', '#d946ef', '#fb7185',
];

function pickFrom(arr, i) { return arr[i % arr.length]; }

// Shape canonical NPC. Dipakai juga sebagai dokumentasi fields.
export function createNpcShape() {
  return {
    id: '',
    nama: '',
    umur: 0,
    jenisKelamin: 'L',          // 'L' | 'P'
    pekerjaan: 'Pengangguran',
    statusPekerjaan: 'Mencari Kerja',

    rumah: null,                // building label (nama bangunan)
    lokasi: null,               // building label (lokasi sekarang)
    tujuan: null,               // building label (saat lagi berjalan)
    aktivitas: 'Diam',

    // Kebutuhan 0..100
    lapar: 100,
    energi: 100,
    mood: 60,
    kesehatan: 100,
    kebersihan: 100,

    // Ekonomi (Rupiah)
    uang: 0,
    tabungan: 0,

    // Sosial
    relasi: {},                 // npcId -> skor (-100..100)
    memori: [],                 // {time, hari, text, kategori}

    // Sifat & metrik
    kepribadian: 'Pendiam',
    stres: 20,
    reputasi: 50,
    skill: 30,
    warnaBaju: '#22d3ee',
  };
}

// Buat 20 NPC sesuai spec. `buildings` = daftar bangunan dari world.
export function createDefaultNPCs(buildings) {
  const homes = buildings.filter(
    (b) => (b.type === 'rumah' || b.type === 'apartemen') && b.status !== 'Dibangun',
  );
  const workplaces = buildings.filter(
    (b) => JOB_BY_BUILDING_TYPE[b.type] && b.status !== 'Dibangun' && b.status !== 'Bangkrut',
  );

  // Slot 'Tukang Bangunan' khusus kalau ada proyek dibangun.
  const hasProject = buildings.some((b) => b.status === 'Dibangun');

  return FIRST_NAMES.map((nama, i) => {
    const home = homes.length ? homes[i % homes.length] : buildings[0];

    // Distribusikan pekerjaan: ~75% punya kantor/usaha, sisanya mahasiswa/pengangguran/tukang.
    let pekerjaan, statusPekerjaan, workplace = null;
    const role = i % 5;

    if (role === 4) {
      // Pengangguran / Mahasiswa
      const umur = 18 + ((i * 7) % 8); // 18-25
      if (umur < 23) {
        pekerjaan = 'Mahasiswa';
        statusPekerjaan = 'Kuliah';
      } else {
        pekerjaan = 'Pengangguran';
        statusPekerjaan = 'Mencari Kerja';
      }
    } else if (role === 3 && hasProject) {
      pekerjaan = 'Tukang Bangunan';
      statusPekerjaan = 'Bekerja';
    } else if (workplaces.length) {
      workplace = workplaces[i % workplaces.length];
      const opts = JOB_BY_BUILDING_TYPE[workplace.type] || ['Pegawai'];
      pekerjaan = pickFrom(opts, i);
      statusPekerjaan = 'Bekerja';
    } else {
      pekerjaan = 'Pengangguran';
      statusPekerjaan = 'Mencari Kerja';
    }

    const umur = pekerjaan === 'Mahasiswa'
      ? 18 + ((i * 3) % 6)
      : pekerjaan === 'Pelajar'
      ? 14 + ((i * 3) % 4)
      : 22 + ((i * 13) % 28);

    return {
      ...createNpcShape(),
      id: `npc_${i + 1}`,
      nama,
      umur,
      jenisKelamin: i % 2 === 0 ? 'L' : 'P',
      pekerjaan,
      statusPekerjaan,

      rumah: home?.name ?? null,
      lokasi: home?.name ?? null,   // mulai di rumah
      tujuan: null,
      aktivitas: 'Bersantai di rumah',

      lapar:      70 + ((i * 11) % 25),
      energi:     75 + ((i * 7)  % 20),
      mood:       55 + ((i * 13) % 35),
      kesehatan:  85 + ((i * 5)  % 12),
      kebersihan: 80 + ((i * 9)  % 18),

      uang:     50000  + ((i * 35000) % 400000),
      tabungan: 0      + ((i * 80000) % 700000),

      relasi: {},
      memori: [],

      kepribadian: pickFrom(PERSONALITIES, i),
      stres:    10 + ((i * 7)  % 30),
      reputasi: 40 + ((i * 11) % 30),
      skill:    30 + ((i * 7)  % 60),
      warnaBaju: pickFrom(SHIRT_COLORS, i),

      // === Internal counter (engine-only, prefix `_`) ===
      _workplaceLabel: workplace?.name ?? null,
      _activityUntil:  0,
      _pendingGoal:    null,
    };
  });
}
