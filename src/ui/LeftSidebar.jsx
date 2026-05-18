// Left sidebar: population, weather, economy, crime, events summary, sim speed.
import { describeCrime, describeEconomy } from '../simulation/world/economy.js';
import { getClock, partOfDay } from '../simulation/time.js';
import Meter from './Meter.jsx';
import PanelHeader from './PanelHeader.jsx';
import SimControls from './SimControls.jsx';
import {
  PeopleIcon, ShieldIcon, BoltIcon, CoinIcon, SunIcon, MoonIcon,
} from './icons.jsx';

export default function LeftSidebar({ snapshot, setSpeedIndex, togglePause }) {
  const clock = getClock({ minutes: snapshot.minutes });
  const phase = partOfDay({ minutes: snapshot.minutes });
  const econLabel = describeEconomy(snapshot.economy);
  const crime = describeCrime(snapshot.economy);
  const moodOfWeather = snapshot.weather.id;
  const isDay = clock.hour >= 6 && clock.hour < 20;

  // Tally moods for population sentiment bar
  const total = snapshot.npcs.length || 1;
  const recentEvents = snapshot.events.slice(0, 4);

  return (
    <aside className="flex flex-col gap-3 p-3 w-[280px] min-w-[280px] h-full overflow-y-auto">
      <SimControls snapshot={snapshot} setSpeedIndex={setSpeedIndex} togglePause={togglePause} />

      <section className="panel">
        <PanelHeader title="World Status" accent="cyan" />
        <div className="flex flex-col gap-3 px-3 py-3">
          <div className="grid grid-cols-2 gap-3">
            <Stat
              icon={<PeopleIcon className="text-neon-cyan" />}
              label="Population"
              value={snapshot.population}
              hint="active agents"
            />
            <Stat
              icon={isDay ? <SunIcon className="text-neon-amber" /> : <MoonIcon className="text-neon-violet" />}
              label="Time"
              value={`${String(clock.hour).padStart(2,'0')}:${String(clock.minute).padStart(2,'0')}`}
              hint={`${phase} · D${clock.day}`}
            />
            <Stat
              icon={<BoltIcon className="text-neon-violet" />}
              label="Weather"
              value={snapshot.weather.label}
              hint={`Intensity ${(snapshot.weatherIntensity * 100).toFixed(0)}%`}
            />
            <Stat
              icon={<CoinIcon className="text-neon-lime" />}
              label="Economy"
              value={econLabel}
              hint={`Index ${snapshot.economy.index.toFixed(1)}`}
            />
          </div>

          <div className="glow-divider" />

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldIcon className="text-neon-red" />
                <span className="stat-label">Crime Level</span>
              </div>
              <span
                className="text-xs font-mono uppercase tracking-wider"
                style={{ color: crime.color }}
              >
                {crime.label}
              </span>
            </div>
            <Meter value={snapshot.economy.crimeIndex} color={crime.color} />
            <div className="stat-row">
              <span className="stat-label">Employment</span>
              <span>{(snapshot.economy.employmentRate * 100).toFixed(1)}%</span>
            </div>
          </div>

          <div className="glow-divider" />

          <div className="flex flex-col gap-2">
            <div className="stat-label">Day / Night Cycle</div>
            <DayNightStrip minutes={snapshot.minutes} />
          </div>
        </div>
      </section>

      <section className="panel">
        <PanelHeader title="Active World Events" accent="violet" />
        <div className="px-3 py-2 flex flex-col gap-2">
          {recentEvents.length === 0 ? (
            <p className="text-xs font-mono text-slate-500">All quiet on the grid…</p>
          ) : (
            recentEvents.map((e) => (
              <div key={e.id} className="text-[11px] font-mono leading-snug">
                <span className="text-slate-500">[{e.time}]</span>{' '}
                <span className={severityColor(e.severity)}>{e.text}</span>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="panel">
        <PanelHeader title={`Weather: ${snapshot.weather.label}`} accent="pink" />
        <div className="px-3 py-3 text-[11px] font-mono text-slate-400 leading-relaxed">
          {weatherFlavor(moodOfWeather)}
        </div>
      </section>
    </aside>
  );
}

function Stat({ icon, label, value, hint }) {
  return (
    <div className="rounded-lg border border-white/5 bg-white/[0.02] p-2.5 flex flex-col gap-1">
      <div className="flex items-center gap-1.5">{icon}<span className="stat-label">{label}</span></div>
      <div className="font-display text-sm text-white tracking-wide">{value}</div>
      {hint ? <div className="font-mono text-[10px] text-slate-500">{hint}</div> : null}
    </div>
  );
}

function DayNightStrip({ minutes }) {
  const dayMinutes = ((minutes % 1440) + 1440) % 1440;
  const pct = (dayMinutes / 1440) * 100;
  return (
    <div className="relative h-3 rounded-full overflow-hidden border border-white/5"
      style={{
        background: 'linear-gradient(90deg, #0b1230 0%, #1e1b4b 12%, #f59e0b 28%, #fde68a 50%, #f97316 70%, #1e1b4b 88%, #0b1230 100%)',
      }}
    >
      <div
        className="absolute top-0 h-full w-[2px] bg-white/80 shadow-[0_0_8px_rgba(255,255,255,0.6)]"
        style={{ left: `${pct}%` }}
      />
    </div>
  );
}

function severityColor(severity) {
  switch (severity) {
    case 'alert': return 'text-neon-red';
    case 'warn':  return 'text-neon-amber';
    case 'good':  return 'text-neon-lime';
    default:      return 'text-slate-200';
  }
}

function weatherFlavor(id) {
  switch (id) {
    case 'rain':   return 'Heavy precipitation across all districts. Drainage systems at 78% capacity. Pedestrian flow reduced by 24%.';
    case 'storm':  return 'Class-3 neon storm. Atmospheric voltage elevated. Citizens advised to remain indoors. Police drones grounded.';
    case 'cloudy': return 'Particulate haze veils the upper city. Holo-billboards diffused, ad reach reduced.';
    case 'fog':    return 'Smog drift index high — visibility 60m. Surveillance grid running on thermal fallback.';
    default:       return 'Clear conditions. Solar collectors at peak yield. NPC mood baseline trending positive.';
  }
}
