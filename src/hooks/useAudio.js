// Hook audio singleton untuk NeoLife Indonesia.
//
// Sekarang masih placeholder: tidak memutar audio sungguhan, tapi:
//   - menyimpan preferensi user di localStorage (musik/ambient/SFX/volume/mode)
//   - menyediakan flag bagaimana audio "diharapkan" berperilaku
//   - menjadi single source of truth untuk indicator di /live + kontrol penuh di /owner
//
// Saat file audio sungguhan dipasang nanti, tinggal isi `play/pause/setVolume`
// di sini. Komponen pemakainya tidak perlu berubah.

import { useSyncExternalStore } from 'react';

const STORAGE_KEY = 'neolife.audio.v1';

const DEFAULTS = {
  musikOn:    true,
  ambientOn:  true,
  sfxOn:      true,
  musikVol:   0.6,
  ambientVol: 0.5,
  sfxVol:     0.7,
  modeOtomatis: true,
  // status: 'belum_diaktifkan' | 'aktif' | 'tidak_tersedia'
  status: 'belum_diaktifkan',
  // file audio belum di-bundle. Ubah ke true saat asset siap.
  audioFilesAvailable: false,
};

let _state = loadState();
const _listeners = new Set();

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULTS };
    const parsed = JSON.parse(raw);
    return { ...DEFAULTS, ...parsed };
  } catch {
    return { ...DEFAULTS };
  }
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(_state));
  } catch {
    // ignore (private mode etc.)
  }
}

function publish() {
  for (const l of _listeners) l();
}

function subscribe(listener) {
  _listeners.add(listener);
  return () => _listeners.delete(listener);
}

function getSnapshot() {
  return _state;
}

// === Public mutators ===

export function toggleMusik() {
  _state = { ..._state, musikOn: !_state.musikOn };
  persist(); publish();
}
export function toggleAmbient() {
  _state = { ..._state, ambientOn: !_state.ambientOn };
  persist(); publish();
}
export function toggleSfx() {
  _state = { ..._state, sfxOn: !_state.sfxOn };
  persist(); publish();
}
export function setMusikVol(v) {
  _state = { ..._state, musikVol: clamp01(v) };
  persist(); publish();
}
export function setAmbientVol(v) {
  _state = { ..._state, ambientVol: clamp01(v) };
  persist(); publish();
}
export function setSfxVol(v) {
  _state = { ..._state, sfxVol: clamp01(v) };
  persist(); publish();
}
export function toggleModeOtomatis() {
  _state = { ..._state, modeOtomatis: !_state.modeOtomatis };
  persist(); publish();
}
export function aktifkanAudio() {
  // Browser butuh user gesture sebelum audio bisa main. Tombol ini
  // mensimulasikan unlock; saat asset sungguhan ada, di sini kita panggil
  // AudioContext.resume() dan mulai loop musik/ambient.
  _state = {
    ..._state,
    status: _state.audioFilesAvailable ? 'aktif' : 'belum_diaktifkan',
  };
  persist(); publish();
}
export function nonaktifkanAudio() {
  _state = { ..._state, status: 'belum_diaktifkan' };
  persist(); publish();
}

function clamp01(v) {
  const n = Number(v);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(1, n));
}

// === React hook ===

export function useAudio() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

// Helper ringkas untuk indicator di /live: apakah audio "aktif efektif"?
// (audio dianggap aktif kalau status === 'aktif' DAN minimal salah satu kanal on)
export function isAudioActive(s) {
  return s.status === 'aktif' && (s.musikOn || s.ambientOn || s.sfxOn);
}
