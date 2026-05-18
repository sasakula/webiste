// Indicator audio kecil untuk halaman /live + /live-vertical.
// Live view TIDAK menampilkan kontrol audio lengkap — itu khusus owner.
// Hanya menampilkan status: Audio aktif/mati, Musik aktif, Ambient aktif,
// dan Mode Audio (Otomatis/Manual).
import { useAudio, isAudioActive } from '../../hooks/useAudio.js';
import { MUSIC_MOOD_LABEL } from '../../audio/musicSystem.js';

export default function LiveAudioIndicator({ compact = false }) {
  const audio = useAudio();
  const aktif = isAudioActive(audio);
  const musicLive = aktif && audio.musikOn;
  const ambientLive = aktif && audio.ambientOn;
  const moodLabel = audio.musicMood === 'otomatis'
    ? 'Otomatis'
    : (MUSIC_MOOD_LABEL[audio.musicMood] || 'Otomatis');

  return (
    <div
      className={`pointer-events-none flex flex-col gap-1 rounded-md border bg-ink-950/70 backdrop-blur ${
        compact ? 'px-2 py-1' : 'px-2.5 py-1.5'
      } ${aktif ? 'border-neon-lime/40' : 'border-white/10'}`}
    >
      {/* Baris 1: Speaker icon + status utama */}
      <div className="flex items-center gap-2">
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
        <span className={`text-[9px] font-mono uppercase tracking-[0.18em] ${aktif ? 'text-neon-lime' : 'text-slate-500'}`}>
          {aktif ? 'Audio Live Aktif' : 'Audio Mati'}
        </span>
      </div>

      {/* Baris 2-4: hanya muncul kalau audio aktif (supaya tidak ramai saat off) */}
      {aktif ? (
        <div className="flex flex-col gap-0.5 pl-[15px]">
          <IndicatorLine label="Musik"   on={musicLive} />
          <IndicatorLine label="Ambient" on={ambientLive} />
          <span className="text-[9px] font-mono text-slate-500">
            Mode Audio: <span className="text-neon-cyan">{moodLabel}</span>
          </span>
        </div>
      ) : null}
    </div>
  );
}

function IndicatorLine({ label, on }) {
  return (
    <span className={`flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-wider ${
      on ? 'text-neon-cyan' : 'text-slate-500'
    }`}>
      <span className={`inline-block h-1.5 w-1.5 rounded-full ${on ? 'bg-neon-cyan animate-pulseSoft' : 'bg-slate-600'}`} />
      {label} {on ? 'Aktif' : 'Mati'}
    </span>
  );
}
