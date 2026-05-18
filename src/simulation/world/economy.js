// Macro economy & crime indices. Slowly drifts and reacts to events.
import { ECONOMY_STATES, CRIME_LEVELS } from '../constants.js';
import { rand } from '../random.js';

export function initEconomy() {
  return {
    index: 100,           // 0..200, baseline 100
    momentum: 0,          // current rate of change
    employmentRate: 0.92, // 0..1
    crimeIndex: 18,       // 0..100
    lastShockTick: 0,
  };
}

export function tickEconomy(econ, state) {
  // Random walk with slight mean reversion toward 100.
  const reversion = (100 - econ.index) * 0.0008;
  const noise = (rand() - 0.5) * 0.05;
  econ.momentum = econ.momentum * 0.92 + reversion + noise;
  econ.index = clamp(econ.index + econ.momentum, 30, 180);

  // Employment correlates loosely with economy.
  const targetEmployment = 0.6 + (econ.index - 60) / 220;
  econ.employmentRate += (clamp(targetEmployment, 0.5, 0.99) - econ.employmentRate) * 0.01;

  // Crime decays slowly toward baseline.
  econ.crimeIndex += (18 - econ.crimeIndex) * 0.005;
  // Crime nudged up by bad economy
  if (econ.index < 80) econ.crimeIndex += 0.02;
  econ.crimeIndex = clamp(econ.crimeIndex, 0, 100);
}

export function applyShock(econ, state, deltaIndex) {
  econ.index = clamp(econ.index + deltaIndex, 30, 180);
  econ.momentum -= deltaIndex * 0.05;
  econ.lastShockTick = state.tick;
}

export function bumpCrime(econ, amount) {
  econ.crimeIndex = clamp(econ.crimeIndex + amount, 0, 100);
}

export function describeEconomy(econ) {
  const i = econ.index;
  if (i >= 130) return ECONOMY_STATES[0];
  if (i >= 95)  return ECONOMY_STATES[1];
  if (i >= 75)  return ECONOMY_STATES[2];
  if (i >= 55)  return ECONOMY_STATES[3];
  return ECONOMY_STATES[4];
}

export function describeCrime(econ) {
  const i = econ.crimeIndex;
  return CRIME_LEVELS.find((l) => i >= l.min && i < l.max) ?? CRIME_LEVELS[0];
}

function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
