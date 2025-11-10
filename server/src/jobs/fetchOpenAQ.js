import pool from '../db/client.js';
import { config } from '../config/env.js';

/**
 * OpenAQ 대기질 데이터 수집
 */
export async function fetchOpenAQ() {
  const url = 'https://api.openaq.org/v2/measurements';
  
  // 최근 1시간 데이터 수집
  const dateFrom = new Date(Date.now() - 60 * 60 * 1000);
  const dateTo = new Date();
  
  const params = new URLSearchParams({
    date_from: dateFrom.toISOString(),
    date_to: dateTo.toISOString(),
    limit: '10000',
    page: '1',
  });
  
  try {
    const response = await fetch(`${url}?${params}`, {
      headers: {
        'User-Agent': config.api.userAgent,
      },
      signal: AbortSignal.timeout(30000), // 30초 타임아웃
    });
    
    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('OpenAQ rate limit exceeded. Please wait before retrying.');
      }
      throw new Error(`OpenAQ API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    const results = data.results || [];
    
    let inserted = 0;
    let updated = 0;
    let failed = 0;
    
    const connection = await pool.getConnection();
    
    try {
      for (const result of results) {
        const measuredAt = new Date(result.date.utc);
        const sourceId = `openaq_${result.id || `${result.locationId}_${result.parameter}_${result.date.utc}`}`;
        
        try {
          const [dbResult] = await connection.execute(
            `INSERT INTO air_quality 
             (measured_at, lat, lng, country, city, location, parameter, value, unit, source_id)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE
               value = VALUES(value),
               updated_at = CURRENT_TIMESTAMP`,
            [
              measuredAt.toISOString().slice(0, 19).replace('T', ' '),
              result.coordinates.latitude,
              result.coordinates.longitude,
              result.country || null,
              result.city || null,
              result.location || null,
              result.parameter,
              result.value,
              result.unit,
              sourceId,
            ]
          );
          
          if (dbResult.affectedRows === 1 && dbResult.insertId) {
            inserted++;
          } else {
            updated++;
          }
        } catch (error) {
          console.error(`Failed to insert air quality ${sourceId}:`, error);
          failed++;
        }
      }
    } finally {
      connection.release();
    }
    
    // 수집 로그 기록
    await pool.execute(
      `INSERT INTO ingest_log 
       (source, window_start, window_end, fetched, inserted, updated, failed)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        'openaq',
        dateFrom.toISOString().slice(0, 19).replace('T', ' '),
        dateTo.toISOString().slice(0, 19).replace('T', ' '),
        results.length,
        inserted,
        updated,
        failed,
      ]
    );
    
    return {
      fetched: results.length,
      inserted,
      updated,
      failed,
    };
  } catch (error) {
    console.error('Error fetching OpenAQ data:', error);
    throw error;
  }
}

