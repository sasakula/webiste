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
//   npcs, buildings          - daftar warga & bangunan (dipakai UI)
//   paused, speed            - kontrol simulasi (1, 2, 4, 8)
//
// Field "_internal" (prefix `_`) hanya dipakai engine; UI tidak perlu baca.
//   _npcs                    - shape kaya per-NPC (24 field, dipakai AI)
//                              UI selalu baca `npcs` (proyeksi snapshot ringan).

import { createDefaultNPCs } from '../npc/npcData.js';

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

export function createWorld() {
  // Mulai jam 06:30, hari 1.
  const startMinutes = 6 * 60 + 30;

  const npcs = createDefaultNPCs(SEED_BUILDINGS);

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
    populasi: npcs.length,
    // `npcs` di sini adalah array yang DI-OVERWRITE engine setiap tick dengan
    // proyeksi ringan dari `_npcs`. UI baca dari sini.
    npcs: [],
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
    _npcs: npcs,                // shape kaya per-NPC (24 field) — dipakai AI
  };
}
