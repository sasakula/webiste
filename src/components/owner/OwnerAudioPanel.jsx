// Kontrol Audio lengkap untuk Owner.
// Live view tidak menampilkan kontrol audio penuh — hanya indicator.
// Di sini owner bisa toggle channel + atur volume + pilih mood + test sound.
import Panel from '../ui/Panel.jsx';
import {
  useAudio,
  toggleMusik, toggleAmbient, toggleSfx,
  setMusikVol, setAmbientVol, setSfxVol,
  toggleModeOtomatis, toggleLiveAudio,
  setMusicMood, aktifkanAudio, nonaktifkanAudio,
  testSoundEffect, testMusicSample, testAmbientSample,
} from '../../hooks/useAudio.js';
import { MUSIC_MOOD_LABEL } from '../../audio/musicSystem.js';

const MOOD_OPTIONS = ['santai', 'cyberpunk', 'malam', 'tegang', 'otomatis'];

export default function OwnerAudioPanel() {
  const audio = useAudio();
  const aktif = audio.status === 'aktif';

  return (
    <Panel title="Kontrol Audio" accent="pink">
      <div className="px-3 py-3 flex flex-col gap-4">
        {/* === Status file audio === */}
        <div className="rounded-md border border-white/10 bg-white/[0.02] px-3 py-2 text-[11px] font-mono">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 uppercase tracking-wider text-[10px]">Status File Audio</span>
            <span className={audio.audioFilesAvailable ? 'text-neon-lime' : 'text-neon-amber'}>
              {audio.audioFilesAvailable ? 'Tersedia' : 'Belum Tersedia'}
            </span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1 leading-relaxed">
            File audio diharapkan ada di <code className="text-neon-cyan">public/audio/&#123;music,ambient,sfx&#125;/</code>.
            Kalau file belum ada, sistem tetap berjalan — tidak ada suara, tapi
            UI tidak crash. Audio bisa diganti owner kapan saja tanpa edit kode.
          </div>
        </div>

        {/* === Tombol aktivasi (perlu user gesture) === */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={aktifkanAudio}
            disabled={aktif}
            className={`chip font-mono uppercase tracking-wider px-3 py-1.5 ${
              aktif
                ? 'border-neon-lime/60 bg-neon-lime/10 text-neon-lime cursor-default'
                : 'border-neon-cyan/40 hover:bg-neon-cyan/10 text-neon-cyan'
            }`}
          >
            {aktif ? '● Audio Aktif' : '◯ Aktifkan Audio'}
          </button>
          {aktif ? (
            <button
              type="button"
              onClick={nonaktifkanAudio}
              className="chip text-neon-amber border-neon-amber/40 hover:bg-neon-amber/10"
            >
              Matikan
            </button>
          ) : null}
          <span className="font-mono text-[10px] text-slate-500">
            Status: {labelStatus(audio.status)}
          </span>
        </div>

        {/* === Kanal toggle === */}
        <div>
          <div className="stat-label mb-2">Kanal</div>
          <div className="grid grid-cols-3 gap-2">
            <ToggleRow label="Musik"      on={audio.musikOn}   onToggle={toggleMusik}   />
            <ToggleRow label="Ambient"    on={audio.ambientOn} onToggle={toggleAmbient} />
            <ToggleRow label="Efek Suara" on={audio.sfxOn}     onToggle={toggleSfx}     />
          </div>
        </div>

        {/* === Volume sliders === */}
        <div>
          <div className="stat-label mb-2">Volume</div>
          <div className="flex flex-col gap-2">
            <VolumeRow label="Volume Musik"   value={audio.musikVol}   onChange={setMusikVol}   />
            <VolumeRow label="Volume Ambient" value={audio.ambientVol} onChange={setAmbientVol} />
            <VolumeRow label="Volume Efek"    value={audio.sfxVol}     onChange={setSfxVol}     />
          </div>
        </div>

        {/* === Mood musik === */}
        <div>
          <div className="stat-label mb-2">Mode Audio · Mood Musik</div>
          <div className="grid grid-cols-5 gap-1.5">
            {MOOD_OPTIONS.map((m) => {
              const active = audio.musicMood === m;
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMusicMood(m)}
                  className={`h-9 rounded-md border text-[11px] font-mono uppercase tracking-wider transition ${
                    active
                      ? 'border-neon-cyan/70 bg-neon-cyan/10 text-neon-cyan'
                      : 'border-white/10 bg-white/5 text-slate-300 hover:border-neon-cyan/40'
                  }`}
                >
                  {MUSIC_MOOD_LABEL[m] || m}
                </button>
              );
            })}
          </div>
          <div className="text-[10px] font-mono text-slate-500 mt-2">
            Mode <span className="text-neon-cyan">Otomatis</span> memilih mood
            sesuai waktu, cuaca, ekonomi, dan kriminalitas kota.
          </div>
        </div>

        {/* === Tombol test sound === */}
        <div>
          <div className="stat-label mb-2">Tes Sound</div>
          <div className="flex flex-wrap gap-2">
            <TestBtn onClick={() => testSoundEffect()}>Tes Efek Suara</TestBtn>
            <TestBtn onClick={() => testMusicSample('cyberpunk')}>Tes Musik Cyberpunk</TestBtn>
            <TestBtn onClick={() => testMusicSample('malam')}>Tes Musik Malam</TestBtn>
            <TestBtn onClick={() => testAmbientSample('rain')}>Tes Hujan</TestBtn>
            <TestBtn onClick={() => testAmbientSample('cityNight')}>Tes Kota Malam</TestBtn>
          </div>
          <div className="text-[10px] font-mono text-slate-500 mt-2">
            Tombol tes hanya menghasilkan suara kalau audio sudah diaktifkan
            dan file audio tersedia di <code className="text-neon-cyan">public/audio/</code>.
          </div>
        </div>

        {/* === Mode otomatis & live audio === */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div className="rounded-md border border-white/10 bg-white/[0.02] px-3 py-2 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-mono text-slate-200">Mode Audio Otomatis</div>
              <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                Sistem pilih musik & ambient sesuai kondisi kota.
              </div>
            </div>
            <button
              type="button"
              onClick={toggleModeOtomatis}
              className={`chip font-mono uppercase tracking-wider ${
                audio.modeOtomatis
                  ? 'border-neon-lime/60 bg-neon-lime/10 text-neon-lime'
                  : 'border-white/10 bg-white/5 text-slate-300'
              }`}
            >
              {audio.modeOtomatis ? '● Otomatis' : '◯ Manual'}
            </button>
          </div>
          <div className="rounded-md border border-white/10 bg-white/[0.02] px-3 py-2 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-mono text-slate-200">Audio Untuk Live</div>
              <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                Kalau aktif, mood lebih stabil supaya enak ditonton 24 jam.
              </div>
            </div>
            <button
              type="button"
              onClick={toggleLiveAudio}
              className={`chip font-mono uppercase tracking-wider ${
                audio.liveAudio
                  ? 'border-neon-cyan/60 bg-neon-cyan/10 text-neon-cyan'
                  : 'border-white/10 bg-white/5 text-slate-300'
              }`}
            >
              {audio.liveAudio ? '● Live' : '◯ Mati'}
            </button>
          </div>
        </div>
      </div>
    </Panel>
  );
}

