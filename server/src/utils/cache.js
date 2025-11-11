/**
 * 캐싱 유틸리티 (LRU 메모리 캐시)
 */
let memoryCache = new Map();
const MAX_MEMORY_SIZE = 1000; // 최대 메모리 캐시 항목 수

// 메모리 캐시 정리 (LRU)
function evictMemoryCache() {
  if (memoryCache.size > MAX_MEMORY_SIZE) {
    const firstKey = memoryCache.keys().next().value;
    memoryCache.delete(firstKey);
  }
}

/**
 * 캐시에서 값 가져오기
 */
export async function get(key) {
  const entry = memoryCache.get(key);
  if (!entry) return null;
  
  // TTL 확인
  if (entry.expires && entry.expires < Date.now()) {
    memoryCache.delete(key);
    return null;
  }
  
  return entry.value;
}

/**
 * 캐시에 값 저장
 */
export async function set(key, value, ttlSeconds = 300) {
  // 메모리 캐시
  evictMemoryCache();
  memoryCache.set(key, {
    value,
    expires: ttlSeconds > 0 ? Date.now() + ttlSeconds * 1000 : null,
  });
}

/**
 * 캐시에서 값 삭제
 */
export async function del(key) {
  memoryCache.delete(key);
}

/**
 * 캐시 키 생성
 */
export function makeKey(prefix, params) {
  const sorted = Object.keys(params)
    .sort()
    .map(k => `${k}:${params[k]}`)
    .join('|');
  return `${prefix}:${sorted}`;
}

