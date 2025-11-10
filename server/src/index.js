import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { config } from './config/env.js';
import { testConnection } from './db/client.js';
import { setupCronJobs } from './jobs/cron.js';

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

// 라우트
app.use('/api/health', healthRouter);
app.use('/api/eq', eqRouter);
app.use('/api/aq', aqRouter);
app.use('/api/tiles', tilesRouter);
app.use('/api/admin', adminRouter);

// 에러 핸들링
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

// 서버 시작
async function start() {
  try {
    // 데이터베이스 연결 확인
    const dbConnected = await testConnection();
    if (!dbConnected) {
      console.error('Database connection failed. Please check your configuration.');
      process.exit(1);
    }
    
    console.log('✓ Database connected');
    
    // 크론 작업 시작
    setupCronJobs();
    
    // 서버 시작
    app.listen(config.server.port, () => {
      console.log(`✓ Server running on port ${config.server.port}`);
      console.log(`✓ Environment: ${config.server.env}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();

