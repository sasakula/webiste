// Weather state machine. Driven by sim ticks; transitions every few in-game hours.
import { WEATHER } from '../constants.js';
import { chance, pick, weightedPick } from '../random.js';

const TRANSITIONS = {
  clear:  [['clear', 4], ['cloudy', 2], ['fog', 1]],
  cloudy: [['cloudy', 3], ['clear', 2], ['rain', 2], ['storm', 1]],
  rain:   [['rain', 3], ['cloudy', 3], ['storm', 1]],
  storm:  [['storm', 1], ['rain', 4], ['cloudy', 1]],
  fog:    [['fog', 2], ['cloudy', 2], ['clear', 1]],
};

export function initWeather() {
  return {
    current: WEATHER.CLEAR,
    nextChangeMinutes: 60 * 3, // first change after ~3 hours
    intensity: 0.4, // 0..1, used by renderer for rain density / fog opacity
  };
}

export function tickWeather(weather, state, broadcast) {
  if (state.minutes < weather.nextChangeMinutes) return;

  const choices = TRANSITIONS[weather.current.id] || TRANSITIONS.clear;
  const nextId = weightedPick(choices, ([, w]) => w)[0];
  const next = WEATHER[nextId.toUpperCase()];
  if (!next) return;

  if (next.id !== weather.current.id) {
    weather.current = next;
    weather.intensity = 0.3 + Math.random() * 0.6;
    broadcast?.({
      type: 'weather',
      severity: next.id === 'storm' ? 'warn' : 'info',
      text: weatherFlavor(next),
    });
  }
  // Re-roll change interval (2-5 in-game hours)
  weather.nextChangeMinutes = state.minutes + 60 * (2 + Math.floor(Math.random() * 4));
}

function weatherFlavor(w) {
  switch (w.id) {
    case 'clear':  return 'Skies cleared over the city.';
    case 'cloudy': return 'Heavy cloud cover rolls in.';
    case 'rain':   return 'Heavy rain started across the city.';
    case 'storm':  return 'A neon thunderstorm erupts overhead.';
    case 'fog':    return 'Dense smog drifts through the streets.';
    default:       return `Weather changed to ${w.label}.`;
  }
}
