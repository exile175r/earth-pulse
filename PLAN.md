# 3D 지구 실시간 환경 대시보드(USGS + OpenAQ) — JavaScript 버전

## 콘셉트 요약
- 3D 지구 위에 최근 지진과 대기질(AQI, PM2.5 등)을 시간축으로 시각화.
- 백엔드 중심: 주기적 ETL→MySQL 적재, 파티셔닝/인덱스, 집계 API, 캐싱, 레이트리밋.
- 프론트는 React + react-three-fiber로 지구/히트맵, 시간 슬라이더/필터 제공.
- 타입스크립트 미사용. 서버/클라이언트 모두 JavaScript로 구현.

## 데이터 소스
- USGS Earthquake API: `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/{interval}.geojson`
  - API 키 불필요 (공개 API)
  - Rate limit: 공식 제한 없음 (합리적 사용 권장)
  - User-Agent 헤더 권장 (서버 식별용)
- OpenAQ v2 API: `https://api.openaq.org/v2/measurements`
  - API 키 불필요 (공개 API)
  - Rate limit: 확인 필요 (대량 요청 시 제한 가능)
  - User-Agent 헤더 권장
  - 참고: 대량 요청 시 OpenAQ 정책 확인 및 필요시 연락

---

## 사용자 흐름(플로우)
1) 랜딩(전세계 뷰)
- 최근 24h 지진 포인트 + 현재 시간대 PM2.5 히트맵 표시
- 상단: 시간 슬라이더, 파라미터 토글(pm25/pm10/o3), 퍼포먼스 토글

2) 탐색
- 드래그/휠로 회전/확대. 줌인 시 국가 경계/라벨 점진적 표시
- 드래그로 BBox 지정 → 해당 영역 집계 API 호출
- 3D 지구 클릭 시 2D 세계 지도 모드 전환
  - 대륙별 영역 클릭 가능 (아시아, 유럽, 아메리카, 아프리카, 오세아니아 등)
  - 대륙 클릭 시 해당 대륙으로 카메라 줌인 및 중심 이동
  - 줌인 후 각 나라별 클릭 가능
  - 국가 클릭 시 국가 정보 패널 표시 (지진 통계, 대기질 평균, 주요 도시 등)

3) 국가 선택
- 국가 클릭 → 우측 패널: 최근 지진 타임라인, 대기질 평균, 상위 도시
- "상세 보기" 클릭 시 국가 상세 화면(국경 강조, 주요 도시 핀)

4) 도시/세부 지표
- 도시 클릭 → 단일 도시 카드(24h/7d 추이, 평균/최대, 이벤트 하이라이트)

5) 스토리 모드(선택)
- 자동 재생: 전 세계 → 특정 스모그 이벤트 → 지진 군집 투어

6) 공유
- 현재 상태(URL 쿼리: 시간/파라미터/카메라/선택)로 링크 공유

---

## 화면 구성
- 상단 바: 타이틀, 시간 슬라이더, 파라미터 토글(pm25/pm10/o3), 성능 토글
- 좌측(옵션): 기간 프리셋(24h/7d), 국가 선택
- 중앙: 3D 지구 캔버스
- 우측 패널: 컨텍스트 상세(요약/지진/대기질 탭)
- 하단(옵션): 수집 상태/로그

---

## 서버 설계(Express + MySQL, JS)
- 수집(ETL): `node-cron`으로 USGS(1~5분), OpenAQ(10~15분) 주기 수집
  - HTTP 요청 시 User-Agent 헤더 설정 (서버 식별용)
  - Rate limit 대응: 요청 간격 조절, 지수 백오프 재시도
  - 에러 핸들링: 네트워크 오류, API 응답 오류 분리 처리
  - 타임아웃 설정: 요청별 적절한 타임아웃 (기본 30초)
- 정제: 좌표/단위 정규화, 소스 고유키로 upsert 중복 방지
- 저장: MySQL 8, 일/월 파티셔닝, 시간/공간 인덱스 고려
- 집계 API: 시간 버킷(5m/1h/1d), 바운딩박스/반경, 상위 N 도시/국가, 히트맵 타일
- 캐싱: 최근 구간 메모리/Redis, ETag/Cache-Control, 레이트리밋
- 관측가능성: 수집 로그/지표, 최근 페치 타임스탬프 API

