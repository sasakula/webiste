// =============================================================================
// Engine simulasi NeoLife Indonesia.
//
// Engine adalah **module singleton**: satu world untuk seluruh aplikasi,
// supaya halaman /owner, /live, dan /live-vertical membaca state yang sama.
// React component subscribe via hook `useSimulation` (lihat hooks/useSimulation.js).
//
// Cara kerja loop (sangat sederhana, gampang di-extend):
//   - createWorld()       : bikin state dunia awal.
//   - start()             : mulai requestAnimationFrame loop.
//   - tick()              : maju 1 menit dunia, panggil semua sub-system.
//   - publish()           : push snapshot baru ke semua listener (UI).
//
// Speed 1x = 2 tick / detik. Speed 2x/4x/8x = 4/8/16 tick / detik.
// Pause -> loop tetap jalan tapi tidak memajukan state.
// =============================================================================

import { createWorld } from './world.js';
import { tickTime } from './timeSystem.js';
import { tickWeather } from './weatherSystem.js';
import { tickEconomy } from './economySystem.js';
import { tickCrime } from './crimeSystem.js';
import { tickConstruction } from './constructionSystem.js';
import { tickRandomEvents, tickScheduledEvents, pushEvent } from './eventSystem.js';
import { tickNpc, tickSocialEncounters, projectNpc } from '../npc/npcAI.js';

// Berapa milidetik per tick pada speed 1x. Lebih kecil = lebih cepat.
const BASE_TICK_MS = 500;

// Throttle UI publish — minimum jeda antar publish ke React listener
// supaya re-render tidak terlalu sering meski engine tick lebih cepat.
const UI_PUBLISH_MIN_MS = 125; // ~8 Hz

// =============================================================================
// State singleton + listener registry
// =============================================================================

let _world = createWorld();
// Lakukan satu kali proyeksi NPC awal supaya `_world.npcs` (dipakai UI) tidak kosong
// sebelum tick pertama dijalankan.
if (_world._npcs) {
  _world.npcs = _world._npcs.map(projectNpc);
  _world.populasi = _world._npcs.length;
}
let _snapshot = buildSnapshot(_world);
let _listeners = new Set();
let _running = false;
let _rafId = 0;
let _lastTickAt = 0;
let _lastPublishAt = 0;

// Welcome event hanya sekali di awal hidup engine.
pushEvent(_world, 'NeoLife Indonesia mulai disiarkan langsung.', 'KOTA');
_snapshot = buildSnapshot(_world);

// =============================================================================
// Public API
// =============================================================================

export function getSnapshot() {
  return _snapshot;
}

export function subscribe(listener) {
  _listeners.add(listener);
  // Pastikan engine berjalan saat ada listener pertama.
  ensureRunning();
  return () => {
    _listeners.delete(listener);
    // Catatan: kita biarkan engine tetap jalan walau listener kosong,
    // supaya world terus hidup saat user pindah route. Hemat dengan tetap
    // berjalan ringan di RAF.
  };
}

export function pause() {
  if (_world.paused) return;
  _world = { ..._world, paused: true };
  publish();
}

export function play() {
  if (!_world.paused) return;
  _world = { ..._world, paused: false };
  publish();
}

export function togglePause() {
  if (_world.paused) play(); else pause();
}

export function setSpeed(speed) {
  const allowed = [1, 2, 4, 8];
  const next = allowed.includes(speed) ? speed : 1;
  if (_world.speed === next && !_world.paused) return;
  _world = { ..._world, speed: next, paused: false };
  publish();
}

// Reset world (handy untuk Settings → tombol reset di masa depan).
export function reset() {
  _world = createWorld();
  pushEvent(_world, 'Simulasi di-reset.', 'KOTA');
  publish();
}

// =============================================================================
// Loop internal
// =============================================================================

function ensureRunning() {
  if (_running) return;
  _running = true;
  _lastTickAt = performance.now();
  _rafId = requestAnimationFrame(loop);
}