function labelStatus(s) {
  if (s === 'aktif')             return 'Aktif';
  if (s === 'tidak_tersedia')    return 'Tidak Tersedia';
  return 'Belum Diaktifkan';
}

function ToggleRow({ label, on, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`flex flex-col items-start rounded-md border p-2 transition text-left ${
        on
          ? 'border-neon-cyan/50 bg-neon-cyan/5'
          : 'border-white/10 bg-white/[0.02] hover:border-neon-violet/30'
      }`}
    >
      <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500">{label}</span>
      <span className={`font-mono text-sm ${on ? 'text-neon-cyan' : 'text-slate-400'}`}>
        {on ? '● ON' : '◯ OFF'}
      </span>
    </button>
  );
}

function VolumeRow({ label, value, onChange }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-32 font-mono text-[10px] uppercase tracking-wider text-slate-500">{label}</span>
      <input
        type="range" min="0" max="1" step="0.01"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="flex-1 accent-neon-cyan"
      />
      <span className="w-10 text-right font-mono text-[11px] text-neon-cyan">
        {Math.round(value * 100)}%
      </span>
    </div>
  );
}

function TestBtn({ children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider text-slate-300 hover:border-neon-violet/40 hover:text-white transition"
    >
      ▶ {children}
    </button>
  );
}
