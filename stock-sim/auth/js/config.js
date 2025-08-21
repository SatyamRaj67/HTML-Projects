export const CONFIG = {
  // Star Generation
  MIN_STARS: 400,
  MAX_STARS: 900,
  TARGET_AREA_PER_STAR: 45000,
  MIN_SEP: 22, // Minimum separation between stars

  // Star Appearance & Motion
  STAR_COLORS: [
    "255, 255, 255", // White
    "200, 220, 255", // Pale Blue
    "255, 240, 220", // Faint Yellow
  ],
  RAY_GAP: 1,
  PARALLAX_STRENGTH: 0.8, // How much the mouse affects the view. 0 to disable.

  // Effects
  ENABLE_DIAGONALS: true,
  ENABLE_BREATHE: true,
  ENABLE_PARALLAX: true,
  ENABLE_NEBULA: true,
  ENABLE_SHOOTING_STARS: true,
  ENABLE_CLICK_NOVA: true,
  ENABLE_MOUSE_TRAIL: true,

  SHOOTING_STAR_CHANCE: 0.0008, // Chance per frame
  SHOOTING_STAR_SPEED: 15,
  SHOOTING_STAR_FADE_RATE: 0.96,

  // New Effect Config
  NOVA_PARTICLES: 80, // Number of particles in a supernova
  NOVA_LIFESPAN: 1.5, // Duration of the explosion in seconds
  NOVA_SHOCKWAVE_SPEED: 350, // Speed of the expanding shockwave (pixels/sec)
  NOVA_CORE_LIFESPAN_RATIO: 0.15, // % of lifespan the bright core is visible
  NOVA_SHAPE_POINTS: 12, // Number of points defining the shockwave's curvy shape
  TRAIL_PARTICLES: 25, // Max number of particles in the mouse trail
  TRAIL_LIFESPAN: 0.4, // Duration of trail particles in seconds
};
