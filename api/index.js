// Vercel 서버리스 함수로 Express 앱 래핑
import app from '../server/src/index.js';

// Vercel 서버리스 함수는 handler 함수를 export해야 함
export default function handler(req, res) {
  return app(req, res);
}
