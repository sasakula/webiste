// Sistem relasi NPC (placeholder).
export function classifyRelation(score) {
  if (score >= 80) return 'Sahabat';
  if (score >= 50) return 'Teman Dekat';
  if (score >= 20) return 'Teman';
  if (score > -20) return 'Netral';
  if (score > -50) return 'Tidak Akur';
  return 'Musuh';
}