### 테이블(요약)
- earthquakes(id, occurred_at, magnitude, depth_km, lat, lng, place, source_id, day, month)
- air_quality(id BIGINT AUTO, measured_at, lat, lng, country, city, location, parameter, value, unit, source_id, day, month)
- ingest_log(source, window_start, window_end, fetched, inserted, updated, failed, created_at)

### 핵심 API
- GET `/api/health`
- GET `/api/eq/recent?from&to&bbox&minMag&bucket=5m`
- GET `/api/aq/recent?from&to&bbox&param=pm25&bucket=1h`
- GET `/api/aq/top?from&to&metric=pm25&group=city&limit&country`
- GET `/api/tiles/aq-heat/{z}/{x}/{y}?param&time`
- POST `/api/admin/ingest?source=usgs|openaq` (토큰)

### 성능/안정성
- 커서 기반 페이지네이션(`occurred_at,id`), 1,000 레코드 제한
- 캐시 TTL: 최근 24h 데이터 1~5분, 타일 15분
- 인덱스: `occurred_at`, `(parameter, measured_at)`, `(country, city, parameter, measured_at)`

---

## 프론트 설계(React + react-three-fiber, JS)
- React Compiler 사용: 자동 최적화 및 메모이제이션
- 지구: 공개 텍스처(NASA/EOX), 대기 레이어(옵션), 오비트컨트롤
- 지진: 인스턴싱 포인트(규모→크기/컬러, 최근→펄스)
- 대기질: 서버 집계 히트맵 타일 텍스처/스프라이트 레이어
- UI: 시간 슬라이더, 파라미터 토글, 국가/도시 선택, BBox 드래그
- 접근성: 키보드 포커스, 대비 모드, 텍스트 요약
- 3D 지구 클릭 시 2D 세계 지도 전환: 대륙별 클릭 가능, 클릭 시 해당 대륙으로 줌인, 각 나라별 클릭 가능, 클릭 시 국가 정보 패널 표시

---

## 디렉토리/파일 구조(JS)

server/
  src/
    index.js
    config/
      env.js
    db/
      client.js          # mysql2/promise 풀
      schema.sql         # 초기 스키마 문서화
    routes/
      health.js
      eq.js
      aq.js
      tiles.js
      admin.js
    jobs/
      cron.js
      fetchUSGS.js
      fetchOpenAQ.js
      backfill.js
    services/
      eqService.js       # 쿼리/집계 로직
      aqService.js
      tileService.js     # 히트맵 타일 생성
      ingestService.js
    utils/
      geo.js             # bbox<->tiles, lat/lng 유틸
      time.js
      cache.js           # LRU/Redis 래퍼
      auth.js            # 토큰 검증
  package.json
  README.md

web/
  src/
    main.jsx
    App.jsx
    api/
      client.js          # fetch 래퍼, 캐싱/재시도
      endpoints.js       # URL 빌더
    state/
      store.js           # Zustand 또는 간단 Context
      selectors.js
      persist.js
    three/
      Scene.jsx
      Globe.jsx
      Map2D.jsx          # 2D 세계 지도 컴포넌트
      ContinentLayer.jsx # 대륙별 클릭 영역
      CountryLayer.jsx   # 국가별 클릭 영역
      Atmosphere.jsx
      EarthquakeLayer.jsx
      AirQualityHeatmap.jsx
      Controls.jsx
      helpers.js         # lat/lng->xyz 등
    ui/
      Topbar.jsx
      SidePanel.jsx
      SummaryCards.jsx
      TimeSlider.jsx
      ParameterToggle.jsx
    pages/
      Home.jsx
      Country.jsx
      City.jsx
    routing/
      routes.jsx
  index.html
  package.json

---

## 라우팅
- `/` 전역 뷰(쿼리: `from,to,param,perf,bbox,camera`)
- `/country/:code` 국가 상세
- `/city/:id` 도시 상세

---

## 상태(클라이언트)
- view: { camera, perfMode, param, timeRange, bbox, mapMode: '3d'|'2d', zoomLevel }
- selection: { type: 'continent'|'country'|'city'|'none', id, name }
- data: { summaries, tilesCache, eqPoints, continentData, countryData }
- ui: { sidePanelOpen, loading, error }

