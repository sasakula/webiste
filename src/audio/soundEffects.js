// =============================================================================
// soundEffects — efek suara pendek (one-shot) untuk event penting.
//
// Mapping kategori event → file SFX. Boleh di-trigger paralel (overlap),
// engine kerjanya panggil playEventSfx(category) saat event muncul.
// =============================================================================

import { playOneShot } from './audioManager.js';

export const SFX = {
  EVENT_POP:            { id: 'event_pop',            src: '/audio/sfx/event-pop.mp3' },
  DRAMA_ALERT:          { id: 'drama_alert',          src: '/audio/sfx/drama-alert.mp3' },
  POLICE_SIREN:         { id: 'police_siren',         src: '/audio/sfx/police-siren.mp3' },
  CONSTRUCTION_DONE:    { id: 'construction_done',    src: '/audio/sfx/construction-complete.mp3' },
  MARRIAGE:             { id: 'marriage',             src: '/audio/sfx/marriage.mp3' },
  BANKRUPTCY:           { id: 'bankruptcy',           src: '/audio/sfx/bankruptcy.mp3' },
  RAIN_START:           { id: 'rain_start',           src: '/audio/sfx/rain-start.mp3' },
  ECONOMY_UP:           { id: 'economy_up',           src: '/audio/sfx/economy-up.mp3' },
  ECONOMY_DOWN:         { id: 'economy_down',         src: '/audio/sfx/economy-down.mp3' },
};

// Map kategori event (dari eventSystem.js) → SFX id.
const CATEGORY_TO_SFX = {
  KRIMINAL:    SFX.POLICE_SIREN,
  KONFLIK:     SFX.DRAMA_ALERT,
  CINTA:       SFX.MARRIAGE,
  PEMBANGUNAN: SFX.CONSTRUCTION_DONE,
  EKONOMI:     SFX.EVENT_POP,
  CUACA:       SFX.RAIN_START,
  PRESTASI:    SFX.EVENT_POP,
  KEHIDUPAN:   SFX.EVENT_POP,
  PEKERJAAN:   SFX.EVENT_POP,
  KEBAIKAN:    SFX.EVENT_POP,
  DRAMA:       SFX.DRAMA_ALERT,
  KOTA:        SFX.EVENT_POP,
};

// Kategori yang DIAM secara default (terlalu sering, akan boring).
const SILENT_CATEGORIES = new Set(['KEHIDUPAN', 'KOTA']);

export function playEventSfx(category, volume = 0.7) {
  if (SILENT_CATEGORIES.has(category)) return false;
  const sfx = CATEGORY_TO_SFX[category];
  if (!sfx) return false;
  return playOneShot(sfx.src, volume);
}

export function playSfxById(sfxId, volume = 0.7) {
  const def = Object.values(SFX).find((s) => s.id === sfxId);
  if (!def) return false;
  return playOneShot(def.src, volume);
}

// Untuk tombol Test Sound di owner panel.
export function testSfx(volume = 0.7) {
  return playOneShot(SFX.EVENT_POP.src, volume);
}
