/**
 * API 클라이언트 (fetch 래퍼, 캐싱/재시도)
 */

const API_BASE = import.meta.env.VITE_API_BASE || '/api';

// 간단한 메모리 캐시
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5분

/**
 * 지수 백오프 재시도
 */
async function fetchWithRetry(url, options, maxRetries = 3) {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      // AbortController를 사용하여 타임아웃 구현
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);
      
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        return response;
      }
      
      // 429 Too Many Requests인 경우 지수 백오프
      if (response.status === 429) {
        const delay = Math.pow(2, i) * 1000; // 1s, 2s, 4s
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    } catch (error) {
      lastError = error;
      if (i < maxRetries - 1) {
        const delay = Math.pow(2, i) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
}

/**
 * GET 요청
 */
export async function get(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const cacheKey = `${url}?${new URLSearchParams(options.params || {}).toString()}`;
  
  // 캐시 확인
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  
  // 쿼리 파라미터 추가
  const urlWithParams = options.params
    ? `${url}?${new URLSearchParams(options.params).toString()}`
    : url;
  
  const response = await fetchWithRetry(urlWithParams, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  
  const data = await response.json();
  
  // 캐시 저장
  cache.set(cacheKey, {
    data,
    timestamp: Date.now(),
  });
  
  return data;
}

/**
 * POST 요청
 */
export async function post(endpoint, body, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  
  const response = await fetchWithRetry(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    body: JSON.stringify(body),
  });
  
  return await response.json();
}

