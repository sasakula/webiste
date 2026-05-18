// Procedurally generates the NeoLife city: tile grid + buildings + points of interest.
// The output is deterministic when paired with random.setSeed.
import {
  MAP_WIDTH,
  MAP_HEIGHT,
  TILE,
  BUILDING_TYPES,
} from '../constants.js';
import { rand, randInt, pick } from '../random.js';

const BUILDING_PALETTE = [
  // [type, label, weight, accent color]
  [BUILDING_TYPES.APARTMENT, 'Neo Heights',     5, '#8b5cf6'],
  [BUILDING_TYPES.APARTMENT, 'Lumen Lofts',     5, '#a855f7'],
  [BUILDING_TYPES.APARTMENT, 'Sector 7 Block',  4, '#6366f1'],
  [BUILDING_TYPES.CAFE,      'Wired Cafe',      3, '#22d3ee'],
  [BUILDING_TYPES.CAFE,      'Holo Brew',       2, '#06b6d4'],
  [BUILDING_TYPES.OFFICE,    'NeuroCorp',       3, '#3b82f6'],
  [BUILDING_TYPES.OFFICE,    'Vexa Industries', 2, '#0ea5e9'],
  [BUILDING_TYPES.SHOP,      'Cyber Mart',      3, '#a3e635'],
  [BUILDING_TYPES.SHOP,      'Chrome Bazaar',   2, '#84cc16'],
  [BUILDING_TYPES.CLUB,      'Pulse Club',      2, '#ec4899'],
  [BUILDING_TYPES.CLUB,      'Neon Lounge',     1, '#f472b6'],
  [BUILDING_TYPES.CLINIC,    'Bio-Reset Clinic',1, '#22c55e'],
  [BUILDING_TYPES.POLICE,    'NCPD HQ',         1, '#60a5fa'],
];

function emptyGrid() {
  const grid = new Uint8Array(MAP_WIDTH * MAP_HEIGHT);
  grid.fill(TILE.GRASS);
  return grid;
}

const idx = (x, y) => y * MAP_WIDTH + x;

function setRect(grid, x, y, w, h, value) {
  const x2 = Math.min(MAP_WIDTH, x + w);
  const y2 = Math.min(MAP_HEIGHT, y + h);
  for (let yy = Math.max(0, y); yy < y2; yy++) {
    for (let xx = Math.max(0, x); xx < x2; xx++) {
      grid[idx(xx, yy)] = value;
    }
  }
}

function carveRoadH(grid, y, thickness = 2) {
  setRect(grid, 0, y, MAP_WIDTH, thickness, TILE.ROAD);
  // sidewalks
  if (y > 0) setRect(grid, 0, y - 1, MAP_WIDTH, 1, TILE.SIDEWALK);
  if (y + thickness < MAP_HEIGHT) setRect(grid, 0, y + thickness, MAP_WIDTH, 1, TILE.SIDEWALK);
}

function carveRoadV(grid, x, thickness = 2) {
  setRect(grid, x, 0, thickness, MAP_HEIGHT, TILE.ROAD);
  if (x > 0) setRect(grid, x - 1, 0, 1, MAP_HEIGHT, TILE.SIDEWALK);
  if (x + thickness < MAP_WIDTH) setRect(grid, x + thickness, 0, 1, MAP_HEIGHT, TILE.SIDEWALK);
}

