// =============================================================================
// Hook audio singleton untuk NeoLife Indonesia.
//
// Tugas:
//   - Source of truth state audio (musik/ambient/SFX on/off, volume, mood,
//     status aktivasi). Persist ke localStorage.
//   - Driver: subscribe ke engine snapshot, panggil sub-system audio supaya
//     musik & ambient otomatis mengikuti kondisi dunia.
//   - Untuk komponen pemakai (LiveAudioIndicator, OwnerAudioPanel): cukup
//     `useAudio()`.
//
// Aman:
//   - localStorage di-guard `typeof window`
//   - autoplay diblokir browser ⇒ tetap jalan; user klik "Aktifkan Audio"
//     untuk memberikan user gesture.
//   - file audio belum tersedia ⇒ probeFile() men-detect, tidak crash.
// =============================================================================

import { useSyncExternalStore } from 'react';
import {
  setMuteAll,
  stopAllChannels,
  probeFile,
} from '../audio/audioManager.js';
import {
  applyMusic, MUSIC_MOODS, MUSIC_MOOD_KEYS, testMusic,
} from '../audio/musicSystem.js';
import {
  applyAmbient, AMBIENT_LAYERS, testAmbient, getActiveAmbient,
} from '../audio/ambientSystem.js';
import {
  playEventSfx, testSfx,
} from '../audio/soundEffects.js';
import { subscribe as subscribeSim, getSnapshot as getSimSnapshot } from '../simulation/engine.js';

const STORAGE_KEY = 'neolife.audio.v1';

const DEFAULTS = {
  musikOn:    true,
  ambientOn:  true,
  sfxOn:      true,
  musikVol:   0.6,
  ambientVol: 0.5,
  sfxVol:     0.7,
  // mood musik dipilih owner. 'otomatis' = sistem yang pilih dari snapshot.
  musicMood:  'otomatis',
  modeOtomatis: true,            // alias historis untuk indicator
  // Audio untuk live: kalau true, kanal musik & ambient lebih konsisten.
  liveAudio:  true,
  // status: 'belum_diaktifkan' | 'aktif' | 'tidak_tersedia'
  status: 'belum_diaktifkan',
  // Hasil probe: apakah minimal 1 file audio bisa di-load.
  audioFilesAvailable: false,
};

let _state = loadState();
let _lastEventId = null;
const _listeners = new Set();

function loadState() {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return { ...DEFAULTS };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULTS };
    const parsed = JSON.parse(raw);
    return { ...DEFAULTS, ...parsed, status: 'belum_diaktifkan' }; // status reset tiap reload
  } catch {
    return { ...DEFAULTS };
  }
}

function persist() {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(_state));
  } catch { /* ignore */ }
}

function publish() {
  for (const l of _listeners) l();
}

function subscribe(listener) {
  _listeners.add(listener);
  return () => _listeners.delete(listener);
}

function getStateSnapshot() { return _state; }

function clamp01(v) {
  const n = Number(v);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(1, n));
}

// =============================================================================
// Public mutators
// =============================================================================

export function toggleMusik() {
  _state = { ..._state, musikOn: !_state.musikOn };
  persist(); publish();
  if (isRunning()) refreshAudio();
}
export function toggleAmbient() {
  _state = { ..._state, ambientOn: !_state.ambientOn };
  persist(); publish();
  if (isRunning()) refreshAudio();
}
export function toggleSfx() {
  _state = { ..._state, sfxOn: !_state.sfxOn };
  persist(); publish();
}
export function setMusikVol(v) {
  _state = { ..._state, musikVol: clamp01(v) };
  persist(); publish();
  if (isRunning()) refreshAudio();
}
export function setAmbientVol(v) {
  _state = { ..._state, ambientVol: clamp01(v) };
  persist(); publish();
  if (isRunning()) refreshAudio();
}
export function setSfxVol(v) {
  _state = { ..._state, sfxVol: clamp01(v) };
  persist(); publish();
}
export function setMusicMood(mood) {
  if (!MUSIC_MOOD_KEYS.includes(mood)) return;
  _state = { ..._state, musicMood: mood };
  persist(); publish();
  if (isRunning()) refreshAudio();
}
export function toggleModeOtomatis() {
  // Kalau diset off, default mood jadi 'cyberpunk' (mood manual default).
  const next = !_state.modeOtomatis;
  _state = {
    ..._state,
    modeOtomatis: next,
    musicMood: next ? 'otomatis' : (_state.musicMood === 'otomatis' ? 'cyberpunk' : _state.musicMood),
  };
  persist(); publish();
  if (isRunning()) refreshAudio();
}
export function toggleLiveAudio() {
  _state = { ..._state, liveAudio: !_state.liveAudio };
  persist(); publish();
}

