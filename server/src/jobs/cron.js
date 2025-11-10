import cron from 'node-cron';
import { fetchUSGS } from './fetchUSGS.js';
import { fetchOpenAQ } from './fetchOpenAQ.js';

/**
 * 크론 작업 설정
 */
export function setupCronJobs() {
  // USGS: 5분마다 수집
  cron.schedule('*/5 * * * *', async () => {
    try {
      console.log('[Cron] Fetching USGS data...');
      const result = await fetchUSGS('all_hour');
      console.log('[Cron] USGS fetch completed:', result);
    } catch (error) {
      console.error('[Cron] USGS fetch error:', error);
    }
  });
  
  // OpenAQ: 15분마다 수집
  cron.schedule('*/15 * * * *', async () => {
    try {
      console.log('[Cron] Fetching OpenAQ data...');
      const result = await fetchOpenAQ();
      console.log('[Cron] OpenAQ fetch completed:', result);
    } catch (error) {
      console.error('[Cron] OpenAQ fetch error:', error);
    }
  });
  
  console.log('Cron jobs scheduled: USGS (5min), OpenAQ (15min)');
}