// Place a building rectangle; returns the descriptor or null if it failed.
function tryPlaceBuilding(grid, x, y, w, h, type, label, color) {
  // Refuse if any tile in footprint is not grass.
  for (let yy = y; yy < y + h; yy++) {
    for (let xx = x; xx < x + w; xx++) {
      if (xx <= 0 || yy <= 0 || xx >= MAP_WIDTH - 1 || yy >= MAP_HEIGHT - 1) return null;
      if (grid[idx(xx, yy)] !== TILE.GRASS) return null;
    }
  }
  // Need at least one adjacent sidewalk for door placement.
  let door = null;
  const candidates = [];
  for (let xx = x; xx < x + w; xx++) {
    if (grid[idx(xx, y - 1)] === TILE.SIDEWALK) candidates.push({ x: xx, y, dir: 'top' });
    if (grid[idx(xx, y + h)] === TILE.SIDEWALK) candidates.push({ x: xx, y: y + h - 1, dir: 'bottom' });
  }
  for (let yy = y; yy < y + h; yy++) {
    if (grid[idx(x - 1, yy)] === TILE.SIDEWALK) candidates.push({ x, y: yy, dir: 'left' });
    if (grid[idx(x + w, yy)] === TILE.SIDEWALK) candidates.push({ x: x + w - 1, y: yy, dir: 'right' });
  }
  if (!candidates.length) return null;
  door = pick(candidates);

  setRect(grid, x, y, w, h, TILE.BUILDING);
  // Door tile (just for logic; rendering uses a different glyph)
  let doorTile;
  switch (door.dir) {
    case 'top':    doorTile = { x: door.x, y: door.y - 1 }; break;
    case 'bottom': doorTile = { x: door.x, y: door.y + 1 }; break;
    case 'left':   doorTile = { x: door.x - 1, y: door.y }; break;
    default:       doorTile = { x: door.x + 1, y: door.y };
  }
  // Make sure the door target stays walkable
  grid[idx(doorTile.x, doorTile.y)] = TILE.SIDEWALK;

  return {
    type,
    label,
    color,
    x, y, w, h,
    door: doorTile,
    centerX: x + w / 2,
    centerY: y + h / 2,
  };
}

function placeParkPlaza(grid, x, y, w, h) {
  setRect(grid, x, y, w, h, TILE.PLAZA);
  // sprinkle some grass patches
  for (let i = 0; i < 6; i++) {
    const px = x + randInt(0, w - 1);
    const py = y + randInt(0, h - 1);
    grid[idx(px, py)] = TILE.GRASS;
  }
  return {
    type: BUILDING_TYPES.PARK,
    label: 'Aurora Park',
    color: '#22c55e',
    x, y, w, h,
    door: { x: x + Math.floor(w / 2), y: y + Math.floor(h / 2) },
    centerX: x + w / 2,
    centerY: y + h / 2,
  };
}

