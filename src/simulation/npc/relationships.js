// Relationship math: friendship/enmity scores update through encounters.
import { chance } from '../random.js';

export function getRelation(a, bId) {
  return a.relations[bId] ?? 0;
}

export function adjustRelation(a, b, delta) {
  a.relations[b.id] = clamp((a.relations[b.id] ?? 0) + delta, -100, 100);
  b.relations[a.id] = clamp((b.relations[a.id] ?? 0) + delta, -100, 100);
}

export function classify(score) {
  if (score >= 80) return 'partner';
  if (score >= 50) return 'friend';
  if (score >= 20) return 'acquaintance';
  if (score > -20) return 'neutral';
  if (score > -50) return 'rival';
  return 'enemy';
}

// Two NPCs interact: outcome depends on personalities & current moods.
export function interact(a, b) {
  const aggA = a.personality.aggression;
  const aggB = b.personality.aggression;
  const socA = a.personality.social;
  const socB = b.personality.social;

  const baseAggression = (aggA + aggB) / 2;
  const baseSocial = (socA + socB) / 2;

  // Probability of conflict rises with low mood + aggression.
  const conflictP = 0.05 * baseAggression
    + (a.mood === 'angry' ? 0.25 : 0)
    + (b.mood === 'angry' ? 0.25 : 0);

  if (chance(conflictP)) {
    adjustRelation(a, b, -10);
    return { kind: 'argument' };
  }

  // Otherwise positive social exchange.
  const bond = 2 + Math.floor(baseSocial * 3);
  adjustRelation(a, b, bond);
  // Boost social need
  a.social = Math.min(100, a.social + 6);
  b.social = Math.min(100, b.social + 6);
  return { kind: 'chat' };
}

function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
