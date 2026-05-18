// Router NeoLife Indonesia.
//
// Dua layout utama dipakai bergantian:
//   • Shell      → halaman admin (Owner Dashboard, Settings).
//                  Punya TopBar + SideNav.
//   • LiveShell  → halaman penonton (Live Horizontal, Live Vertical).
//                  Fullscreen, tanpa sidebar, OBS-friendly.
//
// `/` menampilkan halaman pemilihan mode (tanpa shell apapun).
import { Routes, Route } from 'react-router-dom';
import Shell from '../components/layout/Shell.jsx';
import LiveShell from '../components/layout/LiveShell.jsx';
import ModePicker from '../routes/ModePicker.jsx';
import OwnerDashboard from '../routes/OwnerDashboard.jsx';
import LiveHorizontal from '../routes/LiveHorizontal.jsx';
import LiveVertical from '../routes/LiveVertical.jsx';
import Settings from '../routes/Settings.jsx';

export default function App() {
  return (
    <Routes>
      {/* Halaman pemilihan mode (tanpa shell). */}
      <Route path="/" element={<ModePicker />} />

      {/* Halaman admin: pakai Shell dengan sidebar + top bar. */}
      <Route element={<Shell />}>
        <Route path="/owner" element={<OwnerDashboard />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* Halaman live: layout cinematic minimalis untuk livestream / OBS. */}
      <Route element={<LiveShell />}>
        <Route path="/live" element={<LiveHorizontal />} />
        <Route path="/live-vertical" element={<LiveVertical />} />
      </Route>

      {/* Fallback. */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function NotFound() {
  return (
    <div className="h-full w-full flex items-center justify-center bg-ink-950 text-slate-400 font-mono">
      <div className="text-center">
        <div className="text-6xl font-display text-neon-violet neon-text mb-2">404</div>
        <div className="mb-4">Halaman tidak ditemukan</div>
        <a href="/" className="chip text-neon-cyan border-neon-cyan/50 hover:bg-neon-cyan/10">
          Kembali ke beranda
        </a>
      </div>
    </div>
  );
}
