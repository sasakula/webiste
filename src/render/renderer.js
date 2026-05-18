// Canvas renderer. Draws the city map, NPCs, lighting tints, weather overlays,
// and dynamic shadows. Designed to be cheap: tile painter pre-bakes the static
// city to an offscreen canvas once, then we just blit it each frame plus the
// dynamic layers.
import {
  TILE,
  TILE_SIZE,
  MAP_WIDTH,
  MAP_HEIGHT,
  BUILDING_TYPES,
  MOODS,
} from '../simulation/constants.js';
import { daylight, getClock } from '../simulation/time.js';

// Returns a {canvas, width, height} bake of the static city at logical TILE_SIZE.
export function bakeCity(city) {
  const w = MAP_WIDTH * TILE_SIZE;
  const h = MAP_HEIGHT * TILE_SIZE;
  const off = document.createElement('canvas');
  off.width = w;
  off.height = h;
  const ctx = off.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  // Background gradient
  const bg = ctx.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, '#0a0818');
  bg.addColorStop(1, '#05030f');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Tiles
  for (let y = 0; y < MAP_HEIGHT; y++) {
    for (let x = 0; x < MAP_WIDTH; x++) {
      const t = city.grid[y * MAP_WIDTH + x];
      drawTile(ctx, x, y, t);
    }
  }

  // Buildings (icons + labels are drawn at runtime to allow lighting)
  for (const b of city.buildings) {
    drawBuildingShell(ctx, b);
  }

  // Subtle global noise / scanline pass
  ctx.globalAlpha = 0.04;
  ctx.fillStyle = '#ffffff';
  for (let i = 0; i < 800; i++) {
    const px = Math.floor(Math.random() * w);
    const py = Math.floor(Math.random() * h);
    ctx.fillRect(px, py, 1, 1);
  }
  ctx.globalAlpha = 1;

  return { canvas: off, width: w, height: h };
}

function drawTile(ctx, x, y, type) {
  const px = x * TILE_SIZE;
  const py = y * TILE_SIZE;
  switch (type) {
    case TILE.ROAD:
      ctx.fillStyle = '#0d0d18';
      ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
      // Road dashes
      ctx.fillStyle = 'rgba(168, 85, 247, 0.18)';
      if ((x + y) % 4 === 0) {
        ctx.fillRect(px + TILE_SIZE / 2 - 1, py + 4, 2, TILE_SIZE - 8);
      }
      break;
    case TILE.SIDEWALK:
      ctx.fillStyle = '#171225';
      ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
      ctx.fillStyle = 'rgba(255,255,255,0.025)';
      ctx.fillRect(px + 1, py + 1, TILE_SIZE - 2, TILE_SIZE - 2);
      break;
    case TILE.PLAZA:
      ctx.fillStyle = '#1a1530';
      ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.07)';
      ctx.strokeRect(px + 0.5, py + 0.5, TILE_SIZE - 1, TILE_SIZE - 1);
      break;
    case TILE.GRASS:
      ctx.fillStyle = '#0c1a18';
      ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
      // little dots
      if (((x * 7 + y * 13) % 9) === 0) {
        ctx.fillStyle = 'rgba(34, 197, 94, 0.35)';
        ctx.fillRect(px + 4, py + 5, 2, 2);
      }
      break;
    case TILE.BUILDING:
      ctx.fillStyle = '#13101e';
      ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
      break;
    default:
      ctx.fillStyle = '#08060f';
      ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
  }
}

function drawBuildingShell(ctx, b) {
  const px = b.x * TILE_SIZE;
  const py = b.y * TILE_SIZE;
  const pw = b.w * TILE_SIZE;
  const ph = b.h * TILE_SIZE;

  // Floor
  ctx.fillStyle = '#0e0b1c';
  ctx.fillRect(px, py, pw, ph);

  // Top neon trim using the building accent color
  ctx.fillStyle = b.color;
  ctx.globalAlpha = 0.18;
  ctx.fillRect(px + 1, py + 1, pw - 2, 2);
  ctx.fillRect(px + 1, py + ph - 3, pw - 2, 2);
  ctx.globalAlpha = 1;

  // Border
  ctx.strokeStyle = b.color + '55';
  ctx.lineWidth = 1;
  ctx.strokeRect(px + 0.5, py + 0.5, pw - 1, ph - 1);

  // Window pattern
  ctx.fillStyle = b.color;
  ctx.globalAlpha = 0.18;
  for (let yy = 0; yy < b.h; yy++) {
    for (let xx = 0; xx < b.w; xx++) {
      if ((xx + yy) % 2 === 0) {
        const wx = px + xx * TILE_SIZE + 4;
        const wy = py + yy * TILE_SIZE + 4;
        ctx.fillRect(wx, wy, 3, 3);
      }
    }
  }
  ctx.globalAlpha = 1;

  // Door marker (drawn at runtime in renderFrame for animation)
}

