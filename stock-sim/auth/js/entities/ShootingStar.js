import { rand } from "../utils.js";

export class ShootingStar {
  constructor(canvasWidth, canvasHeight, dpr, config) {
    this.config = config;
    this.x = rand(0, canvasWidth);
    this.y = rand(0, canvasHeight);
    this.len = rand(50, 150) * dpr;
    this.angle = rand(0, Math.PI * 2);
    this.speed =
      rand(config.SHOOTING_STAR_SPEED * 0.5, config.SHOOTING_STAR_SPEED * 1.5) *
      dpr;
    this.alpha = rand(0.5, 1);
    this.vx = Math.cos(this.angle) * this.speed;
    this.vy = Math.sin(this.angle) * this.speed;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.alpha *= this.config.SHOOTING_STAR_FADE_RATE;
    return this.alpha >= 0.01; // Return false when dead
  }

  draw(ctx) {
    ctx.globalCompositeOperation = "lighter";

    const ink =
      getComputedStyle(document.documentElement).getPropertyValue("--ink") ||
      "255,255,255";
    const grad = ctx.createLinearGradient(
      this.x,
      this.y,
      this.x - this.vx * (this.len / this.speed),
      this.y - this.vy * (this.len / this.speed)
    );
    grad.addColorStop(0, `rgba(${ink}, ${this.alpha})`);
    grad.addColorStop(1, `rgba(${ink}, 0)`);

    ctx.strokeStyle = grad;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x + this.vx, this.y + this.vy);
    ctx.stroke();
  }
}
