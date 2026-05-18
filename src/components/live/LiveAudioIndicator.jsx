// Indicator audio kecil untuk halaman /live + /live-vertical.
// Live view TIDAK menampilkan kontrol audio lengkap — itu khusus owner.
// Hanya menampilkan status "Audio Live Aktif" + mode (Otomatis/Manual).
import { useAudio, isAudioActive } from '../../hooks/useAudio.js';

export default function LiveAudioIndicator({ compact = false }) {
  const audio = useAudio();
  const aktif = isAudioActive(audio);

  return (
    <div
      className={`pointer-events-none flex items-center gap-2 rounded-md border bg-ink-950/70 backdrop-blur ${
        compact ? 'px-2 py-1' : 'px-2.5 py-1.5'
      } ${aktif ? 'border-neon-lime/40' : 'border-white/10'}`}
    >
      {/* Speaker icon mini */}
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2"
        className={aktif ? 'text-neon-lime' : 'text-slate-500'}
      >
        <path d="M11 5L6 9H2v6h4l5 4V5z" fill="currentColor" stroke="none"/>
        {aktif ? (
          <>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </>
        ) : (
          <line x1="22" y1="3" x2="2" y2="21" stroke="currentColor"/>
        )}
      </svg>

      <div className="flex flex-col leading-none gap-0.5">
        <span className={`text-[9px] font-mono uppercase tracking-[0.18em] ${aktif ? 'text-neon-lime' : 'text-slate-500'}`}>
          {aktif ? 'Audio Live Aktif' : 'Audio Mati'}
        </span>
        <span className="text-[9px] font-mono text-slate-500">
          Mode: {audio.modeOtomatis ? 'Otomatis' : 'Manual'}
        </span>
      </div>
    </div>
  );
}
