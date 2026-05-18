// Helper random ringan. Akan dipakai engine simulasi.
let _seed = (Date.now() ^ 0x9e3779b9) >>> 0;

export function setSeed(seed) {
  _seed = (seed >>> 0) || 1;
}

// Mulberry32
export function rand() {
  _seed = (_seed + 0x6d2b79f5) >>> 0;
  let t = _seed;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

export const randInt = (min, max) => Math.floor(min + rand() * (max - min + 1));
export const pick = (arr) => arr[Math.floor(rand() * arr.length)];
