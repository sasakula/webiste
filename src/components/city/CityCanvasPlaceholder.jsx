// Canvas placeholder pixel-art untuk fondasi.
// Menggambar peta kota statis sederhana (jalan, plaza, pohon, beberapa NPC titik)
// agar route Live tidak tampak kosong sebelum engine simulasi dipasang.
import { useEffect, useRef } from 'react';

const TILE = 12;
const COLS = 40;
const ROWS = 28;

export default function CityCanvasPlaceholder({ mode = 'horizontal', className = '' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Sprite NPC titik bergerak sederhana (animasi langkah)
    const npcs = Array.from({ length: 8 }, (_, i) => ({
      x: 4 + i * 4,
      y: 6 + (i % 3) * 6,
      vx: i % 2 === 0 ? 0.08 : -0.08,
      vy: 0,
      color: ['#22d3ee', '#a855f7', '#ec4899', '#a3e635', '#fbbf24', '#60a5fa'][i % 6],
    }));

    let raf = 0;

    const drawTile = (x, y, type) => {
      const px = x * TILE;
      const py = y * TILE;
      switch (type) {
        case 'road':
          ctx.fillStyle = '#0c0c16';
          ctx.fillRect(px, py, TILE, TILE);
          if ((x + y) % 4 === 0) {
            ctx.fillStyle = 'rgba(168, 85, 247, 0.20)';
            ctx.fillRect(px + TILE / 2 - 1, py + 3, 2, TILE - 6);
          }
          break;
        case 'sidewalk':
          ctx.fillStyle = '#1a1730';
          ctx.fillRect(px, py, TILE, TILE);
          ctx.strokeStyle = 'rgba(255,255,255,0.05)';
          ctx.strokeRect(px + 0.5, py + 0.5, TILE - 1, TILE - 1);
          break;
        case 'plaza':
          ctx.fillStyle = '#1c1638';
          ctx.fillRect(px, py, TILE, TILE);
          break;
        case 'building': {
          ctx.fillStyle = '#0f0d20';
          ctx.fillRect(px, py, TILE, TILE);
          ctx.fillStyle = 'rgba(34, 211, 238, 0.4)';
          ctx.fillRect(px + 2, py + 2, 3, 3);
          ctx.fillRect(px + 7, py + 2, 3, 3);
          ctx.fillRect(px + 2, py + 7, 3, 3);
          ctx.fillRect(px + 7, py + 7, 3, 3);
          break;
        }
        case 'tree':
          ctx.fillStyle = '#0d1c1a';
          ctx.fillRect(px, py, TILE, TILE);
          ctx.fillStyle = '#22c55e';
          ctx.fillRect(px + 2, py + 2, 8, 6);
          ctx.fillStyle = '#15803d';
          ctx.fillRect(px + 5, py + 8, 2, 3);
          break;
        default:
          ctx.fillStyle = '#0d1c1a';
          ctx.fillRect(px, py, TILE, TILE);
      }
    };

    // Layout statis (peta kecil)
    const map = Array.from({ length: ROWS }, () => Array(COLS).fill('grass'));
    // Jalan horizontal
    [6, 14, 22].forEach((y) => {
      for (let x = 0; x < COLS; x++) map[y][x] = 'road';
      if (y > 0) for (let x = 0; x < COLS; x++) map[y - 1][x] = 'sidewalk';
      if (y < ROWS - 1) for (let x = 0; x < COLS; x++) map[y + 1][x] = 'sidewalk';
    });
    // Jalan vertikal
    [10, 22, 32].forEach((x) => {
      for (let y = 0; y < ROWS; y++) map[y][x] = 'road';
      if (x > 0) for (let y = 0; y < ROWS; y++) map[y][x - 1] = 'sidewalk';
      if (x < COLS - 1) for (let y = 0; y < ROWS; y++) map[y][x + 1] = 'sidewalk';
    });
    // Plaza
    for (let y = 9; y < 13; y++) {
      for (let x = 17; x < 21; x++) map[y][x] = 'plaza';
    }
    // Bangunan
    const buildings = [
      [3, 2, 4, 3], [13, 2, 4, 3], [25, 2, 4, 3], [34, 2, 4, 3],
      [3, 9, 4, 4], [25, 9, 4, 4], [34, 9, 4, 4],
      [3, 17, 4, 3], [13, 17, 4, 3], [25, 17, 4, 3], [34, 17, 4, 3],
      [3, 24, 4, 3], [13, 24, 4, 3], [25, 24, 4, 3],
    ];
    for (const [bx, by, bw, bh] of buildings) {
      for (let y = by; y < by + bh; y++)
        for (let x = bx; x < bx + bw; x++)
          if (map[y] && map[y][x] === 'grass') map[y][x] = 'building';
    }
    // Pohon
    const trees = [[8, 4], [20, 5], [30, 4], [8, 12], [20, 12], [30, 12], [8, 20], [20, 20], [30, 20]];
    for (const [tx, ty] of trees) if (map[ty] && map[ty][tx] === 'grass') map[ty][tx] = 'tree';

    const draw = () => {
      const cssW = canvas.clientWidth;
      const cssH = canvas.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (canvas.width !== cssW * dpr || canvas.height !== cssH * dpr) {
        canvas.width = cssW * dpr;
        canvas.height = cssH * dpr;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = false;

      ctx.fillStyle = '#04030a';
      ctx.fillRect(0, 0, cssW, cssH);

      // Pas-kan map ke viewport
      const scaleX = cssW / (COLS * TILE);
      const scaleY = cssH / (ROWS * TILE);
      const scale = Math.min(scaleX, scaleY);
      const offX = (cssW - COLS * TILE * scale) / 2;
      const offY = (cssH - ROWS * TILE * scale) / 2;

      ctx.save();
      ctx.translate(offX, offY);
      ctx.scale(scale, scale);

      // Tiles
      for (let y = 0; y < ROWS; y++)
        for (let x = 0; x < COLS; x++) drawTile(x, y, map[y][x]);

      // NPC titik bergerak (placeholder animasi)
      for (const n of npcs) {
        n.x += n.vx;
        if (n.x < 1 || n.x > COLS - 2) n.vx *= -1;
        const px = n.x * TILE;
        const py = n.y * TILE;
        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(Math.round(px - 2), Math.round(py + 4), 4, 1);
        // Body
        ctx.fillStyle = n.color;
        ctx.fillRect(Math.round(px - 2), Math.round(py - 2), 4, 5);
        // Head
        ctx.fillStyle = '#f5deb3';
        ctx.fillRect(Math.round(px - 2), Math.round(py - 5), 4, 2);
      }

      // Vignette ringan
      const grad = ctx.createRadialGradient(
        COLS * TILE / 2, ROWS * TILE / 2, 80,
        COLS * TILE / 2, ROWS * TILE / 2, COLS * TILE
      );
      grad.addColorStop(0, 'rgba(0,0,0,0)');
      grad.addColorStop(1, 'rgba(0,0,0,0.55)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, COLS * TILE, ROWS * TILE);
      ctx.restore();

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className={`panel relative overflow-hidden ${className}`}>
      <header className="panel-header">
        <div className="flex items-center gap-2">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-neon-cyan animate-pulseSoft" />
          <span className="panel-title">Tampilan Kota Langsung</span>
        </div>
        <span className="font-mono text-[10px] text-slate-500">
          {mode === 'vertical' ? 'Vertical · 9:16' : 'Horizontal · 16:9'}
        </span>
      </header>
      <div className="absolute inset-0 top-[36px]">
        <canvas ref={canvasRef} className="w-full h-full pixel-edge" />
        <div className="pointer-events-none absolute inset-0 scanlines opacity-40" />
      </div>
    </div>
  );
}
