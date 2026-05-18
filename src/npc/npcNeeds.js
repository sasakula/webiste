// Decay kebutuhan + derivasi mood. Dipanggil setiap tick (1 menit dunia).
// Skala kebutuhan: 0 = paling buruk, 100 = paling baik.

const DECAY = {
  lapar:      0.18,
  energi:     0.10,
  kebersihan: 0.06,
  kesehatan:  0.005,
};

function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

export function decayNeeds(npc) {
  const factor = activityFactor(npc.aktivitas);

  npc.lapar      = clamp(npc.lapar      - DECAY.lapar      * factor, 0, 100);
  if (!isResting(npc.aktivitas)) {
    npc.energi   = clamp(npc.energi     - DECAY.energi     * factor, 0, 100);
  } else {
    // Saat tidur, energi naik perlahan (bonus utama dipasang di finalize).
    npc.energi   = clamp(npc.energi     + 0.25, 0, 100);
  }
  npc.kebersihan = clamp(npc.kebersihan - DECAY.kebersihan * factor, 0, 100);

  // Stres naik kalau lapar/uang sedikit/sedang galau. Turun perlahan saat baik.
  if (npc.lapar < 25 || npc.uang < 30000 || npc.aktivitas === 'Galau') {
    npc.stres = clamp(npc.stres + 0.05, 0, 100);
  } else {
    npc.stres = clamp(npc.stres - 0.015, 0, 100);
  }

  // Kesehatan turun pelan saat lapar/lelah parah.
  if (npc.lapar < 10 || npc.energi < 10) {
    npc.kesehatan = clamp(npc.kesehatan - DECAY.kesehatan * 5, 0, 100);
  }

  // Mood didorong perlahan ke arah komposit kebutuhan.
  const composite = (npc.lapar + npc.energi + npc.kebersihan + (100 - npc.stres)) / 4;
  npc.mood = clamp(npc.mood + (composite - npc.mood) * 0.05, 0, 100);
}

function activityFactor(aktivitas) {
  if (!aktivitas) return 1;
  if (aktivitas === 'Tidur') return 0.3;
  if (aktivitas.startsWith('Bekerja')) return 1.3;
  if (aktivitas.startsWith('Membangun')) return 1.6;
  if (aktivitas === 'Mandi') return 0.5;
  if (aktivitas.startsWith('Berjalan')) return 1.2;
  return 1;
}

function isResting(aktivitas) {
  return aktivitas === 'Tidur';
}

// Util: ubah mood numerik ke label Indonesia untuk display.
export function deriveMoodLabel(mood) {
  if (mood >= 80) return 'Bahagia';
  if (mood >= 60) return 'Senang';
  if (mood >= 40) return 'Netral';
  if (mood >= 25) return 'Galau';
  return 'Sedih';
}
