import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  // WorldWind 이미지 파일을 정적 자산으로 제공
  assetsInclude: ['**/*.jpg', '**/*.png', '**/*.json'],
});

