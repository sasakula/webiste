// Panel kontrol simulasi lengkap (dipakai di tab Live Control).
import Panel from '../ui/Panel.jsx';
import { Link } from 'react-router-dom';

const SPEEDS = [1, 2, 4, 8];

export default function OwnerSimControls({ snapshot, onTogglePause, onSetSpeed, onReset }) {
  // Save / load placeholder — disimpan di localStorage.
  const handleSave = () => {
    try {
      const minimal = {
        hari: snapshot.hari, jam: snapshot.jam, menit: snapshot.menit,
        cuaca: snapshot.cuaca, ekonomi: snapshot.ekonomi,
        populasi: snapshot.populasi,
        savedAt: Date.now(),
      };
      localStorage.setItem('neolife.savegame.v1', JSON.stringify(minimal));
      alert('Simulasi disimpan di browser (localStorage).');
    } catch {
      alert('Gagal menyimpan ke localStorage.');
    }
  };
  const handleLoad = () => {
    try {
      const raw = localStorage.getItem('neolife.savegame.v1');
      if (!raw) return alert('Belum ada save game tersimpan.');
      alert('Save game ditemukan: ' + raw + '\n(Restore penuh akan dipasang di tahap berikut.)');
    } catch {
      alert('Gagal membaca localStorage.');
    }
  };

  return (
    <Panel title="Kontrol Simulasi" accent="violet">
      <div className="px-3 py-3 flex flex-col gap-3">
        {/* Pause + speed */}
        <div className="grid grid-cols-5 gap-1.5">
          <button
            type="button"
            onClick={onTogglePause}
            className={`h-9 rounded-md border text-[11px] font-mono uppercase tracking-wider transition ${
              snapshot.paused
                ? 'border-neon-amber/70 bg-neon-amber/10 text-neon-amber'
                : 'border-white/10 bg-white/5 text-slate-300 hover:border-neon-amber/40'
            }`}
            title="Pause / Play"
          >
            {snapshot.paused ? '▶ Play' : 'II Pause'}
          </button>
          {SPEEDS.map((sp) => {
            const active = !snapshot.paused && snapshot.speed === sp;
            return (
              <button
                key={sp}
                type="button"
                onClick={() => onSetSpeed(sp)}
                className={`h-9 rounded-md border text-[11px] font-mono uppercase tracking-wider transition ${
                  active
                    ? 'border-neon-cyan/70 bg-neon-cyan/10 text-neon-cyan'
                    : 'border-white/10 bg-white/5 text-slate-300 hover:border-neon-cyan/40'
                }`}
              >
                {sp}x
              </button>
            );
          })}
        </div>

        {/* Tombol owner-only */}
        <div className="grid grid-cols-2 gap-2">
          <ActionBtn>Reset Kamera</ActionBtn>
          <ActionBtn>Generate NPC</ActionBtn>
          <ActionBtn>Generate Distrik</ActionBtn>
          <ActionBtn>Mode Chaos</ActionBtn>
          <ActionBtn onClick={handleSave}>Simpan ke localStorage</ActionBtn>
          <ActionBtn onClick={handleLoad}>Load dari localStorage</ActionBtn>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          <Link
            to="/live" target="_blank" rel="noopener"
            className="chip text-neon-cyan border-neon-cyan/40 hover:bg-neon-cyan/10"
          >
            ↗ Buka /live (16:9)
          </Link>
          <Link
            to="/live-vertical" target="_blank" rel="noopener"
            className="chip text-neon-pink border-neon-pink/40 hover:bg-neon-pink/10"
          >
            ↗ Buka /live-vertical (9:16)
          </Link>
          <button
            type="button"
            onClick={onReset}
            className="chip text-neon-amber border-neon-amber/40 hover:bg-neon-amber/10"
          >
            ↻ Reset Simulasi
          </button>
        </div>

        <div className="text-[10px] font-mono text-slate-500 leading-relaxed">
          Tombol dengan label "Generate" / "Mode Chaos" akan diaktifkan saat
          fitur AI dunia diperluas. Save/load saat ini hanya menyimpan ringkasan.
        </div>
      </div>
    </Panel>
  );
}

function ActionBtn({ children, onClick, disabled = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="h-9 rounded-md border border-white/10 bg-white/5 text-[11px] font-mono uppercase tracking-wider text-slate-300 hover:border-neon-violet/40 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {children}
    </button>
  );
}
