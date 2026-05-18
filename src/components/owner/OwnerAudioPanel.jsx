// Kontrol Audio lengkap untuk Owner.
// Live view tidak menampilkan kontrol audio penuh — hanya indicator.
// Di sini owner bisa toggle channel + atur volume + aktifkan audio.
import Panel from '../ui/Panel.jsx';
import {
  useAudio, toggleMusik, toggleAmbient, toggleSfx,
  setMusikVol, setAmbientVol, setSfxVol,
  toggleModeOtomatis, aktifkanAudio, nonaktifkanAudio,
} from '../../hooks/useAudio.js';

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
            File audio (musik, ambient, SFX) belum di-bundle ke build. Saat asset
            siap, audio akan otomatis bisa diputar dengan kontrol di bawah ini.
          </div>
        </div>

        {/* === Tombol aktivasi === */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={aktifkanAudio}
            disabled={!audio.audioFilesAvailable || aktif}
            className={`chip font-mono uppercase tracking-wider px-3 py-1.5 ${
              aktif
                ? 'border-neon-lime/60 bg-neon-lime/10 text-neon-lime cursor-default'
                : audio.audioFilesAvailable
                ? 'border-neon-cyan/40 hover:bg-neon-cyan/10 text-neon-cyan'
                : 'opacity-50 cursor-not-allowed'
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
        <div className="grid grid-cols-3 gap-2">
          <ToggleRow label="Musik"        on={audio.musikOn}   onToggle={toggleMusik}   />
          <ToggleRow label="Ambient"      on={audio.ambientOn} onToggle={toggleAmbient} />
          <ToggleRow label="Efek Suara"   on={audio.sfxOn}     onToggle={toggleSfx}     />
        </div>

        {/* === Volume sliders === */}
        <div className="flex flex-col gap-2">
          <VolumeRow label="Volume Musik"   value={audio.musikVol}   onChange={setMusikVol}   />
          <VolumeRow label="Volume Ambient" value={audio.ambientVol} onChange={setAmbientVol} />
          <VolumeRow label="Volume Efek"    value={audio.sfxVol}     onChange={setSfxVol}     />
        </div>

        {/* === Mode otomatis === */}
        <div className="flex items-center justify-between rounded-md border border-white/10 bg-white/[0.02] px-3 py-2">
          <div>
            <div className="text-[11px] font-mono text-slate-200">Mode Audio Otomatis</div>
            <div className="text-[10px] font-mono text-slate-500 mt-0.5">
              Sistem memilih musik/ambient sesuai kondisi (siang/malam, hujan, drama).
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
