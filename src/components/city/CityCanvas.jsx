// =============================================================================
// CityCanvas — komponen kota pixel-art 2D top-down untuk NeoLife Indonesia.
//
// Strategi performa (ringan, ramah RAF):
//   1. Layout kota (tile grid + slot bangunan + pohon + lampu + mobil)
//      DI-CACHE saat daftar bangunan berubah strukturnya.
//   2. "City bake": tile + bangunan statis dirender SEKALI ke offscreen canvas.
//      Setiap frame cuma blit offscreen, lalu paint layer dinamis di atasnya.
//   3. Layer dinamis (mobil, NPC, hujan, jendela menyala, lampu jalan, label,
//      overlay malam, vignette) digambar tiap RAF.
//   4. requestAnimationFrame tunggal per instance.
//
// Props:
//   - npcs:       snapshot.npcs    (array dari engine simulasi)
//   - buildings:  snapshot.buildings
//   - world:      snapshot penuh (jam, cuaca, dll.)
//   - cameraMode: 'orbit' | 'static' | 'follow'
//   - showLabels: tampilkan label NPC + bangunan
//   - liveMode:   true => render full-bleed (mode penonton/OBS)
//                 false => render dalam panel dengan header (mode admin)
// =============================================================================

import { useEffect, useMemo, useRef } from 'react';
import { pickFocusEvent, pickPatrolBuilding } from '../../simulation/cameraSystem.js';

// ---- Konstanta dasar ---------------------------------------------------------

const TILE = 12;            // px per tile (logical)
const COLS = 60;            // tile horizontal
const ROWS = 40;            // tile vertikal
const MAP_PX_W = COLS * TILE;
const MAP_PX_H = ROWS * TILE;

const TILE_GRASS    = 0;
const TILE_ROAD     = 1;
const TILE_SIDEWALK = 2;
const TILE_PLAZA    = 3;

// Warna tiap tipe bangunan. Cocok dengan tipe di world.js (rumah, kafe, dll.).
const BUILDING_COLOR = {
  rumah:     '#a78bfa',
  apartemen: '#8b5cf6',
  kafe:      '#22d3ee',
  kantor:    '#3b82f6',
  toko:      '#a3e635',
  warung:    '#f59e0b',
  taman:     '#22c55e',
  polisi:    '#60a5fa',
  klinik:    '#34d399',
  default:   '#94a3b8',
};

const NPC_PALETTE = [
  '#22d3ee', '#a855f7', '#ec4899', '#a3e635',
  '#fbbf24', '#60a5fa', '#f87171', '#34d399',
];

// ---- Utility -----------------------------------------------------------------

