import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

// Vercel 환경에서는 파일 시스템 접근이 제한될 수 있으므로 try-catch 사용
try {
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
} catch (error) {
  // 파일 시스템 접근 실패 시 무시 (Vercel 환경에서는 정상)
  dotenv.config(); // process.env에서 직접 읽기
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

