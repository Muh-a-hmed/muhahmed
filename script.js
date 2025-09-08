// Preloader
window.addEventListener("load", () => {
  const pre = document.getElementById("preloader");
  gsap.to(pre, {
    opacity: 0,
    y: -60,
    duration: 0.1,
    ease: "power3.inOut",
    onComplete: () => pre.remove(),
  });
});

// Metaball canvas
const canvas = document.getElementById("metaCanvas");
const ctx = canvas.getContext("2d");
let W = innerWidth,
  H = innerHeight;
canvas.width = W;
canvas.height = H;
const balls = [];
for (let i = 0; i < 36; i++) {
  balls.push({
    x: Math.random() * W,
    y: Math.random() * H,
    r: 40 + Math.random() * 120,
    vx: (Math.random() - 0.5) * 0.6,
    vy: (Math.random() - 0.5) * 0.5,
    hue: 210 + Math.random() * 80,
  });
}
const pointer = { x: -9999, y: -9999 };
window.addEventListener("mousemove", (e) => {
  pointer.x = e.clientX;
  pointer.y = e.clientY;
});
window.addEventListener("mouseleave", () => {
  pointer.x = -9999;
  pointer.y = -9999;
});
function drawBalls() {
  ctx.clearRect(0, 0, W, H);
  ctx.globalCompositeOperation = "lighter";
  for (let b of balls) {
    b.x += b.vx;
    b.y += b.vy;
    if (b.x < -200 || b.x > W + 200) b.vx *= -1;
    if (b.y < -200 || b.y > H + 200) b.vy *= -1;
    const dx = b.x - pointer.x,
      dy = b.y - pointer.y,
      dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 140) {
      const f = (140 - dist) * 0.008;
      b.vx += (dx / dist) * f;
      b.vy += (dy / dist) * f;
    }
    const g = ctx.createRadialGradient(b.x, b.y, b.r * 0.02, b.x, b.y, b.r);
    g.addColorStop(0, `hsla(${b.hue},85%,70%,0.6)`);
    g.addColorStop(0.2, `hsla(${b.hue},85%,60%,0.35)`);
    g.addColorStop(0.6, `hsla(${b.hue},85%,55%,0.12)`);
    g.addColorStop(1, `hsla(${b.hue},85%,50%,0)`);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalCompositeOperation = "source-over";
  requestAnimationFrame(drawBalls);
}
drawBalls();
window.addEventListener("resize", () => {
  W = innerWidth;
  H = innerHeight;
  canvas.width = W;
  canvas.height = H;
});

// Locomotive Scroll + ScrollTrigger
gsap.registerPlugin(ScrollTrigger);
const scrollContainer = document.querySelector("[data-scroll-container]");
const loco = new LocomotiveScroll({
  el: scrollContainer,
  smooth: true,
  inertia: 0.9,
  tablet: { smooth: true },
  smartphone: { smooth: true },
});
loco.on("scroll", ScrollTrigger.update);
ScrollTrigger.scrollerProxy(scrollContainer, {
  scrollTop(value) {
    if (arguments.length)
      loco.scrollTo(value, { duration: 0, disableLerp: true });
    return loco.scroll.instance ? loco.scroll.instance.scroll.y : 0;
  },
  getBoundingClientRect() {
    return { top: 0, left: 0, width: innerWidth, height: innerHeight };
  },
  pinType: scrollContainer.style.transform ? "transform" : "fixed",
});
ScrollTrigger.addEventListener("refresh", () => loco.update());
ScrollTrigger.refresh();

// Swiper
const swiper = new Swiper(".mySwiper", {
  slidesPerView: 1.05,
  spaceBetween: 20,
  centeredSlides: true,
  loop: true,
  pagination: { el: ".swiper-pagination", clickable: true },
  breakpoints: { 900: { slidesPerView: 2.05 } },
});
function scaleActive() {
  document.querySelectorAll(".swiper-slide").forEach((s) => {
    const el = s.querySelector(".slide-card");
    if (el) gsap.to(el, { scale: 0.98, duration: 0.45, ease: "power2.out" });
  });
  const active = document.querySelector(".swiper-slide-active");
  if (active) {
    const el = active.querySelector(".slide-card");
    if (el)
      gsap.to(el, { scale: 1.02, duration: 0.6, ease: "elastic.out(1,0.6)" });
  }
}
scaleActive();
swiper.on("slideChange", scaleActive);

