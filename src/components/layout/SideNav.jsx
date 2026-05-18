// Sidebar navigasi admin (dipakai di Shell, bukan di LiveShell).
import { NavLink } from 'react-router-dom';

const NAV = [
  { to: '/owner',          label: 'Dashboard Owner',  icon: '◉' },
  { to: '/settings',       label: 'Pengaturan',       icon: '⚙' },
];

const NAV_LIVE = [
  { to: '/live',           label: 'Live · 16:9',       icon: '▭' },
  { to: '/live-vertical',  label: 'Live · 9:16',       icon: '▯' },
];

export default function SideNav() {
  return (
    <aside className="w-[210px] min-w-[210px] border-r border-white/5 bg-ink-900/40 px-3 py-4 flex flex-col gap-1">
      <div className="px-2 mb-2 stat-label">Admin</div>
      {NAV.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `nav-link ${isActive ? '!border-neon-cyan/50 !bg-neon-cyan/5 !text-neon-cyan' : ''}`
          }
        >
          <span className="text-neon-violet">{item.icon}</span>
          <span>{item.label}</span>
        </NavLink>
      ))}

      <div className="px-2 mt-4 mb-2 stat-label">Tampilan Live</div>
      {NAV_LIVE.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          target="_blank"
          rel="noopener"
          className="nav-link"
          title="Buka di tab baru (cocok untuk OBS / OBS browser source)"
        >
          <span className="text-neon-pink">{item.icon}</span>
          <span>{item.label}</span>
          <span className="ml-auto text-[9px] text-slate-600">↗</span>
        </NavLink>
      ))}

      <div className="mt-auto px-2 pt-3 border-t border-white/5 font-mono text-[10px] text-slate-600 uppercase tracking-wider">
        v0.1 · pixel simulator
      </div>
    </aside>
  );
}
