/**
 * 인증 유틸리티
 */
import { config } from '../config/env.js';

/**
 * Admin 토큰 검증 미들웨어
 */
export function verifyAdminToken(req, res, next) {
  const token = req.headers['x-admin-token'] || req.query.token;
  
  if (!token || token !== config.auth.adminToken) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  next();
}