// Project modal
const modal = document.getElementById("projectModal");
const modalContent = document.getElementById("modalContent");
const closeModal = document.getElementById("closeModal");
document.querySelectorAll(".slide-card .view").forEach((btn) => {
  btn.addEventListener("click", () => {
    const card = btn.closest(".slide-card");
    const data = JSON.parse(card.getAttribute("data-project"));
    modalContent.innerHTML = `<div style="display:flex;gap:20px;align-items:flex-start;flex-wrap:wrap"><img src="${data.img}" style="width:45%;min-width:280px;border-radius:12px;box-shadow:0 20px 50px rgba(2,6,20,0.4)" /><div style="flex:1;min-width:240px"><h2 style="margin-top:0">${data.title}</h2><p style="color:#6b7280">${data.desc}</p><p style="margin-top:14px;color:#6b7280">Detailed case study placeholder — role, challenge, approach, impact.</p></div></div>`;
    modal.classList.add("show");
  });
});
closeModal.addEventListener("click", () => {
  modal.classList.remove("show");
  modalContent.innerHTML = "";
});

// Smooth scroll nav
document
  .querySelectorAll("a[data-scroll-to], button[data-scroll-to]")
  .forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      const href = el.getAttribute("href") || el.dataset.target || "#work";
      const targetEl = document.querySelector(href);
      if (targetEl) loco.scrollTo(targetEl);
    });
  });
// skills
// Cursor
const cursor = document.getElementById("cursor");
const cursorLabel = document.getElementById("cursorLabel");
const cursorSVG = document.getElementById("cursorSVG");
const hexagon = cursorSVG.querySelector("#hex");
let mouseX = 0,
  mouseY = 0,
  cursorX = 0,
  cursorY = 0;
const speed = 0.2;
function animateCursor() {
  const distX = mouseX - cursorX;
  const distY = mouseY - cursorY;
  cursorX += distX * speed;
  cursorY += distY * speed;
  cursor.style.transform = `translate3d(${cursorX}px,${cursorY}px,0) translate(-50%,-50%)`;
  requestAnimationFrame(animateCursor);
}
animateCursor();
window.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.display = "block";
});
window.addEventListener("mouseleave", () => {
  cursor.style.display = "none";
});
document.querySelectorAll("a, button, .btn, .slide-card").forEach((el) => {
  el.addEventListener("mouseenter", () => {
    gsap.to(hexagon, { scale: 1.4, duration: 0.4, ease: "power3.out" });
    cursorLabel.style.opacity = 1;
    if (el.classList.contains("btn") || el.classList.contains("slide-card")) {
      cursorLabel.textContent = "Click";
    } else {
      cursorLabel.textContent = "Interact";
    }
  });
  el.addEventListener("mouseleave", () => {
    gsap.to(hexagon, { scale: 1, duration: 0.4, ease: "power3.out" });
    cursorLabel.style.opacity = 0;
  });
});
// Skill card hover effect
document.querySelectorAll(".skill-card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const deltaX = x - centerX;
    const deltaY = y - centerY;
    const rotateX = (deltaY / centerY) * 10;
    const rotateY = (deltaX / centerX) * 10;
    gsap.to(card, {
      rotationX: -rotateX,
      rotationY: rotateY,
      scale: 1.05,
      duration: 0.3,
      ease: "power3.out",
      transformPerspective: 600,
      transformOrigin: "center",
    });
  });
  card.addEventListener("mouseleave", () => {
    gsap.to(card, {
      rotationX: 0,
      rotationY: 0,
      scale: 1,
      duration: 0.3,
      ease: "elastic.out(1,0.5)",
      transformPerspective: 600,
      transformOrigin: "center",
    });
  });
});
// Download Resume
document.getElementById("downloadResume").addEventListener("click", () => {
  const link = document.createElement("a");
  link.href = "./Ahmed_Leghari_Resume_Updated.pdf";
  link.download = "Ahmed_Leghari_Resume_Updated.pdf";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});
