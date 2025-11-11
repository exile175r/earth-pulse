import express from 'express';
import { verifyAdminToken } from '../utils/auth.js';

const router = express.Router();

// 모든 admin 라우트에 토큰 검증 적용
router.use(verifyAdminToken);

/**
 * POST /api/admin/ingest
 * 더 이상 필요 없음 (API 프록시 모드에서는 데이터 저장하지 않음)
 * 이 엔드포인트는 호환성을 위해 유지하되, 실제로는 아무 작업도 하지 않음
 */
router.post('/ingest', async (req, res) => {
  res.json({
    success: true,
    message: 'API proxy mode - data is fetched directly from external APIs, no ingestion needed',
  });
});

export default router;

