// NPC decision-making, movement, and reactions.
// Each tick: update needs → derive mood → if no path, pick a goal → walk path.
import {
  BUILDING_TYPES,
  NEED_THRESHOLDS,
} from '../constants.js';
import { getClock } from '../time.js';
import { chance, pick, randInt } from '../random.js';
import { findPath } from '../world/pathfinding.js';
import {
  buildingsByType,
  randomBuilding,
  isWalkable,
  nearestWalkable,
} from '../world/city.js';
import { decayNeeds, recomputeMood } from './needs.js';
import { adjustRelation, interact, classify } from './relationships.js';
import { remember } from './memory.js';
import { pushEvent } from '../events/eventBus.js';

const ARRIVE_EPSILON = 0.12;

export function tickNpc(npc, world) {
  // 1. Need decay
  decayNeeds(npc, world.state);

  // 2. Reactions to world events (run before activity to allow interrupts)
  reactToWorld(npc, world);

  // 3. Activity timeout
  if (npc.activityUntilMinute && world.state.minutes >= npc.activityUntilMinute) {
    finishActivity(npc, world);
  }

  // 4. Decide a new goal if idle and outside
  if (npc.activity === 'idle' && !npc.path.length && !npc.target) {
    const goal = pickGoal(npc, world);
    if (goal) startGoal(npc, world, goal);
  }

  // 5. Movement along path
  if (npc.path.length && npc.activity !== 'sleeping' && npc.activity !== 'working' && npc.activity !== 'eating') {
    stepAlongPath(npc, world);
  }

  // 6. Random social encounters when on the street
  if (npc.activity === 'idle' || npc.activity === 'walking') {
    maybeSocialize(npc, world);
  }

  // 7. Mood recompute (cheap)
  if ((world.state.tick + npc.index) % 8 === 0) recomputeMood(npc);
}

// ---- Goal selection -------------------------------------------------------

function pickGoal(npc, world) {
  const { hour } = getClock(world.state);

  // Sleep at night if at home and tired
  if (npc.energy < NEED_THRESHOLDS.tired && (hour >= 22 || hour < 6)) {
    if (npc.home) return { type: 'goto_sleep', building: npc.home };
  }
  // Hungry → cafe or shop
  if (npc.hunger < NEED_THRESHOLDS.hungry) {
    const cafes = buildingsByType(world.city, BUILDING_TYPES.CAFE);
    const shops = buildingsByType(world.city, BUILDING_TYPES.SHOP);
    const list = [...cafes, ...shops];
    if (list.length) return { type: 'goto_eat', building: pick(list) };
  }
  // Tired but not night → rest at home
  if (npc.energy < NEED_THRESHOLDS.tired) {
    if (npc.home) return { type: 'goto_sleep', building: npc.home };
  }
  // Lonely → club or plaza
  if (npc.social < NEED_THRESHOLDS.lonely && chance(0.6)) {
    const clubs = buildingsByType(world.city, BUILDING_TYPES.CLUB);
    if (clubs.length && hour >= 18) return { type: 'goto_party', building: pick(clubs) };
    return { type: 'wander_plaza' };
  }
  // Work hours: 9-17
  if (hour >= 9 && hour < 17 && npc.workplace && !npc.unemployed && chance(0.7)) {
    return { type: 'goto_work', building: npc.workplace };
  }
  // Default: wander
  return { type: 'wander' };
}

function startGoal(npc, world, goal) {
  const { city } = world;
  switch (goal.type) {
    case 'goto_sleep':
    case 'goto_eat':
    case 'goto_work':
    case 'goto_party': {
      const dest = goal.building.door;
      if (!dest) return;
      const path = findPath(city, npc, dest);
      if (path.length) {
        npc.path = path;
        npc.targetBuilding = goal.building;
        npc.target = dest;
        npc.activity = 'walking';
        npc.pendingGoal = goal.type;
      }
      break;
    }
    case 'wander_plaza': {
      const plazas = buildingsByType(city, BUILDING_TYPES.PARK);
      const dest = plazas.length
        ? plazas[0]
        : randomBuilding(city);
      if (!dest) return;
      const t = nearestWalkable(city, dest.door.x, dest.door.y, 4);
      const path = findPath(city, npc, t);
      if (path.length) {
        npc.path = path;
        npc.target = t;
        npc.activity = 'walking';
        npc.pendingGoal = 'wander_plaza';
      }
      break;
    }
    case 'wander':
    default: {
      const target = pickWanderTarget(world.city, npc);
      if (!target) return;
      const path = findPath(city, npc, target, 600);
      if (path.length) {
        npc.path = path;
        npc.target = target;
        npc.activity = 'walking';
        npc.pendingGoal = 'wander';
      }
      break;
    }
  }
}

