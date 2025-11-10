# EarthPulse Server

3D 지구 실시간 환경 대시보드 서버 (Express + MySQL)

## 설치

```bash
npm install
```

## 환경 변수 설정

`.env` 파일을 생성하고 다음 변수들을 설정하세요:

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

## 데이터베이스 초기화

```bash
npm run migrate
```

## 실행

```bash
# 개발 모드 (자동 재시작)
npm run dev

# 프로덕션 모드
npm start
```

## API 엔드포인트

- `GET /api/health` - 서버 상태 확인
- `GET /api/eq/recent` - 최근 지진 데이터
- `GET /api/aq/recent` - 최근 대기질 데이터
- `GET /api/aq/top` - 상위 대기질 데이터
- `GET /api/tiles/aq-heat/:z/:x/:y` - 히트맵 타일
- `POST /api/admin/ingest?source=usgs|openaq` - 수동 수집 실행 (토큰 필요)

## 크론 작업

- USGS 지진 데이터: 5분마다 자동 수집
- OpenAQ 대기질 데이터: 15분마다 자동 수집

