import { fetchUSGS } from '../jobs/fetchUSGS.js';
import { fetchOpenAQ } from '../jobs/fetchOpenAQ.js';

/**
 * 수집 서비스
 */
export const ingestService = {
  /**
   * 수집 작업 실행
   */
  async runIngest(source) {
    if (source === 'usgs') {
      return await fetchUSGS();
    } else if (source === 'openaq') {
      return await fetchOpenAQ();
    } else {
      throw new Error(`Unknown source: ${source}`);
    }
  },
};

