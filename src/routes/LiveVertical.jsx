// /live-vertical  — Live Vertical 9:16 (TikTok/Instagram).
// Tampilan cinematic untuk penonton mobile.
import CityCanvasPlaceholder from '../components/city/CityCanvasPlaceholder.jsx';
import LiveOverlay from '../components/live/LiveOverlay.jsx';
import LiveEventTicker from '../components/live/LiveEventTicker.jsx';

export default function LiveVertical() {
  return (
    <div className="h-full w-full flex items-center justify-center p-3">
      {/* Frame 9:16 cinematic. Lebar dibatasi supaya rapi di desktop juga. */}
      <div
        className="relative h-full mx-auto rounded-xl overflow-hidden"
        style={{ aspectRatio: '9 / 16', maxHeight: '100%' }}
      >
        <div className="absolute inset-0">
          <CityCanvasPlaceholder mode="vertical" fullBleed />
        </div>

        <LiveOverlay variant="vertical" />
        <LiveEventTicker variant="vertical" />

        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ink-950/85 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink-950/90 to-transparent" />
      </div>
    </div>
  );
}
