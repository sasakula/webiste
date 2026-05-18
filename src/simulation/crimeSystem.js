// Sistem kriminalitas: drift ke baseline ~14, naik kalau ekonomi/waktu buruk.
import { pushDrama } from './eventSystem.js';

function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

export function describeCrime(level) {
  if (level < 25) return { label: 'Rendah',  color: '#a3e635' };
  if (level < 55) return { label: 'Sedang',  color: '#fbbf24' };
  if (level < 80) return { label: 'Tinggi',  color: '#f97316' };
  return            { label: 'Darurat', color: '#f87171' };
}

const RANDOM_CRIME_MESSAGES = [
  'Pencurian kecil dilaporkan di toko serba ada.',
  'Keributan terjadi di plaza pusat.',
  'Polisi mengamankan situasi di distrik tengah.',
  'Mobil dilaporkan hilang di terminal.',
  'Toko mengeluhkan barang hilang dari etalase.',
];

export function tickCrime(world) {
  const baseline = 14;
  // Decay perlahan ke baseline.
  world.kriminalitas += (baseline - world.kriminalitas) * 0.005;
  // Ekonomi buruk -> kriminalitas naik.
  if (world.ekonomiIndex < 80) world.kriminalitas += 0.02;
  // Larut malam -> kriminalitas naik sedikit.
  if (world.waktuHari === 'Larut Malam') world.kriminalitas += 0.03;
  world.kriminalitas = clamp(world.kriminalitas, 0, 100);

  // Sesekali (probabilitas kecil) lempar drama kriminal saat level tinggi.
  if (world.kriminalitas > 50 && Math.random() < 0.005) {
    const text = RANDOM_CRIME_MESSAGES[Math.floor(Math.random() * RANDOM_CRIME_MESSAGES.length)];
    pushDrama(world, text, 'KRIMINAL');
  }
}
