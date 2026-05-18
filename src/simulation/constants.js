// Central tuning constants for the NeoLife simulation.
// Values are kept here so designers can tweak the feel of the world quickly.

export const TILE_SIZE = 16;            // px per tile (logical)
export const MAP_WIDTH = 64;            // tiles
export const MAP_HEIGHT = 44;           // tiles

export const SIM_TICK_MS = 100;         // base simulation tick (10 ticks per second)
export const GAME_MINUTES_PER_TICK = 1; // at 1x speed: 1 in-game minute per tick
export const SPEED_OPTIONS = [0, 1, 2, 4, 8];

export const NPC_COUNT = 28;
export const NPC_BASE_SPEED = 0.06;     // tiles per tick

export const NEED_DECAY = {
  hunger: 0.08,    // per tick
  energy: 0.05,
  social: 0.04,
};

export const NEED_THRESHOLDS = {
  hungry: 55,
  starving: 25,
  tired: 50,
  exhausted: 20,
  lonely: 45,
};

// Tile types used by the city map and renderer.
export const TILE = {
  GRASS: 0,
  ROAD: 1,
  SIDEWALK: 2,
  WATER: 3,
  PLAZA: 4,
  BUILDING: 5,
  DOOR: 6,
};

export const WALKABLE_TILES = new Set([
  TILE.SIDEWALK,
  TILE.PLAZA,
  TILE.DOOR,
  TILE.GRASS,
]);

export const BUILDING_TYPES = {
  APARTMENT: 'apartment',
  CAFE: 'cafe',
  OFFICE: 'office',
  SHOP: 'shop',
  PARK: 'park',
  POLICE: 'police',
  CLUB: 'club',
  CLINIC: 'clinic',
};

export const OCCUPATIONS = [
  'Hacker', 'Bartender', 'Courier', 'Engineer', 'DJ', 'Officer',
  'Barista', 'Mechanic', 'Doctor', 'Reporter', 'Artist', 'Trader',
  'Janitor', 'Programmer', 'Bouncer', 'Vendor',
];

export const PERSONALITIES = [
  { id: 'extrovert',  label: 'Extrovert',  social: 1.4, aggression: 0.9 },
  { id: 'introvert',  label: 'Introvert',  social: 0.6, aggression: 0.7 },
  { id: 'romantic',   label: 'Romantic',   social: 1.2, aggression: 0.4 },
  { id: 'rebellious', label: 'Rebellious', social: 1.0, aggression: 1.6 },
  { id: 'workaholic', label: 'Workaholic', social: 0.8, aggression: 0.8 },
  { id: 'dreamer',    label: 'Dreamer',    social: 1.0, aggression: 0.5 },
  { id: 'cynic',      label: 'Cynic',      social: 0.7, aggression: 1.2 },
];

export const MOODS = {
  HAPPY:    { id: 'happy',    label: 'Happy',    color: '#a3e635' },
  CONTENT:  { id: 'content',  label: 'Content',  color: '#22d3ee' },
  NEUTRAL:  { id: 'neutral',  label: 'Neutral',  color: '#94a3b8' },
  TIRED:    { id: 'tired',    label: 'Tired',    color: '#fbbf24' },
  STRESSED: { id: 'stressed', label: 'Stressed', color: '#f97316' },
  ANGRY:    { id: 'angry',    label: 'Angry',    color: '#f87171' },
  SAD:      { id: 'sad',      label: 'Sad',      color: '#60a5fa' },
  IN_LOVE:  { id: 'in_love',  label: 'In Love',  color: '#ec4899' },
};

export const WEATHER = {
  CLEAR: { id: 'clear', label: 'Clear Skies',  icon: '◑', tint: 'rgba(34,211,238,0.04)' },
  CLOUDY:{ id: 'cloudy',label: 'Cloudy',       icon: '☁',  tint: 'rgba(148,163,184,0.08)' },
  RAIN:  { id: 'rain',  label: 'Heavy Rain',   icon: '☂',  tint: 'rgba(59,130,246,0.10)' },
  STORM: { id: 'storm', label: 'Neon Storm',   icon: '⚡',  tint: 'rgba(168,85,247,0.14)' },
  FOG:   { id: 'fog',   label: 'Smog Drift',   icon: '≈',  tint: 'rgba(255,255,255,0.05)' },
};

export const ECONOMY_STATES = ['Booming', 'Stable', 'Slowing', 'Recession', 'Crashing'];

export const CRIME_LEVELS = [
  { id: 'low',      label: 'Low',      color: '#a3e635', min: 0,   max: 25 },
  { id: 'moderate', label: 'Moderate', color: '#fbbf24', min: 25,  max: 55 },
  { id: 'elevated', label: 'Elevated', color: '#f97316', min: 55,  max: 80 },
  { id: 'critical', label: 'Critical', color: '#f87171', min: 80,  max: 101 },
];
