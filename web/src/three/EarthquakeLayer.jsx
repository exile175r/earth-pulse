import { useMemo } from 'react';
import { Points, PointMaterial } from '@react-three/drei';
import { latLngToXYZ } from './helpers.js';
import { useStore } from '../state/store.js';
import { get } from '../api/client.js';
import { endpoints } from '../api/endpoints.js';
import { useEffect, useState } from 'react';

export default function EarthquakeLayer() {
  const timeRange = useStore((state) => state.view.timeRange);
  const [eqData, setEqData] = useState([]);
  
  useEffect(() => {
    // timeRange가 없으면 기본값 사용
    if (!timeRange || !timeRange.from || !timeRange.to) {
      return;
    }

    async function fetchData() {
      try {
        const data = await get(endpoints.eq.recent({
          from: timeRange.from,
          to: timeRange.to,
          bucket: 'none',
        }));
        setEqData(data.events || []);
      } catch (error) {
        console.error('Error fetching earthquake data:', error);
      }
    }
    
    fetchData();
  }, [timeRange]);
  
  const points = useMemo(() => {
    return eqData.map((eq) => {
      const [x, y, z] = latLngToXYZ(eq.lat, eq.lng, 1.01); // 지구 표면보다 약간 위
      return [x, y, z];
    }).flat();
  }, [eqData]);
  
  const colors = useMemo(() => {
    return eqData.map((eq) => {
      // 규모에 따라 색상 결정 (0-10)
      const magnitude = eq.magnitude || 0;
      const intensity = Math.min(magnitude / 10, 1);
      return [intensity, 1 - intensity * 0.5, 0, 1];
    }).flat();
  }, [eqData]);
  
  if (points.length === 0) return null;
  
  return (
    <Points positions={points} colors={colors}>
      <PointMaterial
        size={0.02}
        sizeAttenuation={true}
        vertexColors={true}
        transparent
        opacity={0.8}
      />
    </Points>
  );
}

