import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { config } from './config/env.js';

// 라우트
import healthRouter from './routes/health.js';
import eqRouter from './routes/eq.js';
import aqRouter from './routes/aq.js';
import tilesRouter from './routes/tiles.js';
import adminRouter from './routes/admin.js';

const app = express();

// 미들웨어
app.use(cors());
app.use(express.json());

// 레이트 리밋
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15분
  max: 100, // 최대 100 요청
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);


// 루트 경로
app.get('/', (req, res) => {
  res.json({
    message: 'EarthPulse API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      earthquakes: '/api/eq/recent',
      airQuality: '/api/aq/recent',
      tiles: '/api/tiles/aq-heat/:z/:x/:y',
    },
  });
});

// 라우트
app.use('/api/health', healthRouter);
app.use('/api/eq', eqRouter);
app.use('/api/aq', aqRouter);
app.use('/api/tiles', tilesRouter);
app.use('/api/admin', adminRouter);

// 404 핸들러
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.path} not found`,
    availableEndpoints: [
      'GET /',
      'GET /api/health',
      'GET /api/eq/recent',
      'GET /api/aq/recent',
      'GET /api/aq/top',
      'GET /api/tiles/aq-heat/:z/:x/:y',
    ],
  });
});

// 에러 핸들링
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

// 서버 시작 (로컬 개발 또는 전통적인 서버 환경에서만)
async function start() {
  try {
    // 서버 시작
    app.listen(config.server.port, () => {
      console.log(`✓ Server running on port ${config.server.port}`);
      console.log(`✓ Environment: ${config.server.env}`);
      console.log(`✓ API Proxy Mode (no database required)`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Vercel 환경이 아닐 때만 서버 시작
if (process.env.VERCEL !== '1') {
  start();
}

// Vercel 서버리스 함수로 export
export default app;

