// LiveShell — wrapper layout untuk halaman penonton (live).
// Fullscreen, tanpa sidebar / topbar admin. Cocok untuk OBS / livestream.
// Hanya menambahkan tombol kecil "Keluar" di pojok yang bisa di-hide saat OBS.
import { Outlet, Link } from 'react-router-dom';

export default function LiveShell() {
  return (
    <div className="h-full w-full bg-ink-950 text-slate-200 overflow-hidden relative">
      {/* Tombol kecil keluar dari mode live (kembali ke pemilihan mode).
          Cukup tersembunyi di pojok kiri-bawah biar tidak ganggu stream. */}
      <Link
        to="/"
        className="absolute bottom-3 left-3 z-30 chip opacity-50 hover:opacity-100 transition"
        title="Keluar dari mode live"
      >
        ← Keluar
      </Link>

      {/* Halaman live render full-bleed di sini. */}
      <Outlet />
    </div>
  );
}
