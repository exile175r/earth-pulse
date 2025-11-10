import pool from '../db/client.js';
import { getTimeBuckets } from '../utils/time.js';

/**
 * 지진 데이터 서비스
 */
export const eqService = {
  /**
   * 최근 지진 데이터 조회
   */
  async getRecent({ from, to, bbox, minMagnitude, bucket }) {
    let query = `
      SELECT 
        occurred_at,
        magnitude,
        depth_km,
        lat,
        lng,
        place,
        source_id
      FROM earthquakes
      WHERE occurred_at >= ? AND occurred_at <= ?
    `;
    
    const params = [
      from.toISOString().slice(0, 19).replace('T', ' '),
      to.toISOString().slice(0, 19).replace('T', ' '),
    ];
    
    if (minMagnitude) {
      query += ' AND magnitude >= ?';
      params.push(minMagnitude);
    }
    
    if (bbox) {
      query += ' AND lat >= ? AND lat <= ? AND lng >= ? AND lng <= ?';
      params.push(bbox.minLat, bbox.maxLat, bbox.minLng, bbox.maxLng);
    }
    
    query += ' ORDER BY occurred_at DESC, id DESC LIMIT 1000';
    
    const [rows] = await pool.execute(query, params);
    
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
      
      rows.forEach(row => {
        const occurredAt = new Date(row.occurred_at);
        const bucketKey = buckets.find(b => 
          occurredAt >= b.start && occurredAt < b.end
        );
        
        if (bucketKey) {
          const key = bucketKey.start.toISOString();
          bucketed[key].count++;
          bucketed[key].maxMagnitude = Math.max(
            bucketed[key].maxMagnitude,
            parseFloat(row.magnitude)
          );
          bucketed[key].events.push({
            occurred_at: row.occurred_at,
            magnitude: parseFloat(row.magnitude),
            depth_km: row.depth_km ? parseFloat(row.depth_km) : null,
            lat: parseFloat(row.lat),
            lng: parseFloat(row.lng),
            place: row.place,
          });
        }
      });
      
      return {
        buckets: Object.values(bucketed),
        total: rows.length,
      };
    }
    
    return {
      events: rows.map(row => ({
        occurred_at: row.occurred_at,
        magnitude: parseFloat(row.magnitude),
        depth_km: row.depth_km ? parseFloat(row.depth_km) : null,
        lat: parseFloat(row.lat),
        lng: parseFloat(row.lng),
        place: row.place,
      })),
      total: rows.length,
    };
  },
};