---

## 마일스톤
1) DB/스키마/연결 + USGS ETL 프로토타입
2) OpenAQ ETL + 스키마/인덱스 확장
3) 집계 API(버킷/상위N/타일) + 캐싱/레이트리밋
4) 3D 지구 MVP(포인트/히트맵) + 시간 슬라이더
5) 성능 튜닝(인스턴싱/캐시 키/인덱스) + 접근성
6) 배포 + README/데모 영상

---

## 개발 도구
- Chrome DevTools MCP: 디버깅 및 성능 프로파일링을 위한 MCP 서버 연동 (개발 환경 전용)
- React Compiler: babel 플러그인 또는 Vite 플러그인으로 설정

## 개발 구현 세부사항

### 빌드 도구 및 설정
- **Vite 사용**: React Compiler 플러그인 지원, 빠른 빌드
- `vite.config.js`: React Compiler 플러그인 설정
- `babel.config.js` (또는 Vite 플러그인): React Compiler 활성화
- 환경 변수 관리: `config/env.js`에서 `.env` 파일 로드 및 검증

### 환경 변수 구조 (구현 필요)
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- `REDIS_URL` (옵션, 캐싱용)
- `PORT` (서버 포트, 기본값 3000)
- `NODE_ENV` (development/production)
- `ADMIN_TOKEN` (Admin API 인증용)
- `API_USER_AGENT` (HTTP 요청용 User-Agent 문자열)

### 데이터베이스 마이그레이션
- `db/schema.sql`: 초기 스키마 정의
- `db/migrate.js`: 스키마 생성 및 파티셔닝 적용 스크립트
- 파티셔닝: `day`, `month` 컬럼 기반 RANGE 파티셔닝
- 인덱스: 시간, 공간, 복합 인덱스 자동 생성

### 로깅 시스템
- 로깅 라이브러리: `winston` 또는 `pino` 사용
- 로그 레벨: error, warn, info, debug
- 로그 형식: JSON (프로덕션), 개발용 포맷 (개발)
- 로그 파일: `logs/` 디렉토리 또는 stdout/stderr
- ETL 작업 로그: `ingest_log` 테이블에 기록

### 인증 구현
- Admin API: `utils/auth.js`에서 토큰 검증
- 토큰 형식: 환경 변수 `ADMIN_TOKEN`과 비교 (간단한 API 키)
- 미들웨어: `routes/admin.js`에서 `auth.js` 미들웨어 사용

### 2D 지도 구현
- 렌더링 방식: **WebGL 사용** (GPU 가속으로 성능 최적화)
  - Canvas 2D API 대신 WebGL 컨텍스트 사용
  - 대량의 폴리곤(국가 경계) 렌더링 시 GPU 병렬 처리로 성능 향상
  - 히트맵 타일 렌더링도 WebGL로 처리
- 라이브러리 선택: 
  - WebGL 직접 구현: `regl`, `twgl` 또는 Three.js의 2D 렌더러 활용
  - 또는 react-three-fiber의 2D 평면 씬 활용 (3D와 통합 용이)
- GeoJSON 로더: `utils/geo.js`에 GeoJSON 파싱 및 좌표 변환 함수
- 클릭 감지: `ContinentLayer.jsx`, `CountryLayer.jsx`에서 point-in-polygon 알고리즘
  - WebGL 렌더링 시: 픽셀 ID 버퍼를 활용한 hit testing (더 빠름)
- 좌표계: WGS84 (GeoJSON) → 화면 좌표 변환
- 성능 최적화:
  - WebGL 버퍼에 GeoJSON 데이터 사전 업로드
  - 인스턴싱으로 동일한 스타일의 국가 경계 일괄 렌더링
  - LOD (Level of Detail): 줌 레벨에 따라 상세도 조절

### 3D 클릭 감지
- `three/helpers.js`: react-three-fiber의 `useRaycaster` 활용
- 클릭 이벤트: `Globe.jsx`에서 raycasting으로 지구 표면 좌표 계산
- 좌표 변환: 3D 좌표 → lat/lng → 국가/대륙 매칭

