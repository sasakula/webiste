// Event ticker besar untuk halaman live.
// Versi horizontal: marquee di bawah (single line, scroll horizontal).
// Versi vertical:   stack 4 event terbaru di atas event ticker bawah.
// Data placeholder; akan diganti dengan event log dari engine simulasi.
import { motion } from 'framer-motion';

const DUMMY_EVENTS = [
  '06:10 · Rian bangun tidur dan bersiap kerja.',
  '06:45 · Salsa membeli sarapan di warung.',
  '07:30 · Budi berangkat kuliah.',
  '08:10 · Udin diterima kerja sebagai tukang bangunan.',
  '09:20 · Maya membuka warung kecil.',
  '10:15 · Proyek Rumah Rian dimulai.',
  '11:40 · Hujan membuat pembangunan tertunda.',
  '13:00 · Kafe Salsa mulai ramai.',
];

export default function LiveEventTicker({ variant = 'horizontal' }) {
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
        {DUMMY_EVENTS.slice(0, 4).map((e, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            className="rounded-md border border-white/10 bg-ink-950/70 backdrop-blur px-2 py-1.5 text-[11px] font-mono text-slate-200"
          >
            {e}
          </motion.div>
        ))}
      </div>
    );
  }

  // Horizontal marquee.
  // Duplikasi list supaya animasi loop mulus.
  const items = [...DUMMY_EVENTS, ...DUMMY_EVENTS];
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
            <div className="ticker-track flex items-center gap-8 whitespace-nowrap py-2 text-[12px] font-mono text-slate-200">
              {items.map((e, i) => (
                <span key={i} className="flex items-center gap-2">
                  <span className="text-neon-violet">▸</span>
                  {e}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