function hashStr(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function isNight(jam) {
  return jam < 5 || jam >= 19;
}

function rainIntensity(cuaca) {
  switch (cuaca) {
    case 'Hujan':       return 0.6;
    case 'Hujan Deras': return 1.0;
    case 'Badai':       return 1.3;
    default:            return 0;
  }
}

// ---- Layout generator (procedural, deterministik) ---------------------------
//
// Diatur supaya dengan sampel awal 8 bangunan (lihat world.js), kota tetap
// terlihat seperti grid pixel rapi: jalan utama 3 horizontal × 3 vertikal,
// plaza tengah, blok-blok bangunan, pohon di rumput, lampu di trotoar, mobil
// kecil di jalan.

const BUILDING_SLOTS = [
  // [x, y, w, h] — diurutkan supaya sample seed buildings (8) terlihat baik.
  [3, 2, 5, 4],   [10, 2, 4, 4],  [16, 2, 5, 4],   [22, 2, 5, 4],
  [32, 2, 5, 4],  [38, 2, 5, 4],  [48, 2, 5, 4],   [54, 2, 5, 4],
  [3, 12, 5, 5],  [10, 12, 4, 5], [16, 12, 5, 5],  [22, 12, 5, 5],
  [48, 12, 5, 5], [54, 12, 5, 5],
  [3, 24, 5, 5],  [10, 24, 4, 5], [16, 24, 5, 5],  [22, 24, 5, 5],
  [48, 24, 5, 5], [54, 24, 5, 5],
  [3, 35, 5, 4],  [10, 35, 4, 4], [16, 35, 5, 4],  [22, 35, 5, 4],
  [32, 35, 5, 4], [38, 35, 5, 4], [48, 35, 5, 4],  [54, 35, 5, 4],
];

const H_ROADS = [8, 20, 32];   // y-tile
const V_ROADS = [14, 30, 46];  // x-tile

function buildLayout(buildings) {
  const tiles = new Uint8Array(COLS * ROWS); // default grass=0
  const setTile = (x, y, t) => {
    if (x < 0 || y < 0 || x >= COLS || y >= ROWS) return;
    tiles[y * COLS + x] = t;
  };

  // Jalan horizontal & trotoar.
  for (const y of H_ROADS) {
    for (let x = 0; x < COLS; x++) {
      setTile(x, y,     TILE_ROAD);
      setTile(x, y + 1, TILE_ROAD);
      if (y > 0)        setTile(x, y - 1, TILE_SIDEWALK);
      if (y < ROWS - 2) setTile(x, y + 2, TILE_SIDEWALK);
    }
  }
  // Jalan vertikal & trotoar.
  for (const x of V_ROADS) {
    for (let y = 0; y < ROWS; y++) {
      setTile(x,     y, TILE_ROAD);
      setTile(x + 1, y, TILE_ROAD);
      if (x > 0)        setTile(x - 1, y, TILE_SIDEWALK);
      if (x < COLS - 2) setTile(x + 2, y, TILE_SIDEWALK);
    }
  }
  // Plaza tengah.
  for (let y = 22; y < 30; y++) {
    for (let x = 32; x < 44; x++) {
      if (tiles[y * COLS + x] === TILE_GRASS) setTile(x, y, TILE_PLAZA);
    }
  }

  // Map setiap bangunan ke slot. Bangunan ke-N pakai BUILDING_SLOTS[N].
  const slots = buildings.slice(0, BUILDING_SLOTS.length).map((b, i) => {
    const [x, y, w, h] = BUILDING_SLOTS[i];
    return {
      id: b.id,
      label: b.name,
      type: b.type,
      status: b.status,
      progress: typeof b.progress === 'number' ? b.progress : 1,
      x, y, w, h,
      cx: x + w / 2,
      cy: y + h / 2,
      doorX: x + Math.floor(w / 2),
      doorY: y + h, // pintu mengarah ke selatan
    };
  });

  // Tile project (di atas grass) — menjadikan footprint "tidak terlihat grass"
  // di bawah bangunan, biar bangunan tidak bocor warnanya.
  for (const s of slots) {
    for (let yy = s.y; yy < s.y + s.h; yy++) {
      for (let xx = s.x; xx < s.x + s.w; xx++) {
        // tetap grass; rendering bangunan akan nutupi.
      }
    }
  }

  // Pohon di rumput (deterministik per koord).
  const trees = [];
  const inSlot = (x, y) =>
    slots.some((s) => x >= s.x && x < s.x + s.w && y >= s.y && y < s.y + s.h);
  for (let y = 1; y < ROWS - 1; y++) {
    for (let x = 1; x < COLS - 1; x++) {
      if (tiles[y * COLS + x] !== TILE_GRASS) continue;
      if (inSlot(x, y)) continue;
      if (((x * 37 + y * 53) % 19) === 0) trees.push({ x, y });
    }
  }

  // Lampu jalan di trotoar dekat persimpangan.
  const lamps = [];
  for (const y of H_ROADS) {
    for (const x of [4, 22, 38, 54]) {
      lamps.push({ x, y: y - 1 });
      lamps.push({ x, y: y + 2 });
    }
  }

  // Mobil kecil — di-spawn di sebagian jalan, akan dianimasi.
  const cars = [];
  for (let i = 0; i < 6; i++) {
    const horizontal = i % 2 === 0;
    const lane = horizontal ? H_ROADS[i % H_ROADS.length] : V_ROADS[i % V_ROADS.length];
    cars.push({
      horizontal,
      lane,
      offset: i * 9,
      speed: 0.05 + (i % 3) * 0.02,
      color: NPC_PALETTE[i % NPC_PALETTE.length],
    });
  }

  return { tiles, slots, trees, lamps, cars };
}

// ---- Bake city ke offscreen canvas (sekali per layout) ----------------------

function bakeCity(layout) {
  const off = document.createElement('canvas');
  off.width = MAP_PX_W;
  off.height = MAP_PX_H;
  const ctx = off.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  // Background.
  ctx.fillStyle = '#04030a';
  ctx.fillRect(0, 0, MAP_PX_W, MAP_PX_H);

  // Tiles.
  paintTiles(ctx, layout.tiles);

  // Pohon di atas grass.
  for (const t of layout.trees) paintTree(ctx, t.x, t.y);

  // Bangunan (statis).
  for (const s of layout.slots) paintBuilding(ctx, s);

  return off;
}

function paintTiles(ctx, tiles) {
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const tile = tiles[y * COLS + x];
      const px = x * TILE;
      const py = y * TILE;
      switch (tile) {
        case TILE_GRASS:
          ctx.fillStyle = '#0d1c1a';
          ctx.fillRect(px, py, TILE, TILE);
          if (((x * 7 + y * 13) % 11) === 0) {
            ctx.fillStyle = 'rgba(34, 197, 94, 0.4)';
            ctx.fillRect(px + 4, py + 5, 2, 2);
          }
          break;
        case TILE_ROAD:
          ctx.fillStyle = '#0c0c16';
          ctx.fillRect(px, py, TILE, TILE);
          if (((x + y) % 4) === 0) {
            ctx.fillStyle = 'rgba(168, 85, 247, 0.20)';
            ctx.fillRect(px + 5, py + 3, 2, 6);
          }
          break;
        case TILE_SIDEWALK:
          ctx.fillStyle = '#1a1730';
          ctx.fillRect(px, py, TILE, TILE);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
          ctx.strokeRect(px + 0.5, py + 0.5, TILE - 1, TILE - 1);
          break;
        case TILE_PLAZA:
          ctx.fillStyle = '#1c1638';
          ctx.fillRect(px, py, TILE, TILE);
          if (((x + y) % 3) === 0) {
            ctx.fillStyle = 'rgba(34, 211, 238, 0.10)';
            ctx.fillRect(px + 5, py + 5, 2, 2);
          }
          break;
        default:
      }
    }
  }
}

