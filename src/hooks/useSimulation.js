// Hook simulasi (placeholder). Akan menjalankan engine + return snapshot.
import { useState } from 'react';

export function useSimulation() {
  const [snapshot] = useState({
    population: 0,
    minutes: 6 * 60 + 30,
    events: [],
    drama: [],
    paused: false,
    speedIndex: 1,
  });
  return { snapshot };
}
