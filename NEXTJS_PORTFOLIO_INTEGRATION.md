# Next.js 포트폴리오에 EarthPulse 추가하기

Next.js로 만든 포트폴리오 사이트에 EarthPulse 프로젝트를 링크로 추가하는 방법입니다.

## 📋 개념

1. **EarthPulse는 별도로 배포** (Vercel, Netlify 등)
2. **포트폴리오 사이트에서 링크로 연결**
3. 사용자가 포트폴리오에서 "라이브 데모 보기" 클릭 → EarthPulse 사이트로 이동

---

## 🎨 Next.js 컴포넌트 예시

### 방법 1: 프로젝트 카드 컴포넌트

`components/ProjectCard.tsx` 또는 `components/projects/EarthPulse.tsx`:

```tsx
import Image from 'next/image';
import Link from 'next/link';

export default function EarthPulseProject() {
  return (
    <div className="project-card group">
      {/* 프로젝트 이미지 */}
      <div className="project-image-wrapper relative overflow-hidden rounded-lg">
        <Image
          src="/projects/earthpulse.png"
          alt="EarthPulse Dashboard"
          width={800}
          height={600}
          className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* 호버 시 링크 버튼 표시 */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
          <a
            href="https://earthpulse.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            라이브 데모 보기 →
          </a>
          <a
            href="https://github.com/your-username/earthpulse"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
          >
            GitHub 코드 →
          </a>
        </div>
      </div>

      {/* 프로젝트 정보 */}
      <div className="project-content mt-4">
        <h3 className="text-2xl font-bold mb-2">EarthPulse</h3>
        <p className="text-gray-400 mb-4">
          3D 지구 실시간 환경 대시보드
        </p>
        <p className="text-gray-300 mb-4">
          USGS 지진 데이터와 OpenAQ 대기질 데이터를 실시간으로 수집하여 
          3D 지구 위에 시각화하는 인터랙티브 대시보드입니다.
        </p>

        {/* 기술 스택 */}
        <div className="flex flex-wrap gap-2 mb-4">
          {['React', 'Three.js', 'Express', 'MySQL', 'Node.js'].map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 bg-gray-800 rounded-full text-sm text-gray-300"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* 링크 버튼 (모바일용) */}
        <div className="flex gap-3">
          <a
            href="https://earthpulse.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-center font-semibold hover:bg-blue-700 transition-colors"
          >
            라이브 데모
          </a>
          <a
            href="https://github.com/your-username/earthpulse"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg text-center font-semibold hover:bg-gray-700 transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
    </div>
  );
}
```

### 방법 2: 프로젝트 리스트에 추가

`app/projects/page.tsx` 또는 `pages/projects.tsx`:

```tsx
import EarthPulseProject from '@/components/projects/EarthPulse';

export default function ProjectsPage() {
  const projects = [
    {
      id: 'earthpulse',
      component: <EarthPulseProject />,
    },
    // 다른 프로젝트들...
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-12">프로젝트</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <div key={project.id}>{project.component}</div>
        ))}
      </div>
    </div>
  );
}
```

### 방법 3: 간단한 링크 버전

`components/projects/EarthPulseSimple.tsx`:

```tsx
export default function EarthPulseSimple() {
  return (
    <div className="border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold mb-2">EarthPulse</h3>
          <p className="text-gray-400 text-sm">
            3D 지구 실시간 환경 대시보드
          </p>
        </div>
        <a
          href="https://earthpulse.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300"
        >
          ↗
        </a>
      </div>
      
      <p className="text-gray-300 text-sm mb-4">
        USGS 지진 데이터와 OpenAQ 대기질 데이터를 실시간으로 시각화
      </p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="text-xs px-2 py-1 bg-gray-800 rounded">React</span>
        <span className="text-xs px-2 py-1 bg-gray-800 rounded">Three.js</span>
        <span className="text-xs px-2 py-1 bg-gray-800 rounded">Express</span>
        <span className="text-xs px-2 py-1 bg-gray-800 rounded">MySQL</span>
      </div>
      
      <div className="flex gap-2">
        <a
          href="https://earthpulse.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-400 hover:underline"
        >
          라이브 데모
        </a>
        <span className="text-gray-600">•</span>
        <a
          href="https://github.com/your-username/earthpulse"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-400 hover:underline"
        >
          GitHub
        </a>
      </div>
    </div>
  );
}
```

---

## 📝 데이터 기반 접근 (추천)

