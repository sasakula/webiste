// World state — bentuk lengkap state simulasi NeoLife Indonesia.
//
// Field utama (sesuai spec):
//   hari, jam, menit         - waktu dalam dunia simulasi
//   waktuHari                - 'Pagi' | 'Siang' | 'Sore' | 'Malam' | 'Larut Malam'
//   cuaca                    - 'Cerah' | 'Mendung' | 'Hujan' | 'Hujan Deras' | 'Badai'
//   ekonomi                  - 'Naik' | 'Stabil' | 'Turun' | 'Krisis'
//   kriminalitas, kebahagiaan- 0..100
//   populasi                 - jumlah warga
//   eventLog, dramaLog       - feed kejadian + drama (terbaru di indeks 0)
//   npcs, buildings          - daftar warga & bangunan
//   paused, speed            - kontrol simulasi (1, 2, 4, 8)
//
// Field "_internal" (prefix `_`) hanya dipakai engine; UI tidak perlu baca.

const SEED_BUILDINGS = [
  { id: 'bld_1', name: 'Kantor Polisi',      type: 'polisi',    district: 'Timur',   status: 'Aktif',     progress: 1   },
  { id: 'bld_2', name: 'Kafe Salsa',         type: 'kafe',      district: 'Tengah',  status: 'Ramai',     progress: 1   },
  { id: 'bld_3', name: 'Kantor Utama',       type: 'kantor',    district: 'Utara',   status: 'Normal',    progress: 1   },
  { id: 'bld_4', name: 'Toko Serba Ada',     type: 'toko',      district: 'Tengah',  status: 'Sepi',      progress: 1   },
  { id: 'bld_5', name: 'Apartemen Neon',     type: 'apartemen', district: 'Utara',   status: 'Penuh 80%', progress: 1   },
  { id: 'bld_6', name: 'Klinik Sehat',       type: 'klinik',    district: 'Barat',   status: 'Normal',    progress: 1   },
  { id: 'bld_7', name: 'Rumah Rian',         type: 'rumah',     district: 'Selatan', status: 'Dihuni',    progress: 1   },
  { id: 'bld_8', name: 'Proyek Rumah Udin',  type: 'rumah',     district: 'Selatan', status: 'Dibangun',  progress: 0.45 },
];

const SEED_NPCS = [
  { id: 'npc_1', name: 'Rian Saputra',  age: 24, job: 'Programmer',      mood: 'Senang',  money: 450000, location: 'Kantor Utama',  status: 'Sedang bekerja' },
  { id: 'npc_2', name: 'Salsa Pratama', age: 22, job: 'Barista',         mood: 'Galau',   money: 280000, location: 'Kafe Salsa',    status: 'Jaga kafe' },
  { id: 'npc_3', name: 'Udin Hartono',  age: 30, job: 'Tukang Bangunan', mood: 'Lelah',   money: 320000, location: 'Proyek Rumah', status: 'Bangun rumah' },
  { id: 'npc_4', name: 'Kevin Wijaya',  age: 25, job: 'Pengangguran',    mood: 'Sedih',   money: 20000,  location: 'Taman Kota',    status: 'Cari kerja' },
  { id: 'npc_5', name: 'Linda Lestari', age: 23, job: 'Pegawai Kantor',  mood: 'Bahagia', money: 380000, location: 'Kantor Utama',  status: 'Pulang kerja' },
  { id: 'npc_6', name: 'Maya Permata',  age: 28, job: 'Pemilik Usaha',   mood: 'Stres',   money: 1200000,location: 'Warung Maya',   status: 'Buka usaha' },
];

export function createWorld() {
  // Mulai jam 06:30, hari 1.
  const startMinutes = 6 * 60 + 30;
  return {
    // Waktu (akan diisi/diupdate oleh tickTime di engine).
    hari: 1,
    jam: 6,
    menit: 30,
    waktuHari: 'Pagi',

    // Cuaca, ekonomi, kriminalitas, kebahagiaan.
    cuaca: 'Cerah',
    ekonomi: 'Stabil',
    ekonomiIndex: 100,
    ekonomiMomentum: 0,
    kriminalitas: 12,
    kebahagiaan: 65,

    // Daftar entitas dunia.
    populasi: SEED_NPCS.length,
    npcs: SEED_NPCS,
    buildings: SEED_BUILDINGS,

    // Log feed.
    eventLog: [],
    dramaLog: [],

    // Kontrol simulasi.
    paused: false,
    speed: 1,                  // 1, 2, 4, atau 8

    // Internal counters (engine-only).
    _minutesTotal: startMinutes,
    _lastWeatherChange: 0,
    _lastRandomEvent: 0,
    _lastScheduledHour: -1,
    _eventCounter: 1,
  };
}
