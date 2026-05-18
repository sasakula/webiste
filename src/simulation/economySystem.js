// Sistem ekonomi: random walk dengan mean reversion ke 100.
// 4 state sesuai spec: Naik, Stabil, Turun, Krisis.
import { pushEvent } from './eventSystem.js';

const FLAVOR = {
  'Naik':   'Ekonomi kota mulai naik, bisnis ramai.',
  'Stabil': 'Ekonomi kota kembali stabil.',
  'Turun':  'Ekonomi kota mulai turun.',
  'Krisis': 'Ekonomi kota memasuki masa krisis!',
};

function describeEconomy(idx) {
  if (idx >= 120) return 'Naik';
  if (idx >= 80)  return 'Stabil';
  if (idx >= 50)  return 'Turun';
  return 'Krisis';
}

function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

export function tickEconomy(world) {
  // Random walk + mean reversion ke 100 supaya tidak terlalu liar.
  const reversion = (100 - world.ekonomiIndex) * 0.0008;
  const noise = (Math.random() - 0.5) * 0.05;
  world.ekonomiMomentum = world.ekonomiMomentum * 0.92 + reversion + noise;
  world.ekonomiIndex = clamp(world.ekonomiIndex + world.ekonomiMomentum, 30, 180);

  const newLabel = describeEconomy(world.ekonomiIndex);
  if (newLabel !== world.ekonomi) {
    world.ekonomi = newLabel;
    pushEvent(world, FLAVOR[newLabel] || `Ekonomi kota: ${newLabel}.`, 'EKONOMI');
  }

  // Kebahagiaan dipengaruhi ekonomi & kriminalitas.
  const target = clamp(0.4 * world.ekonomiIndex + 0.6 * (100 - world.kriminalitas), 0, 100);
  world.kebahagiaan += (target - world.kebahagiaan) * 0.01;
}
