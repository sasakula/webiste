// Sistem pembangunan: progress proyek pelan-pelan saat cuaca cerah.
import { pushEvent } from './eventSystem.js';

export function startConstruction() { return null; } // dipakai nanti

export function tickConstruction(world) {
  // Hujan deras / badai -> pembangunan berhenti.
  const stalled = world.cuaca === 'Hujan Deras' || world.cuaca === 'Badai';

  for (const b of world.buildings) {
    if (b.status !== 'Dibangun') continue;
    if (stalled) continue;

    const speed = world.cuaca === 'Hujan' ? 0.0004 : 0.0009;
    b.progress = Math.min(1, (b.progress || 0) + speed);

    if (b.progress >= 1) {
      b.status = 'Dihuni';
      pushEvent(world, `${b.name} selesai dibangun!`, 'PEMBANGUNAN');
    }
  }
}
