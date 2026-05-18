// Status strip ringkas untuk halaman live.
// Hari · Jam · Waktu Hari · Cuaca · Ekonomi · Populasi.
import { useSimulation } from '../../hooks/useSimulation.js';

export default function LiveStatusStrip({ variant = 'horizontal' }) {
  const { snapshot } = useSimulation();
  const clock = `${String(snapshot.jam).padStart(2, '0')}:${String(snapshot.menit).padStart(2, '0')}`;

  const items = [
    { label: 'Hari',     value: String(snapshot.hari),       color: 'text-neon-cyan'   },
    { label: 'Jam',      value: clock,                        color: 'text-white'       },
    { label: 'Waktu',    value: snapshot.waktuHari,           color: 'text-slate-300'   },
    { label: 'Cuaca',    value: snapshot.cuaca,               color: cuacaColor(snapshot.cuaca) },
    { label: 'Ekonomi',  value: snapshot.ekonomi,             color: ekonomiColor(snapshot.ekonomi) },
    { label: 'Populasi', value: `${snapshot.populasi} jiwa`,  color: 'text-neon-pink'   },
  ];

  if (variant === 'vertical') {
    // Stack 2 kolom × 3 baris.
    return (
      <div className="grid grid-cols-2 gap-1.5 px-2">
        {items.map((it) => (
          <div
            key={it.label}
            className="flex items-center gap-2 rounded-md border border-white/10 bg-ink-950/70 backdrop-blur px-2 py-1"
          >
            <span className="text-[9px] font-mono uppercase tracking-wider text-slate-500">{it.label}</span>
            <span className={`text-[11px] font-mono ${it.color} truncate`}>{it.value}</span>
          </div>
        ))}
      </div>
    );
  }

  // Horizontal: single line strip.
  return (
    <div className="flex items-center justify-center gap-2 flex-wrap">
      {items.map((it, i) => (
        <div
          key={it.label}
          className="flex items-center gap-2 rounded-md border border-white/10 bg-ink-950/70 backdrop-blur px-2.5 py-1"
        >
          <span className="text-[9px] font-mono uppercase tracking-wider text-slate-500">{it.label}</span>
          <span className={`text-[12px] font-mono ${it.color}`}>{it.value}</span>
          {i < items.length - 1 ? <span className="text-slate-600">·</span> : null}
        </div>
      ))}
    </div>
  );
}

function cuacaColor(c) {
  if (c === 'Cerah')   return 'text-neon-amber';
  if (c === 'Mendung') return 'text-slate-300';
  if (c === 'Hujan' || c === 'Hujan Deras') return 'text-neon-blue';
  if (c === 'Badai')   return 'text-neon-violet';
  return 'text-slate-300';
}
function ekonomiColor(e) {
  if (e === 'Naik')   return 'text-neon-lime';
  if (e === 'Stabil') return 'text-neon-cyan';
  if (e === 'Turun')  return 'text-neon-amber';
  if (e === 'Krisis') return 'text-neon-red';
  return 'text-slate-300';
}
