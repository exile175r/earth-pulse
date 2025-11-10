import express from 'express';
import { verifyAdminToken } from '../utils/auth.js';
import { ingestService } from '../services/ingestService.js';

const router = express.Router();

// 모든 admin 라우트에 토큰 검증 적용
router.use(verifyAdminToken);

/**
 * POST /api/admin/ingest
 * 수동 ETL 작업 실행
 * Query params: source (usgs|openaq)
 */
router.post('/ingest', async (req, res) => {
  try {
    const { source } = req.query;
    
    if (!source || !['usgs', 'openaq'].includes(source)) {
      return res.status(400).json({ error: 'Invalid source. Use usgs or openaq' });
    }
    
    const result = await ingestService.runIngest(source);
    
    res.json({
      success: true,
      source,
      result,
    });
  } catch (error) {
    console.error('Error in /api/admin/ingest:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;

