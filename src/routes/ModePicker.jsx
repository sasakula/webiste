// Halaman pemilihan mode di route `/`.
// Penonton/owner memilih mau masuk ke dashboard, livestream horizontal,
// livestream vertical, atau pengaturan.
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const MODES = [
  {
    to: '/owner',
    eyebrow: 'Mode Pemilik',
    title: 'Dashboard Owner',
    desc: 'Pantau kota lengkap dengan tabel warga, bangunan, log kejadian, dan kontrol simulasi.',
    accent: 'cyan',
    icon: '◉',
    audience: 'Untuk admin / pemilik',
  },
  {
    to: '/live',
    eyebrow: 'Mode Live',
    title: 'Live Horizontal · 16:9',
    desc: 'Tampilan cinematic untuk livestream YouTube atau Facebook.',
    accent: 'violet',
    icon: '▭',
    audience: 'Untuk penonton',
  },
  {
    to: '/live-vertical',
    eyebrow: 'Mode Live',
    title: 'Live Vertical · 9:16',
    desc: 'Tampilan cinematic untuk livestream TikTok atau Instagram.',
    accent: 'pink',
    icon: '▯',
    audience: 'Untuk penonton',
  },
  {
    to: '/settings',
    eyebrow: 'Mode Pengaturan',
    title: 'Pengaturan',
    desc: 'Atur tema, kecepatan default, dan parameter dunia simulasi.',
    accent: 'lime',
    icon: '⚙',
    audience: 'Untuk admin',
  },
];

const ACCENT_BG = {
  cyan:   'from-neon-cyan/20 to-transparent',
  violet: 'from-neon-violet/20 to-transparent',
  pink:   'from-neon-pink/20 to-transparent',
  lime:   'from-neon-lime/20 to-transparent',
};
const ACCENT_TEXT = {
  cyan:   'text-neon-cyan',
  violet: 'text-neon-violet',
  pink:   'text-neon-pink',
  lime:   'text-neon-lime',
};
const ACCENT_BORDER = {
  cyan:   'hover:border-neon-cyan/60',
  violet: 'hover:border-neon-violet/60',
  pink:   'hover:border-neon-pink/60',
  lime:   'hover:border-neon-lime/60',
};

export default function ModePicker() {
  return (
    <div className="h-full w-full overflow-y-auto grid-bg">
      <div className="min-h-full flex flex-col items-center justify-center px-6 py-12">
        {/* Logo besar. */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 max-w-2xl"
        >
          <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-neon-violet/80 mb-3">
            Simulasi Kehidupan Pixel Otonom
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-[0.18em] text-white mb-3">
            NEO<span className="text-neon-cyan neon-text">LIFE</span>{' '}
            <span className="text-neon-violet neon-text">INDONESIA</span>
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed max-w-xl mx-auto">
            Pilih mode untuk masuk ke kota pixel otonom: pantau dari sisi pemilik,
            atau tonton kota hidup secara langsung lewat layar livestream.
          </p>
        </motion.div>

        {/* Grid kartu mode. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-3xl">
          {MODES.map((mode, i) => (
            <motion.div
              key={mode.to}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <Link
                to={mode.to}
                className={`group relative block panel overflow-hidden p-5 transition border-white/5 ${ACCENT_BORDER[mode.accent]}`}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${ACCENT_BG[mode.accent]} opacity-0 group-hover:opacity-100 transition`}
                />
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500">
                      {mode.eyebrow}
                    </div>
                    <span className={`text-2xl ${ACCENT_TEXT[mode.accent]} neon-text`}>
                      {mode.icon}
                    </span>
                  </div>
                  <h2 className={`font-display text-xl ${ACCENT_TEXT[mode.accent]} mb-2`}>
                    {mode.title}
                  </h2>
                  <p className="text-xs text-slate-400 leading-relaxed mb-3">
                    {mode.desc}
                  </p>
                  <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-slate-500">
                    <span>{mode.audience}</span>
                    <span className="text-slate-300 group-hover:text-white transition">
                      Buka →
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Footer ringan. */}
        <div className="mt-12 font-mono text-[10px] text-slate-600 uppercase tracking-[0.3em]">
          v0.1 · pixel-art simulator · siap dibangun
        </div>
      </div>
    </div>
  );
}
