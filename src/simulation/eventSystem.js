// Event system: dua log terpisah (kejadian umum + drama NPC),
// plus generator event acak Bahasa Indonesia.
//
// Setiap entry: { id, time, text, kind, severity }
// kind:    KEJADIAN | DRAMA  (tergantung log mana)
// kategori (untuk drama): KONFLIK, CINTA, DRAMA, PRESTASI, PEKERJAAN,
//                          KEBAIKAN, KRIMINAL, EKONOMI, CUACA, PEMBANGUNAN, KOTA

const MAX_EVENTS = 60;
const MAX_DRAMA  = 40;

function nowLabel(world) {
  return `${String(world.jam).padStart(2, '0')}:${String(world.menit).padStart(2, '0')}`;
}

function makeId(world) {
  const id = world._eventCounter++;
  return `evt_${id}`;
}

function severityFor(category) {
  switch (category) {
    case 'KRIMINAL':     return 'alert';
    case 'KONFLIK':      return 'alert';
    case 'CUACA':        return 'warn';
    case 'PEMBANGUNAN':  return 'info';
    case 'PRESTASI':     return 'good';
    case 'KEBAIKAN':     return 'good';
    case 'CINTA':        return 'good';
    case 'EKONOMI':      return 'warn';
    case 'PEKERJAAN':    return 'info';
    default:             return 'info';
  }
}

export function pushEvent(world, text, category = 'KOTA') {
  const item = {
    id: makeId(world),
    time: nowLabel(world),
    text,
    kind: 'KEJADIAN',
    category,
    severity: severityFor(category),
  };
  world.eventLog.unshift(item);
  if (world.eventLog.length > MAX_EVENTS) world.eventLog.length = MAX_EVENTS;
  return item;
}

export function pushDrama(world, text, category = 'DRAMA') {
  const item = {
    id: makeId(world),
    time: nowLabel(world),
    text,
    kind: 'DRAMA',
    category,
    severity: severityFor(category),
  };
  world.dramaLog.unshift(item);
  if (world.dramaLog.length > MAX_DRAMA) world.dramaLog.length = MAX_DRAMA;
  return item;
}

// =============================================================================
// Event terjadwal — dipicu pada jam tertentu sekali per hari.
// =============================================================================

const SCHEDULE = [
  { hour: 6,  text: 'Rian bangun tidur dan bersiap kerja.',          category: 'KOTA' },
  { hour: 7,  text: 'Salsa membeli sarapan di warung.',              category: 'KOTA' },
  { hour: 8,  text: 'Budi berangkat kuliah.',                        category: 'KOTA' },
  { hour: 9,  text: 'Maya membuka warung kecil.',                    category: 'EKONOMI' },
  { hour: 10, text: 'Proyek Rumah Rian dimulai di distrik selatan.', category: 'PEMBANGUNAN' },
  { hour: 13, text: 'Kafe Salsa mulai ramai.',                       category: 'EKONOMI' },
  { hour: 17, text: 'Warga pulang kerja, jalan utama padat.',         category: 'KOTA' },
  { hour: 19, text: 'Lampu kota mulai menyala.',                      category: 'KOTA' },
  { hour: 22, text: 'Polisi mulai patroli malam.',                    category: 'KRIMINAL' },
];

export function tickScheduledEvents(world) {
  if (world.jam === world._lastScheduledHour) return;
  world._lastScheduledHour = world.jam;

  for (const s of SCHEDULE) {
    if (s.hour === world.jam) pushEvent(world, s.text, s.category);
  }
}

// =============================================================================
// Event acak — sesekali muncul untuk membuat dunia terasa hidup.
// =============================================================================

const RANDOM_EVENTS = [
  // Kejadian umum
  { text: 'Antrean panjang terlihat di Kafe Salsa.',                   cat: 'KOTA',        kind: 'KEJADIAN' },
  { text: 'Warga berkumpul di taman kota.',                            cat: 'KOTA',        kind: 'KEJADIAN' },
  { text: 'Kemacetan kecil terjadi di jalan utama.',                   cat: 'KOTA',        kind: 'KEJADIAN' },
  { text: 'Promo kopi diumumkan di Kafe Salsa.',                       cat: 'EKONOMI',     kind: 'KEJADIAN' },
  { text: 'Bank kota memberi pinjaman usaha kecil.',                   cat: 'EKONOMI',     kind: 'KEJADIAN' },
  { text: 'Listrik berkedip di distrik utara.',                        cat: 'KOTA',        kind: 'KEJADIAN' },

  // Drama NPC
  { text: 'Linda mulai dekat dengan Rian.',                            cat: 'CINTA',       kind: 'DRAMA' },
  { text: 'Salsa galau karena Kevin.',                                 cat: 'DRAMA',       kind: 'DRAMA' },
  { text: 'Kevin kehilangan pekerjaan.',                               cat: 'PEKERJAAN',   kind: 'DRAMA' },
  { text: 'Dinda menolak cinta Kevin.',                                cat: 'DRAMA',       kind: 'DRAMA' },
  { text: 'Budi mendapat nilai bagus di kampus.',                      cat: 'PRESTASI',    kind: 'DRAMA' },
  { text: 'Rian membantu orang tua menyeberang.',                      cat: 'KEBAIKAN',    kind: 'DRAMA' },
  { text: 'Maya dan Arif resmi pacaran.',                              cat: 'CINTA',       kind: 'DRAMA' },
  { text: 'Udin dipecat dari proyek lama.',                            cat: 'PEKERJAAN',   kind: 'DRAMA' },

  // Pembangunan
  { text: 'Rumah baru selesai dibangun di distrik selatan.',           cat: 'PEMBANGUNAN', kind: 'KEJADIAN' },
  { text: 'Hujan membuat pembangunan tertunda.',                       cat: 'PEMBANGUNAN', kind: 'KEJADIAN' },
];

export function tickRandomEvents(world) {
  // ~satu event acak setiap 18-30 menit dunia.
  const since = world._minutesTotal - world._lastRandomEvent;
  const interval = 18 + Math.floor(Math.random() * 12);
  if (since < interval) return;
  world._lastRandomEvent = world._minutesTotal;

  const ev = RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)];
  if (ev.kind === 'DRAMA') pushDrama(world, ev.text, ev.cat);
  else                     pushEvent(world, ev.text, ev.cat);
}
