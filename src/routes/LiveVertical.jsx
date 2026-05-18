// /live-vertical  — Live Vertical 9:16 (TikTok/Instagram), target OBS 1080×1920.
//
// Layout vertikal:
//   - Top:    Logo + LIVE 24 JAM + status singkat
//   - Middle: CityCanvas besar (fokus visual)
//   - Bottom: Drama highlight + event terbaru (4 entri stack)
// Tidak ada sidebar kiri-kanan. Teks lebih besar supaya enak di HP.
import CityCanvas from '../components/city/CityCanvas.jsx';
import LiveEventTicker from '../components/live/LiveEventTicker.jsx';
import LiveStatusStrip from '../components/live/LiveStatusStrip.jsx';
import LiveDramaHighlight from '../components/live/LiveDramaHighlight.jsx';
import LiveAudioIndicator from '../components/live/LiveAudioIndicator.jsx';
import { useSimulation } from '../hooks/useSimulation.js';

export default function LiveVertical() {
  const { snapshot } = useSimulation();

  return (
    <div className="h-full w-full flex items-center justify-center bg-ink-950 p-3">
      {/* Frame 9:16 cinematic. */}
      <div
        className="relative h-full mx-auto rounded-xl overflow-hidden shadow-glow border border-white/5"
        style={{ aspectRatio: '9 / 16', maxHeight: '100%' }}
      >
        {/* === Layer 0: kota pixel full-bleed === */}
        <div className="absolute inset-0">
          <CityCanvas
            npcs={snapshot.npcs}
            buildings={snapshot.buildings}
            world={snapshot}
            cameraMode="orbit"
            showLabels
            liveMode
          />
        </div>

        {/* === Vignette === */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-ink-950/90 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-ink-950/95 to-transparent" />

        {/* === HEADER kiri-atas: LIVE === */}
        <div className="absolute top-3 left-3 z-30 flex items-center gap-2">
          <span className="relative inline-flex h-2 w-2 rounded-full bg-neon-red">
            <span className="absolute inset-0 rounded-full bg-neon-red animate-ping" />
          </span>
          <span className="font-display text-sm tracking-[0.3em] text-neon-red neon-text">
            LIVE 24 JAM
          </span>
        </div>

        {/* Audio indicator kanan-atas */}
        <div className="absolute top-3 right-3 z-30">
          <LiveAudioIndicator compact />
        </div>

        {/* Logo NEOLIFE INDONESIA — center top, 2 baris */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 z-30 text-center">
          <div className="font-mono text-[9px] uppercase tracking-[0.4em] text-neon-violet/80 mb-1">
            Kota Pixel Hidup Otomatis
          </div>
          <div className="font-display text-lg tracking-[0.22em] text-white leading-tight">
            NEO<span className="text-neon-cyan neon-text">LIFE</span>
          </div>
          <div className="font-display text-sm tracking-[0.28em] text-neon-violet neon-text">
            INDONESIA
          </div>
        </div>

        {/* Status strip — di bawah logo */}
        <div className="absolute top-32 left-0 right-0 z-20">
          <LiveStatusStrip variant="vertical" />
        </div>

        {/* === BOTTOM: drama + event === */}
        <div className="absolute inset-x-3 bottom-3 z-20 flex flex-col gap-2">
          <LiveDramaHighlight variant="vertical" />
          <LiveEventTicker variant="vertical" />
          <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.3em] text-slate-500/80 mt-1">
            <span>neolife.id</span>
            <span>{snapshot.waktuHari}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
