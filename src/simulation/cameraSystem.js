// Sistem kamera cinematic untuk halaman /live.
//
// Idealnya kamera hidup terpisah dari engine (dipanggil per RAF di CityCanvas).
// Modul ini menyediakan helper murni:
//   pickFocusBuilding(world)  - pilih bangunan yg "menarik" untuk dikunjungi
//   pickFocusEvent(world)     - cari event/drama penting buat di-zoom
//
// CityCanvas akan memanggil pickFocusBuilding tiap N detik di mode 'orbit',
// dan pickFocusEvent setiap update event log untuk transisi smooth ke lokasi.

const FOCUS_CATEGORIES = new Set([
  'KONFLIK', 'KRIMINAL', 'CINTA', 'PRESTASI',
  'PEMBANGUNAN', 'EKONOMI',
]);

// Cari event terbaru yang harus mendapat fokus kamera. Cari di dramaLog dulu,
// fallback ke eventLog. Return label lokasi yg cocok dengan building.name,
// atau null kalau tidak ada match.
export function pickFocusEvent(world) {
  const drama = world.dramaLog || [];
  const events = world.eventLog || [];

  for (const list of [drama.slice(0, 5), events.slice(0, 8)]) {
    for (const e of list) {
      if (!e || !FOCUS_CATEGORIES.has(e.category)) continue;
      // Cari lokasi yang disebut dalam teks event (matching nama bangunan).
      const target = world.buildings?.find((b) =>
        e.text && e.text.includes(b.name),
      );
      if (target) return { event: e, building: target };
    }
  }
  return null;
}

// Pilih bangunan random untuk patrol (skip yang baru saja difokus, kalau bisa).
export function pickPatrolBuilding(world, lastFocusedId) {
  const list = world.buildings?.filter((b) => b.id !== lastFocusedId) || [];
  if (!list.length) return null;
  return list[Math.floor(Math.random() * list.length)];
}

// Skor "penting" suatu event — dipakai kalau nanti kita mau urutkan multiple
// candidates secara otomatis.
export function eventImportance(category) {
  switch (category) {
    case 'KONFLIK':     return 5;
    case 'KRIMINAL':    return 5;
    case 'CINTA':       return 4;
    case 'PEMBANGUNAN': return 3;
    case 'PRESTASI':    return 3;
    case 'EKONOMI':     return 2;
    default:            return 1;
  }
}

// Stub legacy — beberapa file mungkin masih meng-import.
export function createCamera() {
  return { x: 0, y: 0, zoom: 1, mode: 'orbit', targetNpcId: null };
}
export function focusOnNpc(camera, npcId) {
  camera.mode = 'follow';
  camera.targetNpcId = npcId;
}
export function resetCamera(camera) {
  camera.mode = 'orbit';
  camera.targetNpcId = null;
}
