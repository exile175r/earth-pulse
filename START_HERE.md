# 🚀 EarthPulse 시작하기

## 📋 빠른 시작 (5단계)

### 1️⃣ 의존성 설치

```bash
# 서버 의존성 설치
cd earthPulse/server
npm install

# 웹 의존성 설치 (새 터미널)
cd earthPulse/web
npm install
```

### 2️⃣ 데이터베이스 준비

MySQL이 설치되어 있어야 합니다.

```bash
# MySQL 접속
mysql -u root -p

# 데이터베이스 생성
CREATE DATABASE earth_dashboard;

# 종료
exit;
```

### 3️⃣ 환경 변수 설정

`earthPulse/server/.env` 파일을 생성하고 다음 내용을 입력하세요:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=earth_dashboard
REDIS_URL=redis://localhost:6379
PORT=3000
NODE_ENV=development
ADMIN_TOKEN=my_secret_token_123
API_USER_AGENT=EarthPulse/1.0 (contact@example.com)
```

> 💡 `.env.example` 파일을 복사해서 사용하세요:
> ```bash
> cd earthPulse/server
> copy .env.example .env
> # 그 다음 .env 파일을 편집하세요
> ```

### 4️⃣ 데이터베이스 마이그레이션

```bash
cd earthPulse/server
npm run migrate
```

성공하면 다음과 같은 메시지가 표시됩니다:
```
✓ Migration completed successfully
```

### 5️⃣ 실행

**터미널 1 - 서버 실행:**
```bash
cd earthPulse/server
npm start
```

서버가 시작되면:
- ✅ `http://localhost:3000`에서 API 서버 실행
- ✅ 크론 작업 자동 시작 (USGS: 5분마다, OpenAQ: 15분마다)

**터미널 2 - 웹 실행:**
```bash
cd earthPulse/web
npm run dev
```

웹 애플리케이션이 시작되면:
- ✅ `http://localhost:5173`에서 웹 앱 실행
- ✅ 브라우저가 자동으로 열립니다

---

## 🧪 테스트

### 서버 상태 확인

브라우저에서 열기: http://localhost:3000/api/health

또는 터미널에서:
```bash
curl http://localhost:3000/api/health
```

### 수동 데이터 수집 테스트

```bash
# USGS 지진 데이터 수집
curl -X POST "http://localhost:3000/api/admin/ingest?source=usgs" -H "x-admin-token: my_secret_token_123"

# OpenAQ 대기질 데이터 수집
curl -X POST "http://localhost:3000/api/admin/ingest?source=openaq" -H "x-admin-token: my_secret_token_123"
```

---

## 🎯 다음 단계

1. **데이터 확인**: MySQL에서 데이터가 수집되었는지 확인
   ```sql
   SELECT COUNT(*) FROM earthquakes;
   SELECT COUNT(*) FROM air_quality;
   ```

2. **웹에서 확인**: 브라우저에서 http://localhost:5173 열기
   - 3D 지구가 표시됩니다
   - 시간 슬라이더로 시간 범위 조정
   - 파라미터 토글 (PM2.5, PM10, O3)

3. **개발 계속**: `PLAN.md`를 참고하여 추가 기능 구현

---

## ❗ 문제 해결

### "Database connection failed"
- MySQL이 실행 중인지 확인: `mysql -u root -p`로 접속 테스트
- `.env` 파일의 데이터베이스 정보 확인
- 사용자 권한 확인

### "Cannot find module"
- `npm install`이 완료되었는지 확인
- `node_modules` 폴더가 있는지 확인

### "Port 3000 already in use"
- 다른 프로그램이 3000 포트를 사용 중입니다
- `.env` 파일에서 `PORT=3001`로 변경하거나
- 사용 중인 프로세스를 종료하세요

### 크론 작업이 실행되지 않음
- 서버 로그 확인
- 네트워크 연결 확인
- API 응답 확인 (브라우저에서 직접 USGS/OpenAQ API 테스트)

---

## 📚 더 자세한 정보

- `GETTING_STARTED.md` - 상세한 시작 가이드
- `PLAN.md` - 프로젝트 전체 계획
- `README.md` - 프로젝트 개요

