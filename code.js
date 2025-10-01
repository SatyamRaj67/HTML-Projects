// ========================
// Dynamic Card Generation with Search and Sections
// ========================

let projectsData = {};
let allProjects = [];
let allTags = new Set();
let selectedTags = new Set();
let currentHighlightIndex = -1;
let autocompleteItems = [];

fetch("HTMLFiles.json")
  .then((response) => response.json())
  .then((data) => {
    projectsData = data;
    
    // Convert to array and add project name
    allProjects = Object.keys(data).map(key => ({
      ...data[key],
      projectName: key,
      primaryTag: data[key].tags ? data[key].tags[0] : 'other'
    }));
    
    // Collect all unique tags
    allProjects.forEach(project => {
      if (project.tags) {
        project.tags.forEach(tag => allTags.add(tag));
      }
    });
    
    renderProjects(allProjects);
    setupSearchAndFilters();
  })
  .catch((error) => console.error("Error fetching JSON:", error));

function renderProjects(projects) {
  // Group projects by their primary tag (first tag)
  const groupedProjects = projects.reduce((groups, project) => {
    const primaryTag = project.primaryTag;
    if (!groups[primaryTag]) {
      groups[primaryTag] = [];
    }
    groups[primaryTag].push(project);
    return groups;
  }, {});

  let html_code = "";
  
  // Render each section
  Object.keys(groupedProjects).forEach(tag => {
    const tagProjects = groupedProjects[tag];
    const sectionTitle = capitalizeFirst(tag);
    
    html_code += `<div class="section" data-section="${tag}">\n`;
    html_code += `  <h2 class="section-title">${sectionTitle}</h2>\n`;
    html_code += `  <div class="section-cards">\n`;
    
    tagProjects.forEach(project => {
      html_code += generateCardHTML(project);
    });
    
    html_code += `  </div>\n`;
    html_code += `</div>\n`;
  });
  
  document.getElementById("cards").innerHTML = html_code;
}

function generateCardHTML(project) {
  let cardHTML = `<a class="card ${project.class || ''}" href="${project.path}" target="_blank" data-tags="${project.tags ? project.tags.join(' ') : ''}" data-name="${project.projectName.toLowerCase()}">\n`;
  cardHTML += '  <div class="card-content">\n';
  cardHTML += '    <div class="card-info-wrapper">\n';
  cardHTML += `      <div class="card-info">\n`;
  cardHTML += `        <div class="card-info-title">\n`;
  cardHTML += `          <h3>${project.projectName}</h3>\n`;
  
  // Display tags instead of name
  if (project.tags && project.tags.length > 0) {
    cardHTML += `          <h4>${project.tags.join(', ')}</h4>\n`;
  } else {
    cardHTML += `          <h4>${project.name}</h4>\n`;
  }
  
  if (project.status) {
    cardHTML += `          <h2 class="status">${project.status}</h2>\n`;
  }
  cardHTML += "        </div>\n";
  if (project.img) {
    cardHTML += '<div class="imgBx">';
    cardHTML += `     <img src="${project.img}" alt="Image">`;
    cardHTML += "</div>";
  }
  cardHTML += "      </div>\n";
  cardHTML += "    </div>\n";
  cardHTML += "  </div>\n";
  cardHTML += "</a>\n";
  
  return cardHTML;
}

function setupSearchAndFilters() {
  const searchInput = document.getElementById('searchInput');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const autocompleteDropdown = document.getElementById('autocomplete-dropdown');
  const selectedTagsContainer = document.getElementById('selected-tags');
  
  // Search with autocomplete functionality
  searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase().trim();
    
    if (searchTerm.length > 0) {
      showAutocomplete(searchTerm);
    } else {
      hideAutocomplete();
    }
    
    // Real-time filtering based on input and selected tags
    filterProjectsAdvanced();
  });
  
  // Keyboard navigation for autocomplete
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      navigateAutocomplete(1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      navigateAutocomplete(-1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      selectAutocompleteItem();
    } else if (e.key === 'Escape') {
      hideAutocomplete();
    }
  });
  
  // Hide autocomplete when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-container')) {
      hideAutocomplete();
    }
  });
  
  // Filter buttons functionality
  filterButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      // Update active button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      e.target.classList.add('active');
      
      const filterValue = e.target.getAttribute('data-filter');
      
      if (filterValue === 'all') {
        selectedTags.clear();
        updateSelectedTagsDisplay();
        renderProjects(allProjects);
      } else {
        selectedTags.clear();
        selectedTags.add(filterValue);
        updateSelectedTagsDisplay();
        filterProjectsAdvanced();
      }
    });
  });
}

