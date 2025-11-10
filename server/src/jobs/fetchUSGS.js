import pool from '../db/client.js';
import { config } from '../config/env.js';

/**
 * USGS 지진 데이터 수집
 */
export async function fetchUSGS(interval = 'all_hour') {
  const url = `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/${interval}.geojson`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': config.api.userAgent,
      },
      signal: AbortSignal.timeout(30000), // 30초 타임아웃
    });
    
    if (!response.ok) {
      throw new Error(`USGS API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    const features = data.features || [];
    
    let inserted = 0;
    let updated = 0;
    let failed = 0;
    
    const connection = await pool.getConnection();
    
    try {
      for (const feature of features) {
        const props = feature.properties;
        const coords = feature.geometry.coordinates; // [lng, lat, depth]
        
        const occurredAt = new Date(props.time);
        const sourceId = `usgs_${feature.id}`;
        
        try {
          const [result] = await connection.execute(
            `INSERT INTO earthquakes 
             (occurred_at, magnitude, depth_km, lat, lng, place, source_id)
             VALUES (?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE
               magnitude = VALUES(magnitude),
               depth_km = VALUES(depth_km),
               place = VALUES(place),
               updated_at = CURRENT_TIMESTAMP`,
            [
              occurredAt.toISOString().slice(0, 19).replace('T', ' '),
              props.mag || 0,
              coords[2] || null,
              coords[1], // lat
              coords[0], // lng
              props.place || null,
              sourceId,
            ]
          );
          
          if (result.affectedRows === 1 && result.insertId) {
            inserted++;
          } else {
            updated++;
          }
        } catch (error) {
          console.error(`Failed to insert earthquake ${sourceId}:`, error);
          failed++;
        }
      }
    } finally {
      connection.release();
    }
    
    // 수집 로그 기록
    const windowStart = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const windowEnd = new Date();
    
    await pool.execute(
      `INSERT INTO ingest_log 
       (source, window_start, window_end, fetched, inserted, updated, failed)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        'usgs',
        windowStart.toISOString().slice(0, 19).replace('T', ' '),
        windowEnd.toISOString().slice(0, 19).replace('T', ' '),
        features.length,
        inserted,
        updated,
        failed,
      ]
    );
    
    return {
      fetched: features.length,
      inserted,
      updated,
      failed,
    };
  } catch (error) {
    console.error('Error fetching USGS data:', error);
    throw error;
  }
}

