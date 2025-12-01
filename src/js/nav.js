const elements = {
  container: document.querySelector(".container"),
  main: document.querySelector(".contents"),
  btnFold: document.querySelector(".btn-fold"),
  nav: document.querySelector(".question-nav"),
  codeMirror: document.querySelector(".CodeMirror"),
  btnMenu: document.querySelector(".hamburger-btn"),
  icon: document.querySelector(".hamburger-btn img"),
  menuContainer: document.querySelector(".menu-list"),
};

const state = {
  isMobile: null,
  isActive: elements.btnMenu.classList.contains("is-active"),
};

const toggleActiveState = () => {
  state.isActive = !state.isActive;
  const imgSrc = state.isActive ? "src/img/close.webp" : "src/img/hamburger-btn.webp";
  const imgAlt = state.isActive ? "메뉴 닫기" : "메뉴 열기";

  elements.icon.src = imgSrc;
  elements.icon.alt = imgAlt;
};

const handleCloseQuestions = () => {
  elements.container.classList.remove("menu-on");
  elements.btnFold.innerText = "메뉴 펼치기";
  elements.codeMirror.classList.remove("menu-on-CodeMirror");
  elements.codeMirror.classList.add("menu-off-CodeMirror");
};

const handleOpenQuestions = () => {
  if (elements.menuContainer.classList.contains("active")) {
      handleCloseMenu();
  }

  elements.container.classList.add("menu-on");
  elements.btnFold.innerText = "메뉴 접기";
  elements.codeMirror.classList.add("menu-on-CodeMirror");
  elements.codeMirror.classList.remove("menu-off-CodeMirror");
};

const handleToggleQuestions = () => {
  if (elements.container.classList.contains("menu-on")) {
      handleCloseQuestions();
  } else {
      handleOpenQuestions();
  }
};

const handleToggleMenu = () => {
  elements.btnMenu.classList.toggle("is-active");
  toggleActiveState();

  if (state.isActive) {
      elements.icon.classList.add("close");
      elements.menuContainer.classList.add("active");
  } else {
      elements.icon.classList.remove("close");
      elements.menuContainer.classList.remove("active");
  }

  if (elements.menuContainer.classList.contains("active") && state.isMobile) {
      handleCloseQuestions();
  }
};

const handleCloseMenu = () => {
  elements.menuContainer.classList.remove("active");
  elements.icon.classList.remove("close");
  elements.icon.src = "src/img/hamburger-btn.webp";
  state.isActive = false;
};

const checkMobile = () => {
  const winWidth = window.innerWidth;

  if (winWidth > 1024) {
      state.isMobile = false;
      elements.menuContainer.classList.remove("is-active");
  } else if (winWidth >= 900) {
      handleCloseMenu();
      state.isMobile = true;
  } else {
      handleCloseQuestions();
      state.isMobile = true;
  }
};

const handleResizeWidth = () => {
  let timer = null;
  clearTimeout(timer);
  timer = setTimeout(() => {
      checkMobile();
  }, 300);
};

const handleCloseMobileQuestions = (e) => {
  const check =
      Boolean(e.target.closest("nav")) || Boolean(e.target.closest("header"));
  if (state.isMobile && elements.container.classList.contains("menu-on") && !check) {
      handleCloseQuestions();
  }
};

const handleClickOutside = (e) => {
  if (!elements.menuContainer.contains(e.target)) {
      handleCloseMenu();
  }
};

checkMobile();
elements.btnFold.addEventListener("click", handleToggleQuestions);
elements.container.addEventListener("click", handleCloseMobileQuestions);
window.addEventListener("resize", handleResizeWidth);

elements.btnMenu.addEventListener("click", handleToggleMenu);
elements.main.addEventListener("click", handleClickOutside);

