/**
 * 시간 유틸리티 함수
 */

/**
 * ISO 8601 문자열을 Date 객체로 변환
 */
export function parseISO(str) {
  return new Date(str);
}

/**
 * Date 객체를 ISO 8601 문자열로 변환
 */
export function toISO(date) {
  return date.toISOString();
}

/**
 * 시간 범위를 버킷으로 그룹화
 * @param {Date} from - 시작 시간
 * @param {Date} to - 종료 시간
 * @param {string} bucket - 버킷 크기 ('5m', '1h', '1d')
 * @returns {Array} 버킷 배열
 */
export function getTimeBuckets(from, to, bucket = '1h') {
  const buckets = [];
  const current = new Date(from);
  const end = new Date(to);
  
  let interval;
  if (bucket === '5m') {
    interval = 5 * 60 * 1000; // 5분
  } else if (bucket === '1h') {
    interval = 60 * 60 * 1000; // 1시간
  } else if (bucket === '1d') {
    interval = 24 * 60 * 60 * 1000; // 1일
  } else {
    throw new Error(`Unsupported bucket: ${bucket}`);
  }
  
  while (current < end) {
    const bucketEnd = new Date(Math.min(current.getTime() + interval, end.getTime()));
    buckets.push({
      start: new Date(current),
      end: new Date(bucketEnd),
    });
    current.setTime(bucketEnd.getTime());
  }
  
  return buckets;
}

/**
 * MySQL DATETIME 형식으로 변환
 */
export function toMySQLDateTime(date) {
  return date.toISOString().slice(0, 19).replace('T', ' ');
}

/**
 * 시간 범위 파싱 (쿼리 파라미터에서)
 */
export function parseTimeRange(from, to, defaultHours = 24) {
  const now = new Date();
  const defaultFrom = new Date(now.getTime() - defaultHours * 60 * 60 * 1000);
  
  const fromDate = from ? parseISO(from) : defaultFrom;
  const toDate = to ? parseISO(to) : now;
  
  return { from: fromDate, to: toDate };
}

