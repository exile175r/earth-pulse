# 🚀 EarthPulse 배포 가이드

포트폴리오 사이트에 링크하기 위한 배포 방법입니다.

## 📦 배포 옵션

### 옵션 1: Vercel (추천 - 가장 간단)

**프론트엔드 배포:**
1. GitHub에 프로젝트 푸시
2. [Vercel](https://vercel.com)에 가입
3. "New Project" 클릭
4. GitHub 저장소 선택
5. Root Directory를 `web`으로 설정
6. Build Command: `npm run build`
7. Output Directory: `dist`
8. Deploy!

**백엔드 배포:**
- Vercel은 서버리스 함수를 지원하지만, Express 앱은 별도 호스팅 필요
- **대안**: Railway, Render, Fly.io 사용

### 옵션 2: Netlify (프론트엔드) + Railway (백엔드)

**Netlify (프론트엔드):**
1. GitHub에 프로젝트 푸시
2. [Netlify](https://netlify.com)에 가입
3. "Add new site" → "Import an existing project"
4. Root Directory: `web`
5. Build command: `npm run build`
6. Publish directory: `dist`

**Railway (백엔드):**
1. [Railway](https://railway.app)에 가입
2. "New Project" → "Deploy from GitHub"
3. 저장소 선택
4. Root Directory: `server`
5. 환경 변수 설정 (.env 내용)
6. MySQL 데이터베이스 추가 (Railway에서 제공)

### 옵션 3: Render (전체)

**프론트엔드:**
1. [Render](https://render.com)에 가입
2. "New Static Site"
3. GitHub 저장소 연결
4. Root Directory: `web`
5. Build Command: `npm run build`
6. Publish Directory: `dist`

**백엔드:**
1. "New Web Service"
2. GitHub 저장소 연결
3. Root Directory: `server`
4. Build Command: `npm install`
5. Start Command: `npm start`
6. 환경 변수 설정
7. PostgreSQL 또는 MySQL 추가 (Render에서 제공)

---

## 🔧 배포 전 준비사항

### 1. 환경 변수 설정

배포 플랫폼에서 다음 환경 변수를 설정하세요:

**프론트엔드 (.env.production):**
```env
VITE_API_BASE=https://your-backend-url.com/api
```

**백엔드:**
```env
DB_HOST=your_db_host
DB_PORT=3306
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=earth_dashboard
PORT=3000
NODE_ENV=production
ADMIN_TOKEN=your_secure_token
API_USER_AGENT=EarthPulse/1.0
```

### 2. CORS 설정 확인

`server/src/index.js`에서 CORS가 올바르게 설정되어 있는지 확인:

```javascript
app.use(cors({
  origin: ['http://localhost:5173', 'https://your-frontend-url.vercel.app'],
  credentials: true
}));
```

### 3. 프로덕션 빌드

```bash
cd web
npm run build
```

---

## 📝 포트폴리오에 추가하기

### 방법 1: 직접 링크

포트폴리오 사이트에 프로젝트 카드 추가:

```html
<div class="project-card">
  <h3>EarthPulse</h3>
  <p>3D 지구 실시간 환경 대시보드</p>
  <a href="https://your-app.vercel.app" target="_blank">
    라이브 데모 보기 →
  </a>
  <a href="https://github.com/your-username/earthpulse" target="_blank">
    GitHub 코드 보기 →
  </a>
</div>
```

### 방법 2: 스크린샷 + 링크

1. **스크린샷 촬영:**
   - 브라우저에서 프로젝트 실행
   - 개발자 도구 (F12) → 디바이스 툴바 (Ctrl+Shift+M)
   - 모바일/데스크톱 뷰로 스크린샷

2. **포트폴리오에 추가:**
   ```markdown
   ## EarthPulse
   
   ![EarthPulse Screenshot](./screenshots/earthpulse.png)
   
   - **라이브 데모**: [https://your-app.vercel.app](https://your-app.vercel.app)
   - **GitHub**: [https://github.com/your-username/earthpulse](https://github.com/your-username/earthpulse)
   - **기술 스택**: React, Three.js, Express, MySQL
   ```

### 방법 3: README 배지 추가

GitHub README에 배지 추가:

```markdown
# EarthPulse

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit-blue)](https://your-app.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black)](https://github.com/your-username/earthpulse)
```

---

## 🎨 포트폴리오 프로젝트 설명 예시

```markdown
### 🌍 EarthPulse - 3D 지구 실시간 환경 대시보드

**기간**: 2024년
**역할**: 풀스택 개발자

**설명:**
USGS 지진 데이터와 OpenAQ 대기질 데이터를 실시간으로 수집하여 
3D 지구 위에 시각화하는 인터랙티브 대시보드입니다.

**주요 기능:**
- 3D 지구 인터랙티브 시각화 (react-three-fiber)
- 실시간 지진 데이터 표시
- 대기질 히트맵 (PM2.5, PM10, O3)
- 시간 슬라이더로 과거 데이터 탐색
- 3D ↔ 2D 지도 모드 전환

**기술 스택:**
- Frontend: React, Three.js, react-three-fiber, Zustand, Vite
- Backend: Node.js, Express, MySQL
- 데이터: USGS API, OpenAQ API
- 배포: Vercel (Frontend), Railway (Backend)

**링크:**
- [라이브 데모](https://your-app.vercel.app)
- [GitHub 저장소](https://github.com/your-username/earthpulse)
```

---

## 🔗 빠른 배포 체크리스트

### 프론트엔드
- [ ] GitHub에 코드 푸시
- [ ] Vercel/Netlify에 배포
- [ ] 환경 변수 설정 (API URL)
- [ ] CORS 설정 확인
- [ ] 도메인 확인

### 백엔드
- [ ] GitHub에 코드 푸시
- [ ] Railway/Render에 배포
- [ ] 데이터베이스 설정
- [ ] 환경 변수 설정
- [ ] 마이그레이션 실행
- [ ] API 엔드포인트 테스트

### 포트폴리오
- [ ] 스크린샷 촬영
- [ ] 프로젝트 설명 작성
- [ ] 링크 추가
- [ ] 기술 스택 명시
- [ ] GitHub 저장소 공개

---

## 💡 팁

1. **무료 티어 활용:**
   - Vercel: 무제한 (개인 프로젝트)
   - Netlify: 100GB 대역폭/월
   - Railway: $5 크레딧/월
   - Render: 무료 티어 제공

2. **데이터베이스:**
   - Railway, Render는 자동으로 데이터베이스 제공
   - 또는 PlanetScale (MySQL 무료 티어) 사용

3. **환경 변수:**
   - 민감한 정보는 절대 코드에 포함하지 않기
   - 배포 플랫폼의 환경 변수 설정 사용

4. **성능:**
   - 이미지 최적화
   - 코드 스플리팅
   - CDN 활용

---

## 🆘 문제 해결

### CORS 오류
- 백엔드 CORS 설정에서 프론트엔드 URL 추가
- 환경 변수로 동적 설정

### 데이터베이스 연결 실패
- 배포 플랫폼의 데이터베이스 호스트 확인
- 방화벽 설정 확인
- SSL 연결 필요 시 설정

### 빌드 실패
- 로컬에서 `npm run build` 테스트
- 의존성 버전 확인
- 빌드 로그 확인

