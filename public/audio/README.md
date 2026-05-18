# Folder Audio NeoLife Indonesia

Owner cukup menaruh file audio di folder ini, tanpa edit kode. Sistem audio
otomatis akan memuat file saat ditemukan, dan tetap berjalan tanpa error
kalau file belum ada (status di Owner Dashboard akan menampilkan
"Belum Tersedia").

## Struktur folder

```
public/audio/
├── music/        # musik latar — looping
├── ambient/      # layer ambient — looping, bisa aktif paralel
└── sfx/          # efek suara pendek — one-shot
```

## Catatan penting

- **Jangan gunakan lagu copyright.** Pakai musik bebas-royalti / CC0 atau
  bikin sendiri. Beberapa sumber gratis: Pixabay, Free Music Archive,
  Mixkit, OpenGameArt, Kevin MacLeod (atribusi).
- **Format file**: gunakan `.mp3` (kompatibel paling luas) atau `.ogg`
  kalau ingin lossless/ringan. Hindari `.wav` (besar, tidak streamable).
- **Durasi musik & ambient**: 1-3 menit dan loopable (potong tail
  supaya seamless). Engine memutar `loop = true`.
- **Durasi SFX**: pendek (< 2 detik). One-shot tidak loop.
- **Volume mastering**: normalisasi sekitar `-14 LUFS` supaya semua
  layer terdengar konsisten saat di-mix oleh engine.

## Daftar file yang diharapkan

### `music/` — pilih sesuai mood

| File                     | Mood       | Catatan                          |
| ------------------------ | ---------- | -------------------------------- |
| `lofi-cyberpunk.mp3`     | Cyberpunk  | Default, lo-fi sintetis cyberpunk|
| `night-city.mp3`         | Malam Kota | Otomatis aktif jam 19:00 - 04:59 |
| `tension.mp3`            | Tegang     | Saat kriminalitas tinggi / krisis|
| `calm.mp3`               | Santai     | Saat ekonomi stabil & cuaca cerah|

### `ambient/` — layer dapat aktif paralel

| File                  | Aktif kapan                                |
| --------------------- | ------------------------------------------ |
| `rain.mp3`            | Cuaca Hujan / Hujan Deras / Badai          |
| `city-night.mp3`      | Malam (jam ≥ 19 atau < 5)                  |
| `city-day.mp3`        | Siang (jam 5 - 19)                          |
| `cafe.mp3`            | Cadangan — bisa diaktifkan untuk lokasi cafe|
| `traffic.mp3`         | Jam 8-22 (jalan raya pelan)                |
| `park.mp3`            | Cadangan — taman                           |
| `office.mp3`          | Cadangan — kantor                          |
| `police-siren.mp3`    | Kriminalitas > 65%                         |
| `construction.mp3`    | Ada bangunan dengan status "Dibangun"      |

### `sfx/` — efek suara pendek

| File                          | Trigger                         |
| ----------------------------- | ------------------------------- |
| `event-pop.mp3`               | Event umum (PRESTASI, EKONOMI, dll.) |
| `drama-alert.mp3`             | Kategori KONFLIK / DRAMA        |
| `police-siren.mp3`            | Kategori KRIMINAL               |
| `construction-complete.mp3`   | Kategori PEMBANGUNAN            |
| `marriage.mp3`                | Kategori CINTA                  |
| `bankruptcy.mp3`              | Toko bangkrut                   |
| `rain-start.mp3`              | Cuaca berubah jadi hujan        |
| `economy-up.mp3`              | Ekonomi naik                    |
| `economy-down.mp3`            | Ekonomi turun                   |

## Mengganti file

Tinggal copy-paste file ke folder yang sesuai dengan nama persis seperti
tabel di atas. Kalau ingin nama berbeda, edit konstanta `src` di:

- `src/audio/musicSystem.js` (mapping mood → file)
- `src/audio/ambientSystem.js` (mapping layer → file)
- `src/audio/soundEffects.js` (mapping SFX → file)

## Aktivasi audio

Browser modern memblokir autoplay tanpa user gesture. Buka **Owner Dashboard
→ Kontrol Audio** lalu klik "Aktifkan Audio" sekali. Setelah itu engine
akan mengikuti kondisi kota secara otomatis.
