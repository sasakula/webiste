// Sistem kamera (state ringan).
// State kamera disimpan terpisah dari world supaya tidak ikut "ter-snapshot"
// di setiap tick (kamera berubah lebih sering, lewat RAF).
export function createCamera() {
  return { x: 0, y: 0, zoom: 1, mode: 'orbit', targetNpcId: null };
}

export function focusOnNpc(camera, npcId) {
  camera.mode = 'follow';
  camera.targetNpcId = npcId;
}

export function resetCamera(camera) {
  camera.mode = 'orbit';
  camera.targetNpcId = null;
}
