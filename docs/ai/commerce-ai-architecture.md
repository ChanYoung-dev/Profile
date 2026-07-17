> Architecture Summary

# 커머스 운영 이슈 분석을 위한 AI 아키텍처 정리

운영DB를 직접 LLM에 노출하지 않고, 사내망 전용 Tool/API와 로컬 또는 외부 LLM을 조합해 안전하게 운영 문제를 분석하는 구조

### 목차

- [1. 문제 상황](#problem)
- [2. 핵심 원칙](#principle)
- [3. 주요 용어 정리](#terms)
- [4. 권장 아키텍처](#architecture)
- [5. Context API와 Diagnosis API](#context-api)
- [6. 외부 LLM vs 로컬 LLM](#local-llm)
- [7. Safe SQL Tool](#safe-sql)
- [8. 현실적인 도입 로드맵](#roadmap)
- [9. 백엔드 개발자에게 설명하는 방식](#backend-explain)

## 1. 문제 상황

커머스 쇼핑몰에서 특정 고객이 주문서에 진입했을 때 사용할 수 있는 포인트가 0원으로 표시되는 CS가 들어왔다고 가정한다.

이 문제를 해결하려면 보통 다음 정보가 필요하다.

- 모바일 Front 또는 PC Front에서 포인트 표시 로직 확인
- Order API 또는 Point API의 주문서 포인트 계산 로직 확인
- 회원 ID, 상품 ID, 주문번호, 결제수단 기준의 운영DB 데이터 확인
- 포인트 락, 결제 대기 주문, 상품 카테고리 정책, 고객사 정책, 결제수단 정책 확인
- 필요 시 MQ, 이벤트 이력, 로그, 캐시까지 추적

**핵심 문제:** LLM이 원인 분석을 잘하려면 운영 데이터가 필요하지만, 운영DB는 보안상 VDI 또는 사내망 내부에서만 접근 가능하다.

## 2. 핵심 원칙

### LLM에게 운영DB를 직접 열어주지 않는다

```
위험한 구조
LLM → 운영DB 직접 접속
```

이 구조는 개인정보 유출, 대량 조회, Full Scan, 잘못된 SQL 실행, 감사 불가 문제가 있다.

```
권장 구조
LLM → MCP / Tool Gateway → 사내망 전용 운영 API → ReadOnly DB
```

운영DB 접근 권한은 사내망 내부의 Tool/API만 갖고, LLM은 그 Tool을 통해 제한적으로 데이터를 조회한다.

### Read Only

운영DB 계정은 SELECT만 가능해야 한다. INSERT, UPDATE, DELETE, MERGE, DDL은 금지한다.

### Tool Gateway

LLM과 운영 시스템 사이의 통제 계층이다. 허용된 Tool/API만 호출하게 한다.

### Audit

누가 어떤 고객/주문 데이터를 언제 조회했는지 반드시 기록한다.

### Masking

개인정보, 카드번호, 전화번호, 주소, 이메일 등은 LLM에 전달하지 않거나 마스킹한다.

## 3. 주요 용어 정리

| 용어 | 백엔드 개발자 관점 설명 |
| --- | --- |
| MCP | LLM이 외부 Tool/API를 호출하기 위한 표준 인터페이스. 쉽게 말해 “AI용 함수 호출 인터페이스”다. |
| Tool Gateway | LLM이 운영DB나 내부 시스템에 직접 접근하지 못하게 막는 중간 통제 계층이다. |
| Context API | 정답을 내리는 API가 아니라, AI가 분석할 수 있도록 운영 데이터를 업무 단위로 묶어서 제공하는 API다. |
| Diagnosis API | 반복되는 운영 문제에 대해 원인 후보나 reasonCode까지 판단해주는 진단 API다. |
| 사내 GPT | 회사 내부 문서, 소스, 운영 Tool과 연결된 회사 전용 ChatGPT 같은 시스템이다. |
| 로컬 LLM | OpenAI/Claude 같은 외부 서버가 아니라 회사 내부망, VDI, 사내 GPU 서버에서 실행되는 LLM이다. |
| Safe SQL Tool | LLM이 만든 SQL을 바로 실행하지 않고, SELECT 여부, 허용 테이블, 금지 컬럼, row limit 등을 검사한 뒤 제한적으로 실행하는 도구다. |

## 4. 권장 아키텍처

### 외부 LLM 기반 사내 GPT 구조

```
Claude / OpenAI / Gemini
  ↓
MCP / AI Gateway
  ↓
사내망 전용 Context API / Ops API
  ↓
ReadOnly 운영DB / 로그 / MQ / 캐시
```

외부 LLM을 사용하는 경우 운영 원본 데이터는 절대 그대로 보내지 않고, 마스킹/요약/제한된 결과만 전달한다.

### 로컬 LLM 기반 사내 GPT 구조

```
사내망 GPU 서버 또는 VDI 내부
  ├── Local LLM
  ├── MCP / Tool Gateway
  ├── Context API
  ├── Safe SQL Tool
  └── ReadOnly 운영DB 접근
```

운영DB 조회 결과가 외부 LLM 회사로 나가지 않는다는 장점이 있다. 다만 내부망이어도 SQL 안전장치, 감사, 권한관리는 필요하다.

**정확한 표현:** “VDI API”라기보다는 “사내망 전용 운영 진단 API”, “Internal Ops API”, “Internal Support Tool API”라고 부르는 것이 더 자연스럽다.

## 5. Context API와 Diagnosis API

### 테이블별 API는 비추천

```
비추천
GET /point-info
GET /customer-product-category
GET /point-product-category
```

테이블별 API를 만들면 AI가 조인 조건과 정책을 직접 추론해야 하므로 위험하고, 운영 테이블 구조가 과도하게 노출된다.

### 업무 Context 단위 API 추천

```
추천
GET /context/checkout?memberId=...&productId=...&orderNo=...&paymentMethod=...
```

이 API는 주문서 진입 시점의 포인트 판단에 필요한 데이터를 한 번에 묶어서 반환한다.

```
{
  "memberPoint": {
    "totalPoint": 50000,
    "availablePoint": 0,
    "lockedPoint": 50000
  },
  "productPolicy": {
    "pointUsable": false,
    "reason": "CATEGORY_NOT_ALLOWED"
  },
  "paymentPolicy": {
    "pointAllowed": true
  },
  "pendingOrders": [
    {
      "status": "PAYMENT_PENDING",
      "lockedPoint": 50000
    }
  ],
  "reasonHints": [
    "POINT_LOCKED_BY_PENDING_ORDER",
    "PRODUCT_CATEGORY_NOT_POINT_ELIGIBLE"
  ]
}
```

### Diagnosis API는 반복 케이스에만 승격

```
초기 단계
/context/checkout
/context/member-point
/context/order-timeline
/context/event-timeline

반복 CS 발생 후 승격
/diagnosis/point/checkout-availability
/diagnosis/coupon/apply-failure
/diagnosis/cash-receipt/issue-failure
```

매 CS마다 API를 만드는 것이 아니라, 먼저 범용 Context API를 만들고 자주 반복되는 운영 문의만 전용 Diagnosis API로 만든다.

## 6. 외부 LLM vs 로컬 LLM

| 구분 | 외부 LLM 기반 | 로컬 LLM 기반 |
| --- | --- | --- |
| 예시 | Claude, OpenAI, Gemini | Qwen, Llama, Mistral, DeepSeek 계열을 사내 서버에서 실행 |
| 장점 | 성능과 추론력이 좋고 도입이 빠름 | 운영 데이터가 외부로 나가지 않음 |
| 단점 | 민감 데이터 전달 위험이 있어 마스킹/요약 필수 | GPU 서버, 모델 운영, 성능 튜닝 필요 |
| 운영DB 접근 | 원본 전달 금지. Context API 또는 reasonCode 위주 | 내부망에서 Safe SQL 또는 Context API 사용 가능 |
| 현실적 채택 | 일반 IT, 커머스, SaaS에서 더 흔함 | 금융, 방산, 반도체, 망분리 환경에서 선호 |

**현실적인 결론:** 로컬 LLM은 Context API 개발 부담을 줄일 수 있지만, 운영DB를 안전하게 조회하기 위한 Tool Gateway, Safe SQL, Audit은 여전히 필요하다.

## 7. Safe SQL Tool

Safe SQL Tool은 LLM이 만든 SQL을 바로 운영DB에서 실행하지 않고, 실행 전 검사를 통과한 SQL만 제한적으로 실행하는 DB 프록시다.

```
Local LLM
  ↓
MCP Tool: execute_safe_sql
  ↓
Safe SQL Tool
  ↓
SQL 검사
  ↓
ReadOnly Replica
  ↓
결과 row 제한 + 마스킹
```

### 필수 제한 정책

- SELECT만 허용
- INSERT / UPDATE / DELETE / MERGE / DROP / ALTER 금지
- 허용 테이블만 조회 가능
- 개인정보 컬럼 차단
- SELECT \* 금지
- WHERE 조건 필수
- ROWNUM 또는 FETCH FIRST 강제
- timeout 설정
- Audit log 저장
- 운영 Master DB가 아니라 ReadOnly Replica만 접근

### 정책 예시

```
allowedTables:
  - POINT_INFO
  - ORDER_POINT_LOCK
  - ORDER_MASTER
  - PRODUCT_POLICY

blockedColumns:
  - PHONE_NO
  - EMAIL
  - ADDRESS
  - CARD_NO
  - PASSWORD

maxRows: 100
timeoutSeconds: 3
selectOnly: true
requireWhere: true
blockSelectStar: true
```

**추천:** 처음부터 자유 SQL Tool로 가지 말고, Query Template Tool → Context API → 제한된 Safe SQL Tool 순서로 확장하는 것이 안전하다.

## 8. 현실적인 도입 로드맵

1. **1단계:** 운영DB 직접 접근 금지 원칙 확정
2. **2단계:** ReadOnly 계정과 사내망 전용 API 서버 준비
3. **3단계:** 포인트/주문/결제 관련 Context API 1~2개만 PoC로 구현
4. **4단계:** MCP를 통해 LLM이 Context API를 호출하게 연결
5. **5단계:** Audit, Masking, Auth, row limit, timeout 적용
6. **6단계:** 반복 CS를 Diagnosis API로 승격
7. **7단계:** 내부망 GPU 서버 기반 로컬 LLM 검토
8. **8단계:** 마지막으로 제한된 Safe SQL Tool 검토

### PoC

백엔드 1명 + 인프라 1명 기준 2~4주. Local LLM 또는 외부 LLM에 샘플 Context API 1~2개 연결.

### 실무 1차

백엔드 2명 + 인프라 1명 + 보안 검토 기준 2~3개월. 인증, 감사, 마스킹, 운영DB ReadOnly 적용.

### 전사 플랫폼

플랫폼/인프라/보안/백엔드/데이터팀 필요. 6개월 이상 규모가 될 수 있음.

## 9. 백엔드 개발자에게 설명하는 방식

### 한 줄 설명

```
LLM에게 운영DB 직접 권한을 주는 게 아니라,
기존 운영툴 API처럼 중간 API를 만들고,
AI가 그 API를 호출해서 운영 이슈를 분석하는 구조입니다.
```

### 백엔드 개발자 관점 비유

```
MCP = AI가 내부 API를 호출하기 위한 표준 인터페이스
Context API = AI용 운영 어드민 API
Tool Gateway = 보안 필터가 붙은 내부 API Gateway
Safe SQL Tool = SQL 검문소
```

### 최종 추천 구조

```
개발자 / 사내 GPT
  ↓
Claude 또는 Local LLM
  ↓
MCP / Tool Gateway
  ↓
사내망 전용 Context API
  ↓
ReadOnly 운영DB + 로그 + MQ + 캐시
```

핵심은 “AI가 운영DB를 직접 조회한다”가 아니라 “AI가 안전하게 설계된 운영 Tool을 호출한다”이다.

## 최종 결론

**가장 현실적인 방향:**

처음부터 로컬 LLM + Safe SQL + 전사 AI 플랫폼을 만들지 말고, 먼저 사내망 전용 Context API 몇 개를 만들고 MCP로 연결한다. 이후 반복되는 운영 문제만 Diagnosis API로 승격하고, 보안 요구가 높아지면 로컬 LLM과 Safe SQL Tool을 단계적으로 검토한다.

```
1차 목표
AI가 운영DB를 자유롭게 조회하게 만들기 ❌

AI가 사내망 전용 운영 API를 안전하게 호출하게 만들기 ✅
```

문서 목적: 커머스 운영 이슈 분석용 AI 아키텍처를 백엔드 개발자 관점에서 이해하기 쉽게 정리.
