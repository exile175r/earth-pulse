import { useRef } from 'react';
import { useStore } from '../state/store.js';

/**
 * 2D 세계 지도 컴포넌트
 * TODO: WebGL 기반 렌더링 구현
 */
export default function Map2D() {
  const setView = useStore((state) => state.setView);
  
  const handleClick = () => {
    // 3D 모드로 전환
    setView({ mapMode: '3d' });
  };
  
  return (
    <mesh onClick={handleClick}>
      <planeGeometry args={[10, 5]} />
      <meshBasicMaterial color="#1a1a2e" />
    </mesh>
  );
}

