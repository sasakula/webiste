// Deterministic-ish PRNG utilities. We seed with a starter value so reloads
// produce a similar-feeling city, but allow Math.random fallback.

let _seed = (Date.now() ^ 0x9e3779b9) >>> 0;

export function setSeed(seed) {
  _seed = (seed >>> 0) || 1;
}

// Mulberry32 - tiny fast PRNG
export function rand() {
  _seed = (_seed + 0x6d2b79f5) >>> 0;
  let t = _seed;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

export const randRange = (min, max) => min + rand() * (max - min);
export const randInt = (min, max) => Math.floor(randRange(min, max + 1));
export const pick = (arr) => arr[Math.floor(rand() * arr.length)];
export const chance = (p) => rand() < p;

export function weightedPick(items, weightFn) {
  let total = 0;
  for (const it of items) total += Math.max(0, weightFn(it));
  if (total <= 0) return pick(items);
  let r = rand() * total;
  for (const it of items) {
    r -= Math.max(0, weightFn(it));
    if (r <= 0) return it;
  }
  return items[items.length - 1];
}

// Stable id generator
let _id = 1;
export const nextId = (prefix = 'id') => `${prefix}_${_id++}`;
