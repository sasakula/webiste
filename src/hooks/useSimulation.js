// Hook useSimulation — adapter React untuk module-singleton di simulation/engine.js.
//
// Pakai `useSyncExternalStore` (idiomatic React 18) supaya semua component
// mendengar update yang sama tanpa duplikasi state. Halaman /owner, /live,
// dan /live-vertical kalau pakai hook ini akan membaca world yang sama.
import { useSyncExternalStore } from 'react';
import {
  subscribe,
  getSnapshot,
  pause,
  play,
  togglePause,
  setSpeed,
  reset,
} from '../simulation/engine.js';

export function useSimulation() {
  // Subscribe ke engine; component re-render setiap publish().
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  return {
    snapshot,

    // Aksi kontrol simulasi — semua langsung memanggil engine singleton.
    pause,
    play,
    togglePause,
    setSpeed,
    reset,
  };
}
