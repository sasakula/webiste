// Center stage: the canvas viewport that the renderer paints into.
import { useRef } from 'react';
import { useRenderer } from '../hooks/useRenderer.js';
import { TargetIcon } from './icons.jsx';

export default function CityViewport({ world, snapshot, selectedNpcId, onClearFollow, cameraRef }) {
  const canvasRef = useRef(null);
  useRenderer(canvasRef, world, cameraRef);

  const followed = snapshot.npcs.find((n) => n.id === selectedNpcId);

  return (
    <section className="panel flex-1 m-3 mb-0 overflow-hidden flex flex-col scanline-overlay">
      <div className="panel-header">
        <div className="flex items-center gap-2">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-neon-cyan animate-pulseSoft" />
          <span className="panel-title">City Live View</span>
          <span className="font-mono text-[10px] text-slate-500">Sector 7 · Block 4</span>
        </div>
        <div className="flex items-center gap-2">
          {followed ? (
            <button
              className="chip hover:border-neon-violet/50 hover:text-neon-violet"
              onClick={onClearFollow}
            >
              <TargetIcon className="h-3 w-3" /> Following: {followed.name} (release)
            </button>
          ) : (
            <span className="chip text-slate-500">
              <TargetIcon className="h-3 w-3" /> Cinematic mode
            </span>
          )}
          <span className="chip text-neon-cyan">{snapshot.weather.label}</span>
        </div>
      </div>
      <div className="relative flex-1">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pixel-edge" />
        {followed ? (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="border border-neon-cyan/40 rounded-full w-32 h-32 animate-pulseSoft" />
          </div>
        ) : null}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink-900/40 via-transparent to-ink-900/60" />
        {snapshot.activeCrime ? (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full border border-neon-red/60 bg-neon-red/10 text-neon-red text-[11px] font-mono uppercase tracking-wider animate-pulseSoft">
            ⚠ Incident in progress · units dispatched
          </div>
        ) : null}
      </div>
    </section>
  );
}
