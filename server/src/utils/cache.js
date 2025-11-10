/**
 * 캐싱 유틸리티 (LRU 메모리 캐시 또는 Redis)
 */
import { config } from '../config/env.js';

let redisClient = null;
let memoryCache = new Map();
const MAX_MEMORY_SIZE = 1000; // 최대 메모리 캐시 항목 수

// Redis 클라이언트 초기화 (옵션)
async function initRedis() {
  if (config.redis.url && !redisClient) {
    try {
      const Redis = (await import('ioredis')).default;
      redisClient = new Redis(config.redis.url);
      redisClient.on('error', (err) => {
        console.error('Redis error:', err);
        redisClient = null;
      });
      console.log('Redis connected');
    } catch (error) {
      console.warn('Redis not available, using memory cache:', error.message);
    }
  }
}

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
  await initRedis();
  
  if (redisClient) {
    try {
      const value = await redisClient.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.warn('Redis get error, falling back to memory:', error.message);
    }
  }
  
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
  await initRedis();
  
  if (redisClient) {
    try {
      await redisClient.setex(key, ttlSeconds, JSON.stringify(value));
      return;
    } catch (error) {
      console.warn('Redis set error, falling back to memory:', error.message);
    }
  }
  
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
  await initRedis();
  
  if (redisClient) {
    try {
      await redisClient.del(key);
    } catch (error) {
      console.warn('Redis del error:', error.message);
    }
  }
  
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

