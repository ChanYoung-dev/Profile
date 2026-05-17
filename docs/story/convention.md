# Claude Code 팀 표준 코딩 컨벤션 운영 가이드

## 목적

Claude Code가 생성하는 코드가 팀 표준 코딩 컨벤션을 최대한 일관되게 준수하도록 한다.

핵심 원칙은:

> Claude를 믿는 구조가 아니라, Claude가 틀려도 시스템적으로 막히는 구조를 만든다.

즉:

```text
Claude Guide
    ↓
docs (Source of Truth)
    ↓
Skill (Task-specific)
```

---

# 1. 권장 구조

CLAUDE.md 하나에 모든 규칙을 넣지 않는다.

`CLAUDE.md`는 얇게 유지하고, 세부 규칙은 문서로 분리한다.

권장 디렉토리 구조:

```text
repo/
├── CLAUDE.md
├── docs/
│   └── conventions/
│       ├── java.md
│       ├── spring.md
│       ├── mybatis.md
│       ├── testing.md
│       └── architecture.md
│
├── .claude/
│   └── skills/
│       ├── coding-convention/
│       │   └── SKILL.md
│       ├── order-analysis/
│       │   └── SKILL.md
│       └── payment-analysis/
│           └── SKILL.md
│
├── checkstyle.xml
├── .editorconfig
└── pom.xml
```

---

# 2. CLAUDE.md는 Router 역할만 수행

CLAUDE.md는 최소한의 규칙만 유지한다.

예시:

```md
# Team Engineering Rules

## Before Coding
반드시 아래 문서를 먼저 확인한다.

- Java: ./docs/conventions/java.md
- Spring: ./docs/conventions/spring.md
- MyBatis: ./docs/conventions/mybatis.md
- Test: ./docs/conventions/testing.md

## Work Rules
- 수정 전 주변 유사 코드를 먼저 확인한다.
- 파일명/클래스명만 보고 추정하지 않는다.
- 기존 컨벤션과 충돌하면 질문한다.
- 대규모 리팩토링은 요청 없이는 하지 않는다.

## Done Definition

작업 완료 전 반드시 실행:

```bash
mvn spotless:check
mvn checkstyle:check
mvn test
```
```

목표:

- CLAUDE.md heavy 방지
- 컨텍스트 낭비 방지
- 규칙 유지보수 용이

---

# 3. 세부 규칙은 docs/conventions 로 분리

## java.md

```md
# Java Convention

## Version
- Java 8 only

## Layer Rule
- Controller: request mapping + validation only
- Service: business logic only
- Repository/MyBatis: persistence only

## Naming
- DTO suffix 사용
- VO 사용 금지
- Interface + Impl 구조 유지

## Exception
- RuntimeException 직접 throw 금지
- BusinessException 사용
```

---

## spring.md

```md
# Spring Convention

## Transaction
- @Transactional 은 Service 계층에서만 사용

## External API
- 외부 API 호출은 Client 클래스로 분리

## Exception Handling
- 공통 예외 체계 사용
```

---

## mybatis.md

```md
# MyBatis Convention

## Query Rule
- SELECT * 금지
- 컬럼 명시
- 동적 쿼리 최소화

## ResultMap
- 복잡한 Join 시 ResultMap 사용
```

---

## testing.md

```md
# Testing Convention

## Test Rule
- 기존 테스트 스타일 유지
- 신규 정책 변경 시:
  - 정상 케이스
  - 실패 케이스
  - 경계 케이스
  테스트 추가

## Mocking
- 타 API는 mock 처리 우선
```

---

# 4. Skill 기반 로딩 사용

모든 규칙을 항상 컨텍스트에 넣지 않는다.

필요한 작업 시점에만 로드한다.

예시:

```text
.claude/skills/coding-convention/SKILL.md
```

```md
---
name: coding-convention
description: 팀 코딩 컨벤션 검토
---

코드 수정 전:

1. docs/conventions/* 확인
2. 주변 유사 코드 확인
3. 새로운 패턴 생성 금지

작업 완료 후:

```bash
mvn spotless:check
mvn checkstyle:check
mvn test
```
```

효과:

- 토큰 절약
- 컨텍스트 오염 감소
- 작업별 전문화 가능

---

# 5. Claude Code 운영 원칙

Claude에게 컨벤션 준수를 "기억"시키려 하지 않는다.

대신:

```text
CLAUDE.md
+ docs
+ skill
```

구조로 가이드한다.

핵심 철학:

> Claude의 기억에 의존하지 않고,
> 문서·Skill 구조로 일관된 행동을 유도한다.

---

# 최종 추천 아키텍처

```text
CLAUDE.md (Router)
        ↓
docs/conventions (Source of Truth)
        ↓
Skill Loader (Task-specific)
```

이 구조가 가장 유지보수성이 높고,
MSA + 정책 많은 커머스 시스템에서 현실적으로 운영하기 가장 좋다.