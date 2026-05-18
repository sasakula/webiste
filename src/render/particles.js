// Lightweight particle systems for rain, fog, and ambient sparks. Updated and
// rendered from the main renderer to keep allocations tight.
import { MAP_WIDTH, MAP_HEIGHT } from '../simulation/constants.js';
import { rand } from '../simulation/random.js';

const RAIN_COUNT = 220;
const SPARK_COUNT = 60;

export function createParticles() {
  const rain = new Array(RAIN_COUNT);
  for (let i = 0; i < RAIN_COUNT; i++) {
    rain[i] = newRain();
  }
  const sparks = new Array(SPARK_COUNT);
  for (let i = 0; i < SPARK_COUNT; i++) {
    sparks[i] = newSpark();
  }
  return { rain, sparks };
}

function newRain() {
  return {
    x: rand() * MAP_WIDTH,
    y: rand() * MAP_HEIGHT,
    speed: 0.4 + rand() * 0.6,
    length: 6 + rand() * 8,
  };
}

function newSpark() {
  return {
    x: rand() * MAP_WIDTH,
    y: rand() * MAP_HEIGHT,
    life: rand() * 60,
    color: rand() < 0.5 ? '#22d3ee' : '#a855f7',
  };
}

export function updateParticles(particles, world) {
  const w = world.weather.current.id;
  const intensity = world.weather.intensity;

  if (w === 'rain' || w === 'storm') {
    const speed = w === 'storm' ? 1.4 : 0.9;
    for (let i = 0; i < particles.rain.length; i++) {
      const r = particles.rain[i];
      r.y += r.speed * speed;
      r.x += 0.15;
      if (r.y > MAP_HEIGHT) {
        r.y = -1;
        r.x = rand() * MAP_WIDTH;
      }
    }
  }

  for (let i = 0; i < particles.sparks.length; i++) {
    const s = particles.sparks[i];
    s.life -= 1;
    if (s.life <= 0) {
      s.x = rand() * MAP_WIDTH;
      s.y = rand() * MAP_HEIGHT;
      s.life = 40 + rand() * 80;
      s.color = rand() < 0.5 ? '#22d3ee' : '#a855f7';
    }
  }
}
