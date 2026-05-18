// Sistem waktu (placeholder). Konversi menit -> jam:menit.
export function formatClock(minutes) {
  const m = Math.floor(minutes) % 1440;
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return `${String(h).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
}

export function partOfDay(minutes) {
  const h = Math.floor(minutes / 60) % 24;
  if (h < 4)  return 'Larut Malam';
  if (h < 6)  return 'Subuh';
  if (h < 11) return 'Pagi';
  if (h < 15) return 'Siang';
  if (h < 18) return 'Sore';
  if (h < 22) return 'Malam';
  return 'Larut Malam';
}
