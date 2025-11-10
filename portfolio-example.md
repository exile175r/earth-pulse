# 포트폴리오용 프로젝트 설명 예시

## HTML 예시

```html
<section class="project" id="earthpulse">
  <div class="project-image">
    <img src="screenshots/earthpulse.png" alt="EarthPulse Dashboard">
    <div class="project-overlay">
      <a href="https://earthpulse.vercel.app" target="_blank" class="btn-primary">
        라이브 데모 보기
      </a>
      <a href="https://github.com/your-username/earthpulse" target="_blank" class="btn-secondary">
        GitHub 코드
      </a>
    </div>
  </div>
  <div class="project-content">
    <h3>EarthPulse</h3>
    <p class="project-tagline">3D 지구 실시간 환경 대시보드</p>
    <p class="project-description">
      USGS 지진 데이터와 OpenAQ 대기질 데이터를 실시간으로 수집하여 
      3D 지구 위에 시각화하는 인터랙티브 대시보드입니다. 
      사용자는 시간 슬라이더를 통해 과거 데이터를 탐색하고, 
      지구를 회전/확대하여 전 세계의 환경 데이터를 확인할 수 있습니다.
    </p>
    <div class="project-tech">
      <span class="tech-tag">React</span>
      <span class="tech-tag">Three.js</span>
      <span class="tech-tag">Express</span>
      <span class="tech-tag">MySQL</span>
      <span class="tech-tag">Node.js</span>
    </div>
    <div class="project-features">
      <h4>주요 기능:</h4>
      <ul>
        <li>3D 지구 인터랙티브 시각화</li>
        <li>실시간 지진 데이터 표시</li>
        <li>대기질 히트맵 (PM2.5, PM10, O3)</li>
        <li>시간 기반 데이터 탐색</li>
        <li>3D ↔ 2D 지도 모드 전환</li>
      </ul>
    </div>
  </div>
</section>
```

## Markdown 예시 (GitHub, Notion 등)

```markdown
## 🌍 EarthPulse

**3D 지구 실시간 환경 대시보드**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit-blue?style=for-the-badge)](https://earthpulse.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github)](https://github.com/your-username/earthpulse)

### 📝 프로젝트 소개

USGS 지진 데이터와 OpenAQ 대기질 데이터를 실시간으로 수집하여 3D 지구 위에 시각화하는 인터랙티브 대시보드입니다.

### ✨ 주요 기능

- 🌐 **3D 지구 시각화**: react-three-fiber를 사용한 인터랙티브 3D 지구
- 📍 **실시간 지진 데이터**: USGS API에서 최근 지진 데이터 수집 및 표시
- 💨 **대기질 히트맵**: OpenAQ API에서 대기질 데이터 수집 및 히트맵 시각화
- ⏰ **시간 탐색**: 시간 슬라이더로 과거 데이터 탐색
- 🗺️ **3D ↔ 2D 전환**: 3D 지구와 2D 지도 모드 전환
- 🏙️ **국가/도시 상세**: 클릭으로 국가 및 도시 정보 확인

### 🛠️ 기술 스택

**Frontend:**
- React 18
- Three.js / react-three-fiber
- Zustand (상태 관리)
- Vite (빌드 도구)

**Backend:**
- Node.js
- Express
- MySQL 8.0+
- node-cron (ETL 작업)

**데이터 소스:**
- USGS Earthquake API
- OpenAQ v2 API

**배포:**
- Vercel (Frontend)
- Railway (Backend)

### 📸 스크린샷

![EarthPulse Dashboard](./screenshots/earthpulse-main.png)
![EarthPulse 3D View](./screenshots/earthpulse-3d.png)

### 🔗 링크

- **라이브 데모**: [https://earthpulse.vercel.app](https://earthpulse.vercel.app)
- **GitHub 저장소**: [https://github.com/your-username/earthpulse](https://github.com/your-username/earthpulse)
- **API 문서**: [https://earthpulse-api.railway.app/api/health](https://earthpulse-api.railway.app/api/health)

### 🎯 학습 포인트

- 3D 웹 그래픽스 (Three.js) 활용
- 실시간 데이터 수집 및 ETL 파이프라인 구축
- 공간 데이터베이스 설계 및 최적화
- 대용량 데이터 시각화 성능 최적화
- RESTful API 설계 및 구현
```

## React 컴포넌트 예시

```jsx
import React from 'react';

const EarthPulseProject = () => {
  return (
    <div className="project-card">
      <div className="project-image-wrapper">
        <img 
          src="/projects/earthpulse.png" 
          alt="EarthPulse Dashboard"
          className="project-image"
        />
        <div className="project-links">
          <a 
            href="https://earthpulse.vercel.app" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            라이브 데모
          </a>
          <a 
            href="https://github.com/your-username/earthpulse" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-secondary"
          >
            GitHub
          </a>
        </div>
      </div>
      
      <div className="project-content">
        <h3>EarthPulse</h3>
        <p className="project-tagline">
          3D 지구 실시간 환경 대시보드
        </p>
        <p className="project-description">
          USGS 지진 데이터와 OpenAQ 대기질 데이터를 실시간으로 수집하여 
          3D 지구 위에 시각화하는 인터랙티브 대시보드입니다.
        </p>
        
        <div className="project-tech-stack">
          <span>React</span>
          <span>Three.js</span>
          <span>Express</span>
          <span>MySQL</span>
        </div>
        
        <div className="project-features">
          <h4>주요 기능</h4>
          <ul>
            <li>3D 지구 인터랙티브 시각화</li>
            <li>실시간 지진 데이터 표시</li>
            <li>대기질 히트맵</li>
            <li>시간 기반 데이터 탐색</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EarthPulseProject;
```

## 간단한 텍스트 버전

```
EarthPulse - 3D 지구 실시간 환경 대시보드

USGS 지진 데이터와 OpenAQ 대기질 데이터를 실시간으로 수집하여 
3D 지구 위에 시각화하는 인터랙티브 대시보드입니다.

기술 스택: React, Three.js, Express, MySQL
기간: 2024년

라이브 데모: https://earthpulse.vercel.app
GitHub: https://github.com/your-username/earthpulse
```