function pickWanderTarget(city, npc) {
  for (let i = 0; i < 20; i++) {
    const x = randInt(1, city.width - 2);
    const y = randInt(1, city.height - 2);
    if (!isWalkable(city, x, y)) continue;
    if (Math.hypot(x - npc.x, y - npc.y) < 4) continue;
    return { x, y };
  }
  return null;
}

// ---- Movement -------------------------------------------------------------

function stepAlongPath(npc, world) {
  const next = npc.path[0];
  if (!next) return;
  const dx = (next.x + 0.5) - npc.x;
  const dy = (next.y + 0.5) - npc.y;
  const dist = Math.hypot(dx, dy);
  const speedMult = world.weather.current.id === 'rain' || world.weather.current.id === 'storm' ? 1.15 : 1;
  const stepLen = npc.speed * speedMult;

  if (dist <= ARRIVE_EPSILON || dist <= stepLen) {
    // Snap to tile center then advance.
    npc.x = next.x + 0.5;
    npc.y = next.y + 0.5;
    npc.path.shift();
    if (!npc.path.length) onArriveAtTarget(npc, world);
    return;
  }

  const ux = dx / dist;
  const uy = dy / dist;
  npc.x += ux * stepLen;
  npc.y += uy * stepLen;

  // Update facing for sprite
  if (Math.abs(ux) > Math.abs(uy)) npc.facing = ux > 0 ? 'right' : 'left';
  else npc.facing = uy > 0 ? 'down' : 'up';
}

function onArriveAtTarget(npc, world) {
  const goal = npc.pendingGoal;
  npc.pendingGoal = null;
  npc.target = null;

  switch (goal) {
    case 'goto_sleep':
      enterBuilding(npc, world, npc.targetBuilding);
      npc.activity = 'sleeping';
      npc.activityUntilMinute = world.state.minutes + 6 * 60; // 6 hours
      break;
    case 'goto_eat':
      enterBuilding(npc, world, npc.targetBuilding);
      npc.activity = 'eating';
      npc.activityUntilMinute = world.state.minutes + 30;
      break;
    case 'goto_work':
      enterBuilding(npc, world, npc.targetBuilding);
      npc.activity = 'working';
      npc.activityUntilMinute = world.state.minutes + 4 * 60;
      break;
    case 'goto_party':
      enterBuilding(npc, world, npc.targetBuilding);
      npc.activity = 'partying';
      npc.activityUntilMinute = world.state.minutes + 2 * 60;
      break;
    default:
      npc.activity = 'idle';
      npc.activityUntilMinute = world.state.minutes + 5;
      break;
  }
}

function enterBuilding(npc, world, building) {
  if (!building) return;
  npc.insideBuildingId = building.label;
  npc.visible = false;
}

function exitBuilding(npc, world) {
  if (!npc.targetBuilding) return;
  const door = npc.targetBuilding.door;
  if (door) {
    const t = nearestWalkable(world.city, door.x, door.y, 3);
    npc.x = t.x + 0.5;
    npc.y = t.y + 0.5;
  }
  npc.insideBuildingId = null;
  npc.visible = true;
  npc.targetBuilding = null;
}

