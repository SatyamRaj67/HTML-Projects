import { rand, clamp } from "../utils.js";

export class Star {
  constructor(x, y, cssW, cssH) {
    this.x = x;
    this.y = y;
    this.px = x; // Parallax-adjusted position
    this.py = y;

    const depth = Math.pow(Math.random(), 1.6);
    this.depth = depth;
    this.len = clamp(1 + Math.round(depth * 5), 1, 6);
    this.color = ["255, 255, 255", "200, 220, 255", "255, 240, 220"][
      Math.floor(Math.random() * 3)
    ];
    this.alpha = 0.55 + 0.35 * depth;
    this.wobble = rand(0.7, 1.3);
    this.twinkle = rand(2, 5);
    this.phase = rand(0, Math.PI * 2);
    this.vx = rand(-0.02, 0.02);
    this.vy = rand(-0.02, 0.02);
  }

  update(mouse, cssW, cssH) {
    // Continuous drift
    this.x += this.vx;
    this.y += this.vy;

    // Screen wrapping
    if (this.x < 0) this.x += cssW;
    if (this.x > cssW) this.x -= cssW;
    if (this.y < 0) this.y += cssH;
    if (this.y > cssH) this.y -= cssH;

    // Parallax calculation
    const parallaxFactor = this.depth * this.depth;
    this.px = this.x - mouse.dx * 150 * parallaxFactor;
    this.py = this.y - mouse.dy * 150 * parallaxFactor;
  }

  draw(ctx, dpr, t, config) {
    const cx = Math.round(this.px * dpr);
    const cy = Math.round(this.py * dpr);

    if (cx < 0 || cx > ctx.canvas.width || cy < 0 || cy > ctx.canvas.height)
      return;

    const time = t * 0.001;
    const breathePhase = Math.sin(time * this.wobble + this.phase);
    const twinkleVal = Math.sin(time * this.twinkle + this.phase);

    let cardPhase = config.ENABLE_BREATHE ? 1 + 0.2 * breathePhase : 1;
    let diagPhase = config.ENABLE_BREATHE
      ? 1 + 0.2 * Math.sin(breathePhase - Math.PI / 2)
      : 1;

    const baseAlpha = this.alpha * (0.8 + 0.2 * twinkleVal);
    const finalAlpha = clamp(baseAlpha * ((cardPhase + diagPhase) / 2), 0, 1);

    ctx.fillStyle = `rgba(${this.color}, ${finalAlpha.toFixed(3)})`;
    ctx.fillRect(cx, cy, 1, 1);

    const cardLen = Math.max(1, Math.round(this.len * cardPhase));
    const gap = config.RAY_GAP;
    ctx.fillRect(cx + 1 + gap, cy, cardLen, 1);
    ctx.fillRect(cx - gap - cardLen, cy, cardLen, 1);
    ctx.fillRect(cx, cy + 1 + gap, 1, cardLen);
    ctx.fillRect(cx, cy - gap - cardLen, 1, cardLen);

    if (config.ENABLE_DIAGONALS && this.len > 2) {
      const diagLen = Math.max(1, Math.floor(this.len * 0.6 * diagPhase));
      const diagAlpha = finalAlpha * 0.5;
      ctx.fillStyle = `rgba(${this.color}, ${diagAlpha.toFixed(3)})`;
      for (let step = 1 + gap; step <= gap + diagLen; step++) {
        ctx.fillRect(cx + step, cy + step, 1, 1);
        ctx.fillRect(cx + step, cy - step, 1, 1);
        ctx.fillRect(cx - step, cy + step, 1, 1);
        ctx.fillRect(cx - step, cy - step, 1, 1);
      }
    }
  }
}
