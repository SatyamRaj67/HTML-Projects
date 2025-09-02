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

    // Initialize scroll animations after cards are loaded
    initScrollAnimations();
  })
  .catch((error) => console.error("Error fetching JSON:", error));

// Scroll animation system
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -20% 0px",
  };

  const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      }
    });
  }, observerOptions);

  // Observe all cards
  document.querySelectorAll(".card").forEach((card) => {
    animationObserver.observe(card);
  });
}

// Parallax effect for decorative SVGs
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset;
  const parallax = scrolled * 0.5;

  document.querySelector(
    ".top-right"
  ).style.transform = `translateY(${parallax}px)`;
  document.querySelector(
    ".bottom-left"
  ).style.transform = `translateY(${-parallax}px)`;
});

// Enhanced mouse tracking for cards
document.getElementById("cards").onmousemove = (e) => {
  requestAnimationFrame(() => {
    for (const card of document.getElementsByClassName("card")) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    }
  });
};

// Reset card transforms when mouse leaves
document.getElementById("cards").onmouseleave = () => {
  for (const card of document.getElementsByClassName("card")) {
    card.style.transform = "";
  }
};
