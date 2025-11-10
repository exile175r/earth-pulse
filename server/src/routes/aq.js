import express from 'express';
import { parseTimeRange } from '../utils/time.js';
import { parseBBox } from '../utils/geo.js';
import { aqService } from '../services/aqService.js';

const router = express.Router();

/**
 * GET /api/aq/recent
 * 최근 대기질 데이터 조회
 * Query params: from, to, bbox, param, bucket
 */
router.get('/recent', async (req, res) => {
  try {
    const { from, to, bbox, param = 'pm25', bucket = '1h' } = req.query;
    
    const timeRange = parseTimeRange(from, to, 24);
    const bboxObj = parseBBox(bbox);
    
    const result = await aqService.getRecent({
      from: timeRange.from,
      to: timeRange.to,
      bbox: bboxObj,
      parameter: param,
      bucket,
    });
    
    res.json(result);
  } catch (error) {
    console.error('Error in /api/aq/recent:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/aq/top
 * 상위 대기질 데이터 조회
 * Query params: from, to, metric, group, limit, country
 */
router.get('/top', async (req, res) => {
  try {
    const { from, to, metric = 'pm25', group = 'city', limit = 10, country } = req.query;
    
    const timeRange = parseTimeRange(from, to, 24);
    
    const result = await aqService.getTop({
      from: timeRange.from,
      to: timeRange.to,
      metric,
      group,
      limit: parseInt(limit, 10),
      country: country || null,
    });
    
    res.json(result);
  } catch (error) {
    console.error('Error in /api/aq/top:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;

