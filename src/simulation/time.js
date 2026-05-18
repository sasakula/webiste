// In-game clock helpers. Time is tracked as total minutes since simulation start.
// 1 day = 1440 minutes.
import { GAME_MINUTES_PER_TICK } from './constants.js';

export function advanceTime(state, ticks = 1) {
  state.minutes += ticks * GAME_MINUTES_PER_TICK;
}

export function getClock(state) {
  const total = state.minutes;
  const day = Math.floor(total / 1440) + 1;
  const dayMinutes = total % 1440;
  const hour = Math.floor(dayMinutes / 60);
  const minute = dayMinutes % 60;
  return { day, hour, minute, dayMinutes };
}

export function formatClock(state) {
  const { hour, minute } = getClock(state);
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

// Returns 0..1 representing how "day-like" it is now (1 = full daylight, 0 = full night).
export function daylight(state) {
  const { dayMinutes } = getClock(state);
  // Sunrise around 6:00, sunset around 19:30.
  const sunrise = 6 * 60;
  const sunset = 19 * 60 + 30;
  const fadeWindow = 60;
  if (dayMinutes < sunrise - fadeWindow) return 0;
  if (dayMinutes > sunset + fadeWindow) return 0;
  if (dayMinutes < sunrise) return (dayMinutes - (sunrise - fadeWindow)) / fadeWindow;
  if (dayMinutes > sunset) return 1 - (dayMinutes - sunset) / fadeWindow;
  if (dayMinutes < sunrise + fadeWindow) return (dayMinutes - sunrise) / fadeWindow;
  if (dayMinutes > sunset - fadeWindow) return (sunset - dayMinutes) / fadeWindow;
  return 1;
}

export function partOfDay(state) {
  const { hour } = getClock(state);
  if (hour < 5) return 'Late Night';
  if (hour < 8) return 'Dawn';
  if (hour < 12) return 'Morning';
  if (hour < 14) return 'Midday';
  if (hour < 18) return 'Afternoon';
  if (hour < 21) return 'Evening';
  return 'Night';
}