function paintTree(ctx, tx, ty) {
  const px = tx * TILE;
  const py = ty * TILE;
  // Trunk
  ctx.fillStyle = '#3b2618';
  ctx.fillRect(px + 5, py + 8, 2, 4);
  // Leaves
  ctx.fillStyle = '#16a34a';
  ctx.fillRect(px + 2, py + 2, 8, 6);
  ctx.fillStyle = '#22c55e';
  ctx.fillRect(px + 3, py + 1, 6, 1);
  ctx.fillStyle = '#86efac';
  ctx.fillRect(px + 4, py + 3, 2, 1);
  // Outline
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.fillRect(px + 1, py + 7, 10, 1);
}

function paintBuilding(ctx, slot) {
  const px = slot.x * TILE;
  const py = slot.y * TILE;
  const pw = slot.w * TILE;
  const ph = slot.h * TILE;
  const color = BUILDING_COLOR[slot.type] || BUILDING_COLOR.default;

  // Floor (warna gelap)
  ctx.fillStyle = '#0e0b1c';
  ctx.fillRect(px, py, pw, ph);

  // Roof band atas
  ctx.fillStyle = '#1a1730';
  ctx.fillRect(px, py, pw, 3);

  // Neon trim
  ctx.globalAlpha = 0.55;
  ctx.fillStyle = color;
  ctx.fillRect(px + 1, py + 3, pw - 2, 1);
  ctx.fillRect(px + 1, py + ph - 2, pw - 2, 1);
  ctx.globalAlpha = 1;

  // Outline gelap
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 1;
  ctx.strokeRect(px + 0.5, py + 0.5, pw - 1, ph - 1);
  ctx.strokeStyle = color + '66';
  ctx.strokeRect(px + 1.5, py + 1.5, pw - 3, ph - 3);

  if (slot.status === 'Dibangun') {
    // Hatch diagonal supaya kelihatan proyek.
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.4)';
    ctx.setLineDash([2, 2]);
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(px + pw, py + ph);
    ctx.moveTo(px + pw, py);
    ctx.lineTo(px, py + ph);
    ctx.stroke();
    ctx.setLineDash([]);
    return; // skip jendela
  }

  // Jendela (default = gelap; menyala digambar dinamis di malam hari).
  for (let yy = 1; yy < slot.h - 1; yy++) {
    for (let xx = 0; xx < slot.w; xx++) {
      const wx = px + xx * TILE + 2;
      const wy = py + yy * TILE + 3;
      ctx.fillStyle = '#0f0d20';
      ctx.fillRect(wx, wy, 8, 6);
      ctx.fillStyle = color + '44';
      ctx.fillRect(wx + 1, wy + 1, 6, 4);
    }
  }

  // Pintu di sisi bawah.
  const dx = px + Math.floor(slot.w / 2) * TILE + 3;
  const dy = py + ph - 5;
  ctx.fillStyle = color;
  ctx.fillRect(dx, dy, 6, 4);
}

// ---- Render dinamis (per frame) ---------------------------------------------

function paintLitWindows(ctx, layout, time) {
  for (const s of layout.slots) {
    if (s.status === 'Dibangun') continue;
    const seed = hashStr(s.id);
    const px = s.x * TILE;
    const py = s.y * TILE;
    for (let yy = 1; yy < s.h - 1; yy++) {
      for (let xx = 0; xx < s.w; xx++) {
        // Sebagian deterministik, sebagian flicker pelan.
        const k = ((xx + yy + seed) * 13) % 7;
        if (k > 4) continue;
        const flicker = ((time * 1000 + seed + xx * 7 + yy * 11) | 0) % 200 < 195;
        if (!flicker) continue;
        const wx = px + xx * TILE + 2;
        const wy = py + yy * TILE + 3;
        ctx.fillStyle = '#fef9c3';
        ctx.globalAlpha = 0.85;
        ctx.fillRect(wx + 1, wy + 1, 6, 4);
      }
    }
  }
  ctx.globalAlpha = 1;
}

