// Top-level simulation engine. Builds the world, ticks all subsystems, and
// exposes a tiny imperative API used by the React store.
import {
  NPC_COUNT,
  SIM_TICK_MS,
  SPEED_OPTIONS,
} from './constants.js';
import { advanceTime, formatClock } from './time.js';
import { setSeed } from './random.js';
import { generateCity } from './world/city.js';
import { initWeather, tickWeather } from './world/weather.js';
import { initEconomy, tickEconomy } from './world/economy.js';
import { createEventLog, pushEvent } from './events/eventBus.js';
import { maybeFireRandomEvent } from './events/randomEvents.js';
import { createNpc } from './npc/factory.js';
import { tickNpc } from './npc/ai.js';

export function createWorld({ seed = 1337 } = {}) {
  setSeed(seed);
  const city = generateCity();
  const eventLog = createEventLog();
  const economy = initEconomy();
  const weather = initWeather();
  const state = {
    tick: 0,
    minutes: 8 * 60, // start at 08:00
    speedIndex: 1,   // 1x by default
    paused: false,
    cinematicFocusId: null,
    cinematicUntilTick: 0,
    activeCrime: null,
    outageUntilMinute: 0,
    lastRandomEventMinutes: 0,
  };
  const world = { city, state, weather, economy, eventLog, npcs: [] };
  const npcs = Array.from({ length: NPC_COUNT }, (_, i) => createNpc(city, i));
  world.npcs = npcs;

  // Welcome event
  pushEvent(eventLog, state, {
    type: 'system',
    severity: 'info',
    text: 'NeoLife online. Streaming live from Sector 7.',
  });

  return world;
}

export function getSpeed(world) {
  return SPEED_OPTIONS[world.state.speedIndex] ?? 1;
}

export function setSpeedIndex(world, idx) {
  world.state.speedIndex = Math.max(0, Math.min(SPEED_OPTIONS.length - 1, idx));
  world.state.paused = SPEED_OPTIONS[world.state.speedIndex] === 0;
}

export function togglePause(world) {
  if (world.state.paused) {
    if (getSpeed(world) === 0) world.state.speedIndex = 1;
    world.state.paused = false;
  } else {
    world.state.paused = true;
  }
}

// Performs N simulation ticks. Called from a wall-clock loop in React.
export function step(world, steps = 1) {
  for (let s = 0; s < steps; s++) {
    world.state.tick++;
    advanceTime(world.state, 1);

    // World subsystems
    tickWeather(world.weather, world.state, (payload) =>
      pushEvent(world.eventLog, world.state, payload)
    );
    tickEconomy(world.economy, world.state);
    maybeFireRandomEvent(world);

    // Expire active crime
    if (world.state.activeCrime
        && world.state.minutes >= world.state.activeCrime.expiresMinute) {
      world.state.activeCrime = null;
    }

    // Tick NPCs
    for (let i = 0; i < world.npcs.length; i++) {
      tickNpc(world.npcs[i], world);
    }
  }
}

export const TICK_MS = SIM_TICK_MS;

export function clock(world) {
  return formatClock(world.state);
}
