// Memori per-NPC: ring buffer kecil yang menyimpan momen penting hidup
// agar nanti bisa muncul di drawer profil owner.

const MAX_MEMORY = 10;

export function remember(npc, world, text, kategori = 'KOTA') {
  if (!Array.isArray(npc.memori)) npc.memori = [];
  npc.memori.unshift({
    time: `${String(world.jam).padStart(2, '0')}:${String(world.menit).padStart(2, '0')}`,
    hari: world.hari,
    text,
    kategori,
  });
  if (npc.memori.length > MAX_MEMORY) npc.memori.length = MAX_MEMORY;
}

export function recentMemoryText(npc) {
  if (!npc.memori || !npc.memori.length) return null;
  return npc.memori[0].text;
}
