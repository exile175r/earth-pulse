import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// .env 파일 로드 (로컬 개발 환경에서만)
const envPath = join(__dirname, '../../.env');
if (existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  // Vercel 등 클라우드 환경에서는 환경 변수가 이미 설정되어 있음
  dotenv.config(); // process.env에서 직접 읽기
}

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

