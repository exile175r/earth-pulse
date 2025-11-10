import express from 'express';
import { testConnection } from '../db/client.js';

const router = express.Router();

/**
 * GET /api/health
 * 서버 및 데이터베이스 상태 확인
 */
router.get('/', async (req, res) => {
  try {
    const dbConnected = await testConnection();
    
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: dbConnected ? 'connected' : 'disconnected',
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: error.message,
    });
  }
});

export default router;

