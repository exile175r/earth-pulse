import pool from '../db/client.js';
import { getTimeBuckets } from '../utils/time.js';

/**
 * 대기질 데이터 서비스
 */
export const aqService = {
  /**
   * 최근 대기질 데이터 조회
   */
  async getRecent({ from, to, bbox, parameter, bucket }) {
    let query = `
      SELECT 
        measured_at,
        lat,
        lng,
        country,
        city,
        location,
        parameter,
        value,
        unit
      FROM air_quality
      WHERE measured_at >= ? AND measured_at <= ? AND parameter = ?
    `;
    
    const params = [
      from.toISOString().slice(0, 19).replace('T', ' '),
      to.toISOString().slice(0, 19).replace('T', ' '),
      parameter,
    ];
    
    if (bbox) {
      query += ' AND lat >= ? AND lat <= ? AND lng >= ? AND lng <= ?';
      params.push(bbox.minLat, bbox.maxLat, bbox.minLng, bbox.maxLng);
    }
    
    query += ' ORDER BY measured_at DESC, id DESC LIMIT 1000';
    
    const [rows] = await pool.execute(query, params);
    
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
      
      rows.forEach(row => {
        const measuredAt = new Date(row.measured_at);
        const bucketKey = buckets.find(b => 
          measuredAt >= b.start && measuredAt < b.end
        );
        
        if (bucketKey) {
          const key = bucketKey.start.toISOString();
          const value = parseFloat(row.value);
          bucketed[key].count++;
          bucketed[key].max = Math.max(bucketed[key].max, value);
          bucketed[key].min = Math.min(bucketed[key].min, value);
          bucketed[key].measurements.push({
            measured_at: row.measured_at,
            lat: parseFloat(row.lat),
            lng: parseFloat(row.lng),
            country: row.country,
            city: row.city,
            location: row.location,
            value,
            unit: row.unit,
          });
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
        total: rows.length,
      };
    }
    
    return {
      measurements: rows.map(row => ({
        measured_at: row.measured_at,
        lat: parseFloat(row.lat),
        lng: parseFloat(row.lng),
        country: row.country,
        city: row.city,
        location: row.location,
        parameter: row.parameter,
        value: parseFloat(row.value),
        unit: row.unit,
      })),
      total: rows.length,
    };
  },
  
  /**
   * 상위 대기질 데이터 조회
   */
  async getTop({ from, to, metric, group, limit, country }) {
    let query = `
      SELECT 
        ${group === 'city' ? 'city, country' : 'country'},
        AVG(value) as avg_value,
        MAX(value) as max_value,
        COUNT(*) as count
      FROM air_quality
      WHERE measured_at >= ? AND measured_at <= ? AND parameter = ?
    `;
    
    const params = [
      from.toISOString().slice(0, 19).replace('T', ' '),
      to.toISOString().slice(0, 19).replace('T', ' '),
      metric,
    ];
    
    if (country) {
      query += ' AND country = ?';
      params.push(country);
    }
    
    query += ` GROUP BY ${group === 'city' ? 'city, country' : 'country'}`;
    query += ` ORDER BY avg_value DESC LIMIT ?`;
    params.push(limit);
    
    const [rows] = await pool.execute(query, params);
    
    return {
      items: rows.map(row => ({
        [group]: group === 'city' ? row.city : row.country,
        country: group === 'city' ? row.country : null,
        avg_value: parseFloat(row.avg_value),
        max_value: parseFloat(row.max_value),
        count: parseInt(row.count, 10),
      })),
    };
  },
};

