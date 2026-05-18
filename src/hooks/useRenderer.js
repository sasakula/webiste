// Bridges the React canvas element with the imperative renderer.
// Maintains a baked city texture and runs the camera + particles + draw loop.
// Accepts an external camera ref so other UI handlers can manipulate the camera
// (e.g. focusing on a clicked NPC).
import { useEffect, useRef } from 'react';
import { createCamera, updateCamera } from '../render/camera.js';
import { createParticles, updateParticles } from '../render/particles.js';
import { bakeCity, renderFrame } from '../render/renderer.js';

export function useRenderer(canvasRef, world, externalCameraRef) {
  const localCameraRef = useRef(null);
  const cameraRef = externalCameraRef || localCameraRef;
  const particlesRef = useRef(null);
  const bakedRef = useRef(null);

  if (!cameraRef.current) cameraRef.current = createCamera();
  if (!particlesRef.current) particlesRef.current = createParticles();

  useEffect(() => {
    if (!canvasRef.current || !world) return;
    if (!bakedRef.current) bakedRef.current = bakeCity(world.city);

    const ctx = canvasRef.current.getContext('2d');
    let raf = 0;
    const loop = () => {
      updateCamera(cameraRef.current, world);
      updateParticles(particlesRef.current, world);
      renderFrame(ctx, world, cameraRef.current, particlesRef.current, bakedRef.current);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [canvasRef, world, cameraRef]);

  return { camera: cameraRef.current };
}
