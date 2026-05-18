// Top bar with logo, in-game time and brand identity.
import { getClock, partOfDay } from '../simulation/time.js';
import { describeEconomy } from '../simulation/world/economy.js';
import { MoonIcon, SunIcon, RadioIcon } from './icons.jsx';

export default function TopBar({ snapshot, world }) {
  const clock = getClock({ minutes: snapshot.minutes });
  const phase = partOfDay({ minutes: snapshot.minutes });
  const isDay = clock.hour >= 6 && clock.hour < 20;
  return (
    <header className="flex items-center justify-between gap-4 px-4 py-2 border-b border-white/5 bg-ink-900/60 backdrop-blur">
      <div className="flex items-center gap-3">
        <div className="relative h-8 w-8 rounded-md bg-gradient-to-br from-neon-cyan to-neon-violet flex items-center justify-center font-display font-bold text-ink-950">
          N
          <span className="absolute -inset-0.5 rounded-md ring-1 ring-neon-violet/40 animate-pulseSoft pointer-events-none" />
        </div>
        <div className="leading-none">
          <div className="font-display text-base font-bold tracking-[0.18em] text-white">
            NEO<span className="text-neon-cyan neon-text">LIFE</span>
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500">
            Autonomous City Sim · v0.1
          </div>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-6 text-xs font-mono uppercase tracking-wider text-slate-400">
        <div className="flex items-center gap-2">
          {isDay ? <SunIcon className="text-neon-amber" /> : <MoonIcon className="text-neon-cyan" />}
          <span>Day {clock.day}</span>
          <span className="text-white">{String(clock.hour).padStart(2, '0')}:{String(clock.minute).padStart(2, '0')}</span>
          <span className="chip">{phase}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-500">Economy</span>
          <span className="text-neon-lime">{describeEconomy(snapshot.economy)}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs font-mono text-neon-cyan">
        <span className="relative inline-flex h-2 w-2 rounded-full bg-neon-cyan">
          <span className="absolute inset-0 rounded-full bg-neon-cyan animate-ping" />
        </span>
        LIVE FEED · {snapshot.population} agents online
        <RadioIcon className="text-neon-violet" />
      </div>
    </header>
  );
}
