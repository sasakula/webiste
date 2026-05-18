// Sistem cuaca: state machine dengan transisi berbobot.
// 5 state sesuai spec: Cerah, Mendung, Hujan, Hujan Deras, Badai.
import { pushEvent } from './eventSystem.js';

export const CUACA_STATES = ['Cerah', 'Mendung', 'Hujan', 'Hujan Deras', 'Badai'];

const TRANSITIONS = {
  'Cerah':       [['Cerah', 5], ['Mendung', 2]],
  'Mendung':     [['Mendung', 3], ['Cerah', 2], ['Hujan', 2]],
  'Hujan':       [['Hujan', 3], ['Mendung', 2], ['Hujan Deras', 1]],
  'Hujan Deras': [['Hujan Deras', 2], ['Hujan', 3], ['Badai', 1]],
  'Badai':       [['Badai', 1], ['Hujan Deras', 3], ['Hujan', 2]],
};

const FLAVOR = {
  'Cerah':       'Langit kembali cerah di seluruh kota.',
  'Mendung':     'Awan mendung mulai bergumpal di atas kota.',
  'Hujan':       'Hujan turun, jalanan mulai basah.',
  'Hujan Deras': 'Hujan deras mulai mengguyur kota.',
  'Badai':       'Badai menerjang langit kota!',
};

function weightedPick(choices) {
  const total = choices.reduce((s, c) => s + c[1], 0);
  let r = Math.random() * total;
  for (const c of choices) {
    r -= c[1];
    if (r <= 0) return c[0];
  }
  return choices[0][0];
}

// Cuaca berganti setiap ~2-5 jam dunia.
export function tickWeather(world) {
  const since = world._minutesTotal - world._lastWeatherChange;
  const interval = 60 * (2 + Math.floor(Math.random() * 4));
  if (since < interval) return;
  world._lastWeatherChange = world._minutesTotal;

  const choices = TRANSITIONS[world.cuaca] || TRANSITIONS['Cerah'];
  const next = weightedPick(choices);
  if (next !== world.cuaca) {
    world.cuaca = next;
    pushEvent(world, FLAVOR[next] || `Cuaca berubah menjadi ${next}.`, 'CUACA');
  }
}
