import { useEffect, useRef } from 'react';
import { useStore } from '../state/store.js';
import WorldWindEarthquakeLayer from './WorldWindEarthquakeLayer.jsx';
import WorldWindAirQualityLayer from './WorldWindAirQualityLayer.jsx';

// WorldWind는 index.html에서 전역 스크립트로 로드됨
const getWorldWind = () => {
  if (typeof window !== 'undefined' && window.WorldWind) {
    return window.WorldWind;
  }
  return null;
};

export default function WorldWindScene() {
  const canvasRef = useRef(null);
  const wwdRef = useRef(null);
  const mapMode = useStore((state) => state.view.mapMode);
  const setView = useStore((state) => state.setView);
  const timeRange = useStore((state) => state.view.timeRange);
  const parameter = useStore((state) => state.view.param);

  useEffect(() => {
    if (!canvasRef.current) return;

    // WorldWind가 로드될 때까지 대기
    const initWorldWind = () => {
      const WorldWind = getWorldWind();
      
      if (!WorldWind) {
        // WorldWind가 아직 로드되지 않았으면 재시도
        setTimeout(initWorldWind, 100);
        return;
      }

      if (wwdRef.current) return; // 이미 초기화됨

      // WorldWind 이미지 경로 설정
      WorldWind.configuration.baseUrl = '/worldwind/';

      // WorldWindow 생성
      const wwd = new WorldWind.WorldWindow(canvasRef.current);
      wwdRef.current = wwd;

      // 기본 레이어 추가 (Blue Marble Next Generation)
      const bmngLayer = new WorldWind.BMNGLayer();
      wwd.addLayer(bmngLayer);

      // 좌표 표시 레이어 (선택사항)
      // const coordinatesLayer = new WorldWind.CoordinatesDisplayLayer(wwd);
      // wwd.addLayer(coordinatesLayer);

      // 나침반 레이어 (선택사항)
      // const compassLayer = new WorldWind.CompassLayer();
      // wwd.addLayer(compassLayer);

      // 지진 데이터 레이어 (Placemark를 직접 추가하는 방식으로 변경)
      const earthquakeLayer = new WorldWindEarthquakeLayer(wwd);
      earthquakeLayer.setWorldWind(WorldWind);
      wwd.earthquakeLayer = earthquakeLayer; // 참조 저장

      // 대기질 데이터 레이어 (Placemark를 직접 추가하는 방식으로 변경)
      const airQualityLayer = new WorldWindAirQualityLayer(wwd);
      airQualityLayer.setWorldWind(WorldWind);
      wwd.airQualityLayer = airQualityLayer; // 참조 저장

      // 클릭 이벤트 처리
      const clickHandler = (event) => {
        const x = event.clientX - canvasRef.current.getBoundingClientRect().left;
        const y = event.clientY - canvasRef.current.getBoundingClientRect().top;
        const pickList = wwd.pick(new WorldWind.PickedObjectList(), x, y);
        
        if (pickList.objects.length > 0) {
          const pickedObject = pickList.objects[0];
          if (pickedObject.userObject && pickedObject.userObject.position) {
            const position = pickedObject.userObject.position;
            const lat = position.latitude;
            const lng = position.longitude;
            
            // 3D/2D 모드 전환
            if (mapMode === '3d') {
              setView({ mapMode: '2d' });
            } else {
              setView({ mapMode: '3d' });
            }
          }
        }
      };

      canvasRef.current.addEventListener('click', clickHandler);

      // 초기 카메라 위치 설정
      wwd.navigator.range = 40000000;
      wwd.redraw();
    };

    initWorldWind();

    // 리사이즈 핸들러
    const resizeHandler = () => {
      if (wwdRef.current && canvasRef.current) {
        wwdRef.current.resize();
      }
    };
    window.addEventListener('resize', resizeHandler);

    return () => {
      if (canvasRef.current) {
        canvasRef.current.removeEventListener('click', () => {});
      }
      window.removeEventListener('resize', resizeHandler);
    };
  }, []);

  // 모드 변경 시 뷰 업데이트
  useEffect(() => {
    const WorldWind = getWorldWind();
    if (!wwdRef.current || !WorldWind) return;

    if (mapMode === '2d') {
      // 2D 모드: 직교 투영 (WorldWind는 기본적으로 3D이므로, range를 크게 설정)
      wwdRef.current.navigator.range = 100000000;
      wwdRef.current.navigator.heading = 0;
      wwdRef.current.navigator.tilt = 0;
    } else {
      // 3D 모드
      wwdRef.current.navigator.range = 40000000;
    }
    wwdRef.current.redraw();
  }, [mapMode]);

  // 데이터 업데이트
  useEffect(() => {
    if (!wwdRef.current) return;
    
    const layers = wwdRef.current.layers;
    for (let i = 0; i < layers.length; i++) {
      const layer = layers[i];
      if (layer instanceof WorldWindEarthquakeLayer) {
        layer.setTimeRange(timeRange);
      } else if (layer instanceof WorldWindAirQualityLayer) {
        layer.setTimeRange(timeRange);
        layer.setParameter(parameter);
      }
    }
  }, [timeRange, parameter]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
      }}
    />
  );
}