function loop(now) {
  // Saat di-pause, kita tetap jalan tapi tidak tick. Ini supaya kalau user
  // klik play, engine langsung nyambung tanpa delay.
  const interval = BASE_TICK_MS / Math.max(1, _world.speed);

  if (!_world.paused) {
    let elapsed = now - _lastTickAt;
    let ticked = false;

    // Cap maksimal tick per frame supaya tidak death-spiral kalau tab di-resume.
    let safety = 30;
    while (elapsed >= interval && safety-- > 0) {
      tick();
      elapsed -= interval;
      ticked = true;
    }
    _lastTickAt = now - elapsed;

    // Throttle UI publish — engine boleh tick 16x/detik di speed 8x, tapi
    // React tidak butuh re-render segitu sering. Cap di 8 Hz (~125ms).
    if (ticked && now - _lastPublishAt >= UI_PUBLISH_MIN_MS) {
      _lastPublishAt = now;
      publish();
    }
  } else {
    _lastTickAt = now;
  }

  _rafId = requestAnimationFrame(loop);
}

function tick() {
  // Engine memutasi `_world` langsung untuk efisiensi (objek besar, banyak field).
  // Snapshot di-rebuild sekali setelah loop selesai.
  tickTime(_world);
  tickWeather(_world);
  tickEconomy(_world);
  tickCrime(_world);
  tickConstruction(_world);
  tickScheduledEvents(_world);
  tickRandomEvents(_world);

  // Tick semua NPC (decision + decay + arrive + finalize).
  if (_world._npcs) {
    for (const npc of _world._npcs) tickNpc(npc, _world);
    tickSocialEncounters(_world);
    // Proyeksikan ke `world.npcs` (struktur ringan untuk UI).
    _world.npcs = _world._npcs.map(projectNpc);
    _world.populasi = _world._npcs.length;
  }
}

function publish() {
  _snapshot = buildSnapshot(_world);
  for (const l of _listeners) l();
}

// =============================================================================
// Snapshot builder
// Snapshot adalah versi *immutable* dari _world yang dipakai UI.
// Hanya field yang relevan untuk render — tidak ada `_internal`.
// =============================================================================

function buildSnapshot(world) {
  return {
    hari: world.hari,
    jam: world.jam,
    menit: world.menit,
    waktuHari: world.waktuHari,

    cuaca: world.cuaca,
    ekonomi: world.ekonomi,
    ekonomiIndex: Number(world.ekonomiIndex.toFixed(1)),

    kriminalitas: Math.round(world.kriminalitas * 10) / 10,
    kebahagiaan:  Math.round(world.kebahagiaan * 10) / 10,
    populasi: world.populasi,

    eventLog: world.eventLog,
    dramaLog: world.dramaLog,

    npcs: world.npcs,
    buildings: world.buildings,

    paused: world.paused,
    speed: world.speed,
  };
}

// Cleanup hook untuk hot-reload dev (HMR Vite). Bukan untuk produksi.
if (typeof import.meta !== 'undefined' && import.meta.hot) {
  import.meta.hot.dispose(() => {
    if (_rafId) cancelAnimationFrame(_rafId);
    _running = false;
    if (typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', _onVisibilityChange);
    }
  });
}

// =============================================================================
// Visibility throttle
// Saat tab tersembunyi, browser sudah throttle RAF ke ~1 Hz. Tanpa handling,
// saat tab kembali aktif loop akan "catch-up" dan tick banyak sekaligus
// (menghasilkan ledakan event). Kita reset timestamp saat tab visible lagi
// supaya simulasi nyambung mulus tanpa lompat banyak menit dunia.
// =============================================================================

function _onVisibilityChange() {
  if (typeof document === 'undefined') return;
  if (!document.hidden) {
    _lastTickAt = performance.now();
    _lastPublishAt = performance.now();
  }
}

if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', _onVisibilityChange);
}
