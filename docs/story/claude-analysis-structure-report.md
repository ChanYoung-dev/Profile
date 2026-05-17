# Claude Code 분석 체계 설계 보고서

## 1. 목적

이 문서는 지금까지 논의한 내용을 바탕으로, 대규모 MSA/멀티프로젝트 환경에서 Claude Code가 특정 기능을 안정적으로 분석하고 문서화할 수 있도록 하는 구조를 정리한 보고서다.

핵심 목표는 다음과 같다.

- 하위 폴더별 `.claude/CLAUDE.md` 자동 로드에 과도하게 의존하지 않는다.
- 서비스 중심이 아니라 **유스케이스/기능 중심**으로 분석한다.
- `CLAUDE.md`는 얇게 유지하고, 상세 절차는 `SKILL.md`로 분리한다.
- `docs/`는 사람과 AI가 함께 참조하는 지식 베이스로 운영한다.
- 분석 결과는 필요에 따라 `flow`와 `flow-deep` 두 단계 문서로 정리한다.

---

## 2. 문제 인식

### 2.1 하위 폴더 CLAUDE.md 자동 적용 한계

다음과 같은 구조가 있다고 가정했다.

- `projectA/src/ordersubmit/ecouponService/.claude/CLAUDE.md`
- `projectA/src/ordersubmit/.claude/CLAUDE.md`
- `projectA/src/ordercancel/.claude/CLAUDE.md`
- `projectA/.claude/CLAUDE.md`
- `projectB/src/ecoupon/.claude/CLAUDE.md`
- `projectB/src/product/.claude/CLAUDE.md`
- `projectB/.claude/CLAUDE.md`

그리고 `root/projectA`, `root/projectB` 상위에서 Claude를 실행하는 상황을 가정했을 때,  
특정 하위 디렉토리의 `.claude/CLAUDE.md`가 자동으로 확실히 읽히는 구조에 기대기 어렵다는 점이 문제였다.

즉, 복잡한 MSA에서 다음 구조는 불안정하다.

- 폴더별 상세 규칙을 하위 `.claude/CLAUDE.md`에 많이 넣는 방식
- 특정 요청이 들어왔을 때 필요한 하위 규칙이 자동으로 붙을 것이라고 기대하는 방식

### 2.2 서비스 중심 접근의 한계

예를 들어 `ecoupon` 분석은 보통 다음 여러 서비스가 얽힌다.

- 주문 생성
- 주문 취소
- 결제
- 상품
- e쿠폰
- 현금영수증
- 관리자 기능
- MQ / 이벤트 / 배치

따라서 분석 단위를 특정 서비스 폴더로 두기보다,  
다음처럼 **유스케이스 중심**으로 잡아야 한다는 결론에 도달했다.

- 주문
- 주문취소
- 반품
- 교환
- e쿠폰
- 현금영수증
- 특정 상태 변경
- 특정 실패 전파 흐름

---

## 3. 설계 원칙

### 3.1 CLAUDE.md는 얇게 유지

`CLAUDE.md`는 다음 역할만 담당한다.

- 저장소 해석의 핵심 원칙
- 자세한 정보가 있는 참조 경로
- 어떤 skill을 먼저 써야 하는지에 대한 라우팅

즉,

- `CLAUDE.md = 라우터`
- `docs = 지식 베이스, GuardRail·Policy·Instruction`
- `SKILL.md = 실행 플레이북`

으로 구분한다.

### 3.2 분석은 범용 analyze skill 중심

도메인별로 `analyze-order`, `analyze-return`처럼 먼저 쪼개기보다,  
우선은 다음 역할을 하는 범용 `analyze` skill을 둔다.

- 특정 기능/유스케이스 분석
- 상태 변경 지점 분석
- 호출 체인 분석
- 실패 영향 범위 분석
- 문서 작성 또는 업데이트

필요할 경우 보조 skill로 `analyze-cross-service`를 둔다.

### 3.3 docs는 목적별로 분리

`docs/`는 아래 세 범주로 나눈다.

- `architecture/`
- `usecases/`
- `policy/`

이때 문서를 과도하게 잘게 쪼개기보다, 실제 재사용 가치가 높은 수준으로 유지한다.

---

## 4. 최종 디렉토리 구조