// ---------------------------------------------------------------------------

export function renderFrame(ctx, world, camera, particles, baked) {
  const canvas = ctx.canvas;
  const cssW = canvas.clientWidth;
  const cssH = canvas.clientHeight;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  if (canvas.width !== cssW * dpr || canvas.height !== cssH * dpr) {
    canvas.width = cssW * dpr;
    canvas.height = cssH * dpr;
  }

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.imageSmoothingEnabled = false;

  // Background fill
  ctx.fillStyle = '#04030a';
  ctx.fillRect(0, 0, cssW, cssH);

  // Camera transform
  const zoom = camera.sZoom;
  const tilePx = TILE_SIZE * zoom;
  const camX = camera.sx * tilePx;
  const camY = camera.sy * tilePx;
  const shakeX = (Math.random() - 0.5) * camera.shake * 4;
  const shakeY = (Math.random() - 0.5) * camera.shake * 4;
  const offsetX = cssW / 2 - camX + shakeX;
  const offsetY = cssH / 2 - camY + shakeY;

  ctx.save();
  ctx.translate(offsetX, offsetY);
  ctx.scale(zoom, zoom);

  // Draw the baked city.
  ctx.drawImage(baked.canvas, 0, 0);

  // Building runtime decoration: doors, labels (only when zoomed enough)
  drawBuildingDecor(ctx, world, zoom);

  // NPC shadows (drawn underneath)
  drawNpcShadows(ctx, world);

  // NPCs
  drawNpcs(ctx, world);

  // Crime markers
  drawActiveEventMarkers(ctx, world);

  // Particles in world space (rain)
  drawWorldParticles(ctx, world, particles);

  ctx.restore();

  // Lighting overlay (screen space for blend modes)
  drawLighting(ctx, world, cssW, cssH, offsetX, offsetY, zoom);

  // Weather overlay (screen space)
  drawWeatherOverlay(ctx, world, cssW, cssH);

  // Sparks ambient
  drawSparks(ctx, particles, world, offsetX, offsetY, zoom);

  // Vignette + scanlines
  drawVignette(ctx, cssW, cssH);

  // HUD time stamp
  drawCornerHUD(ctx, world, cssW, cssH);
}

function drawBuildingDecor(ctx, world, zoom) {
  const showLabels = zoom > 1.3;
  for (const b of world.city.buildings) {
    // Door dot
    const dx = (b.door.x + 0.5) * TILE_SIZE;
    const dy = (b.door.y + 0.5) * TILE_SIZE;
    ctx.fillStyle = b.color;
    ctx.globalAlpha = 0.85;
    ctx.fillRect(dx - 2, dy - 2, 4, 4);
    ctx.globalAlpha = 1;

    if (showLabels) {
      // Label pill above building
      const cx = (b.x + b.w / 2) * TILE_SIZE;
      const top = b.y * TILE_SIZE - 4;
      const label = b.label;
      ctx.font = '7px "JetBrains Mono", monospace';
      const w = ctx.measureText(label).width + 6;
      ctx.fillStyle = 'rgba(8, 6, 16, 0.85)';
      ctx.fillRect(cx - w / 2, top - 8, w, 8);
      ctx.fillStyle = b.color;
      ctx.fillText(label, cx - w / 2 + 3, top - 2);
    }
  }
}

