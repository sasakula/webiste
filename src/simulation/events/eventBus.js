// Centralized event log for the live feed. Stores a bounded ring buffer
// so the right sidebar can render the latest events without leaking memory.
import { formatClock } from '../time.js';
import { nextId } from '../random.js';

const MAX_EVENTS = 80;

export function createEventLog() {
  return {
    items: [],
    counter: 0,
  };
}

export function pushEvent(log, state, payload) {
  const item = {
    id: nextId('evt'),
    time: formatClock(state),
    tick: state.tick,
    severity: payload.severity || 'info',
    type: payload.type || 'info',
    text: payload.text,
    actorId: payload.actorId || null,
    targetId: payload.targetId || null,
    location: payload.location || null,
  };
  log.items.unshift(item);
  if (log.items.length > MAX_EVENTS) log.items.length = MAX_EVENTS;
  log.counter++;
  return item;
}