```text
root/
  .claude/
    CLAUDE.md
    skills/
      analyze/
        SKILL.md
      analyze-cross-service/
        SKILL.md
  docs/
    architecture/
      service-map.md
      ownership.md
      orderapi.md
    usecases/
      order-flow.md
      order-flow-deep.md
      order-cancel-flow.md
      order-cancel-flow-deep.md
      return-flow.md
      return-flow-deep.md
      exchange-flow.md
      exchange-flow-deep.md
    policy/
      order-state-policy.md
      cancel-policy.md
      return-policy.md
      exchange-policy.md
```

---

## 5. docs 문서 역할

### 5.1 architecture

#### `docs/architecture/service-map.md`
서비스 간 전체 관계를 설명한다.

사용 목적:
- 어떤 프로젝트가 어떤 프로젝트를 호출하는지 파악
- 전체 연결 구조 확인
- 분석 시작 전 큰 그림 확인

#### `docs/architecture/ownership.md`
각 프로젝트/서비스의 책임을 설명한다.

사용 목적:
- 각 프로젝트가 무슨 일을 하는지 확인
- 오케스트레이션 서비스와 상태 소유 서비스 구분
- 조회 전용 서비스와 운영 도구 서비스 구분

#### `docs/architecture/orderapi.md`
orderapi 내부 구조와 해석 기준을 정리한다.

사용 목적:
- orderapi 관련 분석 시작 전 참고
- 여러 버전 endpoint 공존 방식 이해
- v4를 실사용 기본 경로로 해석하는 기준 정리

### 5.2 usecases

#### `docs/usecases/{case}-flow.md`
대표 흐름을 빠르게 이해하기 위한 요약 문서다.

예:
- `order-flow.md`
- `order-cancel-flow.md`
- `return-flow.md`
- `exchange-flow.md`

사용 목적:
- 처음 보는 사람이 5분 안에 큰 흐름을 이해
- 대표 진입점, 대표 호출 체인, 핵심 상태 변경 지점 요약

#### `docs/usecases/{case}-flow-deep.md`
실제 수정/장애분석/리팩토링에 참고하기 위한 상세 문서다.

예:
- `order-flow-deep.md`
- `order-cancel-flow-deep.md`
- `return-flow-deep.md`
- `exchange-flow-deep.md`

사용 목적:
- 세부 분기, 예외, 상태 전이, 실패 전파, 운영 개입, 레거시 흔적까지 분석
- 코드 수정이나 구조 개선 시 참고

### 5.3 policy

#### `docs/policy/order-state-policy.md`
주문 상태값 규칙과 상태 전이 기준

#### `docs/policy/cancel-policy.md`
취소 정책, 부분취소 여부, 취소 가능 조건

#### `docs/policy/return-policy.md`
반품 정책, 반품 가능 조건, 정산 영향

#### `docs/policy/exchange-policy.md`
교환 정책, 교환 가능 조건, 예외 규칙

---

## 6. CLAUDE.md 최종 방향

### 6.1 핵심 원칙

`CLAUDE.md`에는 아래만 담는다.

- 실제 호출 흐름 기준으로 분석할 것
- 단일 파일/클래스명만 보고 추정하지 말 것
- 필요 시 여러 서비스의 연결 구조를 함께 볼 것
- 확정된 사실과 추정/확인 필요 사항을 구분할 것
- 애매하면 사용자에게 질문할 것

### 6.2 참조 경로 중심으로 유지

`CLAUDE.md`에는 상세 정책 설명보다 아래 정도만 둔다.

- 서비스 간 관계: `docs/architecture/service-map.md`
- 서비스별 책임: `docs/architecture/ownership.md`
- 시스템/프로젝트별 구조 문서: `docs/architecture/`
- 유스케이스 흐름: `docs/usecases/`
- 상태/업무 정책: `docs/policy/`

### 6.3 skill 라우팅만 포함

- 일반 기능/유스케이스 분석: `analyze`
- 여러 서비스에 걸친 호출 체인/책임 분석: `analyze-cross-service`

---

## 7. analyze skill 최종 역할

### 7.1 목적

`analyze` skill은 단순 문서 작성용이 아니다.  
다음 모두를 위한 공통 분석 도구다.

- 질의응답
- 구조 검토
- 리스크 파악
- 문서 작성
- 기존 문서 업데이트

### 7.2 분석 대상

다음처럼 폭넓게 적용할 수 있도록 정의했다.