// Contact form submission
document.getElementById("contactForm").addEventListener("submit", (e) => {
  e.preventDefault();
  alert("Thank you for reaching out! I will get back to you soon.");
  e.target.reset();
});
// See Work button
document.getElementById("seeWorkBtn").addEventListener("click", () => {
  loco.scrollTo("#work");
});
// Download Resume button hover effect
const downloadBtn = document.getElementById("downloadResume");
downloadBtn.addEventListener("mouseenter", () => {
  gsap.to(downloadBtn, { scale: 1.05, duration: 0.3, ease: "power3.out" });
});
downloadBtn.addEventListener("mouseleave", () => {
  gsap.to(downloadBtn, { scale: 1, duration: 0.5, ease: "elastic.out(1,0.5)" });
});
// Portrait hover effect
const portrait = document.getElementById("portrait");
portrait.addEventListener("mousemove", (e) => {
  const rect = portrait.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  const deltaX = x - centerX;
  const deltaY = y - centerY;
  const rotateX = (deltaY / centerY) * 8;
  const rotateY = (deltaX / centerX) * 8;
  gsap.to(portrait, {
    rotationX: -rotateX,
    rotationY: rotateY,
    scale: 1.02,
    duration: 0.3,
    ease: "power3.out",
    transformPerspective: 600,
    transformOrigin: "center",
  });
});
portrait.addEventListener("mouseleave", () => {
  gsap.to(portrait, {
    rotationX: 0,
    rotationY: 0,
    scale: 1,
    duration: 0.6,
    ease: "elastic.out(1,0.5)",
    transformPerspective: 600,
    transformOrigin: "center",
  });
});
// Headline gradient animation
const headline = document.getElementById("headline");
gsap.to(headline, {
  backgroundPosition: "200% center",
  duration: 8,
  ease: "linear",
  repeat: -1,
});
// Lead text fade-in
const lead = document.getElementById("lead");
gsap.from(lead, {
  opacity: 0,
  y: 20,
  duration: 1.2,
  ease: "power3.out",
  delay: 0.5,
});
// Portrait fade-in
gsap.from(portrait, {
  opacity: 0,
  scale: 0.95,
  duration: 1.5,
  ease: "power3.out",
  delay: 0.7,
});
// About section animation
gsap.from(".about .content", {
  opacity: 0,
  y: 30,
  duration: 1.2,
  ease: "power3.out",
  scrollTrigger: {
    trigger: ".about .content",
    scroller: scrollContainer,
    start: "top 80%",
  },
});
// Skills section animation
gsap.from(".skills .content", {
  opacity: 0,
  y: 30,
  duration: 0.8,
  ease: "power3.out",
  scrollTrigger: {
    trigger: ".skills .content",
    scroller: scrollContainer,
    start: "top 80%",
  },
});
// Projects section animation
gsap.from(".projects h2", {
  opacity: 0,
  y: 30,
  duration: 1.2,
  ease: "power3.out",
  scrollTrigger: {
    trigger: ".projects h2",
    scroller: scrollContainer,
    start: "top 80%",
  },
});
// Contact section animation
gsap.from(".contact h2", {
  opacity: 0,
  y: 30,
  duration: 1.2,
  ease: "power3.out",
  scrollTrigger: {
    trigger: ".contact h2",
    scroller: scrollContainer,
    start: "top 80%",
  },
});
gsap.from(".contact-form", {
  opacity: 0,
  y: 30,
  duration: 1.2,
  ease: "power3.out",
  scrollTrigger: {
    trigger: ".contact-form",
    scroller: scrollContainer,
    start: "top 80%",
  },
});
// Footer animation
gsap.from("footer", {
  opacity: 0,
  y: 20,
  duration: 1.2,
  ease: "power3.out",
  scrollTrigger: {
    trigger: "footer",
    scroller: scrollContainer,
    start: "top 90%",
  },
});
// End skills
