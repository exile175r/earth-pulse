import { config } from '../config/env.js';
import { getTimeBuckets } from '../utils/time.js';

/**
 * 지진 데이터 서비스 (USGS API 프록시)
 */
export const eqService = {
  /**
   * 최근 지진 데이터 조회
   */
  async getRecent({ from, to, bbox, minMagnitude, bucket }) {
    // USGS API는 최근 데이터만 제공 (all_hour, all_day, all_week, all_month)
    // 시간 범위에 따라 적절한 interval 선택
    const hoursDiff = (to - from) / (1000 * 60 * 60);
    let interval = 'all_hour';
    if (hoursDiff > 24) interval = 'all_day';
    if (hoursDiff > 168) interval = 'all_week';
    if (hoursDiff > 720) interval = 'all_month';
    
    const url = `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/${interval}.geojson`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': config.api.userAgent,
        },
        signal: AbortSignal.timeout(30000),
      });
      
      if (!response.ok) {
        throw new Error(`USGS API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      let features = data.features || [];
      
      // 시간 필터링
      features = features.filter(feature => {
        const time = new Date(feature.properties.time);
        return time >= from && time <= to;
      });
      
      // 최소 규모 필터링
      if (minMagnitude) {
        features = features.filter(feature => 
          feature.properties.mag >= minMagnitude
        );
      }
      
      // BBox 필터링
      if (bbox) {
        features = features.filter(feature => {
          const coords = feature.geometry.coordinates;
          const lat = coords[1];
          const lng = coords[0];
          return lat >= bbox.minLat && lat <= bbox.maxLat &&
                 lng >= bbox.minLng && lng <= bbox.maxLng;
        });
      }
      
      // 정렬 (최신순)
      features.sort((a, b) => b.properties.time - a.properties.time);
      
      // 제한
      features = features.slice(0, 1000);
      
      // 데이터 변환
      const events = features.map(feature => {
        const coords = feature.geometry.coordinates;
        return {
          occurred_at: new Date(feature.properties.time).toISOString(),
          magnitude: feature.properties.mag || 0,
          depth_km: coords[2] || null,
          lat: coords[1],
          lng: coords[0],
          place: feature.properties.place || null,
        };
      });
      
      // 버킷별 집계가 필요한 경우
      if (bucket && bucket !== 'none') {
        const buckets = getTimeBuckets(from, to, bucket);
        const bucketed = {};
        
        buckets.forEach(b => {
          bucketed[b.start.toISOString()] = {
            start: b.start.toISOString(),
            end: b.end.toISOString(),
            count: 0,
            maxMagnitude: 0,
            events: [],
          };
        });
        
        events.forEach(event => {
          const occurredAt = new Date(event.occurred_at);
          const bucketKey = buckets.find(b => 
            occurredAt >= b.start && occurredAt < b.end
          );
          
          if (bucketKey) {
            const key = bucketKey.start.toISOString();
            bucketed[key].count++;
            bucketed[key].maxMagnitude = Math.max(
              bucketed[key].maxMagnitude,
              event.magnitude
            );
            bucketed[key].events.push(event);
          }
        });
        
        return {
          buckets: Object.values(bucketed),
          total: events.length,
        };
      }
      
      return {
        events,
        total: events.length,
      };
    } catch (error) {
      console.error('Error fetching USGS data:', error);
      throw error;
    }
  },
};
