// Cinematic camera. Auto-pans between points of interest, focuses on active
// events, and drifts gently when idle. The camera uses tile-space coordinates.
import { MAP_WIDTH, MAP_HEIGHT } from '../simulation/constants.js';
import { rand } from '../simulation/random.js';

export function createCamera() {
  return {
    // World position (tile coords) the camera is pointed at.
    x: MAP_WIDTH / 2,
    y: MAP_HEIGHT / 2,
    // Smoothed values that we actually render with.
    sx: MAP_WIDTH / 2,
    sy: MAP_HEIGHT / 2,
    zoom: 1.6,
    sZoom: 1.6,
    // Cinematic state machine.
    mode: 'orbit',           // 'orbit' | 'event' | 'follow'
    nextSwitchTick: 0,
    targetNpcId: null,
    eventLocation: null,
    eventExpiresTick: 0,
    shake: 0,
  };
}

export function updateCamera(camera, world) {
  const { state } = world;

  // Decide what to focus on.
  if (world.state.activeCrime) {
    camera.mode = 'event';
    camera.eventLocation = { ...world.state.activeCrime.location };
    camera.eventExpiresTick = state.tick + 240;
  } else if (camera.mode === 'event' && state.tick > camera.eventExpiresTick) {
    camera.mode = 'orbit';
    camera.nextSwitchTick = state.tick + 60;
  }

  if (state.tick >= camera.nextSwitchTick && camera.mode === 'orbit') {
    pickNextOrbitTarget(camera, world);
    camera.nextSwitchTick = state.tick + 220 + Math.floor(rand() * 200);
  }

  // Resolve target position
  let tx = camera.x;
  let ty = camera.y;
  let tz = camera.sZoom;

  if (camera.mode === 'event' && camera.eventLocation) {
    tx = camera.eventLocation.x;
    ty = camera.eventLocation.y;
    tz = 2.4;
  } else if (camera.mode === 'follow' && camera.targetNpcId) {
    const npc = world.npcs.find((n) => n.id === camera.targetNpcId);
    if (npc) {
      tx = npc.x;
      ty = npc.y;
      tz = 2.6;
    } else {
      camera.mode = 'orbit';
    }
  } else {
    // Orbit drift around chosen anchor (camera.x/y)
    tx = camera.x + Math.sin(state.tick / 220) * 1.5;
    ty = camera.y + Math.cos(state.tick / 260) * 1.0;
    tz = 1.6;
  }

  camera.x = tx;
  camera.y = ty;

  // Smooth toward target
  camera.sx += (camera.x - camera.sx) * 0.05;
  camera.sy += (camera.y - camera.sy) * 0.05;
  camera.sZoom += (tz - camera.sZoom) * 0.03;

  // Decay shake
  camera.shake *= 0.92;
}

function pickNextOrbitTarget(camera, world) {
  // Prefer a building that has activity nearby.
  const candidates = world.city.buildings.filter((b) =>
    b.type !== 'apartment' || rand() < 0.3
  );
  if (!candidates.length) return;
  const target = candidates[Math.floor(rand() * candidates.length)];
  camera.x = target.centerX;
  camera.y = target.centerY;
}

export function focusOnNpc(camera, npcId) {
  camera.mode = 'follow';
  camera.targetNpcId = npcId;
}

export function nudgeShake(camera, amount = 0.6) {
  camera.shake = Math.min(2, camera.shake + amount);
}
