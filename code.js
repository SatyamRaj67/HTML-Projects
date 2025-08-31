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


// Scroll-triggered animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      entry.target.style.setProperty('--card-index', index);
      entry.target.classList.add('animate-in');
    }
  });
}, observerOptions);

// Observe cards when they're created
const observeCards = () => {
  document.querySelectorAll('.card').forEach(card => {
    observer.observe(card);
  });
};

// Parallax effect for decorative SVGs
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const parallax = scrolled * 0.5;
  
  document.querySelector('.top-right').style.transform = `translateY(${parallax}px)`;
  document.querySelector('.bottom-left').style.transform = `translateY(${-parallax}px)`;
});

// Enhanced mouse tracking for cards
let isMouseMoving = false;
document.getElementById("cards").onmousemove = (e) => {
  if (!isMouseMoving) {
    isMouseMoving = true;
    requestAnimationFrame(() => {
      for (const card of document.getElementsByClassName("card")) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Enhanced magnetic effect
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const deltaX = (x - centerX) / centerX;
        const deltaY = (y - centerY) / centerY;
        
        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);
        card.style.setProperty("--tilt-x", `${deltaY * 5}deg`);
        card.style.setProperty("--tilt-y", `${deltaX * -5}deg`);
        
        card.style.transform = `
          perspective(1000px) 
          rotateX(var(--tilt-x, 0deg)) 
          rotateY(var(--tilt-y, 0deg))
          translateY(-10px)
          scale(1.05)
        `;
      }
      isMouseMoving = false;
    });
  }
};

// Reset card transforms when mouse leaves
document.getElementById("cards").onmouseleave = () => {
  for (const card of document.getElementsByClassName("card")) {
    card.style.transform = '';
  }
};
