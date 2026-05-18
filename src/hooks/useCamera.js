// Hook kamera (placeholder).
import { useRef } from 'react';
export function useCamera() {
  const camera = useRef({ x: 0, y: 0, zoom: 1, mode: 'orbit' });
  return camera;
}
