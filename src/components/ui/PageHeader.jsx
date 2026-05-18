// Header halaman dengan judul, subtitle, dan slot action di kanan.
export default function PageHeader({ eyebrow, title, subtitle, right }) {
  return (
    <div className="flex items-end justify-between gap-4 px-4 py-4 border-b border-white/5">
      <div>
        {eyebrow ? (
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-neon-violet/80 mb-1">
            {eyebrow}
          </div>
        ) : null}
        <h1 className="font-display text-xl text-white leading-tight">{title}</h1>
        {subtitle ? (
          <p className="text-xs text-slate-400 mt-1 font-mono">{subtitle}</p>
        ) : null}
      </div>
      {right ? <div className="flex items-center gap-2">{right}</div> : null}
    </div>
  );
}
