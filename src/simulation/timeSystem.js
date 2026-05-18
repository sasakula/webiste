// Sistem waktu dunia simulasi.
// 1 hari = 1440 menit dunia. Setiap call tickTime() -> +1 menit.

// Versi yang sesuai spec: 5 fase hari.
export function partOfDay(jam) {
  if (jam >= 5  && jam < 11) return 'Pagi';
  if (jam >= 11 && jam < 15) return 'Siang';
  if (jam >= 15 && jam < 18) return 'Sore';
  if (jam >= 18 && jam < 22) return 'Malam';
  return 'Larut Malam';
}

export function tickTime(world) {
  world._minutesTotal += 1;
  const dayMin = world._minutesTotal % 1440;
  world.hari = Math.floor(world._minutesTotal / 1440) + 1;
  world.jam = Math.floor(dayMin / 60);
  world.menit = dayMin % 60;
  world.waktuHari = partOfDay(world.jam);
}

export function formatClock(world) {
  return `${String(world.jam).padStart(2, '0')}:${String(world.menit).padStart(2, '0')}`;
}
