import { config } from '../config/env.js';
import { getTimeBuckets } from '../utils/time.js';

/**
 * 대기질 데이터 서비스 (OpenAQ API 프록시)
 */
export const aqService = {
  /**
   * 최근 대기질 데이터 조회
   */
  async getRecent({ from, to, bbox, parameter, bucket }) {
    const url = 'https://api.openaq.org/v2/measurements';
    
    const params = new URLSearchParams({
      date_from: from.toISOString(),
      date_to: to.toISOString(),
      parameter,
      limit: '10000',
      page: '1',
    });
    
    // BBox 필터링 (OpenAQ API 형식)
    if (bbox) {
      params.append('coordinates', `${bbox.minLng},${bbox.minLat}`);
      // OpenAQ는 단일 좌표만 지원하므로, 클라이언트 측에서 필터링
    }
    
    try {
      // AbortController를 사용하여 타임아웃 구현 (Vercel 호환성)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);
      
      const response = await fetch(`${url}?${params}`, {
        headers: {
          'User-Agent': config.api.userAgent,
        },
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('OpenAQ rate limit exceeded. Please wait before retrying.');
        }
        throw new Error(`OpenAQ API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      let results = data.results || [];
      
      // BBox 필터링 (서버 측에서)
      if (bbox) {
        results = results.filter(result => {
          const lat = result.coordinates.latitude;
          const lng = result.coordinates.longitude;
          return lat >= bbox.minLat && lat <= bbox.maxLat &&
                 lng >= bbox.minLng && lng <= bbox.maxLng;
        });
      }
      
      // 정렬 (최신순)
      results.sort((a, b) => new Date(b.date.utc) - new Date(a.date.utc));
      
      // 제한
      results = results.slice(0, 1000);
      
      // 데이터 변환
      const measurements = results.map(result => ({
        measured_at: new Date(result.date.utc).toISOString(),
        lat: result.coordinates.latitude,
        lng: result.coordinates.longitude,
        country: result.country || null,
        city: result.city || null,
        location: result.location || null,
        parameter: result.parameter,
        value: result.value,
        unit: result.unit,
      }));
      
      // 버킷별 집계
      if (bucket && bucket !== 'none') {
        const buckets = getTimeBuckets(from, to, bucket);
        const bucketed = {};
        
        buckets.forEach(b => {
          bucketed[b.start.toISOString()] = {
            start: b.start.toISOString(),
            end: b.end.toISOString(),
            count: 0,
            avg: 0,
            max: 0,
            min: Infinity,
            measurements: [],
          };
        });
        
        measurements.forEach(measurement => {
          const measuredAt = new Date(measurement.measured_at);
          const bucketKey = buckets.find(b => 
            measuredAt >= b.start && measuredAt < b.end
          );
          
          if (bucketKey) {
            const key = bucketKey.start.toISOString();
            const value = measurement.value;
            bucketed[key].count++;
            bucketed[key].max = Math.max(bucketed[key].max, value);
            bucketed[key].min = Math.min(bucketed[key].min, value);
            bucketed[key].measurements.push(measurement);
          }
        });
        
        // 평균 계산
        Object.values(bucketed).forEach(bucket => {
          if (bucket.count > 0) {
            const sum = bucket.measurements.reduce((acc, m) => acc + m.value, 0);
            bucket.avg = sum / bucket.count;
          }
          if (bucket.min === Infinity) bucket.min = 0;
        });
        
        return {
          buckets: Object.values(bucketed),
          total: measurements.length,
        };
      }
      
      return {
        measurements,
        total: measurements.length,
      };
    } catch (error) {
      console.error('Error fetching OpenAQ data:', error);
      if (error.name === 'AbortError') {
        throw new Error('Request timeout: OpenAQ API did not respond within 30 seconds');
      }
      throw new Error(`Failed to fetch OpenAQ data: ${error.message}`);
    }
  },
  
  /**
   * 상위 대기질 데이터 조회
   */
  async getTop({ from, to, metric, group, limit, country }) {
    // getRecent로 데이터를 가져온 후 집계
    const data = await this.getRecent({
      from,
      to,
      bbox: null,
      parameter: metric,
      bucket: 'none',
    });
    
    // 그룹별 집계
    const grouped = {};
    
    data.measurements.forEach(m => {
      // 국가 필터링
      if (country && m.country !== country) return;
      
      const key = group === 'city' 
        ? `${m.city || 'Unknown'},${m.country || 'Unknown'}`
        : m.country || 'Unknown';
      
      if (!grouped[key]) {
        grouped[key] = {
          values: [],
          country: m.country,
          city: group === 'city' ? m.city : null,
        };
      }
      
      grouped[key].values.push(m.value);
    });
    
    // 평균, 최대값 계산 및 정렬
    const items = Object.entries(grouped)
      .map(([key, data]) => ({
        [group]: group === 'city' ? data.city : key,
        country: data.country,
        avg_value: data.values.reduce((a, b) => a + b, 0) / data.values.length,
        max_value: Math.max(...data.values),
        count: data.values.length,
      }))
      .sort((a, b) => b.avg_value - a.avg_value)
      .slice(0, limit);
    
    return { items };
  },
};
