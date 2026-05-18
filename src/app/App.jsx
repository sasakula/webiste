// App root — router NeoLife Indonesia.
// Setiap halaman dibungkus oleh Shell yang menyediakan top bar + nav side.
import { Routes, Route, Navigate } from 'react-router-dom';
import Shell from '../components/layout/Shell.jsx';
import OwnerDashboard from '../routes/OwnerDashboard.jsx';
import LiveHorizontal from '../routes/LiveHorizontal.jsx';
import LiveVertical from '../routes/LiveVertical.jsx';
import Settings from '../routes/Settings.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<Shell />}>
        <Route path="/" element={<Navigate to="/owner" replace />} />
        <Route path="/owner" element={<OwnerDashboard />} />
        <Route path="/live" element={<LiveHorizontal />} />
        <Route path="/live/vertical" element={<LiveVertical />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

function NotFound() {
  return (
    <div className="h-full flex items-center justify-center text-slate-400 font-mono">
      <div className="text-center">
        <div className="text-6xl font-display text-neon-violet neon-text mb-2">404</div>
        <div>Halaman tidak ditemukan</div>
      </div>
    </div>
  );
}
