# AI-Driven Development Life Cycle (AI-DLC) 정리 보고서

## 1. 개요

AWS는 기존 SDLC(Software Development Life Cycle)가 AI 시대에 적합하지 않다고 보고, 이를 보완하기 위해 **AI-Driven Development Life Cycle(AI-DLC)** 라는 개념을 제안하였다.

AI-DLC는 단순 코드 자동완성이 아니라:

- 요구사항 분석
- 설계
- 구현
- 테스트
- 배포
- 운영

전 단계에서 **AI가 개발 workflow를 주도**하고, 인간은 **정책·승인·아키텍처 판단을 담당**하는 개발 방식이다.

핵심 철학은:

> “AI가 실행을 주도하되(Human-in-the-loop), 인간이 통제한다.”

---

# 2. 기존 개발 방식의 문제점

AWS는 기존 개발 방식의 가장 큰 문제를 **Context Fragmentation (문맥 단절)** 으로 본다.

기존 개발 환경:

```text
Jira (요구사항)
↓
Confluence (설계)
↓
GitHub (코드)
↓
Jenkins (테스트)
↓
CloudWatch / 로그 (운영)
```

각 영역이 분리되어 있어 개발자가 직접 문맥을 연결해야 한다.

예시:

“교환완료 이후 주문상태 변경 가능” 정책 변경 시:

```text
정책 문서 찾기
→ 주문 API 찾기
→ 영향도 분석
→ 반품/교환 흐름 확인
→ 정산 영향도 분석
→ 테스트 시나리오 검토
```

현재는 사람이 직접 이 Context Stitching을 수행하고 있다.

AWS는 이를:

> AI가 문맥을 연결해야 한다

고 주장한다.

---

# 3. 왜 새로운 AI 접근 방식이 필요한가?

AWS는 기존 AI 활용 방식을 두 가지로 구분하고 둘 다 한계를 지적한다.

## 3.1 AI-Assisted (현재 대부분)

예:
- GitHub Copilot
- ChatGPT
- Claude Code

구조:

```text
개발자
 ↓
일부 코드 요청
 ↓
AI 응답
```

### 문제점

AI는:

- 정책을 모름
- 운영 환경을 모름
- MSA 구조를 모름
- 영향도를 모름

예:

“교환완료 이후 상태변경 불가” 정책을 모르기 때문에:

```java
order.changeStatus(CANCEL_COMPLETE);
```

같은 위험한 코드를 추천할 수 있다.

즉:

> “겉보기엔 맞지만 실제 운영에서는 위험한 코드”

를 생성할 가능성이 존재한다.

---

## 3.2 AI-Managed (극단)

반대로:

> “AI가 알아서 다 만들게 하자”

라는 접근.

### 문제점

- 설계 검증 없음
- 정책 검증 없음
- 보안 검토 없음
- 기술부채 증가

AWS는 이를:

> Vibe Coding의 위험

이라고 본다.

---

## 3.3 AI-Driven (AWS 권장)

AWS가 제안하는 방식:

### AI 역할

- 요구사항 분석
- 영향도 분석
- 코드 생성
- 테스트 생성
- 문서 생성
- 로그 분석
- 운영 진단

### 인간 역할

- 정책 판단
- 승인
- 보안 검토
- 아키텍처 의사결정
- 위험성 평가

즉:

> AI는 실행자, 인간은 의사결정자

---

# 4. AI-DLC란 무엇인가?

AI-DLC는:

> SDLC 전체에 AI를 통합한 개발 방식

이다.

기존 SDLC:

```text
요구사항
↓
설계
↓
개발
↓
테스트
↓
배포
```

AI-DLC:

```text
요구사항
↓
AI 영향도 분석
↓
AI 설계안 생성
↓
AI 작업 계획
↓
AI 구현
↓
AI 테스트
↓
배포
↓
AI 운영 분석
↓
회고 및 개선
```

핵심은:

> AI가 workflow orchestration을 수행한다.

---

# 5. AI-DLC의 3단계

## 5.1 Inception (기획/설계)

AI가:

### 요구사항 분석

예:

> “배송비 부분취소 가능”

AI는:

- 관련 서비스
- DB 영향도
- API 영향도
- 이벤트 영향도

를 분석한다.

---

### 아키텍처 초안 제안

예:

현금영수증 처리 비동기화

AI 제안:

```text
Order Core
    ↓ MQ
Cash Receipt Consumer
```

---

### 테스트 전략 제안

예:

```text
정상취소
부분취소
중복취소
경합상황
외부 API timeout
retry 검증
```

---

## 5.2 Construction (구현)

AI가:

### 코드 생성

정책 기반 구현.

---

### 테스트 코드 생성

예:

```java
should_retry_cash_receipt()
```

---

### PR 자동 작성

예:

```text
변경 목적
영향 범위
리스크
테스트 범위
```

---

### 문서 자동화

- API 문서
- 운영 가이드
- Sequence Diagram

