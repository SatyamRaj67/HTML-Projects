import { CONFIG } from "./config.js";
import { rand, clamp } from "./utils.js";
import { Star } from "./entities/Star.js";
import { Nova } from "./entities/Nova.js";
import { ShootingStar } from "./entities/ShootingStar.js";
import { TrailParticle } from "./entities/TrailParticle.js";

class SpaceEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d", {
      alpha: false,
      desynchronized: true,
    });
    this.config = CONFIG; // Mutable config

    this.cssW = 0;
    this.cssH = 0;
    this.dpr = 1;

    this.stars = [];
    this.effects = []; // Novas, Shooting Stars, Trails

    this.nebulaCanvas = null;
    this.running = true;
    this.lastTime = 0;
    this.mouse = { x: 0, y: 0, dx: 0, dy: 0 };
  }

  init() {
    this._resize();
    this._setupEventListeners();
    this.lastTime = performance.now();
    this._loop();
  }

  _resize() {
    this.cssW = window.innerWidth;
    this.cssH = window.innerHeight;
    this.dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    this.canvas.width = Math.floor(this.cssW * this.dpr);
    this.canvas.height = Math.floor(this.cssH * this.dpr);
    this._generateStars();
    if (this.config.ENABLE_NEBULA) {
      this._generateNebula();
    }
  }

  _setupEventListeners() {
    window.addEventListener("resize", () => this._resize(), { passive: true });

    window.addEventListener("keydown", (e) => {
      const k = e.key.toLowerCase();
      if (e.code === "Space") this.running = !this.running;
      else if (k === "r") this._generateStars();
      else if (k === "d")
        this.config.ENABLE_DIAGONALS = !this.config.ENABLE_DIAGONALS;
      else if (k === "b")
        this.config.ENABLE_BREATHE = !this.config.ENABLE_BREATHE;
      else if (k === "p")
        this.config.ENABLE_PARALLAX = !this.config.ENABLE_PARALLAX;
      else if (k === "n") {
        this.config.ENABLE_NEBULA = !this.config.ENABLE_NEBULA;
        if (this.config.ENABLE_NEBULA) this._generateNebula();
      } else if (k === "s")
        this.config.ENABLE_SHOOTING_STARS = !this.config.ENABLE_SHOOTING_STARS;
      else if (k === "c")
        this.config.ENABLE_CLICK_NOVA = !this.config.ENABLE_CLICK_NOVA;
      else if (k === "t")
        this.config.ENABLE_MOUSE_TRAIL = !this.config.ENABLE_MOUSE_TRAIL;
    });

    window.addEventListener(
      "mousemove",
      (e) => {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
      },
      { passive: true }
    );

    window.addEventListener("click", (e) => {
      if (this.config.ENABLE_CLICK_NOVA) {
        this._createNova(e.clientX, e.clientY);
      }
    });
  }

  _generateStars() {
    this.stars = [];
    const target = clamp(
      Math.round((this.cssW * this.cssH) / this.config.TARGET_AREA_PER_STAR),
      this.config.MIN_STARS,
      this.config.MAX_STARS
    );
    const pts = [];
    let attempts = 0,
      maxAttempts = target * 40;

    while (pts.length < target && attempts++ < maxAttempts) {
      const x = Math.random() * this.cssW;
      const y = Math.random() * this.cssH;
      if (
        pts.every(
          (p) => (p.x - x) ** 2 + (p.y - y) ** 2 >= this.config.MIN_SEP ** 2
        )
      ) {
        pts.push({ x, y });
      }
    }
    this.stars = pts.map((p) => new Star(p.x, p.y, this.cssW, this.cssH));
  }

  _generateNebula() {
    this.nebulaCanvas = document.createElement("canvas");
    this.nebulaCanvas.width = this.canvas.width;
    this.nebulaCanvas.height = this.canvas.height;
    const nebCtx = this.nebulaCanvas.getContext("2d");
    nebCtx.globalCompositeOperation = "lighter";

    const numClouds = Math.floor(rand(15, 25));
    for (let i = 0; i < numClouds; i++) {
      const x = rand(0, this.nebulaCanvas.width);
      const y = rand(0, this.nebulaCanvas.height);
      const r1 = rand(50, 200) * this.dpr;
      const r2 = rand(r1, this.nebulaCanvas.width * 0.4);
      const grad = nebCtx.createRadialGradient(x, y, r1, x, y, r2);
      const hue = rand(200, 280);
      grad.addColorStop(0, `hsla(${hue}, 50%, 40%, ${rand(0.05, 0.15)})`);
      grad.addColorStop(1, `hsla(${hue}, 50%, 20%, 0)`);
      nebCtx.fillStyle = grad;
      nebCtx.fillRect(0, 0, this.nebulaCanvas.width, this.nebulaCanvas.height);
    }
  }

  _createNova(x, y) {
    const nova = new Nova(x, y, this.config, () => {
      this.effects = this.effects.filter((e) => e !== nova);
    });
    this.effects.push(nova);
  }

  _createTrailParticle() {
    if (
      this.effects.filter((e) => e instanceof TrailParticle).length <
      this.config.TRAIL_PARTICLES
    ) {
      const particle = new TrailParticle(
        this.mouse.x,
        this.mouse.y,
        this.config,
        () => {
          this.effects = this.effects.filter((e) => e !== particle);
        }
      );
      this.effects.push(particle);
    }
  }

  _createShootingStar() {
    const star = new ShootingStar(
      this.canvas.width,
      this.canvas.height,
      this.dpr,
      this.config
    );
    this.effects.push(star);
  }

  _update(delta, t) {
    // Update parallax smoothing
    const targetDx = this.config.ENABLE_PARALLAX
      ? ((this.mouse.x - this.cssW / 2) / (this.cssW / 2)) *
        this.config.PARALLAX_STRENGTH
      : 0;
    const targetDy = this.config.ENABLE_PARALLAX
      ? ((this.mouse.y - this.cssH / 2) / (this.cssH / 2)) *
        this.config.PARALLAX_STRENGTH
      : 0;
    this.mouse.dx += (targetDx - this.mouse.dx) * 0.05;
    this.mouse.dy += (targetDy - this.mouse.dy) * 0.05;

    // Update stars
    this.stars.forEach((s) => s.update(this.mouse, this.cssW, this.cssH));

    // Update effects that have manual updates
    this.effects.forEach((e) => {
      if (e.update) {
        const isAlive = e.update(delta);
        if (!isAlive) {
          this.effects = this.effects.filter((eff) => eff !== e);
        }
      }
    });

    // Spawn new effects
    if (this.config.ENABLE_MOUSE_TRAIL) this._createTrailParticle();
    if (
      this.config.ENABLE_SHOOTING_STARS &&
      Math.random() < this.config.SHOOTING_STAR_CHANCE
    )
      this._createShootingStar();
  }

  _draw(t) {
    // Clear background
    this.ctx.globalCompositeOperation = "source-over";
    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    gradient.addColorStop(0, "#090b10");
    gradient.addColorStop(1, "#121417");
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw nebula
    if (this.config.ENABLE_NEBULA && this.nebulaCanvas) {
      this.ctx.globalAlpha = 0.5 + 0.5 * Math.sin(t * 0.0001);
      this.ctx.drawImage(this.nebulaCanvas, 0, 0);
      this.ctx.globalAlpha = 1;
    }

    // Draw stars
    this.stars.forEach((s) => s.draw(this.ctx, this.dpr, t, this.config));

    // Draw effects
    this.effects.forEach((e) => e.draw(this.ctx, this.dpr));

    // Reset composite operation
    this.ctx.globalCompositeOperation = "source-over";
  }

  _loop(t = 0) {
    if (!this.running) {
      this.lastTime = t; // Prevent large delta jump on resume
    } else {
      const delta = (t - this.lastTime) / 1000;
      this.lastTime = t;
      this._update(delta, t);
      this._draw(t);
    }
    requestAnimationFrame(this._loop.bind(this));
  }
}

export default SpaceEngine;
