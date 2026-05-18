// Event ticker besar untuk halaman live.
// Sekarang membaca event dari simulation engine via useSimulation().
import { motion, AnimatePresence } from 'framer-motion';
import { useSimulation } from '../../hooks/useSimulation.js';

export default function LiveEventTicker({ variant = 'horizontal' }) {
  const { snapshot } = useSimulation();
  const events = snapshot.eventLog;

  if (variant === 'vertical') {
    // 4 event terbaru sebagai daftar di bawah.
    return (
      <div className="absolute inset-x-3 bottom-3 z-20 flex flex-col gap-1.5">
        <div className="flex items-center gap-2 mb-1">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-neon-cyan animate-pulseSoft" />
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-neon-cyan/90">
            Feed Kejadian
          </span>
        </div>
        <AnimatePresence initial={false}>
          {events.slice(0, 4).map((e) => (
            <motion.div
              key={e.id}
              layout
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="rounded-md border border-white/10 bg-ink-950/70 backdrop-blur px-2 py-1.5 text-[11px] font-mono text-slate-200"
            >
              <span className="text-slate-500">[{e.time}]</span>{' '}
              {e.text}
            </motion.div>
          ))}
        </AnimatePresence>
        {events.length === 0 ? (
          <div className="text-[11px] font-mono text-slate-500 italic">Menunggu kejadian…</div>
        ) : null}
      </div>
    );
  }

  // === Horizontal marquee. ===
  // Ambil 12 event terbaru, duplikasi 2x supaya marquee loop mulus.
  const items = events.slice(0, 12);
  const doubled = items.length > 0 ? [...items, ...items] : [];

  return (
    <div className="absolute inset-x-0 bottom-3 sm:bottom-5 z-20">
      <div className="mx-auto max-w-[95%] rounded-md border border-white/10 bg-ink-950/70 backdrop-blur overflow-hidden">
        <div className="flex items-stretch">
          <div className="shrink-0 px-3 py-2 bg-neon-cyan/10 border-r border-white/10 flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-neon-cyan animate-pulseSoft" />
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-neon-cyan">
              Feed Kejadian
            </span>
          </div>
          <div className="relative flex-1 overflow-hidden">
            {doubled.length === 0 ? (
              <div className="px-4 py-2 text-[12px] font-mono text-slate-500 italic">
                Menunggu kejadian dari kota…
              </div>
            ) : (
              <div className="ticker-track flex items-center gap-8 whitespace-nowrap py-2 text-[12px] font-mono text-slate-200">
                {doubled.map((e, i) => (
                  <span key={`${e.id}_${i}`} className="flex items-center gap-2">
                    <span className="text-neon-violet">▸</span>
                    <span className="text-slate-500">[{e.time}]</span>
                    {e.text}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
