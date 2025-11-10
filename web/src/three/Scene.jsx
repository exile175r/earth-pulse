import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import Globe from './Globe.jsx';
import Map2D from './Map2D.jsx';
import EarthquakeLayer from './EarthquakeLayer.jsx';
import AirQualityHeatmap from './AirQualityHeatmap.jsx';
import { useStore } from '../state/store.js';

export default function Scene() {
  const mapMode = useStore((state) => state.view.mapMode);
  
  return (
    <Canvas>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      
      {mapMode === '3d' ? (
        <>
          <Globe />
          <EarthquakeLayer />
          <AirQualityHeatmap />
        </>
      ) : (
        <Map2D />
      )}
      
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={2}
        maxDistance={10}
      />
    </Canvas>
  );
}

