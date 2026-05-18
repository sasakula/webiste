// Name pools used to generate unique NPC identities.
import { pick, rand } from './random.js';

const FIRST = [
  'Kevin', 'Sarah', 'Mira', 'Dax', 'Yuki', 'Ren', 'Nova', 'Cass',
  'Jin', 'Lex', 'Aria', 'Echo', 'Vex', 'Nyx', 'Kai', 'Zara',
  'Riko', 'Tomo', 'Eli', 'June', 'Maya', 'Rion', 'Sable', 'Iris',
  'Octa', 'Pax', 'Quill', 'Soren', 'Thea', 'Vela', 'Wren', 'Zephyr',
];

const LAST = [
  'Vox', 'Reign', 'Kade', 'Vale', 'Hoshi', 'Kuro', 'Nash', 'Riven',
  'Lume', 'Pryce', 'Stryx', 'Onyx', 'Halsey', 'Mori', 'Drey', 'Quinn',
  'Saito', 'Ashe', 'Bell', 'Crow',
];

const used = new Set();

export function makeName() {
  for (let i = 0; i < 12; i++) {
    const candidate = `${pick(FIRST)} ${pick(LAST)}`;
    if (!used.has(candidate)) {
      used.add(candidate);
      return candidate;
    }
  }
  // fallback with random suffix
  return `${pick(FIRST)} ${pick(LAST)}-${Math.floor(rand() * 99)}`;
}

export function resetNamePool() {
  used.clear();
}
