// =============================================================================
// ambientSystem — kelola layer ambient yang aktif PARALEL.
//
// Tidak seperti musik (1 track aktif), ambient bisa beberapa kanal sekaligus:
// hujan + kota malam, atau cafe + jalan raya, dll.
//
// Aktif/nonaktifnya ditentukan kondisi dunia.
// =============================================================================

import { playOnChannel, setChannelVolume } from './audioManager.js';

// Daftar layer ambient + path file.
export const AMBIENT_LAYERS = {
  rain:         { id: 'rain',         label: 'Hujan',          src: '/audio/ambient/rain.mp3' },
  cityNight:    { id: 'cityNight',    label: 'Kota Malam',     src: '/audio/ambient/city-night.mp3' },
  cityDay:      { id: 'cityDay',      label: 'Kota Pelan',     src: '/audio/ambient/city-day.mp3' },
  cafe:         { id: 'cafe',         label: 'Kafe Ramai',     src: '/audio/ambient/cafe.mp3' },
  traffic:      { id: 'traffic',      label: 'Jalan Raya',     src: '/audio/ambient/traffic.mp3' },
  park:         { id: 'park',         label: 'Taman',          src: '/audio/ambient/park.mp3' },
  office:       { id: 'office',       label: 'Kantor',         src: '/audio/ambient/office.mp3' },
  policeSiren:  { id: 'policeSiren',  label: 'Sirine Polisi',  src: '/audio/ambient/police-siren.mp3' },
  construction: { id: 'construction', label: 'Konstruksi',     src: '/audio/ambient/construction.mp3' },
};

const _active = new Set();

// Tentukan layer mana yang harus aktif berdasarkan world snapshot.
function pickActiveLayers(snapshot) {
  if (!snapshot) return new Set();
  const layers = new Set();
  const jam = snapshot.jam ?? 12;
  const malam = jam >= 19 || jam < 5;

  // Hujan: aktif kalau cuaca termasuk kategori hujan.
  if (snapshot.cuaca === 'Hujan' || snapshot.cuaca === 'Hujan Deras' || snapshot.cuaca === 'Badai') {
    layers.add('rain');
  }

  // Kota: malam pakai cityNight, siang pakai cityDay (volume rendah).
  if (malam) layers.add('cityNight');
  else       layers.add('cityDay');

  // Sirine: kalau kriminalitas tinggi.
  if ((snapshot.kriminalitas ?? 0) > 65) layers.add('policeSiren');

  // Konstruksi: kalau ada bangunan dengan status 'Dibangun'.
  if (snapshot.buildings?.some((b) => b.status === 'Dibangun')) layers.add('construction');

  // Cafe/traffic ringan tergantung populasi & jam.
  if (jam >= 8 && jam < 22) layers.add('traffic');

  return layers;
}

// Set volume per layer berdasarkan kondisi (mis. hujan deras lebih keras).
function volumeForLayer(layerId, snapshot, baseVol) {
  let v = baseVol;
  if (layerId === 'rain') {
    if (snapshot?.cuaca === 'Hujan')       v = baseVol * 0.55;
    if (snapshot?.cuaca === 'Hujan Deras') v = baseVol * 0.85;
    if (snapshot?.cuaca === 'Badai')       v = baseVol * 1.0;
  }
  if (layerId === 'cityDay')   v = baseVol * 0.4;
  if (layerId === 'cityNight') v = baseVol * 0.55;
  if (layerId === 'traffic')   v = baseVol * 0.35;
  if (layerId === 'policeSiren')v= baseVol * 0.7;
  if (layerId === 'construction')v= baseVol * 0.5;
  return Math.max(0, Math.min(1, v));
}

// Apply ambient state berdasarkan snapshot + flag user.
export async function applyAmbient({ snapshot, ambientOn, volume }) {
  if (!ambientOn) {
    // Stop semua layer yang sebelumnya aktif.
    const toStop = Array.from(_active);
    _active.clear();
    await Promise.all(toStop.map((id) => {
      const def = AMBIENT_LAYERS[id];
      if (!def) return null;
      return playOnChannel(`ambient_${id}`, null, 0, 600);
    }));
    return [];
  }

  const desired = pickActiveLayers(snapshot);

  // Stop layer yang sudah tidak diinginkan.
  for (const id of Array.from(_active)) {
    if (!desired.has(id)) {
      _active.delete(id);
      const def = AMBIENT_LAYERS[id];
      if (def) playOnChannel(`ambient_${id}`, null, 0, 800);
    }
  }

  // Mulai layer baru.
  for (const id of desired) {
    const def = AMBIENT_LAYERS[id];
    if (!def) continue;
    const vol = volumeForLayer(id, snapshot, volume);
    if (!_active.has(id)) {
      _active.add(id);
      playOnChannel(`ambient_${id}`, def.src, vol, 1500);
    } else {
      // Sudah aktif — refresh volume sesuai kondisi.
      setChannelVolume(`ambient_${id}`, vol, 400);
    }
  }

  return Array.from(_active);
}

export function getActiveAmbient() { return Array.from(_active); }

// Untuk tombol Test Sound — putar sebentar 1 layer.
export function testAmbient(layerId = 'rain', volume = 0.6) {
  const def = AMBIENT_LAYERS[layerId];
  if (!def) return false;
  playOnChannel(`ambient_${layerId}`, def.src, volume, 200);
  return true;
}
