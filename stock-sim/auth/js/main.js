import SpaceEngine from "./SpaceEngine.js";

// Wait for the DOM to be fully loaded before starting the engine
document.addEventListener("DOMContentLoaded", () => {
  const space = new SpaceEngine("space");
  space.init();
});
