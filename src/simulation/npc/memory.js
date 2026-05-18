// Bounded per-NPC memory: stores salient events for narrative recall.
const MAX_MEMORY = 8;

export function remember(npc, state, text) {
  npc.memory.unshift({ tick: state.tick, text });
  if (npc.memory.length > MAX_MEMORY) npc.memory.length = MAX_MEMORY;
}

export function recentMemoryText(npc) {
  if (!npc.memory.length) return null;
  return npc.memory[0].text;
}
