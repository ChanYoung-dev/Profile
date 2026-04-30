# Resume HTML — 3 Styles Design Spec

작성일: 2026-04-30
대상: `docs/resume_short.pdf` 의 콘텐츠를 보존하면서 시각적 표현을 현대적으로 개선

## 배경

기존 PDF는 채용 플랫폼(사람인 등) 양식 그대로 추출되어 있어 정보 밀도는 높지만 시각적으로 답답하고 가독성이 떨어진다. PDF의 모든 정보를 손실 없이 유지하되 표현 방식을 현대적으로 바꾼 HTML 버전을 만들고, 동시에 인쇄(PDF 저장) 시에도 깔끔하게 출력되도록 한다.

## 결과물

```
resume.html              # 진입점. 3가지 스타일 미리보기 + 각 페이지 링크
resume-magazine.html     # A. 매거진/에디토리얼 스타일
resume-magazine.css
resume-minimal.html      # B. 미니멀 모던 2단 스타일
resume-minimal.css
resume-notion.html       # C. 한국형 노션 단정 스타일
resume-notion.css
```

## 콘텐츠 (PDF 원문 보존)

### 인적 사항
- 김찬영 (1993년생, 32세, 남)
- emrhssla@gmail.com / 010-9192-1372
- 경기 수원시 권선구 삼천병마로1598번길
- 포트폴리오: https://chanyoung-dev.github.io/Profile/
- 블로그: https://chanyoung-dev.github.io/
- 노션: https://chanlog.notion.site/d23d460f2e554944bf60448e47f982ef

### 간략 소개
정보통신공학 전공, 커머스 핵심 도메인 실무 경험 개발자. 두 축의 경험:
1. SK 엠앤서비스 복지몰 — 주문·결제 도메인 전담, MSA + 분산트랜잭션, 객체지향 리팩토링·테스트·MQ로 신뢰성·효율성 향상
2. 개인 프로젝트 — AI Agentic Coding 기반 코인 자동매매·알림 서비스, 멀티프로세스 대규모 데이터 처리

### 경력 (3년 10개월)
SK 엠앤서비스(주) 커머스개발1팀 · 대리/팀원 3년차 · 풀스택 (2022.07 ~ 재직중)

#### 1. 주문 고도화 프로젝트 (2024.12 ~ 2025.06)
- 기술: Spring Boot, Java, JavaScript, MyBatis, Oracle, Docker, MSA, Jenkins, RabbitMQ
- 1.1 MSA 주문·배송·결제 전면 재설계 (N:N 분리, 멱등성/동시성/분산 트랜잭션)
- 1.2 핵심 시나리오 테스트 코드 도입 → MTTR 45분 → 12분 (73% 단축)
- 1.3 RabbitMQ 도입 (후행 작업/대량 INSERT 비동기 처리, DLQ 활용)

#### 2. 운영 모니터링 및 운영 개선
- DataDog 실시간 모니터링, 근본 원인 분석
- 장애 인지 시간 20분 → 2분, 장애율 76.5% 감소

#### 3. ISMS 대응 (2025.06 ~ 2025.07)
- MSA XSS 처리 통합 애노테이션, 가이드 구축
- ISMS 점검 XSS 관련 80% 단축

#### 4. 커머스 운영 자동화 및 안정성 강화 (2024.05 ~ 2024.07)
- 초도배송비 복구/주문 상태 변경/공급가 자동화
- CS 연 1,500건 → 10건 이하 (99% 개선), MTBF 2~3일 → 1개월+

### 개인 프로젝트: 코인 자동매매 및 알림 서비스 (2024.01 ~ 2025.10)
Node.js, Python, React, Binance/Upbit API, TradingView Script
- 멀티프로세스 백테스트 (단일 대비 ~10배), 재현성 95%
- Telegram 구독자 760명, 멀티 SNS 자동 포스팅
- AI Agentic Coding으로 React 대시보드 + AI 서비스 연동

