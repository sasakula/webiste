// React hook that owns the simulation lifecycle. Spins up the world once,
// runs a fixed-timestep loop using requestAnimationFrame, and exposes a
// stable snapshot via React state at a throttled cadence so the UI stays smooth.
import { useEffect, useRef, useState, useCallback } from 'react';
import {
  createWorld,
  step as stepWorld,
  getSpeed,
  setSpeedIndex as setSpeedIndexEngine,
  togglePause as togglePauseEngine,
  TICK_MS,
} from '../simulation/engine.js';
import { focusOnNpc as cameraFocusNpc } from '../render/camera.js';

const UI_REFRESH_HZ = 6; // UI snapshots per second

export function useSimulation({ seed = 1337 } = {}) {
  // The world is mutable. We keep it in a ref so it survives re-renders.
  const worldRef = useRef(null);
  if (!worldRef.current) worldRef.current = createWorld({ seed });

  // UI snapshot — derived from world at limited frequency.
  const [snapshot, setSnapshot] = useState(() => buildSnapshot(worldRef.current));
  const [selectedNpcId, setSelectedNpcId] = useState(null);

  // Track world step accumulator
  const acc = useRef({ last: performance.now(), unspent: 0, lastUiAt: 0 });

  useEffect(() => {
    let raf = 0;
    const loop = (now) => {
      const world = worldRef.current;
      const dt = now - acc.current.last;
      acc.current.last = now;
      acc.current.unspent += dt;

      const speed = getSpeed(world);
      if (speed > 0) {
        const stepMs = TICK_MS / speed;
        // Run in fixed steps; cap to avoid death spiral.
        let stepsThisFrame = 0;
        while (acc.current.unspent >= stepMs && stepsThisFrame < 30) {
          stepWorld(world, 1);
          acc.current.unspent -= stepMs;
          stepsThisFrame++;
        }
      } else {
        // Paused — just drain the accumulator
        acc.current.unspent = 0;
      }

      // Throttled UI snapshot
      if (now - acc.current.lastUiAt > 1000 / UI_REFRESH_HZ) {
        acc.current.lastUiAt = now;
        setSnapshot(buildSnapshot(world));
      }

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const setSpeedIndex = useCallback((idx) => {
    setSpeedIndexEngine(worldRef.current, idx);
    setSnapshot(buildSnapshot(worldRef.current));
  }, []);

  const togglePause = useCallback(() => {
    togglePauseEngine(worldRef.current);
    setSnapshot(buildSnapshot(worldRef.current));
  }, []);

  const focusNpc = useCallback((npcId, camera) => {
    setSelectedNpcId(npcId);
    if (camera) cameraFocusNpc(camera, npcId);
  }, []);

  return {
    world: worldRef.current,
    snapshot,
    selectedNpcId,
    setSelectedNpcId,
    focusNpc,
    setSpeedIndex,
    togglePause,
  };
}

function buildSnapshot(world) {
  // Lightweight snapshot — only the data the UI actually reads.
  return {
    tick: world.state.tick,
    minutes: world.state.minutes,
    speedIndex: world.state.speedIndex,
    paused: world.state.paused,
    weather: world.weather.current,
    weatherIntensity: world.weather.intensity,
    economy: { ...world.economy },
    population: world.npcs.length,
    activeCrime: world.state.activeCrime,
    events: world.eventLog.items.slice(0, 60),
    npcs: world.npcs.map((n) => ({
      id: n.id,
      name: n.name,
      color: n.color,
      occupation: n.occupation,
      personality: n.personality.label,
      mood: n.mood,
      hunger: n.hunger,
      energy: n.energy,
      social: n.social,
      money: n.money,
      activity: n.activity,
      partnerId: n.partnerId,
      home: n.home?.label,
      workplace: n.workplace?.label,
      relations: n.relations,
      memory: n.memory.slice(0, 3),
    })),
  };
}
