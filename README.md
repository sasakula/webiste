# Cetakindo Print - Website Katalog Jasa Percetakan

Website katalog modern & responsive untuk jasa percetakan digital printing.
Dibangun dengan **React + Vite + Tailwind CSS**.

## Fitur

- Hero section dengan CTA WhatsApp & Lihat Katalog
- Katalog 8 produk (Banner, Stiker, Nota, Undangan, ID Card, Akrilik, Kaos, Brosur)
- Section Keunggulan, Cara Order (5 langkah), Paket Promo (UMKM/Sekolah/Event)
- Testimoni & FAQ accordion
- Footer dengan info kontak, jam buka, Instagram, dan WhatsApp
- Floating WhatsApp button
- Animasi halus saat scroll (Intersection Observer)
- Responsive untuk HP, tablet, dan PC
- Tema warna: biru tua, putih, aksen kuning/oranye

## Menjalankan Project

```bash
npm install
npm run dev
```

Buka <http://localhost:5173> di browser.

## Build untuk Produksi

```bash
npm run build
npm run preview
```

## Struktur Folder

```
src/
  components/      Komponen reusable (Navbar, ProductCard, Icon, dst.)
  config/          Konfigurasi terpusat (info kontak, link WhatsApp)
  data/            Data konten (products, features, testimonials, faqs, dll.)
  hooks/           Custom hooks (useScrollReveal)
  sections/        Section halaman (Hero, ProductCatalog, FAQ, dst.)
  utils/           Helper (formatRupiah)
  App.jsx          Root komponen
  main.jsx         Entry point
  index.css        Tailwind directives & utilities kustom
```

## Kustomisasi Konten

- **Info usaha & nomor WhatsApp** -> `src/config/site.js`
- **Daftar produk & harga** -> `src/data/products.js`
- **Paket promo** -> `src/data/promoPackages.js`
- **Testimoni / FAQ / Keunggulan / Cara order** -> file lain di `src/data/`
- **Warna brand** -> `tailwind.config.js` (palet `brand` & `accent`)