// User gesture untuk unlock audio. Probe file dulu — kalau minimal 1 file
// bisa di-load, kita anggap audio "tersedia".
export async function aktifkanAudio() {
  // Probe contoh file musik default. Boleh fail; status "aktif" tetap kita pasang
  // supaya indicator hidup, tapi audioFilesAvailable mencatat hasil probe.
  const probeSrc = MUSIC_MOODS.cyberpunk?.src;
  let available = false;
  if (probeSrc) {
    try { available = await probeFile(probeSrc); } catch { /* ignore */ }
  }

  _state = {
    ..._state,
    status: 'aktif',
    audioFilesAvailable: available,
  };
  persist(); publish();
  refreshAudio();
}

export function nonaktifkanAudio() {
  _state = { ..._state, status: 'belum_diaktifkan' };
  persist(); publish();
  // Stop semua kanal — tidak crash kalau tidak ada yang aktif.
  stopAllChannels(400).catch(() => {});
}

// =============================================================================
// Driver — subscribe ke engine snapshot & terapkan ke audio sub-systems
// =============================================================================

let _started = false;
let _unsubSim = null;

function isRunning() {
  return _started && _state.status === 'aktif';
}

// Jalankan refresh audio terhadap snapshot saat ini.
function refreshAudio(snapshot) {
  if (_state.status !== 'aktif') return;
  const snap = snapshot || getSimSnapshot();
  if (!snap) return;

  setMuteAll(false);

  // Music
  applyMusic({
    userMood: _state.musicMood,
    snapshot: snap,
    musikOn: _state.musikOn,
    volume: _state.musikVol,
  }).catch(() => {});

  // Ambient
  applyAmbient({
    snapshot: snap,
    ambientOn: _state.ambientOn,
    volume: _state.ambientVol,
  }).catch(() => {});

  // SFX: trigger untuk event baru saja terjadi (cek id terbaru).
  const newest = snap.eventLog?.[0];
  if (_state.sfxOn && newest && newest.id !== _lastEventId) {
    _lastEventId = newest.id;
    playEventSfx(newest.category, _state.sfxVol);
  }
}

// Mulai driver — dipanggil otomatis saat hook pertama dipakai.
function ensureDriverStarted() {
  if (_started || typeof window === 'undefined') return;
  _started = true;
  _unsubSim = subscribeSim(() => {
    refreshAudio(getSimSnapshot());
  });
}

// =============================================================================
// React hook
// =============================================================================

export function useAudio() {
  ensureDriverStarted();
  return useSyncExternalStore(subscribe, getStateSnapshot, getStateSnapshot);
}

// Helper ringkas untuk indicator di /live: apakah audio "aktif efektif"?
export function isAudioActive(s) {
  return s.status === 'aktif' && (s.musikOn || s.ambientOn || s.sfxOn);
}

// =============================================================================
// Helper untuk owner test sound + label
// =============================================================================

export function testSoundEffect() {
  if (!_state.sfxOn) return false;
  return testSfx(_state.sfxVol);
}

export function testMusicSample(mood = 'cyberpunk') {
  return testMusic(mood, _state.musikVol);
}

export function testAmbientSample(layer = 'rain') {
  return testAmbient(layer, _state.ambientVol);
}

export function listAmbientLabels() {
  return Object.values(AMBIENT_LAYERS);
}

// Cleanup HMR (Vite dev). Bukan untuk produksi.
if (typeof import.meta !== 'undefined' && import.meta.hot) {
  import.meta.hot.dispose(() => {
    if (_unsubSim) try { _unsubSim(); } catch {}
    _unsubSim = null;
    _started = false;
    stopAllChannels(0).catch(() => {});
  });
}
