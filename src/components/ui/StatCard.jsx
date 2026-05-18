// Kartu statistik kecil bertema cyberpunk.
export default function StatCard({ label, value, hint, accent = 'cyan' }) {
  const color =
    accent === 'cyan'   ? 'text-neon-cyan'   :
    accent === 'violet' ? 'text-neon-violet' :
    accent === 'pink'   ? 'text-neon-pink'   :
    accent === 'lime'   ? 'text-neon-lime'   :
    accent === 'amber'  ? 'text-neon-amber'  :
    'text-neon-cyan';
  return (
    <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3 flex flex-col gap-1">
      <div className="stat-label">{label}</div>
      <div className={`font-display text-lg tracking-wide ${color}`}>{value}</div>
      {hint ? <div className="font-mono text-[10px] text-slate-500">{hint}</div> : null}
    </div>
  );
}
