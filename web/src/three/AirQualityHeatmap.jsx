import { useMemo } from 'react';
import { useStore } from '../state/store.js';
import { get } from '../api/client.js';
import { endpoints } from '../api/endpoints.js';
import { useEffect, useState } from 'react';

export default function AirQualityHeatmap() {
  const timeRange = useStore((state) => state.view.timeRange);
  const parameter = useStore((state) => state.view.param);
  const [aqData, setAqData] = useState([]);
  
  useEffect(() => {
    // timeRange가 없으면 기본값 사용
    if (!timeRange || !timeRange.from || !timeRange.to) {
      return;
    }

    async function fetchData() {
      try {
        const data = await get(endpoints.aq.recent({
          from: timeRange.from,
          to: timeRange.to,
          param: parameter,
          bucket: '1h',
        }));
        setAqData(data.buckets || []);
      } catch (error) {
        console.error('Error fetching air quality data:', error);
      }
    }
    
    fetchData();
  }, [timeRange, parameter]);
  
  // TODO: 히트맵 렌더링 구현
  // 현재는 플레이스홀더
  
  return null;
}