function drawNpcShadows(ctx, world) {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
  for (const npc of world.npcs) {
    if (!npc.visible) continue;
    const px = npc.x * TILE_SIZE;
    const py = npc.y * TILE_SIZE;
    ctx.beginPath();
    ctx.ellipse(px, py + 4, 4, 1.6, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawNpcs(ctx, world) {
  for (const npc of world.npcs) {
    if (!npc.visible) continue;
    const px = npc.x * TILE_SIZE;
    const py = npc.y * TILE_SIZE;
    const bob = Math.sin(world.state.tick * 0.3 + npc.bobPhase) * 0.6;

    // Body — pixel-art style
    ctx.fillStyle = npc.color;
    ctx.fillRect(Math.round(px - 2), Math.round(py - 4 + bob), 4, 6);
    // Head
    ctx.fillStyle = '#f5f1ff';
    ctx.fillRect(Math.round(px - 2), Math.round(py - 7 + bob), 4, 3);
    // Glow eye
    ctx.fillStyle = npc.color;
    ctx.fillRect(Math.round(px - 1), Math.round(py - 6 + bob), 2, 1);

    // Mood halo
    const mood = MOODS[npc.mood?.toUpperCase()] || MOODS.NEUTRAL;
    ctx.fillStyle = mood.color;
    ctx.globalAlpha = 0.18;
    ctx.beginPath();
    ctx.arc(px, py - 2 + bob, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    // Highlighted ring if criminal/officer/in-action
    if (npc.activity === 'fighting') {
      ctx.strokeStyle = '#f87171';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.arc(px, py - 2 + bob, 6, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
}

function drawActiveEventMarkers(ctx, world) {
  if (world.state.activeCrime) {
    const { x, y } = world.state.activeCrime.location;
    const px = x * TILE_SIZE;
    const py = y * TILE_SIZE;
    const pulse = 0.5 + 0.5 * Math.sin(world.state.tick * 0.2);
    ctx.strokeStyle = `rgba(248, 113, 113, ${0.25 + pulse * 0.5})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(px, py, 8 + pulse * 4, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(px, py, 14 + pulse * 4, 0, Math.PI * 2);
    ctx.stroke();
  }
}

function drawWorldParticles(ctx, world, particles) {
  const w = world.weather.current.id;
  if (w !== 'rain' && w !== 'storm') return;
  ctx.strokeStyle = w === 'storm' ? 'rgba(168, 85, 247, 0.55)' : 'rgba(125, 211, 252, 0.45)';
  ctx.lineWidth = 0.6;
  ctx.beginPath();
  for (const r of particles.rain) {
    const x = r.x * TILE_SIZE;
    const y = r.y * TILE_SIZE;
    ctx.moveTo(x, y);
    ctx.lineTo(x + 1.5, y + r.length);
  }
  ctx.stroke();
}

function drawLighting(ctx, world, w, h, offsetX, offsetY, zoom) {
  const day = daylight(world.state);
  // Night tint
  ctx.fillStyle = `rgba(5, 3, 20, ${0.65 * (1 - day)})`;
  ctx.fillRect(0, 0, w, h);

  // Building/window emissive glow at night
  if (day < 0.6) {
    ctx.save();
    ctx.translate(offsetX, offsetY);
    ctx.scale(zoom, zoom);
    ctx.globalCompositeOperation = 'lighter';
    for (const b of world.city.buildings) {
      const cx = b.centerX * TILE_SIZE;
      const cy = b.centerY * TILE_SIZE;
      const r = Math.max(b.w, b.h) * TILE_SIZE * 0.8;
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      grad.addColorStop(0, b.color + 'aa');
      grad.addColorStop(0.4, b.color + '33');
      grad.addColorStop(1, b.color + '00');
      ctx.fillStyle = grad;
      ctx.globalAlpha = 0.15 + (1 - day) * 0.35;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
    ctx.restore();
  }
}

function drawWeatherOverlay(ctx, world, w, h) {
  const wid = world.weather.current.id;
  if (wid === 'fog') {
    ctx.fillStyle = `rgba(180, 200, 220, ${0.05 + world.weather.intensity * 0.08})`;
    ctx.fillRect(0, 0, w, h);
  }
  if (wid === 'storm') {
    if (Math.random() < 0.01) {
      ctx.fillStyle = 'rgba(255,255,255,0.18)';
      ctx.fillRect(0, 0, w, h);
    }
  }
  // Tint from current weather
  ctx.fillStyle = world.weather.current.tint || 'transparent';
  ctx.fillRect(0, 0, w, h);
}

function drawSparks(ctx, particles, world, offsetX, offsetY, zoom) {
  if (daylight(world.state) > 0.6) return;
  ctx.save();
  ctx.translate(offsetX, offsetY);
  ctx.scale(zoom, zoom);
  ctx.globalCompositeOperation = 'lighter';
  for (const s of particles.sparks) {
    const x = s.x * TILE_SIZE;
    const y = s.y * TILE_SIZE;
    ctx.fillStyle = s.color;
    ctx.globalAlpha = 0.35;
    ctx.fillRect(x, y, 1, 1);
  }
  ctx.globalCompositeOperation = 'source-over';
  ctx.globalAlpha = 1;
  ctx.restore();
}

function drawVignette(ctx, w, h) {
  const g = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.35, w / 2, h / 2, Math.max(w, h) * 0.7);
  g.addColorStop(0, 'rgba(0,0,0,0)');
  g.addColorStop(1, 'rgba(0,0,0,0.55)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
}

function drawCornerHUD(ctx, world, w, h) {
  const { hour, minute, day } = getClock(world.state);
  const stamp = `D${day} • ${String(hour).padStart(2,'0')}:${String(minute).padStart(2,'0')}`;
  ctx.font = '11px "JetBrains Mono", monospace';
  ctx.fillStyle = 'rgba(34, 211, 238, 0.9)';
  ctx.fillText(stamp, 12, h - 12);

  ctx.fillStyle = 'rgba(168, 85, 247, 0.6)';
  ctx.fillText(world.weather.current.label.toUpperCase(), 12, h - 26);

  ctx.textAlign = 'right';
  ctx.fillStyle = 'rgba(168, 85, 247, 0.7)';
  ctx.fillText('NEOLIFE // LIVE', w - 12, h - 12);
  ctx.textAlign = 'left';
}
