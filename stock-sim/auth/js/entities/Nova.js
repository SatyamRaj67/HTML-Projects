import { rand, clamp } from "../utils.js";

export class Nova {
  constructor(x, y, config, onComplete) {
    this.x = x;
    this.y = y;
    this.config = config;
    this.hue = rand(0, 360);
    this.particles = [];
    this.shapeRadii = Array.from({ length: config.NOVA_SHAPE_POINTS }, () =>
      rand(0.85, 1.15)
    );

    this.props = { progress: 0 }; // GSAP will animate this

    for (let i = 0; i < config.NOVA_PARTICLES; i++) {
      const angle = rand(0, Math.PI * 2);
      const speed = rand(50, 250) * (1 + Math.random());
      this.particles.push({
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
      });
    }

    gsap.to(this.props, {
      progress: 1,
      duration: config.NOVA_LIFESPAN,
      ease: "power2.out",
      onComplete: onComplete,
    });
  }

  draw(ctx, dpr) {
    ctx.globalCompositeOperation = "lighter";

    const progress = this.props.progress;
    const life = 1 - progress;
    const alpha = life * life;

    // Shockwave
    const baseRadius = progress * this.config.NOVA_SHOCKWAVE_SPEED;
    ctx.strokeStyle = `hsla(${this.hue}, 100%, 80%, ${alpha * 0.7})`;
    ctx.lineWidth = 2 * dpr;
    ctx.beginPath();
    const angleStep = (Math.PI * 2) / this.config.NOVA_SHAPE_POINTS;
    for (let j = 0; j < this.config.NOVA_SHAPE_POINTS; j++) {
      const r1 = baseRadius * this.shapeRadii[j];
      const p1x = (this.x + Math.cos(j * angleStep) * r1) * dpr;
      const p1y = (this.y + Math.sin(j * angleStep) * r1) * dpr;
      const r2 =
        baseRadius * this.shapeRadii[(j + 1) % this.config.NOVA_SHAPE_POINTS];
      const p2x = (this.x + Math.cos((j + 1) * angleStep) * r2) * dpr;
      const p2y = (this.y + Math.sin((j + 1) * angleStep) * r2) * dpr;
      const midX = (p1x + p2x) / 2;
      const midY = (p1y + p2y) / 2;
      if (j === 0) ctx.moveTo(midX, midY);
      else ctx.quadraticCurveTo(p1x, p1y, midX, midY);
    }
    ctx.closePath();
    ctx.stroke();

    // Core Flash
    const coreProgress = clamp(
      progress / this.config.NOVA_CORE_LIFESPAN_RATIO,
      0,
      1
    );
    if (coreProgress < 1) {
      const eased = 1 - Math.pow(1 - coreProgress, 2);
      const coreRadius = (40 + 160 * eased) * dpr;
      const coreAlpha = Math.pow(1 - coreProgress, 1.5);
      const grad = ctx.createRadialGradient(
        this.x * dpr,
        this.y * dpr,
        0,
        this.x * dpr,
        this.y * dpr,
        coreRadius
      );
      grad.addColorStop(0, `hsla(${this.hue}, 100%, 95%, ${coreAlpha})`);
      grad.addColorStop(1, `hsla(${this.hue}, 100%, 80%, 0)`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(this.x * dpr, this.y * dpr, coreRadius, 0, Math.PI * 2);
      ctx.fill();
    }

    // Particles
    ctx.fillStyle = `hsla(${this.hue}, 100%, 75%, ${alpha})`;
    for (const p of this.particles) {
      const px = (this.x + p.vx * progress) * dpr;
      const py = (this.y + p.vy * progress) * dpr;
      ctx.fillRect(px, py, 1.5 * dpr, 1.5 * dpr);
    }
  }
}