---

## 5.3 Operations (운영)

AWS가 특히 강조하는 영역.

AI가:

### 로그 분석

예:

```text
현금영수증 timeout 증가
```

AI:

```text
원인:
captAmerica 특정 노드 404 증가

시작 시점:
13:22

영향:
주문 23건
```

---

### 장애 분석

배포 이후 이상 탐지:

```text
최근 변경점 분석
→ 영향 API 분석
→ 로그 상관관계 분석
→ 원인 제시
```

---

### 회고

예:

```text
이번 장애 원인:
동기 호출 구조

개선안:
RabbitMQ 기반 비동기화 추천
```

---

# 6. AI-DLC 동작 매커니즘

핵심은:

## Context Loop

기존:

```text
요구사항 ↔ 코드 단절
코드 ↔ 운영 단절
```

AI-DLC:

```text
Requirement
 ↓
Code
 ↓
Test
 ↓
Deploy
 ↓
Logs
 ↓
Feedback
 ↓
Requirement 개선
```

AI가 lifecycle 전체 문맥을 유지한다.

---

## Adaptive Workflow

작업 난이도에 따라 workflow가 달라진다.

### 단순 버그

```text
AI 수정
→ 테스트
→ Merge
```

### 복잡 기능

```text
요구사항 분석
→ 영향도 분석
→ 설계
→ 승인
→ 구현
→ 운영 검증
```

---

## Human Oversight

중요 의사결정은 인간 승인.

특히:

- 보안
- 정책
- 개인정보
- 비용
- 아키텍처

---

# 7. AI-DLC의 장점

## 7.1 개발 속도 향상

AI가:

- 설계 초안
- 테스트 코드
- PR 설명
- 문서

를 자동 생성.

---

## 7.2 Context Loss 감소

레거시 탐색 비용 감소.

예:

```text
주문취소 정책
→ 관련 md
→ order-api
→ captAmerica
→ 배송비 정책
→ 정산 영향
```

를 AI가 탐색.

---

## 7.3 테스트 강화

AI가 edge case를 잘 찾음.

예:

- race condition
- retry
- duplicate request
- MQ 순서 보장
- partial refund

---

## 7.4 운영 안정성 증가

AI가:

단순 에러가 아닌

```text
배포 이후
Consul health delay
→ unavailable node routing
→ cash receipt 404 증가
```

같은 root cause를 연결 가능.

---

## 7.5 문서화 자동화

운영 지식 손실 방지.

---

# 8. 실제 현업(MSA/커머스)과의 연결

현재 커머스 시스템 특징:

- 복잡한 주문 정책
- 숨겨진 업무 규칙
- 다수의 MSA
- 운영 장애 대응
- 정책 변경 영향도 분석 어려움

예:

```text
교환완료 이후 상태 변경 불가
```

같은 정책은:

AI가 코드만 보고는 알 수 없다.

따라서:

## Context 중심 구조 필요

```text
Policy Docs
↓
Context API
↓
MSA Metadata
↓
LLM
```

---

# 9. Claude Code와 AI-DLC 연결

현재 구성:

```text
Claude Code
+
CLAUDE.md
+
정책 md
```

는 AI-DLC Level 2~3 수준에 해당.

현재 문제:

- 정책 탐색 어려움
- md 파일 위치 탐색 비용
- 운영 context 부족

---

# 10. 권장 미래 구조

권장 구조:

```text
Claude / OpenAI / Gemini
          ↓
MCP / AI Gateway
          ↓
Context API
          ↓
ReadOnly 운영DB
로그
MQ
캐시
정책문서
```

---

## MCP / AI Gateway 역할

단순 API 호출이 아님.

역할:

### Tool Routing

어떤 Tool을 호출할지 결정.

---

### Permission

읽기 전용 제한.

---

### Audit

누가 무엇을 조회했는지 기록.

---

### Context Normalization

운영 데이터를 LLM 친화적으로 변환.

예:

AS-IS:

```json
{
  "POINT_STTS_CD": "P003"
}
```

TO-BE:

```json
{
  "reason": "POINT_LOCKED_BY_PENDING_ORDER"
}
```

---

# 11. 현재 상태 평가

현재:

```text
Claude Code
+ CLAUDE.md
+ 정책 md
```

→ AI-Assisted + Planning

중간 단계.

향후:

```text
LLM
↓
MCP
↓
Context API
↓
운영데이터
```

로 발전 시:

> 실제 AWS가 말하는 AI-DLC에 가까워짐.

---

# 12. 핵심 결론

AWS AI-DLC의 핵심은:

> “AI가 코드 자동완성기가 아니라
> 개발 lifecycle orchestration engine이 되는 것”

이다.

핵심 방향:

```text
AI + Context + Policy + Architecture + Operations
```

단순 코드 생성보다:

- 정책 이해
- 운영 이해
- 영향도 분석
- 테스트 전략
- 장애 분석

이 더 중요해지는 방향이다.