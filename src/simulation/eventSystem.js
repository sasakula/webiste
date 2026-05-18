// Event log ringan (placeholder).
export function createEventLog() {
  return { items: [] };
}

export function pushEvent(log, event) {
  log.items.unshift(event);
  if (log.items.length > 80) log.items.length = 80;
}
