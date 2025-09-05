// ========================
// Dynamic Card Generation
// ========================

fetch("HTMLFiles.json")
  .then((response) => response.json())
  .then((data) => {
    let html_code = "";
    for (const category in data) {
      if (data.hasOwnProperty(category)) {
        const info = data[category];
        html_code += `<a class="card ${info.class}" href="${info.path}" target="_blank">\n`;
        html_code += '  <div class="card-content">\n';
        html_code += '    <div class="card-info-wrapper">\n';
        html_code += `      <div class="card-info">\n`;
        html_code += `        <div class="card-info-title">\n`;
        html_code += `          <h3>${category}</h3>\n`;
        html_code += `          <h4>${info.name}</h4>\n`;
        if (info.status) {
          html_code += `          <h2 class="status">${info.status}</h2>\n`;
        }
        html_code += "        </div>\n";
        if (info.img) {
          html_code += '<div class="imgBx">';
          html_code += `     <img src="${info.img}" alt="Image">`;
          html_code += "</div>";
        }
        html_code += "      </div>\n";
        html_code += "    </div>\n";
        html_code += "  </div>\n";
        html_code += "</a>\n";
      }
    }
    document.getElementById("cards").innerHTML = html_code;
  })
  .catch((error) => console.error("Error fetching JSON:", error));

// ========================
// Scroll Progress Indicator (Chevrons)
// ========================

document.addEventListener("DOMContentLoaded", function () {
  const progressPath = document.querySelector(".progress-wrap path");
  const pathLength = progressPath.getTotalLength();

  progressPath.style.transition = progressPath.style.WebkitTransition = "none";
  progressPath.style.strokeDasharray = `${pathLength} ${pathLength}`;
  progressPath.style.strokeDashoffset = pathLength;
  progressPath.getBoundingClientRect();
  progressPath.style.transition = progressPath.style.WebkitTransition =
    "stroke-dashoffset 10ms linear";

  const updateProgress = () => {
    const scroll = window.scrollY;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const progress = pathLength - (scroll * pathLength) / height;
    progressPath.style.strokeDashoffset = progress;
  };

  updateProgress();
  window.addEventListener("scroll", updateProgress);

  const offset = 50;
  window.addEventListener("scroll", () => {
    if (window.scrollY > offset) {
      document.querySelector(".progress-wrap").classList.add("active-progress");
    } else {
      document
        .querySelector(".progress-wrap")
        .classList.remove("active-progress");
    }
  });

  document
    .querySelector(".progress-wrap")
    .addEventListener("click", (event) => {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
});

// ========================
// Mouse Tracking for Cards
// ========================

document.getElementById("cards").onmousemove = (e) => {
  for (const card of document.getElementsByClassName("card")) {
    const rect = card.getBoundingClientRect(),
      x = e.clientX - rect.left,
      y = e.clientY - rect.top;

    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  }
};

// ========================

const canvas = document.getElementById("particleCanvas");
const ctx = canvas.getContext("2d");

// Initial canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
let particleCount = calculateParticleCount();

class Particle {
  constructor() {
    this.reset();
    this.y = Math.random() * canvas.height;
    this.fadeDelay = Math.random() * 600 + 100;
    this.fadeStart = Date.now() + this.fadeDelay;
    this.fadingOut = false;
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.speed = Math.random() / 5 + 0.1;
    this.opacity = 1;
    this.fadeDelay = Math.random() * 600 + 100;
    this.fadeStart = Date.now() + this.fadeDelay;
    this.fadingOut = false;
  }

  update() {
    this.y -= this.speed;
    if (this.y < 0) {
      this.reset();
    }

    if (!this.fadingOut && Date.now() > this.fadeStart) {
      this.fadingOut = true;
    }

    if (this.fadingOut) {
      this.opacity -= 0.008;
      if (this.opacity <= 0) {
        this.reset();
      }
    }
  }

  draw() {
    ctx.fillStyle = `rgba(${255 - (Math.random() * 255) / 2}, 255, 255, ${
      this.opacity
    })`;
    ctx.fillRect(this.x, this.y, 0.4, Math.random() * 2 + 1);
  }
}

function initParticles() {
  particles = [];
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((particle) => {
    particle.update();
    particle.draw();
  });
  requestAnimationFrame(animate);
}

function calculateParticleCount() {
  return Math.floor((canvas.width * canvas.height) / 6000);
}

function onResize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  particleCount = calculateParticleCount();
  initParticles();
}

window.addEventListener("resize", onResize);

initParticles();
animate();

// ========================
window.addEventListener("load", function () {
  var fieldOne = document.getElementsByClassName("field")[0];
  var fieldTwo = document.getElementsByClassName("field-two")[0];
  var button = document.getElementsByClassName("button")[0];
  var overlay = document.getElementById("form-sent");
  var drawing = document.getElementsByClassName("draw");

  var intervalID = window.setInterval(animateForm, 11250);
  var stopDrawing = window.setTimeout(removeDrawingClass, 4500);

  drawing = [].slice.call(drawing);

  function animateForm() {
    fieldOne.classList.remove("field");
    fieldTwo.classList.remove("field-two");
    button.classList.remove("button");
    overlay.classList.add("is-hidden");
    overlay.id = "";

    setTimeout(function () {
      fieldOne.classList.add("field");
      fieldTwo.classList.add("field-two");
      button.classList.add("button");
      overlay.id = "form-sent";
      overlay.classList.remove("is-hidden");
    }, 50);
  }

  function removeDrawingClass() {
    drawing.forEach(function (draw) {
      draw.classList.remove("draw");
    });
  }
});
