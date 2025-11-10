/**
 * 지리 공간 유틸리티 함수
 */

/**
 * 바운딩 박스 파싱 (minLng,minLat,maxLng,maxLat)
 */
export function parseBBox(bboxStr) {
  if (!bboxStr) return null;
  
  const parts = bboxStr.split(',').map(parseFloat);
  if (parts.length !== 4) return null;
  
  const [minLng, minLat, maxLng, maxLat] = parts;
  
  // 유효성 검사
  if (
    minLng < -180 || maxLng > 180 || minLng >= maxLng ||
    minLat < -90 || maxLat > 90 || minLat >= maxLat
  ) {
    return null;
  }
  
  return { minLng, minLat, maxLng, maxLat };
}

/**
 * 좌표가 바운딩 박스 내부에 있는지 확인
 */
export function isInBBox(lat, lng, bbox) {
  if (!bbox) return true;
  return (
    lat >= bbox.minLat &&
    lat <= bbox.maxLat &&
    lng >= bbox.minLng &&
    lng <= bbox.maxLng
  );
}

/**
 * 타일 좌표를 바운딩 박스로 변환 (Web Mercator)
 */
export function tileToBBox(z, x, y) {
  const n = Math.pow(2, z);
  const minLng = (x / n) * 360 - 180;
  const maxLng = ((x + 1) / n) * 360 - 180;
  const latRad = Math.atan(Math.sinh(Math.PI * (1 - 2 * (y + 1) / n)));
  const maxLat = (latRad * 180) / Math.PI;
  const latRad2 = Math.atan(Math.sinh(Math.PI * (1 - 2 * y / n)));
  const minLat = (latRad2 * 180) / Math.PI;
  
  return { minLng, minLat, maxLng, maxLat };
}

/**
 * 좌표를 타일 좌표로 변환
 */
export function latLngToTile(lat, lng, z) {
  const n = Math.pow(2, z);
  const x = Math.floor((lng + 180) / 360 * n);
  const latRad = (lat * Math.PI) / 180;
  const y = Math.floor((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2 * n);
  return { x, y, z };
}

/**
 * 거리 계산 (Haversine 공식, km)
 */
export function distance(lat1, lng1, lat2, lng2) {
  const R = 6371; // 지구 반경 (km)
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

