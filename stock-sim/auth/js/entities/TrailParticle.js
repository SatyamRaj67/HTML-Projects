import { rand } from "../utils.js";

export class TrailParticle {
  constructor(x, y, config, onComplete) {
    this.config = config;
    this.props = { x, y, life: 1 };

    const colorIndex = Math.floor(Math.random() * config.STAR_COLORS.length);
    this.color = config.STAR_COLORS[colorIndex];

    gsap.to(this.props, {
      life: 0,
      x: `+=${rand(-5, 5)}`,
      y: `+=${rand(-5, 5)}`,
      duration: config.TRAIL_LIFESPAN,
      ease: "power1.out",
      onComplete: onComplete,
    });
  }

  draw(ctx, dpr) {
    ctx.globalCompositeOperation = "lighter";
    ctx.fillStyle = `rgba(${this.color}, ${this.props.life * 0.8})`;
    ctx.fillRect(this.props.x * dpr, this.props.y * dpr, 1, 1);
  }
}