### 학력
- 성결대학교 정보통신공학 (2013.03 ~ 2020.02), 학점 3.17/4.5
- 영생고등학교 이과계열 (2009.03 ~ 2012.02)

### 자격/어학/수상
정보처리기사 / TOEIC 760 / 한이음 ICT 공모전 입상 / 한국사 1급 / MOS Word 2010 Expert / MOS Outlook 2010 Core / SK Supex / 1종보통

### 기타
- 기술 블로그 운영 (2018.12~)
- 구름 쿠버네티스 전문가 양성 과정 (2021.12 ~ 2022.05)

### 주요 강점
주문·결제·정산 도메인 전문성 / 테스트·자동화 안정성 / 보안·운영 안정성 / 유지보수·확장성 시스템 설계 / 대규모 트래픽·MQ 경험 / MSA·분산트랜잭션 / MTBF 4~6배↑, MTTR 60~75%↓

### 핵심 스킬
Java · Spring Boot · Spring Data JPA · MyBatis · Oracle · MSA · RabbitMQ · Docker · Jenkins · AWS · JavaScript · Vue.js · React · jQuery · Python · git · CI/CD · AI Agentic Coding

## 디자인 사양

### 공통
- 폰트: Pretendard (한국어), JetBrains Mono (수치/코드)
- A4 인쇄 최적화: `@media print { ... }` 으로 toolbar/네비 숨김, 페이지 마진 조정
- floating 우측 상단 toolbar: "🖨 PDF 저장", "← 다른 스타일 보기"
- 외부 의존성 최소화 (CDN 폰트만)
- `docs/picture.jpg` 프로필 사진 활용 (선택)
- 외부 JS 파일 없음. 인라인 `window.print()` 트리거만

### A. resume-magazine.html — 매거진/에디토리얼
- 큰 타이포그래피 hero ("Backend Engineer · Commerce Domain")
- 통계 카드 4개 (3년 10개월, MTTR 73%↓, CS 99%↓, MTBF 4~6배↑)
- 프로젝트별 큰 섹션, WHY/HOW/IMPACT 컬러 박스 (오렌지/시안/그린)
- 인디고 + 액센트, 좌우 비대칭 그리드
- 페이지 분리: cover → 경력 → 개인 프로젝트 → 학력/자격
- 인쇄 분량: A4 3페이지 내외

### B. resume-minimal.html — 미니멀 모던 2단
- 좌측 사이드바 280~300px: 사진(원형), 이름·직무, 연락처, 핵심 스킬, 학력, 자격증
- 우측 본문: 한 줄 요약 → 간략 소개 → 경력 (회사 > 프로젝트 > 핵심 성과 bullet)
- 흑백 + 단일 강조색(인디고 #4f46e5)
- 충분한 여백, 가는 구분선, 작은 메타 라벨
- 인쇄 분량: A4 1.5~2페이지에 압축

### C. resume-notion.html — 한국형 노션 단정
- 단일 컬럼 좌측 정렬, 최대폭 760px
- 헤더: 좌측 사진 + 우측 이름·인적사항 표
- 섹션별 H2 + 가로 구분선, 정보는 라벨-값 그리드/표
- 회색-검정 베이스, 액센트 1색 (블루 그레이)
- 노션 페이지 느낌의 청결한 카드/리스트
- 인쇄 분량: A4 2~3페이지

## 검증

- 각 HTML을 브라우저에서 열어 시각 확인
- Cmd+P 인쇄 미리보기로 PDF 출력 시 레이아웃 깨짐 여부 확인
- toolbar 버튼이 인쇄 결과에서 보이지 않는지 확인
- 콘텐츠 누락 여부 PDF 원문과 대조

## 비범위 (Out of scope)

- 다국어 지원 (한국어만)
- 다크 모드 (인쇄 우선이라 라이트만)
- 동적 데이터/CMS 연동