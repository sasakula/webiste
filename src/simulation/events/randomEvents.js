// World-level random events that punctuate the simulation: outages, robberies,
// promotions, lottery wins, marriages... These pull NPCs into reaction states
// where appropriate.
import { BUILDING_TYPES } from '../constants.js';
import { chance, pick, rand, weightedPick } from '../random.js';
import { applyShock, bumpCrime } from '../world/economy.js';
import { pushEvent } from './eventBus.js';

const EVENT_DEFINITIONS = [
  { id: 'cafe_promo',   weight: 4, fn: cafePromo },
  { id: 'power_outage', weight: 1, fn: powerOutage },
  { id: 'robbery',      weight: 2, fn: robbery },
  { id: 'protest',      weight: 1, fn: protest },
  { id: 'traffic',      weight: 2, fn: trafficJam },
  { id: 'breakup',      weight: 2, fn: npcBreakup },
  { id: 'marriage',     weight: 1, fn: npcMarriage },
  { id: 'job_loss',     weight: 2, fn: jobLoss },
  { id: 'lottery',      weight: 1, fn: lotteryWin },
  { id: 'celebrity',    weight: 1, fn: celebritySighting },
  { id: 'art_show',     weight: 2, fn: artShow },
];

export function maybeFireRandomEvent(world) {
  // Roughly 1 random event every 18-30 in-game minutes
  const minutesSince = world.state.minutes - (world.state.lastRandomEventMinutes || 0);
  if (minutesSince < 18 + Math.floor(rand() * 12)) return;
  world.state.lastRandomEventMinutes = world.state.minutes;

  const def = weightedPick(EVENT_DEFINITIONS, (d) => d.weight);
  try { def.fn(world); } catch (e) { /* swallow */ }
}

function aliveNpcs(world) {
  return world.npcs;
}

function cafePromo(world) {
  const cafes = world.city.buildings.filter((b) => b.type === BUILDING_TYPES.CAFE);
  if (!cafes.length) return;
  const cafe = pick(cafes);
  pushEvent(world.eventLog, world.state, {
    type: 'promo',
    severity: 'info',
    text: `${cafe.label} is offering a flash promo on synth-coffee.`,
    location: cafe.label,
  });
  // Buff: nearby NPCs get a "want coffee" nudge
  for (const npc of aliveNpcs(world)) {
    if (chance(0.25)) npc.cravings = 'coffee';
  }
}

function powerOutage(world) {
  pushEvent(world.eventLog, world.state, {
    type: 'outage',
    severity: 'warn',
    text: 'Citywide power flicker — grid load exceeded threshold.',
  });
  world.state.outageUntilMinute = world.state.minutes + 15;
  applyShock(world.economy, world.state, -3);
}

function robbery(world) {
  const shops = world.city.buildings.filter((b) =>
    b.type === BUILDING_TYPES.SHOP || b.type === BUILDING_TYPES.CAFE
  );
  if (!shops.length) return;
  const shop = pick(shops);
  const npcs = aliveNpcs(world);
  if (!npcs.length) return;
  const culprit = pick(npcs);
  pushEvent(world.eventLog, world.state, {
    type: 'crime',
    severity: 'alert',
    text: `Robbery reported at ${shop.label}.`,
    actorId: culprit.id,
    location: shop.label,
  });
  bumpCrime(world.economy, 6);
  applyShock(world.economy, world.state, -2);
  // Police get alerted
  world.state.activeCrime = {
    location: { x: shop.centerX, y: shop.centerY },
    expiresMinute: world.state.minutes + 12,
    suspectId: culprit.id,
  };
}

function protest(world) {
  pushEvent(world.eventLog, world.state, {
    type: 'crowd',
    severity: 'warn',
    text: 'A protest forms outside the corporate plaza.',
  });
  bumpCrime(world.economy, 2);
}

