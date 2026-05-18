// Top bar global NeoLife Indonesia.
export default function TopBar() {
  return (
    <header className="flex items-center justify-between gap-4 px-4 py-2 border-b border-white/5 bg-ink-900/70 backdrop-blur">
      <div className="flex items-center gap-3">
        <div className="relative h-9 w-9 rounded-md bg-gradient-to-br from-neon-cyan to-neon-violet flex items-center justify-center font-display font-bold text-ink-950 text-lg">
          N
          <span className="absolute -inset-0.5 rounded-md ring-1 ring-neon-violet/40 animate-pulseSoft pointer-events-none" />
        </div>
        <div className="leading-none">
          <div className="font-display text-base font-bold tracking-[0.18em] text-white">
            NEO<span className="text-neon-cyan neon-text">LIFE</span>{' '}
            <span className="text-neon-violet neon-text">INDONESIA</span>
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-slate-500">
            Simulasi Kehidupan Pixel Otonom · v0.1
          </div>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-2 text-xs font-mono text-slate-400">
        <span className="chip">Foundation</span>
        <span className="flex items-center gap-1.5 text-neon-cyan">
          <span className="relative inline-flex h-2 w-2 rounded-full bg-neon-cyan">
            <span className="absolute inset-0 rounded-full bg-neon-cyan animate-ping" />
          </span>
          SIAP DIBANGUN
        </span>
      </div>
    </header>
  );
}
