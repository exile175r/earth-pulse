import { useRef } from 'react';
import { Sphere } from '@react-three/drei';
import { xyzToLatLng } from './helpers.js';
import { useStore } from '../state/store.js';

export default function Globe() {
  const meshRef = useRef();
  const setSelection = useStore((state) => state.setSelection);
  const setView = useStore((state) => state.setView);
  
  // 지구 텍스처 (기본 색상으로 시작, 나중에 텍스처 로드 가능)
  // TODO: 실제 텍스처 URL 설정
  // const texture = useTexture('https://eoimages.gsfc.nasa.gov/images/imagerecords/73000/73909/world.topo.bathy.200412.3x5400x2700.jpg');
  
  const handleClick = (event) => {
    event.stopPropagation();
    
    // Raycasting으로 클릭 위치 계산
    const point = event.point;
    const { lat, lng } = xyzToLatLng(point.x, point.y, point.z);
    
    // 2D 지도 모드로 전환
    setView({ mapMode: '2d' });
    
    // TODO: 국가/대륙 매칭 로직 추가
    console.log('Clicked at:', lat, lng);
  };
  
  return (
    <Sphere
      ref={meshRef}
      args={[1, 64, 64]}
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'default';
      }}
    >
      <meshStandardMaterial 
        color="#4a90e2"
        roughness={0.8}
        metalness={0.2}
      />
    </Sphere>
  );
}