function trafficJam(world) {
  pushEvent(world.eventLog, world.state, {
    type: 'traffic',
    severity: 'info',
    text: 'Heavy traffic snarls the lower boulevard.',
  });
}

function npcBreakup(world) {
  const couples = collectCouples(world);
  if (!couples.length) return;
  const [a, b] = pick(couples);
  setRelation(a, b.id, -45);
  setRelation(b, a.id, -45);
  pushEvent(world.eventLog, world.state, {
    type: 'drama',
    severity: 'warn',
    text: `${a.name} and ${b.name} broke up — messy.`,
    actorId: a.id,
    targetId: b.id,
  });
  a.mood = 'sad';
  b.mood = 'angry';
}

function npcMarriage(world) {
  const lovers = collectLovers(world);
  if (!lovers.length) return;
  const [a, b] = pick(lovers);
  setRelation(a, b.id, 90);
  setRelation(b, a.id, 90);
  a.partnerId = b.id;
  b.partnerId = a.id;
  pushEvent(world.eventLog, world.state, {
    type: 'drama',
    severity: 'good',
    text: `${a.name} and ${b.name} just got married downtown!`,
    actorId: a.id,
    targetId: b.id,
  });
  a.mood = 'in_love';
  b.mood = 'in_love';
}

function jobLoss(world) {
  const npc = pick(world.npcs);
  if (!npc) return;
  if (npc.unemployed) return;
  npc.unemployed = true;
  npc.money = Math.max(0, npc.money - 80);
  npc.mood = 'sad';
  pushEvent(world.eventLog, world.state, {
    type: 'jobloss',
    severity: 'warn',
    text: `${npc.name} lost their job at ${npc.workplace?.label ?? 'a downtown firm'}.`,
    actorId: npc.id,
  });
  applyShock(world.economy, world.state, -1);
}

function lotteryWin(world) {
  const npc = pick(world.npcs);
  if (!npc) return;
  npc.money += 1500;
  npc.mood = 'happy';
  pushEvent(world.eventLog, world.state, {
    type: 'lottery',
    severity: 'good',
    text: `${npc.name} hit the city lottery — credits are flowing.`,
    actorId: npc.id,
  });
}

function celebritySighting(world) {
  pushEvent(world.eventLog, world.state, {
    type: 'celebrity',
    severity: 'info',
    text: 'Holo-star Vexa spotted near the plaza, crowd forming.',
  });
}

function artShow(world) {
  pushEvent(world.eventLog, world.state, {
    type: 'culture',
    severity: 'info',
    text: 'Underground art show opens in the warehouse district.',
  });
}

// --- Relationship helpers used by the events --- //

function collectCouples(world) {
  const seen = new Set();
  const out = [];
  for (const a of world.npcs) {
    for (const [bid, score] of Object.entries(a.relations)) {
      if (score < 70) continue;
      if (seen.has(`${bid}:${a.id}`) || seen.has(`${a.id}:${bid}`)) continue;
      const b = world.npcs.find((n) => n.id === bid);
      if (!b) continue;
      out.push([a, b]);
      seen.add(`${a.id}:${bid}`);
    }
  }
  return out;
}

function collectLovers(world) {
  const seen = new Set();
  const out = [];
  for (const a of world.npcs) {
    if (a.partnerId) continue;
    for (const [bid, score] of Object.entries(a.relations)) {
      if (score < 80) continue;
      const b = world.npcs.find((n) => n.id === bid);
      if (!b || b.partnerId) continue;
      const reciprocal = b.relations[a.id] ?? 0;
      if (reciprocal < 75) continue;
      const k1 = `${a.id}:${b.id}`;
      const k2 = `${b.id}:${a.id}`;
      if (seen.has(k1) || seen.has(k2)) continue;
      seen.add(k1);
      out.push([a, b]);
    }
  }
  return out;
}

function setRelation(npc, targetId, value) {
  npc.relations[targetId] = value;
}
