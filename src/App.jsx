// Top-level layout for NeoLife. Composes the dashboard panels around the
// central canvas viewport and shares simulation state via a single hook.
import { useCallback, useRef } from 'react';
import { useSimulation } from './hooks/useSimulation.js';
import { createCamera, focusOnNpc } from './render/camera.js';
import TopBar from './ui/TopBar.jsx';
import LeftSidebar from './ui/LeftSidebar.jsx';
import RightSidebar from './ui/RightSidebar.jsx';
import CityViewport from './ui/CityViewport.jsx';
import BottomPanel from './ui/BottomPanel.jsx';

export default function App() {
  const sim = useSimulation({ seed: 1337 });
  const cameraRef = useRef(createCamera());

  const handleFocusNpc = useCallback(
    (npcId) => {
      sim.setSelectedNpcId(npcId);
      if (cameraRef.current) focusOnNpc(cameraRef.current, npcId);
    },
    [sim]
  );

  const handleClearFollow = useCallback(() => {
    sim.setSelectedNpcId(null);
    if (cameraRef.current) {
      cameraRef.current.mode = 'orbit';
      cameraRef.current.targetNpcId = null;
    }
  }, [sim]);

  return (
    <div className="h-full w-full flex flex-col overflow-hidden grid-bg">
      <TopBar snapshot={sim.snapshot} world={sim.world} />
      <div className="flex-1 flex min-h-0">
        <LeftSidebar
          snapshot={sim.snapshot}
          setSpeedIndex={sim.setSpeedIndex}
          togglePause={sim.togglePause}
        />
        <main className="flex-1 flex flex-col min-w-0">
          <CityViewport
            world={sim.world}
            snapshot={sim.snapshot}
            selectedNpcId={sim.selectedNpcId}
            onClearFollow={handleClearFollow}
            cameraRef={cameraRef}
          />
          <BottomPanel
            snapshot={sim.snapshot}
            selectedNpcId={sim.selectedNpcId}
            onSelect={handleFocusNpc}
          />
        </main>
        <RightSidebar
          snapshot={sim.snapshot}
          world={sim.world}
          onFocusNpc={handleFocusNpc}
          selectedNpcId={sim.selectedNpcId}
        />
      </div>
    </div>
  );
}
