// Helper umum untuk perilaku NPC. Tidak menyimpan state — hanya fungsi murni
// yang dipakai oleh AI maupun UI (mis. menampilkan aktivitas singkat).

// Ringkas string aktivitas panjang menjadi label pendek untuk tampilan.
//   "Berjalan ke Kafe Salsa" -> "Berjalan"
//   "Bekerja di Kantor Utama" -> "Bekerja"
export function aktivitasShort(npc) {
  const a = npc?.aktivitas || 'Diam';
  if (a.startsWith('Berjalan'))   return 'Berjalan';
  if (a.startsWith('Bekerja'))    return 'Bekerja';
  if (a.startsWith('Makan'))      return 'Makan';
  if (a.startsWith('Belanja'))    return 'Belanja';
  if (a.startsWith('Nongkrong'))  return 'Nongkrong';
  if (a.startsWith('Membangun'))  return 'Membangun';
  if (a.startsWith('Bersantai'))  return 'Bersantai';
  return a;
}

// Apakah NPC sedang berada di luar (lagi jalan)?
export function isOutdoor(npc) {
  return Boolean(npc?.aktivitas?.startsWith('Berjalan'));
}

// Status pekerjaan default yang konsisten untuk profesi.
export function statusPekerjaanFor(pekerjaan) {
  if (pekerjaan === 'Pengangguran')                   return 'Mencari Kerja';
  if (pekerjaan === 'Mahasiswa' || pekerjaan === 'Pelajar') return 'Kuliah';
  return 'Bekerja';
}

// Pencarian bangunan deterministik per tipe (atau bangunan tertentu by name).
export function findBuildingByName(world, name) {
  return world.buildings.find((b) => b.name === name);
}

export function findBuildingsByType(world, type) {
  return world.buildings.filter(
    (b) => b.type === type && b.status !== 'Dibangun' && b.status !== 'Bangkrut',
  );
}

// Pilih satu bangunan random dari tipe tertentu. Null kalau tidak ada.
export function pickBuildingOfType(world, type) {
  const list = findBuildingsByType(world, type);
  return list.length ? list[Math.floor(Math.random() * list.length)] : null;
}

// Pilih bangunan dari daftar tipe (pertama yang ada).
export function pickBuildingFromTypes(world, types) {
  for (const t of types) {
    const b = pickBuildingOfType(world, t);
    if (b) return b;
  }
  return null;
}