### 데이터 로더
- GeoJSON 로더: `utils/geo.js`에 국가/대륙 GeoJSON 로드 함수
- 지구 텍스처: `three/Globe.jsx`에서 텍스처 이미지 로드
- 텍스처 소스: NASA Blue Marble 또는 EOX Cloudless Earth (CDN 또는 로컬)

### 캐싱 구현
- `utils/cache.js`: LRU 캐시 (메모리) 또는 Redis 클라이언트 래퍼
- Redis 사용 시: `ioredis` 또는 `redis` 패키지
- 캐시 키 전략: `{source}:{type}:{params}` 형식
- TTL 관리: 환경별 다른 TTL 설정

## 구현 메모
- 외부 타일 서비스는 약관/쿼터 준수. 안정성 위해 히트맵은 내부 타일 API 사용 우선.
- 국가 상세는 "구면 확대" 기본, 필요 시 평면 타일 오버레이 옵션 추가.
- 2D 지도 모드: GeoJSON 기반 대륙/국가 경계 데이터 사용 (Natural Earth 또는 유사 공개 데이터셋)
- 대륙/국가 클릭 감지: Raycasting 또는 Canvas 기반 hit testing
- 3D↔2D 전환 애니메이션: 카메라 트랜지션 및 페이드 효과
- API 사용 정책:
  - USGS/OpenAQ 모두 API 키 불필요 (공개 API)
  - User-Agent 헤더 필수 설정 (예: "EarthDashboard/1.0 (contact@example.com)")
  - Rate limit 모니터링 및 적절한 요청 간격 유지
  - 429 Too Many Requests 응답 시 지수 백오프 재시도
  - 대량 요청 계획 시 OpenAQ에 사전 연락 고려

## 사용자 준비 사항 (개발자가 직접 수행)

### 1. 환경 설정
- [ ] MySQL 8.0+ 설치 및 실행
- [ ] Redis 설치 및 실행 (옵션, 캐싱 사용 시)
- [ ] Node.js 18+ 설치
- [ ] `.env` 파일 생성 및 환경 변수 값 설정:
  ```
  DB_HOST=localhost
  DB_PORT=3306
  DB_USER=your_db_user
  DB_PASSWORD=your_db_password
  DB_NAME=earth_dashboard
  REDIS_URL=redis://localhost:6379 (옵션)
  PORT=3000
  NODE_ENV=development
  ADMIN_TOKEN=your_secure_token_here
  API_USER_AGENT=EarthDashboard/1.0 (contact@example.com)
  ```

### 2. 데이터 준비
- [ ] GeoJSON 데이터 다운로드:
  - Natural Earth 데이터: https://www.naturalearthdata.com/downloads/
  - 국가 경계: `ne_10m_admin_0_countries.geojson` (10m 해상도)
  - 대륙 그룹핑 데이터 준비 (국가 코드 → 대륙 매핑)
- [ ] 지구 텍스처 다운로드 또는 CDN URL 확인:
  - NASA Blue Marble: https://visibleearth.nasa.gov/
  - EOX Cloudless Earth: https://eox.at/
  - 또는 로컬에 저장 후 `public/textures/` 디렉토리에 배치
- [ ] GeoJSON 파일을 `server/data/` 또는 `web/public/data/` 디렉토리에 배치

### 3. 데이터베이스 초기화
- [ ] MySQL 데이터베이스 생성: `CREATE DATABASE earth_dashboard;`
- [ ] 마이그레이션 스크립트 실행: `node server/src/db/migrate.js`
- [ ] 초기 데이터 확인

### 4. 개발 환경 테스트
- [ ] 서버 실행: `cd server && npm start`
- [ ] 프론트엔드 실행: `cd web && npm run dev`
- [ ] ETL 작업 수동 실행 테스트: `POST /api/admin/ingest?source=usgs`
- [ ] API 엔드포인트 테스트

### 5. 배포 준비 (프로덕션)
- [ ] 프로덕션 환경 변수 설정
- [ ] 데이터베이스 백업 전략 수립
- [ ] 호스팅 서버 준비 (VPS, 클라우드 등)
- [ ] 도메인 설정 (옵션)
- [ ] SSL 인증서 설정 (HTTPS)
- [ ] 모니터링 도구 설정 (옵션)
