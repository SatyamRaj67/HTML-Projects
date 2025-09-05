const root = document.documentElement;
let mx = -9999,
  my = -9999,
  rafId = 0;

function apply() {
  rafId = 0;
  root.style.setProperty("--mx", mx);
  root.style.setProperty("--my", my);
}

function move(e) {
  mx = e.clientX;
  my = e.clientY;
  if (!rafId) rafId = requestAnimationFrame(apply);
}

function leave() {
  mx = -9999;
  my = -9999;
  if (!rafId) rafId = requestAnimationFrame(apply);
}

addEventListener("pointermove", move, {passive: true});
addEventListener("pointerdown", move, {passive: true});
addEventListener("pointerleave", leave, {passive: true});