// 인증서
const $certifBtn = document.querySelector(".certif-btn");
const $certifModal = document.querySelector(".certif-modal");
window.addEventListener("click", (e) => {
  if ($certifBtn.contains(e.target)) {
    $certifBtn.classList.toggle("active");
    $certifModal.classList.toggle("active");
  } else if (e.target === $certifModal.querySelector(".close-btn")) {
    $certifBtn.classList.remove("active");
    $certifModal.classList.remove("active");
  } else if (!$certifModal.contains(e.target)) {
    $certifBtn.classList.remove("active");
    $certifModal.classList.remove("active");
  }

  if ($certifModal.classList.contains("active")) {
    if (state.isMobile) {
      document.querySelector(".container").classList.remove("menu-on");
    }
    document.querySelector(".menu-list").classList.remove("active");
    checkCertif();
  }
});

function checkCertif() {
  const totalProblem = 20;
  // 점수 체크
  let score = 0;
  for (let i = 1; i <= totalProblem; i++) {
    if (localStorage.getItem(`${i}_check`) === "통과") {
      score++;
    }
  }

  // 진행률 표시
  document.querySelector(".solved").innerText = score;
  const $progressBar = document.querySelector(".solved-progressbar-inner");
  $progressBar.style.transform = `scaleX(${score / totalProblem})`;
  $progressBar.style.transformOrigin = "left";

  const $certifDownloadBtn = document.querySelector(".certif-download-btn");
  const $labelUsername = document.querySelector(".label-username");
  // 인증서 날짜
  if (score >= totalProblem) {
    $progressBar.style.backgroundColor = "var(--ColorPrimary)";
    if (!localStorage.getItem("certif-date")) {
      const current = new Date();
      const currentTime = `${current.getFullYear()}.${(current.getMonth() + 1)
        .toString()
        .padStart(2, "0")}.${current.getDate().toString().padStart(2, "0")}`;
      localStorage.setItem("certif-date", currentTime);
    }
    $certifDownloadBtn.removeAttribute("disabled");
    $labelUsername.classList.add("active");
  } else {
    localStorage.removeItem("certif-date");
    $certifDownloadBtn.setAttribute("disabled", true);
    $labelUsername.classList.remove("active");
  }

  // 화면 표시
  const $downloadBtn = document.querySelector(".certif-download-btn");
  if (score >= totalProblem) {
    $downloadBtn.removeAttribute("disabled");
  } else {
    $downloadBtn.setAttribute("disabled", true);
  }
}

const $inputUsername = document.getElementById("username");
$inputUsername.addEventListener("input", (e) => {
  localStorage.setItem("username", e.target.value);
});
$inputUsername.value = localStorage.getItem("username") || "";

const $downloadBtn = document.querySelector(".certif-download-btn");
$downloadBtn.addEventListener("click", () => {
  // disabled 제거 후 인증서 다운로드 방지
  const totalProblem = 20;
  let score = 0;
  for (let i = 1; i <= totalProblem; i++) {
    if (localStorage.getItem(`${i}_check`) === "통과") {
      score++;
    }
  }

  createCertifImg(localStorage.getItem("username"));
});
checkCertif();

function createCertifImg() {
  console.log("createCertifImg");
  const img = new Image();
  img.src = `src/img/certif-pyalgo.png`; // 이미지 변경 필요
  img.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    const name = localStorage.getItem("username") || "-";
    ctx.font = "400 74px pretendard";
    ctx.fillStyle = "#3a72ff";
    ctx.textAlign = "center";
    ctx.fillText(name, canvas.width / 2, 570);

    const current = new Date();
    const currentTime = `${current.getFullYear()}.${(current.getMonth() + 1)
      .toString()
      .padStart(2, "0")}.${current.getDate().toString().padStart(2, "0")}`;

    const date = localStorage.getItem("certif-date") || currentTime;

    ctx.font = "400 36px pretendard";
    ctx.fillStyle = "black";
    ctx.fillText(date, 1340, 1000);

    const certif = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = certif;
    a.download = `인증서.png`;
    a.click();
  };
}