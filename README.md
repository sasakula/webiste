# NeoLife Indonesia

> **Simulasi Kehidupan Pixel Otonom** — kota cyberpunk pixel-art 2D yang dihuni
> NPC otomatis. Dashboard dashboard dan livestream kota berbahasa Indonesia.

> **Status saat ini:** Foundation. Struktur project, router, layout dasar, dan
> tema cyberpunk gelap sudah jalan. Engine simulasi penuh akan dipasang di
> tahap berikutnya.

## Cara Menjalankan

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run preview
```

Butuh Node.js 18 atau lebih baru.

## Tech Stack

- **React 18** + **Vite 5**
- **TailwindCSS 3** (palet neon cyberpunk kustom)
- **Framer Motion** (animasi UI)
- **React Router 6** (navigasi halaman)
- **HTML Canvas 2D** (rendering pixel-art)

## Struktur Folder

```
src/
├── app/
│   └── App.jsx                 # Root + router
├── routes/
│   ├── OwnerDashboard.jsx      # Dashboard owner (kartu status + feed)
│   ├── LiveHorizontal.jsx      # Tampilan livestream 16:9
│   ├── LiveVertical.jsx        # Tampilan livestream 9:16 (HP)
│   └── Settings.jsx            # Pengaturan simulasi
├── components/
│   ├── layout/                 # Shell, TopBar, SideNav
│   ├── ui/                     # Panel, StatCard, PageHeader
│   ├── city/                   # CityCanvasPlaceholder pixel-art
│   ├── owner/                  # (segera) panel khusus dashboard owner
│   ├── live/                   # (segera) komponen khusus halaman live
│   └── npc/                    # (segera) kartu & label NPC
├── simulation/                 # Engine + sistem dunia (placeholder)
│   ├── engine.js
│   ├── world.js
│   ├── timeSystem.js
│   ├── weatherSystem.js
│   ├── economySystem.js
│   ├── crimeSystem.js
│   ├── eventSystem.js
│   ├── relationshipSystem.js
│   ├── jobSystem.js
│   ├── constructionSystem.js
│   └── cameraSystem.js
├── npc/                        # Logika NPC (placeholder)
│   ├── npcData.js
│   ├── npcAI.js
│   ├── npcBehavior.js
│   ├── npcMemory.js
│   └── npcNeeds.js
├── city/                       # Generator + utilitas kota (placeholder)
│   ├── cityGenerator.js
│   ├── cityMap.js
│   ├── buildings.js
│   ├── districts.js
│   └── pathfinding.js
├── data/                       # Data statis (nama, pekerjaan, dll.)
│   ├── names.js
│   ├── jobs.js
│   ├── buildings.js
│   ├── events.js
│   └── personalities.js
├── hooks/                      # React hooks (placeholder)
│   ├── useSimulation.js
│   ├── useNPCs.js
│   ├── useWorldEvents.js
│   └── useCamera.js
├── styles/
│   └── globals.css             # Tailwind + utility cyberpunk
└── utils/
    ├── random.js
    ├── formatter.js
    └── math.js
```

## Halaman

| Path             | Layout    | Deskripsi                                                            |
| ---------------- | --------- | -------------------------------------------------------------------- |
| `/`              | —         | Pemilihan mode (owner / live horizontal / live vertical / settings). |
| `/owner`         | Shell     | Dashboard owner: kartu status, kontrol simulasi, tabel warga, tabel bangunan, log lengkap. |
| `/live`          | LiveShell | Tampilan kota 16:9 cinematic untuk YouTube/Facebook (cocok OBS).     |
| `/live-vertical` | LiveShell | Tampilan kota 9:16 cinematic untuk TikTok/Instagram.                 |
| `/settings`      | Shell     | Pengaturan tema, kecepatan, parameter dunia.                         |

**Shell** menampilkan TopBar admin + SideNav navigasi.
**LiveShell** menampilkan halaman full-bleed tanpa elemen admin (cocok untuk
livestream / OBS browser source).

## Catatan Pengembangan

Semua modul di `simulation/`, `npc/`, dan `city/` saat ini berisi placeholder
ringan agar struktur project lengkap, tetapi tidak menjalankan logika berat.
Tahap berikut akan mengisi:

- Engine fixed-timestep + RAF loop
- Generator kota procedural + 5 distrik
- AI NPC (rutinitas harian, kebutuhan, relasi, memori)
- Sistem cuaca, ekonomi, kriminalitas, pembangunan
- Renderer canvas pixel-art penuh dengan kamera sinematik
- Hook React yang menyatukan world ↔ UI
