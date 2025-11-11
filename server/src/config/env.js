import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// .env 파일 로드
dotenv.config({ path: join(__dirname, '../../.env') });

// 환경 변수 검증 (데이터베이스는 더 이상 필요 없음)
const required = [
  'API_USER_AGENT'
];

const missing = required.filter(key => !process.env[key]);
if (missing.length > 0) {
  // 필수 변수가 없어도 기본값 사용
  console.warn(`Missing optional environment variables: ${missing.join(', ')}. Using defaults.`);
}

export const config = {
  server: {
    port: parseInt(process.env.PORT, 10) || 3000,
    env: process.env.NODE_ENV || 'development',
  },
  auth: {
    adminToken: process.env.ADMIN_TOKEN || null,
  },
  api: {
    userAgent: process.env.API_USER_AGENT || 'EarthPulse/1.0',
  },
};

