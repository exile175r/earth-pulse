# EarthPulse 시작 가이드

## 사전 요구사항

1. **Node.js 18+** 설치
2. **MySQL 8.0+** 설치 및 실행
3. **Redis** (옵션, 캐싱 사용 시)

## 설치 단계

### 1. 프로젝트 클론 및 의존성 설치

```bash
# 서버 의존성 설치
cd server
npm install

# 웹 의존성 설치
cd ../web
npm install
```

### 2. 데이터베이스 설정

```bash
# MySQL 접속
mysql -u root -p

# 데이터베이스 생성
CREATE DATABASE earth_dashboard;

# 종료
exit;
```

### 3. 환경 변수 설정

#### 서버 환경 변수

`server/.env` 파일 생성:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=earth_dashboard
REDIS_URL=redis://localhost:6379
PORT=3000
NODE_ENV=development
ADMIN_TOKEN=your_secure_token_here
API_USER_AGENT=EarthPulse/1.0 (contact@example.com)
```

#### 웹 환경 변수 (옵션)

`web/.env` 파일 생성:

```env
VITE_API_BASE=http://localhost:3000/api
```

### 4. 데이터베이스 마이그레이션

```bash
cd server
npm run migrate
```

마이그레이션이 성공하면 테이블이 생성됩니다:
- `earthquakes` - 지진 데이터
- `air_quality` - 대기질 데이터
- `ingest_log` - 수집 로그

### 5. 서버 실행

```bash
cd server
npm start
# 또는 개발 모드 (자동 재시작)
npm run dev
```

서버가 정상적으로 시작되면:
- `http://localhost:3000`에서 API 서버 실행
- 크론 작업 자동 시작:
  - USGS 지진 데이터: 5분마다 수집
  - OpenAQ 대기질 데이터: 15분마다 수집

### 6. 웹 프론트엔드 실행

새 터미널에서:

```bash
cd web
npm run dev
```

웹 애플리케이션이 `http://localhost:5173`에서 실행됩니다.

## 수동 데이터 수집 테스트

서버가 실행 중일 때:

```bash
# USGS 지진 데이터 수집
curl -X POST "http://localhost:3000/api/admin/ingest?source=usgs" \
  -H "x-admin-token: your_secure_token_here"

# OpenAQ 대기질 데이터 수집
curl -X POST "http://localhost:3000/api/admin/ingest?source=openaq" \
  -H "x-admin-token: your_secure_token_here"
```

## API 테스트

```bash
# 서버 상태 확인
curl http://localhost:3000/api/health

# 최근 지진 데이터 조회
curl "http://localhost:3000/api/eq/recent?from=2024-01-01T00:00:00Z&to=2024-01-02T00:00:00Z"

# 최근 대기질 데이터 조회
curl "http://localhost:3000/api/aq/recent?param=pm25&from=2024-01-01T00:00:00Z&to=2024-01-02T00:00:00Z"
```

## 문제 해결

### 데이터베이스 연결 실패
- MySQL이 실행 중인지 확인
- `.env` 파일의 데이터베이스 정보 확인
- 사용자 권한 확인

### 크론 작업이 실행되지 않음
- 서버 로그 확인
- API 키 및 User-Agent 설정 확인
- 네트워크 연결 확인

### 프론트엔드에서 API 호출 실패
- 서버가 실행 중인지 확인
- CORS 설정 확인
- 브라우저 콘솔에서 에러 확인

## 다음 단계

1. **GeoJSON 데이터 준비**: 국가/대륙 경계 데이터 다운로드
2. **지구 텍스처 설정**: NASA Blue Marble 또는 EOX 텍스처 URL 설정
3. **히트맵 타일 구현**: 대기질 히트맵 타일 이미지 생성 로직 구현
4. **2D 지도 구현**: WebGL 기반 2D 지도 렌더링
5. **성능 최적화**: 인스턴싱, LOD, 캐싱 최적화

자세한 내용은 `PLAN.md`를 참고하세요.

