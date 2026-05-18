// Drama highlight — kotak besar yang menampilkan drama paling baru
// di halaman live. Kategori tertentu (KONFLIK, CINTA, KRIMINAL, dll.) di-pulse.
import { motion, AnimatePresence } from 'framer-motion';
import { useSimulation } from '../../hooks/useSimulation.js';

const CATEGORY_COLOR = {
  KONFLIK:     '#f87171',
  KRIMINAL:    '#dc2626',
  CINTA:       '#ec4899',
  PRESTASI:    '#a3e635',
  KEBAIKAN:    '#22d3ee',
  PEKERJAAN:   '#60a5fa',
  PEMBANGUNAN: '#a855f7',
  EKONOMI:     '#fbbf24',
  CUACA:       '#3b82f6',
  KEHIDUPAN:   '#67e8f9',
  DRAMA:       '#fb923c',
};

export default function LiveDramaHighlight({ variant = 'horizontal' }) {
  const { snapshot } = useSimulation();
  const latest = snapshot.dramaLog?.[0];

  const isVertical = variant === 'vertical';
  const widthClass = isVertical
    ? 'w-full max-w-full'
    : 'max-w-[420px]';

  return (
    <div className={`pointer-events-none ${widthClass}`}>
      <AnimatePresence mode="wait">
        {latest ? (
          <motion.div
            key={latest.id}
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0,  scale: 1     }}
            exit   ={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.35 }}
            className="relative rounded-lg border bg-ink-950/80 backdrop-blur px-3 py-2.5 overflow-hidden"
            style={{
              borderColor: (CATEGORY_COLOR[latest.category] || '#64748b') + '66',
            }}
          >
            {/* Pulse glow di belakang */}
            <div
              className="absolute inset-0 opacity-30 animate-pulseSoft pointer-events-none"
              style={{
                background: `radial-gradient(ellipse at center, ${CATEGORY_COLOR[latest.category] || '#64748b'}33, transparent 70%)`,
              }}
            />
            <div className="relative">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="inline-block h-1.5 w-1.5 rounded-full animate-pulseSoft"
                  style={{ background: CATEGORY_COLOR[latest.category] || '#64748b' }}
                />
                <span
                  className="font-mono text-[10px] uppercase tracking-[0.25em]"
                  style={{ color: CATEGORY_COLOR[latest.category] || '#64748b' }}
                >
                  Drama {latest.category}
                </span>
                <span className="ml-auto font-mono text-[10px] text-slate-500">
                  [{latest.time}]
                </span>
              </div>
              <div className={`font-display text-white leading-snug ${isVertical ? 'text-sm' : 'text-base'}`}>
                {latest.text}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit   ={{ opacity: 0 }}
            className="rounded-lg border border-white/10 bg-ink-950/60 backdrop-blur px-3 py-2.5"
          >
            <div className="flex items-center gap-2">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-slate-500" />
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500">
                Drama Terkini
              </span>
            </div>
            <div className="font-mono text-[11px] text-slate-500 italic mt-1">
              Menunggu drama warga…
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