function showAutocomplete(searchTerm) {
  const autocompleteDropdown = document.getElementById('autocomplete-dropdown');
  const suggestions = getSuggestions(searchTerm);
  
  if (suggestions.length === 0) {
    hideAutocomplete();
    return;
  }
  
  autocompleteItems = suggestions;
  currentHighlightIndex = -1;
  
  const html = suggestions.map((item, index) => 
    `<div class="autocomplete-item" data-index="${index}">
      ${item.value}
      <span class="tag-type">${item.type}</span>
    </div>`
  ).join('');
  
  autocompleteDropdown.innerHTML = html;
  autocompleteDropdown.classList.add('show');
  
  // Add click handlers
  autocompleteDropdown.querySelectorAll('.autocomplete-item').forEach(item => {
    item.addEventListener('click', () => {
      const index = parseInt(item.dataset.index);
      selectSuggestion(suggestions[index]);
    });
  });
}

function hideAutocomplete() {
  const autocompleteDropdown = document.getElementById('autocomplete-dropdown');
  autocompleteDropdown.classList.remove('show');
  currentHighlightIndex = -1;
}

function getSuggestions(searchTerm) {
  const suggestions = [];
  
  // Add matching tags
  Array.from(allTags).forEach(tag => {
    if (tag.toLowerCase().includes(searchTerm) && !selectedTags.has(tag)) {
      suggestions.push({ value: tag, type: 'tag' });
    }
  });
  
  // Add matching project names
  allProjects.forEach(project => {
    if (project.projectName.toLowerCase().includes(searchTerm)) {
      suggestions.push({ value: project.projectName, type: 'project' });
    }
  });
  
  return suggestions.slice(0, 8); // Limit to 8 suggestions
}

function navigateAutocomplete(direction) {
  if (autocompleteItems.length === 0) return;
  
  // Remove previous highlight
  const items = document.querySelectorAll('.autocomplete-item');
  if (currentHighlightIndex >= 0) {
    items[currentHighlightIndex]?.classList.remove('highlighted');
  }
  
  // Update index
  currentHighlightIndex += direction;
  if (currentHighlightIndex < 0) currentHighlightIndex = autocompleteItems.length - 1;
  if (currentHighlightIndex >= autocompleteItems.length) currentHighlightIndex = 0;
  
  // Add new highlight
  items[currentHighlightIndex]?.classList.add('highlighted');
  items[currentHighlightIndex]?.scrollIntoView({ block: 'nearest' });
}

function selectAutocompleteItem() {
  if (currentHighlightIndex >= 0 && autocompleteItems[currentHighlightIndex]) {
    selectSuggestion(autocompleteItems[currentHighlightIndex]);
  }
}

function selectSuggestion(suggestion) {
  const searchInput = document.getElementById('searchInput');
  
  if (suggestion.type === 'tag') {
    selectedTags.add(suggestion.value);
    updateSelectedTagsDisplay();
    searchInput.value = '';
    hideAutocomplete();
    filterProjectsAdvanced();
  } else if (suggestion.type === 'project') {
    searchInput.value = suggestion.value;
    hideAutocomplete();
    filterProjectsAdvanced();
  }
}

function updateSelectedTagsDisplay() {
  const container = document.getElementById('selected-tags');
  container.innerHTML = '';
  
  selectedTags.forEach(tag => {
    const chip = document.createElement('div');
    chip.className = 'tag-chip';
    chip.innerHTML = `
      ${tag}
      <span class="remove-tag" data-tag="${tag}">×</span>
    `;
    
    chip.querySelector('.remove-tag').addEventListener('click', () => {
      selectedTags.delete(tag);
      updateSelectedTagsDisplay();
      filterProjectsAdvanced();
    });
    
    container.appendChild(chip);
  });
}

function filterProjectsAdvanced() {
  const searchInput = document.getElementById('searchInput');
  const searchTerm = searchInput.value.toLowerCase().trim();
  
  let filteredProjects = allProjects;
  
  // Filter by selected tags
  if (selectedTags.size > 0) {
    filteredProjects = filteredProjects.filter(project => {
      if (!project.tags) return false;
      return Array.from(selectedTags).every(tag => 
        project.tags.includes(tag)
      );
    });
  }
  
  // Filter by search term (project names)
  if (searchTerm) {
    filteredProjects = filteredProjects.filter(project =>
      project.projectName.toLowerCase().includes(searchTerm)
    );
  }
  
  renderProjects(filteredProjects);
}

function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

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
// Particle Animation Background
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
