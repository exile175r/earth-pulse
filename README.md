# EarthPulse

3D 지구 실시간 환경 대시보드 - USGS 지진 데이터 + OpenAQ 대기질 데이터 시각화

## 프로젝트 구조

```
.
├── server/          # Express + MySQL 백엔드
├── web/            # React + react-three-fiber 프론트엔드
└── PLAN.md         # 상세 계획서
```

## 빠른 시작

### 1. 환경 설정

#### 서버
```bash
cd server
npm install
cp .env.example .env
# .env 파일 편집하여 데이터베이스 정보 입력
```

#### 웹
```bash
cd web
npm install
```

### 2. 데이터베이스 초기화

```bash
# MySQL 데이터베이스 생성
mysql -u root -p
CREATE DATABASE earth_dashboard;

# 마이그레이션 실행
cd server
npm run migrate
```

### 3. 실행

#### 서버
```bash
cd server
npm start
# 또는 개발 모드 (자동 재시작)
npm run dev
```

#### 웹
```bash
cd web
npm run dev
```

## 주요 기능

- **3D 지구 시각화**: react-three-fiber를 사용한 인터랙티브 3D 지구
- **실시간 지진 데이터**: USGS API에서 최근 지진 데이터 수집 및 표시
- **대기질 히트맵**: OpenAQ API에서 대기질 데이터 수집 및 히트맵 시각화
- **시간 탐색**: 시간 슬라이더로 과거 데이터 탐색
- **3D ↔ 2D 전환**: 3D 지구와 2D 지도 모드 전환
- **국가/도시 상세**: 클릭으로 국가 및 도시 정보 확인

## API 엔드포인트

- `GET /api/health` - 서버 상태 확인
- `GET /api/eq/recent` - 최근 지진 데이터
- `GET /api/aq/recent` - 최근 대기질 데이터
- `GET /api/aq/top` - 상위 대기질 데이터
- `GET /api/tiles/aq-heat/:z/:x/:y` - 히트맵 타일
- `POST /api/admin/ingest?source=usgs|openaq` - 수동 수집 실행

## 기술 스택

### 백엔드
- Node.js + Express
- MySQL 8.0+
- node-cron (ETL 작업)
- Redis (옵션, 캐싱)

### 프론트엔드
- React 18
- react-three-fiber (3D 렌더링)
- Three.js
- Zustand (상태 관리)
- Vite (빌드 도구)

## 개발 상태

현재 기본 구조와 핵심 기능이 구현되었습니다. 다음 기능들이 추가로 구현 필요:

- [ ] 히트맵 타일 이미지 생성
- [ ] GeoJSON 기반 국가/대륙 경계 렌더링
- [ ] 2D 지도 WebGL 렌더링
- [ ] 국가/도시 상세 정보 표시
- [ ] 성능 최적화 (인스턴싱, LOD)

## 라이선스

MIT