export function generateCity() {
  const grid = emptyGrid();

  // Major boulevards (horizontal & vertical) form blocks.
  const hRoads = [10, 22, 34];
  const vRoads = [12, 28, 44, 56];
  hRoads.forEach((y) => carveRoadH(grid, y, 2));
  vRoads.forEach((x) => carveRoadV(grid, x, 2));

  // Plazas at major intersections
  const plazaPositions = [
    [vRoads[1] - 3, hRoads[0] - 3],
    [vRoads[2] - 3, hRoads[2] - 3],
  ];
  plazaPositions.forEach(([px, py]) => {
    setRect(grid, px, py, 6, 6, TILE.PLAZA);
  });

  const buildings = [];
  const blocks = [];
  // Compute block rectangles between roads.
  const xs = [0, ...vRoads, MAP_WIDTH];
  const ys = [0, ...hRoads, MAP_HEIGHT];
  for (let yi = 0; yi < ys.length - 1; yi++) {
    for (let xi = 0; xi < xs.length - 1; xi++) {
      const x1 = xs[xi];
      const y1 = ys[yi];
      const x2 = xs[xi + 1];
      const y2 = ys[yi + 1];
      // Inset away from roads/sidewalks
      const insetLeft   = xi === 0 ? 1 : 3;
      const insetTop    = yi === 0 ? 1 : 3;
      const insetRight  = xi === xs.length - 2 ? 1 : 1;
      const insetBottom = yi === ys.length - 2 ? 1 : 1;
      const bx = x1 + insetLeft;
      const by = y1 + insetTop;
      const bw = x2 - x1 - insetLeft - insetRight;
      const bh = y2 - y1 - insetTop - insetBottom;
      if (bw > 0 && bh > 0) blocks.push({ x: bx, y: by, w: bw, h: bh });
    }
  }

  // One park + one police station guaranteed.
  const parkBlock = pick(blocks);
  buildings.push(placeParkPlaza(
    grid,
    parkBlock.x,
    parkBlock.y,
    Math.min(parkBlock.w, 10),
    Math.min(parkBlock.h, 6),
  ));

  const policeBlock = pick(blocks.filter((b) => b !== parkBlock));
  const policeW = Math.min(policeBlock.w, 5);
  const policeH = Math.min(policeBlock.h, 4);
  const policeBuilding = tryPlaceBuilding(
    grid, policeBlock.x, policeBlock.y, policeW, policeH,
    BUILDING_TYPES.POLICE, 'NCPD HQ', '#60a5fa'
  );
  if (policeBuilding) buildings.push(policeBuilding);

  // Fill remaining blocks with random buildings.
  for (const block of blocks) {
    let cursorX = block.x;
    let cursorY = block.y;
    const tries = 12;
    for (let t = 0; t < tries; t++) {
      const w = randInt(3, 6);
      const h = randInt(3, 5);
      const x = block.x + randInt(0, Math.max(0, block.w - w));
      const y = block.y + randInt(0, Math.max(0, block.h - h));
      const [type, label, , color] = pick(BUILDING_PALETTE);
      const placed = tryPlaceBuilding(grid, x, y, w, h, type, label, color);
      if (placed) buildings.push(placed);
      cursorX = x;
      cursorY = y;
    }
  }

  // Sidewalk fill: any grass tile orthogonally adjacent to a road becomes sidewalk
  // (paint paths around plazas to make NPCs route nicely).
  for (let y = 0; y < MAP_HEIGHT; y++) {
    for (let x = 0; x < MAP_WIDTH; x++) {
      if (grid[idx(x, y)] !== TILE.GRASS) continue;
      const neighbors = [
        x > 0 ? grid[idx(x - 1, y)] : -1,
        x < MAP_WIDTH - 1 ? grid[idx(x + 1, y)] : -1,
        y > 0 ? grid[idx(x, y - 1)] : -1,
        y < MAP_HEIGHT - 1 ? grid[idx(x, y + 1)] : -1,
      ];
      if (neighbors.includes(TILE.ROAD) || neighbors.includes(TILE.PLAZA)) {
        grid[idx(x, y)] = TILE.SIDEWALK;
      }
    }
  }

  return {
    width: MAP_WIDTH,
    height: MAP_HEIGHT,
    grid,
    buildings,
  };
}

export function buildingsByType(city, type) {
  return city.buildings.filter((b) => b.type === type);
}

export function randomBuilding(city, types = null) {
  const list = types ? city.buildings.filter((b) => types.includes(b.type)) : city.buildings;
  return list.length ? pick(list) : null;
}

// Returns a walkable tile near a building (its door) usable as pathfinding target.
export function buildingDoor(building) {
  return { x: building.door.x, y: building.door.y };
}

export function tileAt(city, x, y) {
  if (x < 0 || y < 0 || x >= city.width || y >= city.height) return TILE.BUILDING;
  return city.grid[y * city.width + x];
}

export function isWalkable(city, x, y) {
  const t = tileAt(city, x, y);
  return t !== TILE.BUILDING && t !== TILE.WATER;
}

// Returns nearest walkable neighbor; useful when an NPC starts inside a building.
export function nearestWalkable(city, x, y, maxRadius = 6) {
  for (let r = 0; r <= maxRadius; r++) {
    for (let dy = -r; dy <= r; dy++) {
      for (let dx = -r; dx <= r; dx++) {
        if (Math.abs(dx) !== r && Math.abs(dy) !== r) continue;
        const nx = x + dx;
        const ny = y + dy;
        if (isWalkable(city, nx, ny)) return { x: nx, y: ny };
      }
    }
  }
  return { x, y };
}
