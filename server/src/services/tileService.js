import { aqService } from './aqService.js';
import { tileToBBox } from '../utils/geo.js';

/**
 * 타일 서비스 (히트맵 타일 생성)
 */
export const tileService = {
  /**
   * 대기질 히트맵 타일 생성
   * TODO: 실제 PNG 이미지 생성 구현 필요
   */
  async getHeatmapTile({ z, x, y, parameter, time }) {
    const bbox = tileToBBox(z, x, y);
    
    // 해당 타일 영역의 대기질 데이터 조회
    const from = new Date(time.getTime() - 60 * 60 * 1000); // 1시간 전
    const data = await aqService.getRecent({
      from,
      to: time,
      bbox,
      parameter,
      bucket: 'none',
    });
    
    // TODO: 데이터를 PNG 히트맵 이미지로 변환
    // 현재는 플레이스홀더
    // 실제 구현 시: canvas 또는 sharp 라이브러리 사용
    
    return null; // 플레이스홀더
  },
};

