import express from 'express';
import { parseTimeRange } from '../utils/time.js';
import { parseBBox } from '../utils/geo.js';
import { eqService } from '../services/eqService.js';

const router = express.Router();

/**
 * GET /api/eq/recent
 * 최근 지진 데이터 조회
 * Query params: from, to, bbox, minMag, bucket
 */
router.get('/recent', async (req, res) => {
  try {
    const { from, to, bbox, minMag, bucket = '5m' } = req.query;
    
    const timeRange = parseTimeRange(from, to, 24);
    const bboxObj = parseBBox(bbox);
    const minMagnitude = minMag ? parseFloat(minMag) : null;
    
    const result = await eqService.getRecent({
      from: timeRange.from,
      to: timeRange.to,
      bbox: bboxObj,
      minMagnitude,
      bucket,
    });
    
    res.json(result);
  } catch (error) {
    console.error('Error in /api/eq/recent:', error);
    const statusCode = error.message.includes('timeout') ? 504 : 500;
    res.status(statusCode).json({ 
      error: error.message || 'Internal server error',
      endpoint: '/api/eq/recent'
    });
  }
});

export default router;

