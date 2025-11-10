# ⚡ 빠른 배포 가이드 (5분 안에)

포트폴리오에 올리기 위한 최소한의 배포 방법입니다.

## 🎯 목표

- 프론트엔드: Vercel에 배포
- 백엔드: Railway에 배포 (또는 로컬에서만 실행)

## 1단계: GitHub에 푸시 (2분)

```bash
# GitHub 저장소 생성 후
cd earthPulse
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/your-username/earthpulse.git
git push -u origin main
```

## 2단계: Railway에 백엔드 배포 (3분) ⚠️ 먼저 배포!

> 💡 **팁**: 백엔드를 먼저 배포하면 URL을 바로 받을 수 있어서 프론트엔드 환경 변수 설정이 쉬워집니다.

1. [railway.app](https://railway.app) 가입/로그인
2. "New Project" → "Deploy from GitHub repo"
3. 저장소 선택
4. **중요 설정:**
   - Root Directory: `server`
   - Start Command: `npm start`
5. "Variables" 탭에서 환경 변수 추가:
   ```
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
6. "Data" 탭 → "Add MySQL" (무료 티어 사용 가능)
7. MySQL 정보를 환경 변수에 추가 (Railway가 자동으로 제공)
8. Deploy!
9. **배포 완료 후 Railway에서 제공하는 URL 복사** (예: `https://your-backend.railway.app`)

## 3단계: Vercel에 프론트엔드 배포 (2분)

1. [vercel.com](https://vercel.com) 가입/로그인
2. "Add New Project" 클릭
3. GitHub 저장소 선택
4. **중요 설정:**
   - Root Directory: `web` 선택
   - Framework Preset: Vite
   - Build Command: `npm run build` (자동 감지됨)
   - Output Directory: `dist` (자동 감지됨)
5. Environment Variables 추가:
   ```
   VITE_API_BASE=https://your-backend.railway.app/api
   ```
   > 💡 Railway에서 받은 백엔드 URL을 여기에 입력하세요!
6. Deploy!

## 4단계: 데이터베이스 마이그레이션

Railway 대시보드에서:
1. 프로젝트 선택 → "View Logs" 또는 "Deployments" 탭
2. 터미널 열기 또는 "Run Command" 사용
3. 다음 명령 실행:
   ```bash
   npm run migrate
   ```

또는 Railway의 MySQL에 직접 접속하여 `server/src/db/schema.sql` 실행

## 5단계: CORS 설정 업데이트

`server/src/index.js`에서:

```javascript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://your-app.vercel.app'  // Vercel에서 받은 URL
  ],
  credentials: true
}));
```

GitHub에 푸시하면 Railway가 자동으로 재배포됩니다.

## 6단계: 프론트엔드 API URL 업데이트 (필요시)

> 💡 백엔드를 먼저 배포했다면 이미 환경 변수에 설정했을 것입니다.
> 만약 나중에 백엔드 URL이 변경되었다면:

Vercel 대시보드에서:
1. Settings → Environment Variables
2. `VITE_API_BASE` 값을 Railway 백엔드 URL로 업데이트
3. Redeploy

## ✅ 완료!

이제 다음 URL들이 준비되었습니다:
- 프론트엔드: `https://your-app.vercel.app` (Vercel에서 제공)
- 백엔드: `https://your-backend.railway.app` (Railway에서 제공)

### 🧪 테스트

1. **백엔드 테스트:**
   ```
   https://your-backend.railway.app/api/health
   ```
   브라우저에서 열어서 `{"status":"ok"}` 응답 확인

2. **프론트엔드 테스트:**
   ```
   https://your-app.vercel.app
   ```
   브라우저에서 열어서 3D 지구가 표시되는지 확인

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
- Root Directory가 `web`인지 확인
- `package.json`이 `web` 폴더에 있는지 확인

### Railway 배포 실패
- Root Directory가 `server`인지 확인
- 환경 변수가 모두 설정되었는지 확인
- MySQL이 추가되었는지 확인

### CORS 오류
- Vercel URL이 백엔드 CORS 설정에 포함되었는지 확인
- 브라우저 콘솔에서 정확한 에러 메시지 확인