- 주문
- 주문취소
- 반품
- 교환
- e쿠폰
- 현금영수증
- 특정 API endpoint
- 특정 상태값 변경 흐름
- 특정 장애/실패 전파 흐름
- 특정 MQ consumer / scheduler / batch 처리 흐름
- 관리자 기능 개입 여부

### 7.3 공통 분석 원칙

- 실제 호출 흐름 기준으로 판단
- 레거시 흔적과 현재 운영 경로 구분
- “호출한다”와 “상태를 소유한다” 구분
- 단순 조회/중계와 실제 상태 변경 구분
- 동기/비동기 구간 분리
- 문서와 코드가 다르면 단정하지 않고 차이 기록
- 애매하면 사용자에게 질문

### 7.4 docs 참조 가이드

analyze skill 안에는 “어떤 상황에 어떤 docs를 봐야 하는지”를 넣는다.

예:
- 서비스 관계가 헷갈리면 `service-map.md`
- 프로젝트 책임이 헷갈리면 `ownership.md`
- orderapi 관련 분석이면 `orderapi.md`
- 유스케이스 분석이면 해당 `*-flow.md`
- 상세 분기까지 보면 `*-flow-deep.md`
- 상태/정책이 중요하면 `policy/*.md`

### 7.5 문서 생성 해석 규칙

`analyze`는 문서 생성 요청도 다음처럼 해석한다.

- `{case}-flow.md` 요청 → 대표 흐름 요약 문서
- `{case}-flow-deep.md` 요청 → 상세 분석 문서
- 둘 다 요청 → 요약/상세를 각각 분리 작성
- 기존 문서 업데이트 요청 → 기존 문서 목적(summary/deep)을 유지하며 갱신

---

## 8. analyze-cross-service skill 역할

이 skill은 보조 성격으로 둔다.

사용 목적:
- 여러 서비스에 걸친 호출 체인 추적
- 오케스트레이션 서비스 찾기
- 상태 소유 서비스 찾기
- 동기/비동기 경계 정리
- 운영/관리 기능이 본 처리에 개입하는지 확인
- 레거시 경로와 현재 운영 경로 혼재 시 정리

즉:
- `analyze` = 범용 메인
- `analyze-cross-service` = 다서비스 흐름 보조

---

## 9. flow / flow-deep 2단 문서 전략

### 9.1 왜 2단 구조가 필요한가

복잡한 시스템에서 문서가 하나만 있으면 아래 둘 중 하나가 된다.

- 너무 짧아서 실무에 부족함
- 너무 길어서 읽기 어려움

그래서 다음 2단 구조가 적합하다고 정리했다.

- `*-flow.md` = 빠른 이해용 요약 문서
- `*-flow-deep.md` = 실무용 상세 분석 문서

### 9.2 flow 문서 역할

목적:
- 처음 보는 사람이 전체 구조를 빨리 이해
- 큰 흐름과 핵심 책임을 요약

권장 포함 항목:
- 유스케이스 개요
- 분석 범위
- 대표 진입점
- 대표 호출 체인
- 서비스별 역할 요약
- 핵심 상태 변경 지점
- 동기/비동기 큰 흐름
- 운영 관점 핵심 포인트
- 추가 확인 필요 사항
- 후속 상세 분석 포인트

### 9.3 flow-deep 문서 역할

목적:
- 실제 수정/장애분석/리팩토링 참고
- 세부 분기와 예외를 정리

권장 포함 항목:
- 유스케이스 개요
- 분석 범위 및 해석 기준
- 진입점 후보와 실제 운영 경로
- 상세 호출 체인
- 주요 분기
- 상태 소유 서비스 및 상태 변경 지점
- 동기/비동기 경계
- 실패 전파 / 재시도 / 멱등성 / 보상 처리
- 운영/관리 기능 개입 여부
- 레거시 흔적과 현재 운영 경로 구분
- 코드상 리스크 포인트
- 애매한 점 / 추가 확인 필요 사항
- 후속 분석 포인트

---

## 10. orderapi 규칙 처리 방식

초기에는 `api-version-policy.md` 같은 별도 문서를 두는 방안을 검토했지만,  
너무 잘게 쪼개는 구조는 과하다고 판단했다.

최종 방향은 다음과 같다.

- `CLAUDE.md`에는 orderapi 상세 규칙을 넣지 않는다.
- `docs/architecture/orderapi.md`에 orderapi 내부 구조와 해석 기준을 둔다.
- analyze skill이 orderapi 관련 분석 시 해당 문서를 먼저 참조하도록 한다.

