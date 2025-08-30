class ProjectMap {
  constructor() {
    this.creators = [
      "Alex Chen",
      "Maria Rodriguez",
      "James Wilson",
      "Sarah Kim",
      "David Brown",
      "Emma Thompson",
      "Michael Lee",
      "Anna Garcia",
      "Ryan Davis",
      "Sophie Wang",
      "Jake Miller",
      "Lily Zhang",
      "Tom Anderson",
      "Maya Patel",
      "Lucas White",
      "Zoe Johnson",
      "Kevin Liu",
      "Grace Taylor",
      "Noah Smith",
      "Chloe Adams",
    ];

    this.projectTypes = [
      "Smart IoT Device",
      "Mobile App",
      "Web Platform",
      "Hardware Project",
      "AI Assistant",
      "Game Development",
      "Data Visualization",
      "Robotics Project",
      "AR/VR Experience",
      "Environmental Monitor",
      "Health Tracker",
      "Music Synthesizer",
      "Art Installation",
      "Educational Tool",
      "Security System",
      "Weather Station",
      "Home Automation",
      "3D Printer Mod",
      "Drone Project",
      "Social Platform",
    ];

    this.tags = [
      "JavaScript",
      "Python",
      "Arduino",
      "React",
      "IoT",
      "Machine Learning",
      "Hardware",
      "Mobile",
      "Web",
      "AI",
      "Raspberry Pi",
      "Sensors",
      "API",
      "Database",
      "Cloud",
      "Open Source",
      "Beginner Friendly",
      "Advanced",
      "Creative",
      "Educational",
      "Prototype",
      "Production Ready",
    ];

    this.descriptions = [
      "An innovative solution that combines modern technology with practical applications.",
      "A creative project that pushes the boundaries of what's possible.",
      "Built with passion and attention to detail, this project showcases technical excellence.",
      "A unique approach to solving everyday problems through technology.",
      "An experimental project exploring new possibilities in tech.",
      "Combining creativity and functionality to create something amazing.",
      "A learning journey that resulted in a practical and useful tool.",
      "Innovation meets practicality in this thoughtfully designed project.",
    ];

    this.init();
  }

  init() {
    // Define the bounds of your custom map image
    this.imageBounds = [
      [-90, -180],
      [90, 180],
    ];

    // Initialize the map with restricted bounds
    this.map = L.map("map", {
      crs: L.CRS.Simple,
      minZoom: 2,
      maxZoom: 4,
      maxBounds: this.imageBounds,
    });

    L.imageOverlay("map.png", this.imageBounds).addTo(this.map);

    this.map.fitBounds(this.imageBounds);

    this.generateProjectMarkers();
  }

  generateProjectMarkers() {
    const numProjects = 250;

    for (let i = 0; i < numProjects; i++) {
      this.createProjectMarker();
    }
  }

  createProjectMarker() {
    // Generate random coordinates within the image bounds (with some padding)
    const lat = (Math.random() - 0.5) * 160; // -80 to 80 (padding from edges)
    const lng = (Math.random() - 0.5) * 320; // -160 to 160 (padding from edges)

    // Generate project data
    const projectData = this.generateProjectData();

    // Create custom icon
    const customIcon = L.divIcon({
      className: "custom-marker",
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    });

    // Create marker with popup
    const marker = L.marker([lat, lng], { icon: customIcon })
      .addTo(this.map)
      .bindPopup(this.createPopupContent(projectData));

    // Add hover effects
    marker.on("mouseover", function () {
      this.openPopup();
    });
  }

  generateProjectData() {
    const creator =
      this.creators[Math.floor(Math.random() * this.creators.length)];
    const projectType =
      this.projectTypes[Math.floor(Math.random() * this.projectTypes.length)];

    // Generate random tags
    const numTags = Math.floor(Math.random() * 4) + 2;
    const projectTags = [];
    for (let i = 0; i < numTags; i++) {
      const tag = this.tags[Math.floor(Math.random() * this.tags.length)];
      if (!projectTags.includes(tag)) {
        projectTags.push(tag);
      }
    }

    return {
      title: projectType,
      creator: creator,
      description:
        this.descriptions[Math.floor(Math.random() * this.descriptions.length)],
      tags: projectTags,
    };
  }

  createPopupContent(projectData) {
    return `
      <div class="project-popup">
        <h3>${projectData.title}</h3>
        <div class="creator">by ${projectData.creator}</div>
        <div class="description">${projectData.description}</div>
        <div class="tags">
          ${projectData.tags
            .map((tag) => `<span class="tag">${tag}</span>`)
            .join("")}
        </div>
      </div>
    `;
  }
}

// Initialize the map when the page loads
document.addEventListener("DOMContentLoaded", () => {
  new ProjectMap();
});
