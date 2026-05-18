// Lightweight 4-direction A* pathfinder over the city grid.
// Designed for small frequent calls — uses a binary-heap-ish priority queue.
import { isWalkable } from './city.js';

class MinHeap {
  constructor() { this.data = []; }
  push(node) {
    this.data.push(node);
    this._bubbleUp(this.data.length - 1);
  }
  pop() {
    if (!this.data.length) return null;
    const top = this.data[0];
    const last = this.data.pop();
    if (this.data.length) {
      this.data[0] = last;
      this._sinkDown(0);
    }
    return top;
  }
  get size() { return this.data.length; }
  _bubbleUp(i) {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.data[p].f <= this.data[i].f) break;
      [this.data[p], this.data[i]] = [this.data[i], this.data[p]];
      i = p;
    }
  }
  _sinkDown(i) {
    const n = this.data.length;
    while (true) {
      const l = 2 * i + 1;
      const r = 2 * i + 2;
      let best = i;
      if (l < n && this.data[l].f < this.data[best].f) best = l;
      if (r < n && this.data[r].f < this.data[best].f) best = r;
      if (best === i) break;
      [this.data[best], this.data[i]] = [this.data[i], this.data[best]];
      i = best;
    }
  }
}

const manhattan = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

// Returns an array of {x, y} or [] if unreachable.
export function findPath(city, from, to, maxNodes = 800) {
  const sx = Math.round(from.x);
  const sy = Math.round(from.y);
  const tx = Math.round(to.x);
  const ty = Math.round(to.y);

  if (sx === tx && sy === ty) return [];

  const open = new MinHeap();
  const cameFrom = new Map();
  const gScore = new Map();

  const key = (x, y) => `${x},${y}`;
  const startKey = key(sx, sy);
  gScore.set(startKey, 0);
  open.push({ x: sx, y: sy, f: manhattan({ x: sx, y: sy }, { x: tx, y: ty }) });

  let visited = 0;
  const dirs = [
    [1, 0], [-1, 0], [0, 1], [0, -1],
  ];

  while (open.size && visited < maxNodes) {
    const cur = open.pop();
    visited++;
    const ck = key(cur.x, cur.y);

    if (cur.x === tx && cur.y === ty) {
      // Reconstruct
      const path = [];
      let k = ck;
      while (cameFrom.has(k)) {
        const [px, py] = k.split(',').map(Number);
        path.push({ x: px, y: py });
        k = cameFrom.get(k);
      }
      return path.reverse();
    }

    const baseG = gScore.get(ck) ?? Infinity;
    for (const [dx, dy] of dirs) {
      const nx = cur.x + dx;
      const ny = cur.y + dy;
      // Allow walking onto destination even if it's a building door.
      const isTarget = nx === tx && ny === ty;
      if (!isTarget && !isWalkable(city, nx, ny)) continue;
      const nk = key(nx, ny);
      const tentative = baseG + 1;
      if (tentative < (gScore.get(nk) ?? Infinity)) {
        cameFrom.set(nk, ck);
        gScore.set(nk, tentative);
        const f = tentative + manhattan({ x: nx, y: ny }, { x: tx, y: ty });
        open.push({ x: nx, y: ny, f });
      }
    }
  }
  return [];
}
