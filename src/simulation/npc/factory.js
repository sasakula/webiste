// NPC factory: creates fully-formed agents with personality, occupation, home, workplace.
import {
  BUILDING_TYPES,
  NPC_BASE_SPEED,
  OCCUPATIONS,
  PERSONALITIES,
} from '../constants.js';
import { makeName } from '../names.js';
import { nextId, pick, randInt, randRange, rand } from '../random.js';
import { buildingsByType, nearestWalkable } from '../world/city.js';

const NPC_HUES = [
  '#22d3ee', '#a855f7', '#ec4899', '#a3e635',
  '#fbbf24', '#60a5fa', '#f87171', '#34d399',
  '#f472b6', '#c084fc', '#fb923c', '#67e8f9',
];

export function createNpc(city, index = 0) {
  const homes = buildingsByType(city, BUILDING_TYPES.APARTMENT);
  const offices = [
    ...buildingsByType(city, BUILDING_TYPES.OFFICE),
    ...buildingsByType(city, BUILDING_TYPES.SHOP),
    ...buildingsByType(city, BUILDING_TYPES.CAFE),
    ...buildingsByType(city, BUILDING_TYPES.CLINIC),
    ...buildingsByType(city, BUILDING_TYPES.CLUB),
  ];

  const home = homes.length ? pick(homes) : null;
  const workplace = offices.length ? pick(offices) : null;

  const startTile = home
    ? nearestWalkable(city, home.door.x, home.door.y, 4)
    : { x: Math.floor(city.width / 2), y: Math.floor(city.height / 2) };

  const personality = pick(PERSONALITIES);
  const occupation = workplace
    ? occupationForBuilding(workplace.type)
    : pick(OCCUPATIONS);

  return {
    id: nextId('npc'),
    index,
    name: makeName(),
    color: NPC_HUES[index % NPC_HUES.length],
    personality,
    occupation,
    home,
    workplace,
    // Position in tile space (floats for smooth movement)
    x: startTile.x + 0.5,
    y: startTile.y + 0.5,
    // Path is a list of tile centers we are heading to.
    path: [],
    target: null,            // current goal tile
    targetBuilding: null,    // if heading into a building
    speed: NPC_BASE_SPEED * randRange(0.85, 1.15),
    facing: 'down',          // for sprite rendering
    // Needs (0..100)
    hunger: randRange(40, 80),
    energy: randRange(60, 95),
    social: randRange(40, 80),
    money: Math.floor(randRange(40, 220)),
    mood: 'content',
    // Behavior state
    activity: 'idle',        // idle | walking | working | eating | sleeping | socializing | shopping | partying | fighting | fleeing
    activityUntilMinute: 0,
    insideBuildingId: null,
    visible: true,
    cravings: null,          // 'coffee' etc.
    unemployed: false,
    partnerId: null,
    // Memory & relationships
    memory: [],              // recent salient events {tick, text}
    relations: {},           // npcId -> -100..100
    // Police/criminal flags
    isCriminal: false,
    chasingId: null,
    // Cached for rendering
    bobPhase: rand() * Math.PI * 2,
  };
}

function occupationForBuilding(type) {
  switch (type) {
    case BUILDING_TYPES.OFFICE: return pick(['Engineer', 'Programmer', 'Trader', 'Reporter']);
    case BUILDING_TYPES.CAFE:   return pick(['Barista', 'Bartender']);
    case BUILDING_TYPES.SHOP:   return pick(['Vendor', 'Mechanic', 'Courier']);
    case BUILDING_TYPES.CLINIC: return 'Doctor';
    case BUILDING_TYPES.CLUB:   return pick(['DJ', 'Bouncer']);
    case BUILDING_TYPES.POLICE: return 'Officer';
    default: return pick(OCCUPATIONS);
  }
}
