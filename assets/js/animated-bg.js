// Simple gradient animation or SVG/Canvas effect
document.addEventListener("DOMContentLoaded", () => {
    const bg = document.getElementById("animated-bg");
    if (bg) {
      bg.style.background = `radial-gradient(circle at top left, #0f0c29, #302b63, #24243e)`;
      bg.style.animation = "pulse-bg 15s ease-in-out infinite";
    }
  });
  