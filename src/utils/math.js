// Helper matematika kecil.
export const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
export const lerp = (a, b, t) => a + (b - a) * t;
export const distance = (ax, ay, bx, by) => Math.hypot(bx - ax, by - ay);
