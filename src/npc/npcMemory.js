// Memori NPC (placeholder).
export function remember(npc, text) {
  npc.memory = npc.memory || [];
  npc.memory.unshift(text);
  if (npc.memory.length > 8) npc.memory.length = 8;
}
