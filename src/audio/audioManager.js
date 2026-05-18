// =============================================================================
// audioManager — wrapper tipis di atas HTMLAudioElement.
//
// Tanggung jawab:
//   - Memuat file audio secara lazy.
//   - Memutar / memberhentikan track di kanal tertentu (music/ambient).
//   - Crossfade halus saat ganti track di kanal yg sama.
//   - One-shot play untuk SFX (boleh tumpang-tindih dengan instance terpisah).
//   - Aman: kalau file 404 / browser blokir autoplay, sistem tidak crash.
//
// File audio belum di-bundle. Saat asset siap ditaruh di `public/audio/...`,
// audio otomatis bisa diputar tanpa perubahan kode lain.
// =============================================================================

// === Internal state ===
const _channels = new Map();   // kanalId -> { audio, key, fadeRaf }
const _cache = new Map();      // src -> { ok: boolean, audio?: HTMLAudio }
let _muteAll = false;

// Cek apakah env mendukung audio (jaga2 SSR / build).
function audioSupported() {
  return typeof window !== 'undefined' && typeof Audio !== 'undefined';
}

// Probe file: cek apakah bisa di-load. Return { ok, audio } yang di-cache.
function loadAudio(src) {
  if (!audioSupported()) return { ok: false };
  if (_cache.has(src)) return _cache.get(src);

  let entry;
  try {
    const audio = new Audio(src);
    audio.preload = 'auto';
    audio.crossOrigin = 'anonymous';

    // Catat status load. `error` sering dipicu kalau file tidak ada.
    audio.addEventListener('error', () => {
      const cached = _cache.get(src);
      if (cached) cached.ok = false;
    });

    entry = { ok: true, audio };
  } catch {
    entry = { ok: false };
  }
  _cache.set(src, entry);
  return entry;
}

// Crossfade dari volume sekarang ke target dalam `ms`. Return Promise.
function fade(audio, fromVol, toVol, ms = 600) {
  return new Promise((resolve) => {
    if (!audio || ms <= 0) {
      try { audio.volume = clamp01(toVol); } catch {}
      return resolve();
    }
    const start = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - start) / ms);
      try { audio.volume = clamp01(fromVol + (toVol - fromVol) * t); } catch {}
      if (t < 1) requestAnimationFrame(step);
      else resolve();
    };
    requestAnimationFrame(step);
  });
}

function clamp01(v) {
  const n = Number(v);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(1, n));
}

// =============================================================================
// Public API
// =============================================================================

// Mainkan track di kanal (music/ambient_xxx).
//   channelId : kunci kanal, mis. 'music', 'ambient_rain', 'ambient_city'
//   src       : path audio (boleh null untuk stop kanal)
//   volume    : 0..1 (volume target setelah fade-in)
//   fadeMs    : durasi crossfade (ms)
export async function playOnChannel(channelId, src, volume = 0.6, fadeMs = 600) {
  if (!audioSupported()) return false;

  const current = _channels.get(channelId);

  // Stop kanal kalau src null.
  if (!src) {
    if (current?.audio) {
      await fade(current.audio, current.audio.volume, 0, fadeMs);
      try { current.audio.pause(); } catch {}
    }
    _channels.delete(channelId);
    return true;
  }

  // Tidak ganti track kalau sudah memutar src yang sama.
  if (current && current.key === src) {
    // Hanya update volume target.
    await fade(current.audio, current.audio.volume, _muteAll ? 0 : volume, fadeMs);
    return true;
  }

  // Load (atau ambil dari cache).
  const entry = loadAudio(src);
  if (!entry.ok) return false;

  // Fade-out track lama (kalau ada).
  if (current?.audio) {
    fade(current.audio, current.audio.volume, 0, fadeMs).then(() => {
      try { current.audio.pause(); } catch {}
    });
  }

  // Mulai track baru: looping = true (musik & ambient).
  const audio = entry.audio;
  try {
    audio.loop = true;
    audio.volume = 0;
    // play() return Promise; tangkap rejection (autoplay policy).
    const p = audio.play();
    if (p && typeof p.catch === 'function') p.catch(() => { /* di-block, biarkan */ });
  } catch {
    return false;
  }

  _channels.set(channelId, { audio, key: src });
  await fade(audio, 0, _muteAll ? 0 : volume, fadeMs);
  return true;
}

// Stop semua kanal (dipakai saat user matikan audio).
export async function stopAllChannels(fadeMs = 400) {
  const ids = Array.from(_channels.keys());
  await Promise.all(ids.map((id) => playOnChannel(id, null, 0, fadeMs)));
}

// Atur volume kanal yang sudah berjalan.
export function setChannelVolume(channelId, volume, fadeMs = 200) {
  const c = _channels.get(channelId);
  if (!c?.audio) return;
  fade(c.audio, c.audio.volume, _muteAll ? 0 : clamp01(volume), fadeMs);
}

// One-shot play (SFX). Bikin instance baru tiap kali — boleh overlap.
// Tidak loop. Volume di-set langsung tanpa fade.
export function playOneShot(src, volume = 0.7) {
  if (!audioSupported() || _muteAll) return false;
  const entry = loadAudio(src);
  if (!entry.ok) return false;
  try {
    // Clone supaya bisa overlap dengan instance lain.
    const node = entry.audio.cloneNode();
    node.volume = clamp01(volume);
    const p = node.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
    return true;
  } catch {
    return false;
  }
}

// Cek apakah file ada (resolve true = file dapat dimuat).
// Probe ringan dengan fetch HEAD; fallback ke create Audio kalau fetch gagal.
export async function probeFile(src) {
  if (!audioSupported()) return false;
  try {
    const res = await fetch(src, { method: 'HEAD' });
    return res.ok;
  } catch {
    // Fallback: cek lewat HTMLAudioElement load event.
    return new Promise((resolve) => {
      const a = new Audio();
      a.addEventListener('canplaythrough', () => resolve(true), { once: true });
      a.addEventListener('error', () => resolve(false), { once: true });
      a.preload = 'auto';
      a.src = src;
      // Timeout safety
      setTimeout(() => resolve(false), 1500);
    });
  }
}

// Mute semua audio (dipakai saat user toggle off).
export function setMuteAll(mute) {
  _muteAll = !!mute;
  for (const { audio } of _channels.values()) {
    try { audio.muted = _muteAll; } catch {}
  }
}

export function isMuteAll() { return _muteAll; }

// Expose channel state untuk debugging / indicator.
export function listActiveChannels() {
  return Array.from(_channels.keys());
}