function finishActivity(npc, world) {
  switch (npc.activity) {
    case 'sleeping':
      npc.energy = 100;
      npc.mood = 'content';
      break;
    case 'eating':
      npc.hunger = 100;
      npc.money = Math.max(0, npc.money - 8);
      if (chance(0.3)) {
        pushEvent(world.eventLog, world.state, {
          type: 'life',
          severity: 'info',
          text: `${npc.name} grabbed a bite at ${npc.targetBuilding?.label ?? 'a cafe'}.`,
          actorId: npc.id,
          location: npc.targetBuilding?.label,
        });
      }
      break;
    case 'working':
      npc.energy = Math.max(20, npc.energy - 10);
      const wage = 18 + randInt(0, 18);
      npc.money += wage;
      if (chance(0.12)) {
        pushEvent(world.eventLog, world.state, {
          type: 'life',
          severity: 'info',
          text: `${npc.name} clocked out from ${npc.targetBuilding?.label ?? 'work'}.`,
          actorId: npc.id,
        });
      }
      break;
    case 'partying':
      npc.social = 100;
      npc.energy = Math.max(15, npc.energy - 25);
      npc.money = Math.max(0, npc.money - 25);
      if (chance(0.2)) {
        pushEvent(world.eventLog, world.state, {
          type: 'life',
          severity: 'info',
          text: `${npc.name} left the club, lights still ringing in their ears.`,
          actorId: npc.id,
        });
      }
      break;
    default:
      break;
  }
  exitBuilding(npc, world);
  npc.activity = 'idle';
  npc.activityUntilMinute = 0;
}

// ---- Social encounters ----------------------------------------------------

function maybeSocialize(npc, world) {
  if (!npc.visible) return;
  if ((world.state.tick + npc.index) % 12 !== 0) return;

  for (const other of world.npcs) {
    if (other === npc || !other.visible) continue;
    const d = Math.hypot(other.x - npc.x, other.y - npc.y);
    if (d > 1.8) continue;
    if (chance(0.3)) {
      const result = interact(npc, other);
      if (result.kind === 'argument' && chance(0.3)) {
        startFight(npc, other, world);
        return;
      }
      const score = npc.relations[other.id] ?? 0;
      const tier = classify(score);
      if (tier === 'friend' && chance(0.06)) {
        pushEvent(world.eventLog, world.state, {
          type: 'social',
          severity: 'info',
          text: `${npc.name} and ${other.name} chatted by the corner.`,
          actorId: npc.id,
          targetId: other.id,
        });
        remember(npc, world.state, `Talked with ${other.name}.`);
      }
      return;
    }
  }
}

function startFight(a, b, world) {
  a.activity = 'fighting';
  b.activity = 'fighting';
  a.activityUntilMinute = world.state.minutes + 4;
  b.activityUntilMinute = world.state.minutes + 4;
  pushEvent(world.eventLog, world.state, {
    type: 'crime',
    severity: 'alert',
    text: `Fight reported between ${a.name} and ${b.name}.`,
    actorId: a.id,
    targetId: b.id,
    location: nearbyDistrictLabel(a, world),
  });
  world.economy.crimeIndex = Math.min(100, world.economy.crimeIndex + 3);
  world.state.activeCrime = {
    location: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 },
    expiresMinute: world.state.minutes + 8,
    suspectId: a.id,
  };
}

function nearbyDistrictLabel(npc, world) {
  let best = null;
  let bestD = Infinity;
  for (const b of world.city.buildings) {
    const d = Math.hypot(b.centerX - npc.x, b.centerY - npc.y);
    if (d < bestD) { bestD = d; best = b; }
  }
  return best ? `near ${best.label}` : 'Central District';
}

// ---- World reactions ------------------------------------------------------

function reactToWorld(npc, world) {
  // Officers respond to active crimes
  if (npc.occupation === 'Officer' && world.state.activeCrime
      && world.state.minutes < world.state.activeCrime.expiresMinute) {
    if (npc.activity !== 'walking' || !npc.path.length) {
      const t = nearestWalkable(world.city,
        Math.round(world.state.activeCrime.location.x),
        Math.round(world.state.activeCrime.location.y), 3);
      const path = findPath(world.city, npc, t, 600);
      if (path.length) {
        npc.path = path;
        npc.target = t;
        npc.activity = 'walking';
        npc.pendingGoal = 'wander';
      }
    }
  }
  // Heavy storm → most NPCs head home/indoors
  if ((world.weather.current.id === 'storm' || world.weather.current.id === 'rain')
      && npc.activity === 'idle' && chance(0.04) && npc.home) {
    npc.activity = 'walking';
    npc.pendingGoal = 'goto_sleep';
    npc.targetBuilding = npc.home;
    const path = findPath(world.city, npc, npc.home.door, 600);
    if (path.length) {
      npc.path = path;
      npc.target = npc.home.door;
    }
  }
}