### `orderapi.md`에 들어갈 핵심 내용

- orderapi 역할
- 여러 버전 endpoint 공존 가능성
- v4를 기본 분석 기준으로 삼는 해석 원칙
- 다른 버전이 보이면 실제 사용 여부를 교차 확인해야 한다는 점
- 프론트 / gateway / 호출부 기준으로 운영 경로를 확인해야 한다는 점

---

## 11. 공통 프롬프트 전략

### 11.1 특정 주문 전용 프롬프트의 문제

초기 프롬프트는 `"주문"`에만 특화되어 있었다.

예:
- `order-flow.md`
- `order-flow-deep.md`
- 고정된 분석 대상 서비스 목록

이 구조는 주문취소, 반품, 교환, e쿠폰 등 다른 기능으로 확장하기 어려웠다.

### 11.2 `{case}` 기반 공통 프롬프트로 일반화

최종적으로 다음처럼 일반화된 프롬프트 템플릿이 적절하다고 정리했다.

- `{case}`를 분석 대상 기능/유스케이스로 입력
- `{case}-flow.md`
- `{case}-flow-deep.md`
- 분석 대상 서비스와 참고 문서는 사용자 입력

예:
- `order`
- `order-cancel`
- `return`
- `exchange`
- `ecoupon`
- `cash-receipt`

이렇게 하면 동일한 analyze skill을 다양한 기능 분석에 재사용할 수 있다.

---

## 12. 사용자 질문 원칙

분석 과정에서 애매한 부분은 절대 단정하지 않고 질문하도록 설계했다.

질문 형식은 다음으로 통일했다.

- 확인이 필요한 지점:
- 현재 코드에서 보이는 정황:
- 가능한 해석 1:
- 가능한 해석 2:
- 어느 쪽이 맞는지 알려달라:

이 형식은 다음 상황에 특히 중요하다.

- 실제 운영 경로와 레거시 경로가 구분되지 않을 때
- 동일 컨트롤러/메서드에 여러 버전이 공존할 때
- 동기/비동기가 코드만으로 확정되지 않을 때
- 특정 상태값의 source of truth가 अस्पष्ट할 때
- admin 경로가 본 처리인지 운영 보정인지 불분명할 때
- 문서와 코드가 충돌할 때

---

## 13. 최종 결론

이번 논의의 핵심 결론은 다음과 같다.

1. 하위 폴더별 `.claude/CLAUDE.md` 자동 적용에 기대지 않는다.
2. 서비스 중심이 아니라 유스케이스/기능 중심으로 분석한다.
3. `CLAUDE.md`는 얇게 유지하고 라우터 역할만 맡긴다.
4. 상세 분석 절차는 `analyze` skill에 둔다.
5. 다서비스 호출 체인 분석은 `analyze-cross-service`를 보조로 둔다.
6. `docs/`는 architecture / usecases / policy로 나눈다.
7. 유스케이스 문서는 `flow`와 `flow-deep` 두 단계로 운영한다.
8. orderapi 특수 규칙은 `docs/architecture/orderapi.md`에서 관리한다.
9. 문서 생성 프롬프트는 `{case}` 기반 공통 템플릿으로 일반화한다.
10. 문서와 코드가 다르거나 애매한 부분은 반드시 질문한다.

이 구조는 다음 장점을 가진다.

- 복잡한 MSA에서도 유지보수 가능
- 특정 도메인에 과도하게 고정되지 않음
- 문서와 분석 체계의 역할 분리가 명확함
- 사람과 AI가 같은 기준으로 시스템을 이해할 수 있음
- 신규 기능/도메인 추가 시에도 쉽게 확장 가능

---

## 14. 권장 다음 작업

다음 문서를 실제로 작성하면 운영 가능한 체계가 된다.

### architecture
- `docs/architecture/service-map.md`
- `docs/architecture/ownership.md`
- `docs/architecture/orderapi.md`

### usecases
- `docs/usecases/order-flow.md`
- `docs/usecases/order-flow-deep.md`

이후 필요 시 아래로 확장한다.

- `order-cancel-flow.md`
- `order-cancel-flow-deep.md`
- `return-flow.md`
- `return-flow-deep.md`
- `exchange-flow.md`
- `exchange-flow-deep.md`

### policy
- `docs/policy/order-state-policy.md`
- `docs/policy/cancel-policy.md`
- `docs/policy/return-policy.md`
- `docs/policy/exchange-policy.md`
