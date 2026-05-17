/* ===========================================================
   Chan Yeong Portfolio · PDF Edition · main_upgrade.js
   - PDF 출력 보조 / 시각 효과 / 인터랙션
   =========================================================== */

(() => {
  'use strict';

  /* -----------------------------------------------------------
     1. 인쇄 직전 모든 details 펼치기 + 스킬 바 100% 렌더 보장
     ----------------------------------------------------------- */
  function expandAll() {
    document.querySelectorAll('details').forEach((d) => (d.open = true));
    document.querySelectorAll('.fill').forEach((el) => {
      el.style.transition = 'none';
    });
  }
  window.expandAll = expandAll;

  // 시스템 print 호출(브라우저 단축키 포함)에도 자동 반영
  window.addEventListener('beforeprint', () => {
    expandAll();
    document.body.classList.add('is-printing');
    // 카운트업 애니메이션 중간에 인쇄되면 "-0.1 yrs" 같은 잔상이 PDF에 박히는 문제 방지
    document.querySelectorAll('[data-original-text]').forEach((el) => {
      el.textContent = el.dataset.originalText;
    });
  });
  window.addEventListener('afterprint', () => {
    document.body.classList.remove('is-printing');
  });

  /* -----------------------------------------------------------
     2. 진입 시 스킬 바 카운트업 애니메이션
     ----------------------------------------------------------- */
  function animateSkillBars() {
    const fills = document.querySelectorAll('.skill-row .fill');
    fills.forEach((el, idx) => {
      const target = el.style.width;
      el.style.width = '0%';
      setTimeout(() => {
        el.style.transition = 'width 1.1s cubic-bezier(0.22, 1, 0.36, 1)';
        el.style.width = target;
      }, 80 * idx + 220);
    });
  }

  /* -----------------------------------------------------------
     3. 메트릭 큰 숫자 카운트업 (정수 / 퍼센트 / 분수 케이스 대응)
     ----------------------------------------------------------- */
  function animateNumbers() {
    const targets = document.querySelectorAll('.cover-stat .num, .metric .big');
    targets.forEach((el) => {
      const text = el.textContent.trim();
      const match = text.match(/^([0-9,\.]+)(.*)$/);
      if (!match) return; // 4~6× 같은 케이스는 패스

      const value = parseFloat(match[1].replace(/,/g, ''));
      const suffix = match[2];
      if (Number.isNaN(value)) return;

      // beforeprint 훅이 즉시 원복할 수 있도록 원본 텍스트를 보존
      el.dataset.originalText = match[1] + suffix;

      const duration = 1100;
      const start = performance.now();

      function tick(now) {
        // p가 음수가 되면 "-0.1" 같은 값이 잠깐 표시될 수 있어 0으로 클램프
        const p = Math.max(0, Math.min(1, (now - start) / duration));
        const eased = 1 - Math.pow(1 - p, 3);
        const current = Math.max(0, value * eased);
        const formatted =
          value % 1 === 0
            ? Math.round(current).toLocaleString('ko-KR')
            : current.toFixed(1);
        el.textContent = formatted + suffix;
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = match[1] + suffix; // 원본 복원(서식 안전)
      }
      requestAnimationFrame(tick);
    });
  }

  /* -----------------------------------------------------------
     4. IntersectionObserver — 페이지 진입 시 fade-up
     ----------------------------------------------------------- */
  function setupReveal() {
    const items = document.querySelectorAll(
      '.sub-block, .deep, .mini, .pillar, .coin-item, .cover-stat, .metric, .tl-item, .skill-cat, .contact-card'
    );
    items.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(14px)';
      el.style.transition = 'opacity .6s ease, transform .6s cubic-bezier(0.22,1,0.36,1)';
    });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            setTimeout(() => {
              el.style.opacity = '1';
              el.style.transform = 'translateY(0)';
            }, i * 40);
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    items.forEach((el) => io.observe(el));
  }

  /* -----------------------------------------------------------
     5. 페이지 번호 자동 계산 (수동 작성 fallback)
     ----------------------------------------------------------- */
  function paginateFooters() {
    const pages = document.querySelectorAll('.page');
    const total = pages.length;
    pages.forEach((p, i) => {
      const num = p.querySelector('.page-footer .pf-num');
      if (!num) return;
      const original = num.textContent;
      // "01 · COVER" 형태에 [n/total] 보강
      num.dataset.original = original;
      num.textContent = original + `  ·  ${String(i + 1).padStart(2, '0')}/${String(total).padStart(2, '0')}`;
    });
  }

  /* -----------------------------------------------------------
     6. 키보드 단축키
        ⌘/Ctrl + P → 프린트
        E → expandAll
        T → 페이지 처음으로
     ----------------------------------------------------------- */
  function setupHotkeys() {
    document.addEventListener('keydown', (e) => {
      // ⌘P / Ctrl+P 는 브라우저 기본 동작 사용 (beforeprint 훅으로 처리)
      if (e.key === 'e' || e.key === 'E') {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        expandAll();
      }
      if (e.key === 't' || e.key === 'T') {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  /* -----------------------------------------------------------
     7. 부드러운 호버 인터랙션 (sub-block / deep / mini)
     ----------------------------------------------------------- */
  function setupHover() {
    const cards = document.querySelectorAll('.sub-block, .deep, .mini, .coin-item');
    cards.forEach((c) => {
      c.style.transition =
        'transform .25s cubic-bezier(0.22,1,0.36,1), box-shadow .25s ease, border-color .25s ease';
      c.addEventListener('mouseenter', () => {
        c.style.transform = 'translateY(-3px)';
        c.style.boxShadow = '0 12px 32px rgba(17, 24, 39, 0.08)';
      });
      c.addEventListener('mouseleave', () => {
        c.style.transform = '';
        c.style.boxShadow = '';
      });
    });
  }

  /* -----------------------------------------------------------
     8. 다크/라이트 토글 — 이번 에디션은 print-first → 기본 light
        (구조만 마련하고 default off)
     ----------------------------------------------------------- */
  function setupTheme() {
    document.documentElement.dataset.theme = 'light';
  }

  /* -----------------------------------------------------------
     INIT
     ----------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', () => {
    setupTheme();
    paginateFooters();
    setupReveal();
    setupHover();
    setupHotkeys();

    // 첫 화면 즉시 보이는 요소들 — reveal과 충돌 없이 살짝 지연 후 실행
    setTimeout(() => {
      animateNumbers();
      animateSkillBars();
    }, 350);

    console.log('%cChan Yeong · Portfolio (PDF Edition)', 'color:#4338ca; font-weight:700; font-size:13px;');
    console.log('단축키: [E] 모두 펼치기 · [T] 맨 위로 · [⌘/Ctrl+P] PDF 저장');
  });
})();