# EarthPulse Web

3D 지구 실시간 환경 대시보드 웹 프론트엔드 (React + react-three-fiber)

## 설치

```bash
npm install
```

## 실행

```bash
# 개발 서버
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 미리보기
npm run preview
```

## 환경 변수

`.env` 파일 생성 (옵션):

```env
VITE_API_BASE=http://localhost:3000/api
```

## 주요 기능

- 3D 지구 시각화 (react-three-fiber)
- 실시간 지진 데이터 표시
- 대기질 히트맵 (PM2.5, PM10, O3)
- 시간 슬라이더로 시간대 탐색
- 3D ↔ 2D 지도 모드 전환
- 국가/도시 상세 정보 패널

