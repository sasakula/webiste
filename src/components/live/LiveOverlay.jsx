// Overlay penonton untuk halaman live.
// Berisi:
//  - badge LIVE merah di pojok kiri-atas
//  - logo + judul kecil di tengah-atas
//  - info ringkas (jam, cuaca, populasi) di pojok kanan-atas
// Dibuat data placeholder dulu — akan disambung ke engine simulasi.
import { motion } from 'framer-motion';

export default function LiveOverlay({ variant = 'horizontal' }) {
  const isVertical = variant === 'vertical';

  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      {/* LIVE badge */}
      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex items-center gap-2">
        <span className="relative inline-flex h-2 w-2 rounded-full bg-neon-red">
          <span className="absolute inset-0 rounded-full bg-neon-red animate-ping" />
        </span>
        <span className="font-display text-xs sm:text-sm tracking-[0.3em] text-neon-red neon-text">
          LIVE
        </span>
      </div>

      {/* Logo + judul, posisi tergantung variant */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`absolute ${
          isVertical ? 'top-3 left-1/2 -translate-x-1/2 text-center' : 'top-3 left-1/2 -translate-x-1/2 text-center'
        }`}
      >
        <div className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.35em] text-neon-violet/80">
          Simulasi Kehidupan Pixel Otonom
        </div>
        <div className="font-display text-sm sm:text-lg tracking-[0.2em] text-white">
          NEO<span className="text-neon-cyan neon-text">LIFE</span>{' '}
          <span className="text-neon-violet neon-text">INDONESIA</span>
        </div>
      </motion.div>

      {/* Info ringkas penonton */}
      <div
        className={`absolute ${
          isVertical
            ? 'top-3 right-3 flex flex-col items-end gap-1.5'
            : 'top-3 right-3 sm:top-4 sm:right-4 flex flex-col items-end gap-1.5'
        }`}
      >
        <Stat label="Hari" value="—" accent="cyan" />
        <Stat label="Jam"  value="06:30" accent="violet" />
        <Stat label="Cuaca" value="Cerah" accent="lime" />
        <Stat label="Warga" value="0 jiwa" accent="pink" />
      </div>

      {/* Watermark di pojok kanan bawah (subtle, untuk OBS) */}
      <div
        className={`absolute ${
          isVertical ? 'bottom-3 right-3' : 'bottom-3 right-3 sm:bottom-4 sm:right-4'
        } font-mono text-[9px] uppercase tracking-[0.3em] text-slate-500/70`}
      >
        neolife.id
      </div>
    </div>
  );
}

function Stat({ label, value, accent }) {
  const color =
    accent === 'cyan'   ? 'text-neon-cyan'   :
    accent === 'violet' ? 'text-neon-violet' :
    accent === 'pink'   ? 'text-neon-pink'   :
    accent === 'lime'   ? 'text-neon-lime'   :
    'text-neon-cyan';
  return (
    <div className="flex items-center gap-2 rounded-md border border-white/10 bg-ink-950/60 backdrop-blur px-2 py-1">
      <span className="text-[9px] font-mono uppercase tracking-wider text-slate-500">{label}</span>
      <span className={`text-[11px] font-mono ${color}`}>{value}</span>
    </div>
  );
}
