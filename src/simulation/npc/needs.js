// Need decay & mood derivation.
import { NEED_DECAY, NEED_THRESHOLDS } from '../constants.js';

export function decayNeeds(npc, state) {
  // Decay scales mildly with time of day & activity.
  const factor = activityNeedFactor(npc.activity);
  npc.hunger = clamp(npc.hunger - NEED_DECAY.hunger * factor, 0, 100);
  if (npc.activity !== 'sleeping') {
    npc.energy = clamp(npc.energy - NEED_DECAY.energy * factor, 0, 100);
  }
  npc.social = clamp(npc.social - NEED_DECAY.social * factor, 0, 100);
}

function activityNeedFactor(activity) {
  switch (activity) {
    case 'sleeping': return 0.3;
    case 'eating':   return 0.5;
    case 'working':  return 1.2;
    case 'fighting': return 2.0;
    case 'fleeing':  return 1.6;
    case 'partying': return 1.4;
    default: return 1;
  }
}

export function recomputeMood(npc) {
  // Composite mood from needs and recent events.
  if (npc.activity === 'fighting') { npc.mood = 'angry'; return; }
  if (npc.activity === 'fleeing')  { npc.mood = 'stressed'; return; }
  if (npc.activity === 'sleeping') { npc.mood = 'tired'; return; }
  if (npc.partnerId)               { if (Math.random() < 0.05) npc.mood = 'in_love'; }

  if (npc.hunger < NEED_THRESHOLDS.starving || npc.energy < NEED_THRESHOLDS.exhausted) {
    npc.mood = 'tired';
    return;
  }
  if (npc.unemployed && Math.random() < 0.2) {
    npc.mood = 'sad';
    return;
  }

  const score = (npc.hunger + npc.energy + npc.social) / 3;
  if (score > 75) npc.mood = 'happy';
  else if (score > 55) npc.mood = 'content';
  else if (score > 35) npc.mood = 'neutral';
  else npc.mood = 'sad';
}

function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
