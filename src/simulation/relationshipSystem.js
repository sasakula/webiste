// Sistem relasi NPC (placeholder ringan untuk tahap engine sederhana).
export function classifyRelation(score) {
  if (score >= 80) return 'Sahabat';
  if (score >= 50) return 'Teman Dekat';
  if (score >= 20) return 'Teman';
  if (score > -20) return 'Netral';
  if (score > -50) return 'Tidak Akur';
  return 'Musuh';
}

// Belum ada update otomatis di engine v0.1 — akan diisi saat AI NPC dipasang.
export function tickRelationships(_world) {}
