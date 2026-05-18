// Compact NPC profile card used in the bottom rail.
import { MOODS } from '../simulation/constants.js';
import {
  HeartIcon, BoltIcon, CoinIcon, FoodIcon, PeopleIcon, BriefcaseIcon, HomeIcon,
} from './icons.jsx';
import Meter from './Meter.jsx';

const ACTIVITY_LABEL = {
  idle: 'Idle',
  walking: 'Walking',
  working: 'Working',
  eating: 'Eating',
  sleeping: 'Sleeping',
  socializing: 'Socializing',
  shopping: 'Shopping',
  partying: 'Partying',
  fighting: 'Fighting',
  fleeing: 'Fleeing',
};

export default function NpcCard({ npc, selected, onClick }) {
  const mood = MOODS[npc.mood?.toUpperCase()] || MOODS.NEUTRAL;
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative shrink-0 w-[230px] rounded-xl border p-3 text-left transition ${
        selected
          ? 'border-neon-cyan/70 bg-neon-cyan/5 shadow-glow-cyan'
          : 'border-white/5 bg-ink-900/70 hover:border-neon-violet/50'
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className="relative h-10 w-10 rounded-lg overflow-hidden flex items-center justify-center font-display text-base text-ink-950 shrink-0"
          style={{ background: `linear-gradient(135deg, ${npc.color}, ${mood.color})` }}
        >
          {npc.name.charAt(0)}
          <span
            className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border border-ink-900"
            style={{ background: mood.color, boxShadow: `0 0 6px ${mood.color}` }}
            title={mood.label}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-display text-sm text-white truncate">{npc.name}</div>
          <div className="font-mono text-[10px] uppercase tracking-wider text-slate-500 truncate">
            {npc.occupation} · {npc.personality}
          </div>
          <div className="mt-1 flex items-center gap-1 flex-wrap">
            <span className="chip" style={{ color: mood.color, borderColor: `${mood.color}55` }}>
              {mood.label}
            </span>
            <span className="chip">{ACTIVITY_LABEL[npc.activity] || npc.activity}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-3">
        <NeedRow icon={<FoodIcon />} value={npc.hunger} color="#fbbf24" label="Hunger" />
        <NeedRow icon={<BoltIcon />} value={npc.energy} color="#22d3ee" label="Energy" />
        <NeedRow icon={<HeartIcon />} value={npc.social} color="#ec4899" label="Social" />
        <NeedRow icon={<CoinIcon />} value={Math.min(100, npc.money / 5)} color="#a3e635" label={`₡ ${npc.money}`} raw />
      </div>

      <div className="mt-2 flex items-center gap-2 text-[10px] font-mono text-slate-500 truncate">
        <BriefcaseIcon className="text-slate-500" />
        <span className="truncate">{npc.workplace || 'Unemployed'}</span>
      </div>
      <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 truncate">
        <HomeIcon className="text-slate-500" />
        <span className="truncate">{npc.home || 'No fixed address'}</span>
      </div>
      {npc.partnerId ? (
        <div className="absolute top-2 right-2 text-neon-pink animate-pulseSoft">
          <HeartIcon />
        </div>
      ) : null}
    </button>
  );
}

function NeedRow({ icon, value, color, label, raw }) {
  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
        <span className="flex items-center gap-1">
          <span style={{ color }}>{icon}</span>{label}
        </span>
        {!raw ? <span>{Math.round(value)}</span> : null}
      </div>
      <Meter value={value} color={color} />
    </div>
  );
}
