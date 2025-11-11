# ⚡ 빠른 배포 가이드 (5분 안에)

포트폴리오에 올리기 위한 최소한의 배포 방법입니다.

## 🎯 목표

- 프론트엔드: Vercel에 배포
- 백엔드: Vercel에 배포 (서버리스 함수)

## 1단계: GitHub에 푸시 (2분)

```bash
# GitHub 저장소 생성 후
cd earthPulse
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/exile175r/earthpulse.git
git push -u origin main
```

## 2단계: Vercel에 백엔드 배포 (3분) ⚠️ 먼저 배포!

> 💡 **팁**: 백엔드를 먼저 배포하면 URL을 바로 받을 수 있어서 프론트엔드 환경 변수 설정이 쉬워집니다.

1. [vercel.com](https://vercel.com) 가입/로그인
2. "Add New Project" 클릭
3. GitHub 저장소 선택
4. **중요 설정:**
   - Root Directory: 프로젝트 루트 (기본값)
   - Framework Preset: Other (또는 자동 감지)
   - Build Command: (비워두기 - 서버리스 함수이므로 빌드 불필요)
   - Output Directory: (비워두기)
5. Environment Variables 추가:
   ```
   DB_HOST=your_db_host
   DB_PORT=3306
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_NAME=earth_dashboard
   NODE_ENV=production
   ADMIN_TOKEN=your_secure_token
   API_USER_AGENT=EarthPulse/1.0
   ```
   > 💡 **데이터베이스**: Vercel은 데이터베이스를 제공하지 않으므로, 별도의 MySQL 호스팅이 필요합니다.
   > - [PlanetScale](https://planetscale.com) (무료 티어 제공)
   > - [Railway](https://railway.app) MySQL (무료 티어 제공)
   > - [Supabase](https://supabase.com) PostgreSQL (무료 티어 제공, 코드 수정 필요)
6. Deploy!
7. **배포 완료 후 Vercel에서 제공하는 URL 복사** (예: `https://your-project.vercel.app`)

## 3단계: Vercel에 프론트엔드 배포 (2분)

> 💡 **참고**: 백엔드와 프론트엔드를 같은 Vercel 프로젝트에 배포할 수도 있습니다. 이 경우 별도 프로젝트를 만들 필요가 없습니다.

**옵션 A: 같은 프로젝트에 배포 (추천)**
- 백엔드 배포 시 Root Directory를 설정하지 않으면 자동으로 프론트엔드도 함께 배포됩니다
- `vercel.json`이 이미 설정되어 있어 자동으로 처리됩니다

**옵션 B: 별도 프로젝트로 배포**

1. [vercel.com](https://vercel.com)에서 "Add New Project" 클릭
2. 같은 GitHub 저장소 선택
3. **중요 설정:**
   - Root Directory: `web` 선택
   - Framework Preset: Vite
   - Build Command: `npm run build` (자동 감지됨)
   - Output Directory: `dist` (자동 감지됨)
4. Environment Variables 추가:
   ```
   VITE_API_BASE=https://your-backend-project.vercel.app/api
   ```
   > 💡 백엔드 배포 시 받은 Vercel URL을 여기에 입력하세요!
5. Deploy!

## 4단계: 데이터베이스 마이그레이션

데이터베이스 호스팅 서비스에 직접 접속하여 마이그레이션을 실행하세요:

**PlanetScale의 경우:**
1. PlanetScale 대시보드에서 데이터베이스 선택
2. "Console" 탭 클릭
3. `server/src/db/schema.sql` 파일의 내용을 복사하여 실행

**Railway MySQL의 경우:**
1. Railway 대시보드에서 MySQL 서비스 선택
2. "Data" 탭 → "Connect" 클릭
3. MySQL 클라이언트로 접속하여 `server/src/db/schema.sql` 실행

**또는 로컬에서 실행:**
```bash
cd server
# .env 파일에 프로덕션 데이터베이스 정보 설정
npm run migrate
```

## 5단계: CORS 설정 확인

`server/src/index.js`에서 CORS가 이미 모든 origin을 허용하도록 설정되어 있습니다:
```javascript
app.use(cors());
```

특정 도메인만 허용하려면 다음과 같이 수정하세요:
```javascript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://your-app.vercel.app'  // Vercel에서 받은 URL
  ],
  credentials: true
}));
```

GitHub에 푸시하면 Vercel이 자동으로 재배포됩니다.

## 6단계: 프론트엔드 API URL 업데이트 (필요시)

> 💡 백엔드를 먼저 배포했다면 이미 환경 변수에 설정했을 것입니다.
> 만약 나중에 백엔드 URL이 변경되었다면:

Vercel 대시보드에서:
1. 프로젝트 선택 → Settings → Environment Variables
2. `VITE_API_BASE` 값을 Vercel 백엔드 URL로 업데이트
3. Redeploy

## ✅ 완료!

이제 다음 URL들이 준비되었습니다:
- 프론트엔드: `https://your-app.vercel.app` (Vercel에서 제공)
- 백엔드: `https://your-project.vercel.app/api` (Vercel에서 제공)

### 🧪 테스트

1. **백엔드 테스트:**
   ```
   https://your-project.vercel.app/api/health
   ```
   브라우저에서 열어서 `{"status":"ok"}` 응답 확인

2. **프론트엔드 테스트:**
   ```
   https://your-app.vercel.app
   ```
   브라우저에서 열어서 3D 지구가 표시되는지 확인

3. **크론 작업 확인:**
   - Vercel 대시보드 → 프로젝트 → Settings → Cron Jobs
   - USGS (5분마다)와 OpenAQ (15분마다) 작업이 자동으로 실행됩니다

## 📝 포트폴리오에 추가

```markdown
## EarthPulse

3D 지구 실시간 환경 대시보드

- **라이브 데모**: https://your-app.vercel.app
- **GitHub**: https://github.com/your-username/earthpulse
```

---

## 🆘 문제 해결

### Vercel 빌드 실패
- Root Directory가 올바르게 설정되었는지 확인
- `vercel.json` 파일이 프로젝트 루트에 있는지 확인
- `api/index.js` 파일이 존재하는지 확인

### 백엔드 배포 실패
- 환경 변수가 모두 설정되었는지 확인
- 데이터베이스 연결 정보가 올바른지 확인
- Vercel 로그에서 정확한 에러 메시지 확인

### 데이터베이스 연결 오류
- 데이터베이스 호스팅 서비스가 실행 중인지 확인
- 방화벽 설정에서 Vercel IP를 허용했는지 확인 (필요시)
- 환경 변수의 데이터베이스 정보가 정확한지 확인

### 크론 작업이 실행되지 않음
- Vercel 대시보드 → Settings → Cron Jobs에서 설정 확인
- `vercel.json`의 `crons` 설정이 올바른지 확인
- Vercel Pro 플랜이 필요한지 확인 (무료 플랜에서는 제한적)

### CORS 오류
- `server/src/index.js`에서 CORS 설정 확인
- 브라우저 콘솔에서 정확한 에러 메시지 확인

