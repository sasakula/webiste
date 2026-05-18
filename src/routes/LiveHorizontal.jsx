// /live  — Live Horizontal 16:9 (YouTube/Facebook).
// Tampilan cinematic untuk penonton: kota pixel besar di tengah, overlay LIVE
// di kiri-atas, info ringkas di kanan-atas, event ticker besar di bawah.
// Tidak ada sidebar admin. Cocok dijadikan OBS browser source.
import CityCanvas from '../components/city/CityCanvas.jsx';
import LiveOverlay from '../components/live/LiveOverlay.jsx';
import LiveEventTicker from '../components/live/LiveEventTicker.jsx';
import { useSimulation } from '../hooks/useSimulation.js';

export default function LiveHorizontal() {
  const { snapshot } = useSimulation();

  return (
    <div className="h-full w-full flex items-center justify-center p-4">
      {/* Frame 16:9 cinematic. */}
      <div
        className="relative w-full h-full max-w-[1920px] mx-auto rounded-xl overflow-hidden"
        style={{ aspectRatio: '16 / 9', maxHeight: '100%' }}
      >
        {/* Kota pixel mengisi seluruh frame. */}
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

        {/* Overlay info penonton. */}
        <LiveOverlay variant="horizontal" />

        {/* Event ticker besar di bawah, full width. */}
        <LiveEventTicker variant="horizontal" />

        {/* Edge gradient supaya teks lebih kebaca di atas canvas. */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-ink-950/80 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-ink-950/85 to-transparent" />
      </div>
    </div>
  );
}