function paintLamps(ctx, layout, lit) {
  for (const l of layout.lamps) {
    const px = l.x * TILE;
    const py = l.y * TILE;
    // Tiang
    ctx.fillStyle = '#475569';
    ctx.fillRect(px + 5, py + 4, 2, 8);
    // Kepala
    ctx.fillStyle = '#1f2937';
    ctx.fillRect(px + 3, py + 2, 6, 3);
    // Bohlam
    ctx.fillStyle = lit ? '#fde047' : '#475569';
    ctx.fillRect(px + 5, py + 5, 2, 1);
    if (lit) {
      // Glow halo
      const grad = ctx.createRadialGradient(px + 6, py + 6, 0, px + 6, py + 6, 28);
      grad.addColorStop(0, 'rgba(253, 224, 71, 0.45)');
      grad.addColorStop(1, 'rgba(253, 224, 71, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(px - 14, py - 12, 40, 40);
    }
  }
}

function paintCars(ctx, cars, time) {
  for (const c of cars) {
    if (c.horizontal) {
      const x = ((time * c.speed * 60 + c.offset) % (COLS + 8)) - 4;
      const y = c.lane;
      drawCarH(ctx, x, y, c.color);
    } else {
      const y = ((time * c.speed * 60 + c.offset) % (ROWS + 8)) - 4;
      const x = c.lane;
      drawCarV(ctx, x, y, c.color);
    }
  }
}

function drawCarH(ctx, x, y, color) {
  const px = x * TILE;
  const py = y * TILE;
  ctx.fillStyle = color;
  ctx.fillRect(px, py + 3, 14, 6);
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(px + 2, py + 4, 10, 4);
  ctx.fillStyle = '#facc15';
  ctx.fillRect(px + 13, py + 4, 1, 1);
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(px, py + 7, 1, 1);
}

function drawCarV(ctx, x, y, color) {
  const px = x * TILE;
  const py = y * TILE;
  ctx.fillStyle = color;
  ctx.fillRect(px + 3, py, 6, 14);
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(px + 4, py + 2, 4, 10);
  ctx.fillStyle = '#facc15';
  ctx.fillRect(px + 4, py + 13, 2, 1);
}

// NPC pixel kecil. State posisi disimpan di Map yg dipertahankan antar frame.
function paintNpc(ctx, state, time) {
  const px = state.x * TILE;
  const py = state.y * TILE;
  const moving = Math.abs(state.tx - state.x) > 0.05 || Math.abs(state.ty - state.y) > 0.05;
  const phase = Math.floor(time * 5 + state.walkPhase) % 4;
  const bob = moving ? Math.sin(time * 6 + state.walkPhase) * 0.6 : 0;

  // Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
  ctx.beginPath();
  ctx.ellipse(px, py + 4, 4, 1.6, 0, 0, Math.PI * 2);
  ctx.fill();

  const baseX = Math.round(px - 3);
  const baseY = Math.round(py - 8 + bob);

  // Hair / hat
  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(baseX + 1, baseY, 4, 1);
  // Head
  ctx.fillStyle = '#f5deb3';
  ctx.fillRect(baseX + 1, baseY + 1, 4, 2);
  // Eyes
  ctx.fillStyle = '#1f2937';
  ctx.fillRect(baseX + 2, baseY + 2, 1, 1);
  ctx.fillRect(baseX + 3, baseY + 2, 1, 1);
  // Body / shirt
  ctx.fillStyle = state.color;
  ctx.fillRect(baseX + 1, baseY + 3, 4, 3);
  // Belt
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(baseX + 1, baseY + 6, 4, 1);
  // Legs (langkah berganti)
  ctx.fillStyle = '#1e293b';
  if (moving && phase % 2 === 0) {
    ctx.fillRect(baseX + 1, baseY + 7, 1, 2);
    ctx.fillRect(baseX + 4, baseY + 7, 1, 2);
    ctx.fillRect(baseX + 2, baseY + 7, 2, 2);
  } else {
    ctx.fillRect(baseX + 1, baseY + 7, 2, 2);
    ctx.fillRect(baseX + 3, baseY + 7, 2, 2);
  }
}

function paintNpcLabel(ctx, state, npc) {
  const px = state.x * TILE;
  const py = state.y * TILE - 12;
  const label = `${(npc.name || '').split(' ')[0]} — ${npc.status || npc.activityLabel || ''}`.trim();
  if (!label) return;
  ctx.font = '7px "JetBrains Mono", monospace';
  const w = ctx.measureText(label).width + 4;
  ctx.fillStyle = 'rgba(8, 6, 16, 0.85)';
  ctx.fillRect(px - w / 2, py - 6, w, 8);
  ctx.fillStyle = state.color;
  ctx.fillText(label, px - w / 2 + 2, py);
}

function paintBuildingLabels(ctx, layout, time) {
  ctx.font = '7px "JetBrains Mono", monospace';
  for (const s of layout.slots) {
    const cx = (s.x + s.w / 2) * TILE;
    const top = s.y * TILE - 4;
    const color = BUILDING_COLOR[s.type] || BUILDING_COLOR.default;

    // Label utama
    const label = s.label || '';
    const w = ctx.measureText(label).width + 6;
    ctx.fillStyle = 'rgba(8, 6, 16, 0.88)';
    ctx.fillRect(cx - w / 2, top - 9, w, 8);
    ctx.strokeStyle = color + '88';
    ctx.lineWidth = 0.5;
    ctx.strokeRect(cx - w / 2 + 0.5, top - 9 + 0.5, w - 1, 7);
    ctx.fillStyle = color;
    ctx.fillText(label, cx - w / 2 + 3, top - 3);

    // Status sub-label / progress bar
    if (s.status === 'Dibangun' && s.progress < 1) {
      const wPx = s.w * TILE;
      const barX = s.x * TILE + 2;
      const barY = s.y * TILE + 2;
      ctx.fillStyle = 'rgba(0,0,0,0.7)';
      ctx.fillRect(barX, barY, wPx - 4, 4);
      ctx.fillStyle = '#a855f7';
      ctx.fillRect(barX + 1, barY + 1, Math.floor((wPx - 6) * s.progress), 2);
      // Sub-label "Dibangun X%"
      const sub = `Dibangun ${Math.floor(s.progress * 100)}%`;
      ctx.font = '6px "JetBrains Mono", monospace';
      const sw = ctx.measureText(sub).width + 4;
      ctx.fillStyle = 'rgba(8, 6, 16, 0.85)';
      ctx.fillRect(cx - sw / 2, top - 1, sw, 7);
      ctx.fillStyle = '#a855f7';
      ctx.fillText(sub, cx - sw / 2 + 2, top + 4);
      ctx.font = '7px "JetBrains Mono", monospace';

      // Highlight ring di sekitar proyek (animasi pulse)
      const pulse = 0.5 + 0.5 * Math.sin(time * 4);
      ctx.strokeStyle = `rgba(168, 85, 247, ${0.25 + pulse * 0.4})`;
      ctx.lineWidth = 1;
      ctx.strokeRect(s.x * TILE - 2, s.y * TILE - 2, s.w * TILE + 4, s.h * TILE + 4);
    }
  }
}

function paintNightOverlay(ctx, w, h, jam) {
  // Hitung "darkness" 0..1 berdasarkan jam.
  let dark = 0;
  if (jam >= 19 && jam < 22) dark = (jam - 19) / 3;             // 19-22 makin gelap
  else if (jam >= 22 || jam < 4) dark = 1;                       // 22-04 paling gelap
  else if (jam >= 4 && jam < 6) dark = 1 - (jam - 4) / 2;        // 04-06 makin terang
  else dark = 0;

  if (dark <= 0) return;
  ctx.fillStyle = `rgba(5, 3, 20, ${0.7 * dark})`;
  ctx.fillRect(0, 0, w, h);
}

function paintRain(ctx, particles, intensity) {
  ctx.strokeStyle = intensity > 1.1
    ? 'rgba(168, 85, 247, 0.55)'
    : 'rgba(125, 211, 252, 0.55)';
  ctx.lineWidth = 0.7;
  ctx.beginPath();
  for (const r of particles) {
    ctx.moveTo(r.x * TILE, r.y * TILE);
    ctx.lineTo(r.x * TILE + 1.5, r.y * TILE + r.length);
  }
  ctx.stroke();
}

function paintFocusHighlight(ctx, slot, time) {
  // Glow ring pulse di sekitar bangunan yang sedang difokus.
  const px = slot.x * TILE;
  const py = slot.y * TILE;
  const pw = slot.w * TILE;
  const ph = slot.h * TILE;
  const cx = px + pw / 2;
  const cy = py + ph / 2;

  const pulse = 0.5 + 0.5 * Math.sin(time * 4);
  const r = Math.max(pw, ph) * 0.85;

  // Soft radial halo
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 1.4);
  grad.addColorStop(0, `rgba(34, 211, 238, ${0.15 + pulse * 0.15})`);
  grad.addColorStop(0.6, 'rgba(34, 211, 238, 0.04)');
  grad.addColorStop(1, 'rgba(34, 211, 238, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(cx - r * 1.4, cy - r * 1.4, r * 2.8, r * 2.8);

  // Outline neon
  ctx.strokeStyle = `rgba(34, 211, 238, ${0.5 + pulse * 0.4})`;
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 3]);
  ctx.strokeRect(px - 1, py - 1, pw + 2, ph + 2);
  ctx.setLineDash([]);
}

