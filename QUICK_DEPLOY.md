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

## 2단계: Vercel에 백엔드 배포 (1분) ⚠️ 먼저 배포!

> 💡 **팁**: 백엔드를 먼저 배포하면 URL을 바로 받을 수 있어서 프론트엔드 환경 변수 설정이 쉬워집니다.
> 
> 🎉 **좋은 소식**: 데이터베이스가 필요 없습니다! API 프록시 모드로 작동하므로 USGS와 OpenAQ API에서 직접 데이터를 가져옵니다.

1. [vercel.com](https://vercel.com) 가입/로그인
2. "Add New Project" 클릭
3. GitHub 저장소 선택
4. **중요 설정:**
   - Root Directory: 프로젝트 루트 (기본값)
   - Framework Preset: Other (또는 자동 감지)
   - Build Command: (비워두기 - 서버리스 함수이므로 빌드 불필요)
   - Output Directory: (비워두기)
5. Environment Variables 추가 (선택사항):
   ```
   NODE_ENV=production
   ADMIN_TOKEN=your_secure_token (admin 엔드포인트 사용 시)
   API_USER_AGENT=EarthPulse/1.0
   ```
   > 💡 **참고**: 데이터베이스 환경 변수는 필요 없습니다! API 프록시 모드로 작동합니다.
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

## 4단계: CORS 설정 확인

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

## 5단계: 프론트엔드 API URL 업데이트 (필요시)

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

3. **API 프록시 확인:**
   - 데이터는 USGS와 OpenAQ API에서 실시간으로 가져옵니다
   - 데이터베이스나 크론 작업이 필요 없습니다

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
- Vercel 로그에서 정확한 에러 메시지 확인
- `api/index.js` 파일이 존재하는지 확인
- `vercel.json` 설정이 올바른지 확인

### API 호출 오류
- USGS API와 OpenAQ API가 정상 작동하는지 확인
- Rate limit에 걸렸는지 확인 (너무 많은 요청 시)
- 네트워크 연결 상태 확인

### CORS 오류
- `server/src/index.js`에서 CORS 설정 확인
- 브라우저 콘솔에서 정확한 에러 메시지 확인

