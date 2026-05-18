// Speed + pause controls. Uses keyboard shortcut Space for pause.
import { useEffect } from 'react';
import { SPEED_OPTIONS } from '../simulation/constants.js';
import { PauseIcon, PlayIcon, FastIcon } from './icons.jsx';

export default function SimControls({ snapshot, setSpeedIndex, togglePause }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        togglePause();
      } else if (e.key >= '1' && e.key <= '4') {
        setSpeedIndex(Number(e.key));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setSpeedIndex, togglePause]);

  return (
    <div className="panel">
      <div className="panel-header">
        <span className="panel-title">Simulation Controls</span>
        <span className="font-mono text-[10px] text-slate-500">SPACE pause · 1-4 speed</span>
      </div>
      <div className="flex items-center gap-2 px-3 py-3">
        <button
          className="btn-icon"
          data-active={snapshot.paused ? 'true' : 'false'}
          onClick={togglePause}
          title={snapshot.paused ? 'Resume (Space)' : 'Pause (Space)'}
        >
          {snapshot.paused ? <PlayIcon /> : <PauseIcon />}
        </button>
        <div className="flex-1 grid grid-cols-5 gap-1">
          {SPEED_OPTIONS.map((sp, idx) => {
            const active = snapshot.speedIndex === idx;
            return (
              <button
                key={idx}
                onClick={() => setSpeedIndex(idx)}
                className={`h-8 rounded-md border text-[11px] font-mono uppercase tracking-wider transition ${
                  active
                    ? 'border-neon-cyan/70 bg-neon-cyan/10 text-neon-cyan shadow-glow-cyan'
                    : 'border-white/10 bg-white/5 text-slate-300 hover:border-neon-violet/40'
                }`}
              >
                {sp === 0 ? 'II' : `${sp}x`}
              </button>
            );
          })}
        </div>
        <FastIcon className="text-neon-violet" />
      </div>
    </div>
  );
}
