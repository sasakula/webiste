// Bottom panel — horizontal scroll rail of NPC cards. The selected NPC opens
// an extended profile drawer beside it.
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import NpcCard from './NpcCard.jsx';
import PanelHeader from './PanelHeader.jsx';
import { MOODS } from '../simulation/constants.js';
import { HeartIcon } from './icons.jsx';

export default function BottomPanel({ snapshot, selectedNpcId, onSelect }) {
  const sortedNpcs = useMemo(() => {
    // Selected first, then by activity priority (drama up top), then by name.
    const priority = { fighting: 5, fleeing: 4, partying: 3, working: 2, eating: 1 };
    return [...snapshot.npcs].sort((a, b) => {
      if (a.id === selectedNpcId) return -1;
      if (b.id === selectedNpcId) return 1;
      const pa = priority[a.activity] || 0;
      const pb = priority[b.activity] || 0;
      if (pb !== pa) return pb - pa;
      return a.name.localeCompare(b.name);
    });
  }, [snapshot.npcs, selectedNpcId]);

  const selected = snapshot.npcs.find((n) => n.id === selectedNpcId) || null;

  return (
    <section className="panel mx-3 mb-3 h-[230px] flex">
      <div className="flex-1 flex flex-col min-w-0">
        <PanelHeader
          title="Citizen Roster"
          accent="cyan"
          right={
            <span className="font-mono text-[10px] text-slate-500">
              {snapshot.npcs.length} living agents · click to follow
            </span>
          }
        />
        <div className="flex-1 overflow-x-auto overflow-y-hidden">
          <motion.div
            layout
            className="flex items-stretch gap-2 px-3 py-3 h-full"
          >
            {sortedNpcs.map((npc) => (
              <NpcCard
                key={npc.id}
                npc={npc}
                selected={npc.id === selectedNpcId}
                onClick={() => onSelect(npc.id)}
              />
            ))}
          </motion.div>
        </div>
      </div>

      {selected ? (
        <NpcDetailDrawer npc={selected} npcs={snapshot.npcs} />
      ) : null}
    </section>
  );
}

function NpcDetailDrawer({ npc, npcs }) {
  const mood = MOODS[npc.mood?.toUpperCase()] || MOODS.NEUTRAL;
  const friends = Object.entries(npc.relations || {})
    .filter(([, score]) => score >= 30)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([id, score]) => ({ id, score, npc: npcs.find((n) => n.id === id) }))
    .filter((x) => x.npc);
  const enemies = Object.entries(npc.relations || {})
    .filter(([, score]) => score <= -25)
    .sort((a, b) => a[1] - b[1])
    .slice(0, 3)
    .map(([id, score]) => ({ id, score, npc: npcs.find((n) => n.id === id) }))
    .filter((x) => x.npc);

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-[280px] shrink-0 border-l border-white/5 bg-ink-900/60 px-3 py-3 flex flex-col gap-3 overflow-y-auto"
    >
      <div className="flex items-center justify-between">
        <span className="panel-title">Agent Profile</span>
        <span className="chip" style={{ color: mood.color, borderColor: `${mood.color}55` }}>
          {mood.label}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <div
          className="h-12 w-12 rounded-lg flex items-center justify-center font-display text-lg text-ink-950"
          style={{ background: `linear-gradient(135deg, ${npc.color}, ${mood.color})` }}
        >
          {npc.name.charAt(0)}
        </div>
        <div>
          <div className="font-display text-base text-white">{npc.name}</div>
          <div className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
            {npc.personality} · {npc.occupation}
          </div>
        </div>
      </div>

      <div>
        <div className="stat-label mb-1">Friends</div>
        {friends.length === 0 ? (
          <div className="text-[11px] font-mono text-slate-500">No close ties yet.</div>
        ) : (
          <div className="flex flex-col gap-1">
            {friends.map(({ npc: f, score }) => (
              <div key={f.id} className="flex items-center justify-between text-[11px] font-mono">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: f.color, boxShadow: `0 0 4px ${f.color}` }}
                  />
                  <span className="text-slate-200">{f.name}</span>
                </div>
                <span className="text-neon-lime">+{Math.round(score)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {enemies.length ? (
        <div>
          <div className="stat-label mb-1">Rivals</div>
          <div className="flex flex-col gap-1">
            {enemies.map(({ npc: f, score }) => (
              <div key={f.id} className="flex items-center justify-between text-[11px] font-mono">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ background: f.color }} />
                  <span className="text-slate-200">{f.name}</span>
                </div>
                <span className="text-neon-red">{Math.round(score)}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {npc.partnerId ? (
        <div className="rounded-md border border-neon-pink/40 bg-neon-pink/10 px-2 py-1.5 text-[11px] font-mono flex items-center gap-2">
          <HeartIcon className="text-neon-pink" />
          <span className="text-neon-pink">
            Married to {npcs.find((n) => n.id === npc.partnerId)?.name || '—'}
          </span>
        </div>
      ) : null}

      <div>
        <div className="stat-label mb-1">Recent Memory</div>
        {npc.memory.length === 0 ? (
          <div className="text-[11px] font-mono text-slate-500">No salient events yet.</div>
        ) : (
          <ul className="text-[11px] font-mono text-slate-300 list-disc list-inside space-y-0.5">
            {npc.memory.map((m, i) => (
              <li key={i} className="truncate">{m.text}</li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  );
}
