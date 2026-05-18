// /live  — Live Horizontal 16:9 (YouTube/Facebook), target OBS 1920×1080.
//
// Bersih, cinematic, cocok untuk live 24 jam:
//   - Header: NEOLIFE INDONESIA — LIVE 24 JAM + subtitle
//   - CityCanvas full-bleed, kamera auto-cinematic (orbit + zoom event)
//   - Status strip ringkas (Hari · Jam · Cuaca · Ekonomi · Populasi)
//   - Drama highlight (kotak besar untuk drama paling baru)
//   - Event ticker marquee 5-7 item
//   - LIVE badge + Audio indicator (tidak ada kontrol)
//   - Vignette gradients atas-bawah supaya teks kebaca
import CityCanvas from '../components/city/CityCanvas.jsx';
import LiveEventTicker from '../components/live/LiveEventTicker.jsx';
import LiveStatusStrip from '../components/live/LiveStatusStrip.jsx';
import LiveDramaHighlight from '../components/live/LiveDramaHighlight.jsx';
import LiveAudioIndicator from '../components/live/LiveAudioIndicator.jsx';
import { useSimulation } from '../hooks/useSimulation.js';

export default function LiveHorizontal() {
  const { snapshot } = useSimulation();

  return (
    <div className="h-full w-full flex items-center justify-center bg-ink-950 p-4">
      {/* Frame 16:9 cinematic, lock ratio supaya OBS 1920×1080 selalu rapi. */}
      <div
        className="relative w-full mx-auto rounded-xl overflow-hidden shadow-glow border border-white/5"
        style={{ aspectRatio: '16 / 9', maxWidth: '1920px', maxHeight: '100%' }}
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

        {/* === Layer 1: gradient vignette atas-bawah === */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ink-950/85 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-ink-950/90 to-transparent" />

        {/* === Layer 2: HEADER (kiri-tengah-kanan) === */}
        {/* LIVE pulse */}
        <div className="absolute top-4 left-5 z-30 flex items-center gap-2">
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-neon-red">
            <span className="absolute inset-0 rounded-full bg-neon-red animate-ping" />
          </span>
          <span className="font-display text-base tracking-[0.32em] text-neon-red neon-text">
            LIVE
          </span>
          {snapshot.paused ? (
            <span className="ml-1 chip text-neon-amber border-neon-amber/40 bg-neon-amber/10">
              JEDA
            </span>
          ) : null}
        </div>

        {/* Logo + judul tengah */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 text-center">
          <div className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.4em] text-neon-violet/80">
            Kota Pixel Hidup Otomatis
          </div>
          <div className="font-display text-base sm:text-xl tracking-[0.22em] text-white">
            NEO<span className="text-neon-cyan neon-text">LIFE</span>{' '}
            <span className="text-neon-violet neon-text">INDONESIA</span>{' '}
            <span className="text-white/80">— LIVE 24 JAM</span>
          </div>
        </div>

        {/* Audio indicator (kanan atas, tanpa kontrol) */}
        <div className="absolute top-4 right-5 z-30 flex flex-col items-end gap-2">
          <LiveAudioIndicator />
          <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-slate-500/80">
            neolife.id · {snapshot.waktuHari}
          </div>
        </div>

        {/* === Layer 3: status strip (di bawah header) === */}
        <div className="absolute top-16 sm:top-20 left-0 right-0 z-20 flex justify-center pointer-events-none">
          <LiveStatusStrip variant="horizontal" />
        </div>

        {/* === Layer 4: drama highlight kiri-bawah-tengah === */}
        <div className="absolute bottom-20 left-5 z-20 max-w-[460px]">
          <LiveDramaHighlight variant="horizontal" />
        </div>

        {/* === Layer 5: event ticker marquee di paling bawah === */}
        <LiveEventTicker variant="horizontal" />
      </div>
    </div>
  );
}
