// Right sidebar: live event feed + drama logs.
import { motion, AnimatePresence } from 'framer-motion';
import PanelHeader from './PanelHeader.jsx';

export default function RightSidebar({ snapshot, world, onFocusNpc, selectedNpcId }) {
  const events = snapshot.events;
  const drama = events.filter((e) => e.type === 'drama' || e.type === 'crime' || e.type === 'social');
  const notices = events.filter((e) => e.type !== 'drama' && e.type !== 'crime' && e.type !== 'social').slice(0, 14);

  return (
    <aside className="flex flex-col gap-3 p-3 w-[320px] min-w-[320px] h-full overflow-hidden">
      <section className="panel flex flex-col flex-[2] min-h-0">
        <PanelHeader
          title="Live Event Feed"
          accent="cyan"
          right={
            <span className="font-mono text-[10px] text-slate-500">
              {events.length} entries
            </span>
          }
        />
        <div className="flex-1 overflow-y-auto px-3 py-2">
          <AnimatePresence initial={false}>
            {events.map((e) => (
              <motion.div
                key={e.id}
                layout
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="group flex items-start gap-2 py-1.5 border-b border-white/5 last:border-0 cursor-pointer"
                onClick={() => e.actorId && onFocusNpc(e.actorId)}
              >
                <span className="font-mono text-[10px] text-slate-500 shrink-0 mt-0.5">
                  [{e.time}]
                </span>
                <span className={`text-[11px] leading-snug ${severityColor(e.severity)} ${e.actorId ? 'group-hover:underline' : ''}`}>
                  {e.text}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      <section className="panel flex flex-col flex-1 min-h-0">
        <PanelHeader title="NPC Drama Logs" accent="pink" />
        <div className="flex-1 overflow-y-auto px-3 py-2 flex flex-col gap-1.5">
          {drama.length === 0 ? (
            <p className="text-xs font-mono text-slate-500">No drama yet — citizens are behaving.</p>
          ) : (
            drama.slice(0, 12).map((e) => (
              <div key={e.id} className="rounded-md border border-white/5 bg-white/[0.02] px-2 py-1.5">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span>{e.time}</span>
                  <span className={severityChip(e.severity)}>{labelOf(e.type)}</span>
                </div>
                <div className={`text-[11px] mt-1 ${severityColor(e.severity)}`}>{e.text}</div>
              </div>
            ))
          )}
        </div>
      </section>
    </aside>
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

function severityChip(severity) {
  const base = 'rounded-full px-1.5 py-0.5 border ';
  switch (severity) {
    case 'alert': return base + 'border-neon-red/40 text-neon-red bg-neon-red/10';
    case 'warn':  return base + 'border-neon-amber/40 text-neon-amber bg-neon-amber/10';
    case 'good':  return base + 'border-neon-lime/40 text-neon-lime bg-neon-lime/10';
    default:      return base + 'border-white/10 text-slate-400 bg-white/5';
  }
}

function labelOf(type) {
  switch (type) {
    case 'crime': return 'CRIME';
    case 'drama': return 'DRAMA';
    case 'social': return 'SOCIAL';
    case 'jobloss': return 'JOB';
    case 'lottery': return 'WIN';
    case 'promo': return 'PROMO';
    case 'outage': return 'GRID';
    case 'traffic': return 'TRAFFIC';
    case 'weather': return 'WEATHER';
    case 'culture': return 'CULTURE';
    case 'celebrity': return 'CELEB';
    case 'system': return 'SYS';
    default: return 'INFO';
  }
}
