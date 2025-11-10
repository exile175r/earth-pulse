/**
 * Three.js 헬퍼 함수
 */

/**
 * 위도/경도를 3D 좌표로 변환 (구면 좌표)
 */
export function latLngToXYZ(lat, lng, radius = 1) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  
  return [x, y, z];
}

/**
 * 3D 좌표를 위도/경도로 변환
 */
export function xyzToLatLng(x, y, z) {
  const radius = Math.sqrt(x * x + y * y + z * z);
  const lat = 90 - (Math.acos(y / radius) * 180) / Math.PI;
  const lng = ((Math.atan2(z, -x) * 180) / Math.PI + 180) % 360 - 180;
  
  return { lat, lng };
}

/**
 * 거리 계산 (Haversine, km)
 */
export function distance(lat1, lng1, lat2, lng2) {
  const R = 6371;
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

