// 위니버시티 안내
// 이 사이트의 문제는 위니버시티 학습 도구 > 알고리즘으로 옮겨 갔다.
// - data-wv-problem 링크: 지금 보고 있는 문제의 위니버시티 주소로 바꾼다
// - 처음 온 사람에게 한 번 안내 창을 띄운다 (닫으면 다시 띄우지 않음)
// 설정은 이 스크립트 태그의 data-* 값으로 받는다.
(function () {
  const script = document.currentScript;
  const config = {
    name: script.dataset.name, // 파이알고 Best 20
    set: script.dataset.set, // best20 | basic100 | start7
    lang: script.dataset.lang, // python | javascript
    max: Number(script.dataset.max), // 위니버시티에 옮겨 간 마지막 문제 번호
  };

  const WENIVERSITY = "https://weniversity.co.kr";
  const LIST_URL = `${WENIVERSITY}/tools/algo/`;
  const NOTICE_KEY = "weniversity-moved-notice";

  function currentPage() {
    const fromUrl = Number(new URLSearchParams(location.search).get("page"));
    if (fromUrl) return fromUrl;
    const active = document.querySelector(".btn-que.active");
    return active ? Number(active.id.replace(/\D/g, "")) : 1;
  }

  function problemUrl() {
    const page = currentPage();
    if (page >= 1 && page <= config.max) {
      return `${LIST_URL}${config.set}-${page}/?lang=${config.lang}`;
    }
    return LIST_URL;
  }

  function sendClick(link, type) {
    try {
      fetch("https://dev.wenivops.co.kr/api/weniv_analytics/collect/anchor-click", {
        method: "POST",
        keepalive: true,
        headers: {
          "Content-Type": "application/json",
          "Session-Id": sessionStorage.getItem("session_id") || "",
        },
        body: JSON.stringify({
          source_url: location.href,
          target_url: link,
          type: `${config.name}: ${type}`,
        }),
      }).catch(() => {});
    } catch (e) {
      /* 수집 실패는 이동에 영향을 주지 않는다 */
    }
  }

  // 링크 주소는 누르는 순간의 문제로 맞춘다 (문제를 옮겨 다녀도 따라감)
  function bindLinks(root) {
    root.querySelectorAll("[data-wv-problem]").forEach((a) => {
      a.href = problemUrl();
      a.addEventListener("click", () => {
        a.href = problemUrl();
        sendClick(a.href, a.dataset.wvTrack || "위니버시티에서 풀기");
      });
      a.addEventListener("mouseenter", () => (a.href = problemUrl()));
      a.addEventListener("focus", () => (a.href = problemUrl()));
    });
    root.querySelectorAll("[data-wv-track]:not([data-wv-problem])").forEach((a) => {
      a.addEventListener("click", () => sendClick(a.href, a.dataset.wvTrack));
    });
  }

  function readNotice() {
    try {
      return localStorage.getItem(NOTICE_KEY);
    } catch (e) {
      return "1";
    }
  }

  function showNotice() {
    if (readNotice()) return;

    const notice = document.createElement("aside");
    notice.className = "wv-notice";
    notice.setAttribute("role", "dialog");
    notice.setAttribute("aria-labelledby", "wv-notice-title");
    notice.innerHTML = `
      <button type="button" class="wv-notice__close" aria-label="안내 닫기">
        <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 5l10 10M15 5L5 15" /></svg>
      </button>
      <p class="wv-notice__eyebrow">weniversity</p>
      <strong id="wv-notice-title" class="wv-notice__title">${config.name} 문제가 위니버시티로 옮겨 갔어요</strong>
      <p class="wv-notice__desc">
        같은 문제를 위니버시티 알고리즘에서 Python·JavaScript·Java로 풀고 바로 채점받을 수 있어요.
        로그인하면 푼 문제가 계정에 기록됩니다.
      </p>
      <div class="wv-notice__actions">
        <a class="wv-notice__go" data-wv-problem data-wv-track="안내 창 > 위니버시티에서 풀기" href="${LIST_URL}">이 문제 위니버시티에서 풀기</a>
        <button type="button" class="wv-notice__stay">여기서 계속 풀기</button>
      </div>
    `;

    const close = () => {
      try {
        localStorage.setItem(NOTICE_KEY, new Date().toISOString());
      } catch (e) {
        /* 저장이 막혀 있으면 다음에 다시 보일 뿐이다 */
      }
      notice.classList.add("is-hidden");
      setTimeout(() => notice.remove(), 300);
    };

    notice.querySelector(".wv-notice__close").addEventListener("click", close);
    notice.querySelector(".wv-notice__stay").addEventListener("click", close);
    notice.querySelector(".wv-notice__go").addEventListener("click", close);
    document.addEventListener("keydown", function onKey(e) {
      if (e.key === "Escape" && document.body.contains(notice)) {
        close();
        document.removeEventListener("keydown", onKey);
      }
    });

    document.body.appendChild(notice);
    bindLinks(notice);
    requestAnimationFrame(() => notice.classList.add("is-shown"));
  }

  function init() {
    bindLinks(document);
    setTimeout(showNotice, 1200);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