function paintVignette(ctx, w, h) {
  const g = ctx.createRadialGradient(
    w / 2, h / 2, Math.min(w, h) * 0.35,
    w / 2, h / 2, Math.max(w, h) * 0.7
  );
  g.addColorStop(0, 'rgba(0,0,0,0)');
  g.addColorStop(1, 'rgba(0,0,0,0.55)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
}

// ---- React Component --------------------------------------------------------

export default function CityCanvas({
  npcs = [],
  buildings = [],
  world = {},
  cameraMode = 'orbit',
  showLabels = true,
  liveMode = false,
}) {
  const canvasRef = useRef(null);

  // Layout dirakit hanya saat identitas bangunan berubah strukturnya.
  // Properti seperti progress/status berubah lebih sering — di-sinkronkan ke
  // `layout.slots` di dalam RAF loop (lihat di bawah), bukan saat render.
  // Stable key: id + status sudah cukup; sengaja di-precompute supaya useMemo
  // tidak alokasi string baru tiap render.
  const layoutKey = buildings.map((b) => `${b.id}:${b.status}`).join('|');
  const layout = useMemo(() => buildLayout(buildings || []), [layoutKey]);

  // Bake city statis (sekali per layout). Hanya "shell" tile + bangunan;
  // progress/jendela menyala/mobil/NPC = layer dinamis.
  const bakedRef = useRef(null);
  useEffect(() => {
    bakedRef.current = bakeCity(layout);
  }, [layout]);

  // Patch progress dari prop buildings ke layout.slots — DILAKUKAN DI RAF LOOP,
  // bukan di body render. Lihat awal `loop()` di useEffect.

  // Posisi NPC di-cache di Map. Kalau NPC baru muncul, kita spawn di slot
  // bangunan yang cocok dengan `location`-nya. Kalau location berubah,
  // target wandering juga ikut berubah.
  const npcStateRef = useRef(new Map());

  // Hujan particles (precomputed sekali).
  const rainRef = useRef(null);
  if (!rainRef.current) {
    rainRef.current = Array.from({ length: 220 }, () => ({
      x: Math.random() * COLS,
      y: Math.random() * ROWS,
      speed: 0.4 + Math.random() * 0.6,
      length: 5 + Math.random() * 6,
    }));
  }

  // Props ref — RAF loop tidak boleh re-baca closure props (akan stale).
  const propsRef = useRef({});
  propsRef.current = {
    npcs, buildings, world, cameraMode, showLabels, layout,
  };  // Kamera state internal.
  // - sx, sy, sZoom: nilai smoothed yang dipakai render
  // - tx, ty, tz:    target (di-update saat orbit/event-focus)
  // - lastFocusId, focusUntil: anti-spam, ganti target maksimal beberapa detik sekali
  const camRef = useRef({
    sx: COLS / 2, sy: ROWS / 2, sZoom: 1,
    tx: COLS / 2, ty: ROWS / 2, tz: 1,
    lastFocusId: null,
    nextSwitchAt: 0,
    holdUntil: 0,
    lastEventId: null,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf = 0;
    const t0 = performance.now();

    const loop = (now) => {
      const time = (now - t0) / 1000;
      const { npcs, world, cameraMode, showLabels, layout, buildings } =
        propsRef.current;
      const baked = bakedRef.current;
      if (!baked) {
        raf = requestAnimationFrame(loop);
        return;
      }

      // Sinkronkan progress + status terbaru ke slot. Loop kecil (8-30 entri)
      // dan dijalankan di RAF, bukan saat render React.
      if (buildings && buildings.length) {
        const byId = new Map(buildings.map((b) => [b.id, b]));
        for (const s of layout.slots) {
          const b = byId.get(s.id);
          if (b) {
            s.progress = typeof b.progress === 'number' ? b.progress : s.progress;
            s.status = b.status;
          }
        }
      }

      // -- Resize / DPR --
      const cssW = canvas.clientWidth;
      const cssH = canvas.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (canvas.width !== cssW * dpr || canvas.height !== cssH * dpr) {
        canvas.width = cssW * dpr;
        canvas.height = cssH * dpr;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = false;

      // -- Background --
      ctx.fillStyle = '#04030a';
      ctx.fillRect(0, 0, cssW, cssH);

      // -- Camera --
      // Mode: orbit (drift halus), static (centered), follow (ikuti NPC pertama).
      // Di liveMode kita aktifkan auto-cinematic: pilih landmark / event drama
      // dan zoom in halus, ganti target tiap ~10-14 detik atau saat ada drama
      // baru di lokasi tertentu.
      const cam = camRef.current;
      const fitScaleX = cssW / MAP_PX_W;
      const fitScaleY = cssH / MAP_PX_H;
      const baseZoom = liveMode
        ? Math.max(fitScaleX, fitScaleY) * 1.05
        : Math.min(fitScaleX, fitScaleY);

      // Default target = drift halus (orbit).
      let tx = COLS / 2 + Math.sin(time / 6) * 4;
      let ty = ROWS / 2 + Math.cos(time / 8) * 2;
      let tz = baseZoom;

      if (cameraMode === 'follow' && npcs.length > 0) {
        const first = npcs[0];
        const s = npcStateRef.current.get(first.id);
        if (s) { tx = s.x; ty = s.y; tz = baseZoom * 1.4; }
      } else if (liveMode && cameraMode !== 'static') {
        // Auto-cinematic: cek event penting dulu.
        const focus = pickFocusEvent(world);
        if (focus && focus.event.id !== cam.lastEventId) {
          // Ada drama baru — hop kamera ke lokasinya, hold 8 detik.
          cam.lastEventId = focus.event.id;
          cam.lastFocusId = focus.building.id;
          const tile = mapBuildingToTile(focus.building);
          cam.tx = tile.x;
          cam.ty = tile.y;
          cam.tz = baseZoom * 1.4;
          cam.holdUntil = time + 8;
          cam.nextSwitchAt = time + 8;
        } else if (time >= cam.nextSwitchAt) {
          // Jadwal patrol berikutnya: pilih landmark random.
          const target = pickPatrolBuilding(world, cam.lastFocusId);
          if (target) {
            cam.lastFocusId = target.id;
            const tile = mapBuildingToTile(target);
            cam.tx = tile.x;
            cam.ty = tile.y;
            cam.tz = baseZoom * 1.18;
          }
          cam.nextSwitchAt = time + 10 + Math.random() * 4;
          cam.holdUntil = time + 6;
        }
        tx = cam.tx ?? tx;
        ty = cam.ty ?? ty;
        tz = cam.tz ?? tz;
      }

      // Smoothing — interpolasi halus, hindari jitter.
      cam.sx += (tx - cam.sx) * 0.04;
      cam.sy += (ty - cam.sy) * 0.04;
      cam.sZoom += (tz - cam.sZoom) * 0.05;

      const offX = cssW / 2 - cam.sx * TILE * cam.sZoom;
      const offY = cssH / 2 - cam.sy * TILE * cam.sZoom;

      ctx.save();
      ctx.translate(offX, offY);
      ctx.scale(cam.sZoom, cam.sZoom);

      // -- Draw baked static city --
      ctx.drawImage(baked, 0, 0);

      // -- Mobil bergerak --
      paintCars(ctx, layout.cars, time);

      // -- Lampu jalan (lit kalau malam) --
      const night = isNight(world.jam ?? 12);
      paintLamps(ctx, layout, night);

      // -- Jendela menyala (kalau malam) --
      if (night) paintLitWindows(ctx, layout, time);

      // -- NPCs (update target & posisi) --
      paintAllNpcs(ctx, npcs, layout, npcStateRef.current, time);

      // -- Highlight bangunan yang sedang difokus kamera (glow ring pulse) --
      // Hanya saat liveMode dan dalam window holdUntil agar tidak distraksi.
      if (liveMode && cam.lastFocusId && time < cam.holdUntil) {
        const slot = layout.slots.find((s) => s.id === cam.lastFocusId);
        if (slot) paintFocusHighlight(ctx, slot, time);
      }

      // -- Rain particles (di world space) --
      const rainI = rainIntensity(world.cuaca);
      if (rainI > 0) {
        // Update partikel
        const speed = rainI > 1 ? 1.4 : 1.0;
        for (const r of rainRef.current) {
          r.y += r.speed * speed;
          r.x += 0.15;
          if (r.y > ROWS) {
            r.y = -1;
            r.x = Math.random() * COLS;
          }
        }
        paintRain(ctx, rainRef.current, rainI);
      }

      // -- Labels --
      if (showLabels) {
        paintBuildingLabels(ctx, layout, time);
        // Label NPC hanya kalau zoom cukup dekat.
        if (cam.sZoom > 1.5) {
          for (const npc of npcs) {
            const s = npcStateRef.current.get(npc.id);
            if (s) paintNpcLabel(ctx, s, npc);
          }
        }
      }

      ctx.restore();

      // -- Layer screen-space --
      // Overlay malam.
      paintNightOverlay(ctx, cssW, cssH, world.jam ?? 12);
      // Tint cuaca (subtle).
      if (world.cuaca === 'Mendung') {
        ctx.fillStyle = 'rgba(148, 163, 184, 0.06)';
        ctx.fillRect(0, 0, cssW, cssH);
      }
      // Vignette.
      paintVignette(ctx, cssW, cssH);

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liveMode]);

  // Rendering wrapper: panel (admin) atau full-bleed (live).
  if (liveMode) {
    return (
      <div className="relative w-full h-full overflow-hidden">
        <canvas ref={canvasRef} className="w-full h-full pixel-edge" />
        <div className="pointer-events-none absolute inset-0 scanlines opacity-30" />
      </div>
    );
  }

  return (
    <div className="panel relative overflow-hidden h-full">
      <header className="panel-header">
        <div className="flex items-center gap-2">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-neon-cyan animate-pulseSoft" />
          <span className="panel-title">Tampilan Kota Langsung</span>
        </div>
        <span className="font-mono text-[10px] text-slate-500">
          {COLS}×{ROWS} tile · {layout.slots.length} bangunan
        </span>
      </header>
      <div className="absolute inset-0 top-[36px]">
        <canvas ref={canvasRef} className="w-full h-full pixel-edge" />
        <div className="pointer-events-none absolute inset-0 scanlines opacity-40" />
      </div>
    </div>
  );
}

// Memetakan building object (snapshot) ke tile coord di layout.
// Layout pakai BUILDING_SLOTS sequential, jadi index sama dengan index building
// di array buildings. Aman dipakai karena world.js menjaga urutan.
function mapBuildingToTile(building) {
  // Cari slot yg id-nya cocok di BUILDING_SLOTS via index.
  const idx = parseInt(String(building.id).replace(/\D+/g, ''), 10) - 1;
  const slot = BUILDING_SLOTS[Math.max(0, Math.min(BUILDING_SLOTS.length - 1, idx))];
  if (!slot) return { x: COLS / 2, y: ROWS / 2 };
  const [x, y, w, h] = slot;
  return { x: x + w / 2, y: y + h / 2 };
}

// ---- NPC update + render gabungan -------------------------------------------

function paintAllNpcs(ctx, npcs, layout, stateMap, time) {
  // Mapping cepat label bangunan -> slot.
  const slotByLabel = new Map();
  for (const s of layout.slots) slotByLabel.set(s.label, s);

  // Cleanup: hapus NPC yang tidak ada di prop lagi.
  const liveIds = new Set(npcs.map((n) => n.id));
  for (const id of stateMap.keys()) {
    if (!liveIds.has(id)) stateMap.delete(id);
  }

  for (const npc of npcs) {
    let state = stateMap.get(npc.id);
    if (!state) {
      const slot = slotByLabel.get(npc.location) || layout.slots[0];
      const seedHue = NPC_PALETTE[hashStr(npc.id) % NPC_PALETTE.length];
      const cx = slot ? slot.cx : COLS / 2;
      const cy = slot ? slot.cy : ROWS / 2;
      state = {
        x: cx + (Math.random() - 0.5) * 4,
        y: cy + (Math.random() - 0.5) * 4,
        tx: cx + (Math.random() - 0.5) * 3,
        ty: cy + 1.5,
        color: seedHue,
        walkPhase: Math.random() * Math.PI * 2,
        lastLocation: npc.location,
        wanderTimer: 0,
      };
      stateMap.set(npc.id, state);
    } else if (npc.location !== state.lastLocation) {
      const slot = slotByLabel.get(npc.location);
      if (slot) {
        state.tx = slot.cx + (Math.random() - 0.5) * 3;
        state.ty = slot.doorY + 0.5;
      }
      state.lastLocation = npc.location;
    } else {
      // Wander kecil-kecilan supaya kelihatan hidup.
      state.wanderTimer -= 1;
      if (state.wanderTimer <= 0) {
        const slot = slotByLabel.get(npc.location);
        if (slot) {
          state.tx = slot.cx + (Math.random() - 0.5) * 4;
          state.ty = slot.doorY + 0.3 + Math.random() * 1.5;
        }
        state.wanderTimer = 200 + Math.floor(Math.random() * 200);
      }
    }

    // Move pelan ke target.
    const dx = state.tx - state.x;
    const dy = state.ty - state.y;
    const d = Math.hypot(dx, dy);
    if (d > 0.04) {
      const speed = 0.04;
      state.x += (dx / d) * speed;
      state.y += (dy / d) * speed;
    }

    paintNpc(ctx, state, time);
  }
}