프로젝트 데이터를 별도 파일로 관리:

`data/projects.ts`:

```tsx
export interface Project {
  id: string;
  title: string;
  description: string;
  tagline: string;
  image: string;
  liveUrl: string;
  githubUrl: string;
  techStack: string[];
  features: string[];
}

export const projects: Project[] = [
  {
    id: 'earthpulse',
    title: 'EarthPulse',
    tagline: '3D 지구 실시간 환경 대시보드',
    description: 'USGS 지진 데이터와 OpenAQ 대기질 데이터를 실시간으로 수집하여 3D 지구 위에 시각화하는 인터랙티브 대시보드입니다.',
    image: '/projects/earthpulse.png',
    liveUrl: 'https://earthpulse.vercel.app',
    githubUrl: 'https://github.com/your-username/earthpulse',
    techStack: ['React', 'Three.js', 'Express', 'MySQL', 'Node.js'],
    features: [
      '3D 지구 인터랙티브 시각화',
      '실시간 지진 데이터 표시',
      '대기질 히트맵 (PM2.5, PM10, O3)',
      '시간 슬라이더로 과거 데이터 탐색',
      '3D ↔ 2D 지도 모드 전환',
    ],
  },
  // 다른 프로젝트들...
];
```

`components/ProjectCard.tsx` (재사용 가능):

```tsx
import Image from 'next/image';
import { Project } from '@/data/projects';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="project-card group">
      <div className="project-image-wrapper relative overflow-hidden rounded-lg mb-4">
        <Image
          src={project.image}
          alt={project.title}
          width={800}
          height={600}
          className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            라이브 데모 →
          </a>
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
          >
            GitHub →
          </a>
        </div>
      </div>

      <div className="project-content">
        <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
        <p className="text-gray-400 mb-4">{project.tagline}</p>
        <p className="text-gray-300 mb-4">{project.description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 bg-gray-800 rounded-full text-sm text-gray-300"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="flex gap-3">
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-center font-semibold hover:bg-blue-700 transition-colors"
          >
            라이브 데모
          </a>
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg text-center font-semibold hover:bg-gray-700 transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
    </div>
  );
}
```

사용:

```tsx
import ProjectCard from '@/components/ProjectCard';
import { projects } from '@/data/projects';

export default function ProjectsPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-12">프로젝트</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
```

---

## 🎨 Tailwind CSS 스타일 예시

`globals.css` 또는 프로젝트 스타일 파일에 추가:

```css
.project-card {
  @apply bg-gray-900 rounded-lg p-6 transition-all duration-300;
}

.project-card:hover {
  @apply shadow-xl shadow-blue-500/10;
}

.project-image-wrapper {
  @apply relative overflow-hidden rounded-lg;
}
```

---

## 📸 스크린샷 준비

1. **스크린샷 촬영:**
   - EarthPulse 앱 실행
   - 개발자 도구 (F12) → 디바이스 툴바 (Ctrl+Shift+M)
   - 데스크톱/모바일 뷰로 스크린샷

2. **이미지 저장:**
   ```
   public/
     projects/
       earthpulse.png (또는 .webp)
   ```

3. **Next.js Image 최적화:**
   ```tsx
   <Image
     src="/projects/earthpulse.png"
     alt="EarthPulse Dashboard"
     width={800}
     height={600}
     className="w-full h-auto"
   />
   ```

---

## ✅ 체크리스트

- [ ] EarthPulse 배포 완료 (Vercel 등)
- [ ] 배포 URL 확인
- [ ] GitHub 저장소 공개
- [ ] 스크린샷 촬영 및 저장
- [ ] Next.js 프로젝트에 컴포넌트 추가
- [ ] 링크 테스트 (새 탭에서 열리는지 확인)
- [ ] 모바일 반응형 확인

---

## 💡 팁

1. **외부 링크 표시:**
   - `target="_blank"` 사용
   - `rel="noopener noreferrer"` 보안을 위해 추가
   - 아이콘으로 외부 링크 표시 (예: ↗)

2. **SEO:**
   ```tsx
   <a
     href={project.liveUrl}
     target="_blank"
     rel="noopener noreferrer nofollow"
     aria-label={`${project.title} 라이브 데모 보기 (새 창)`}
   >
   ```

3. **애니메이션:**
   - 호버 효과로 사용자 경험 향상
   - Framer Motion 등 사용 가능

4. **접근성:**
   - 키보드 네비게이션 지원
   - 스크린 리더를 위한 aria-label

