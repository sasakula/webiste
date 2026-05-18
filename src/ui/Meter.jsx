// Small horizontal bar meter for NPC needs. Color shifts based on value.
export default function Meter({ value, max = 100, color, label }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const tone =
    color ||
    (pct < 25 ? '#f87171' : pct < 50 ? '#fbbf24' : '#a3e635');
  return (
    <div className="flex flex-col gap-1">
      {label ? (
        <div className="flex items-center justify-between">
          <span className="stat-label">{label}</span>
          <span className="text-[10px] font-mono text-slate-400">{Math.round(value)}</span>
        </div>
      ) : null}
      <div className="meter">
        <div
          className="meter-fill"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${tone}, ${tone}aa)`,
            boxShadow: `0 0 8px ${tone}55`,
          }}
        />
      </div>
    </div>
  );
}
