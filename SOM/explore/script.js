class ExploreTabManager {
  constructor() {
    this.contentContainer = document.getElementById("content-container");
    this.tabs = document.querySelectorAll(".explore-nav a[data-tab]");
    this.currentTab = "gallery";
    this.contentCache = new Map();

    this.init();
  }

  init() {
    // Add click listeners to tabs
    this.tabs.forEach((tab) => {
      tab.addEventListener("click", (e) => {
        e.preventDefault();
        const tabName = tab.dataset.tab;
        this.switchTab(tabName);
      });
    });

    // Load default content
    this.loadContent(this.currentTab);
  }

  switchTab(tabName) {
    if (tabName === this.currentTab) return;

    // Update active state
    this.tabs.forEach((tab) => {
      tab.classList.toggle("active", tab.dataset.tab === tabName);
    });

    this.currentTab = tabName;
    this.loadContent(tabName);
  }

  async loadContent(tabName) {
    try {
      // Check cache first
      if (this.contentCache.has(tabName)) {
        this.renderContent(this.contentCache.get(tabName));
        return;
      }

      // Show loading state
      this.contentContainer.innerHTML = '<div class="loading">Loading...</div>';

      // Load content from HTML file
      const content = await this.fetchHTMLContent(tabName);

      // Cache the content
      this.contentCache.set(tabName, content);
      this.renderContent(content);
    } catch (error) {
      console.error("Error loading content:", error);
      this.contentContainer.innerHTML =
        '<div class="error">Failed to load content. Please try again.</div>';
    }
  }

  async fetchHTMLContent(tabName) {
    const response = await fetch(`./content/${tabName}.html`);
    
    if (!response.ok) {
      throw new Error(`Failed to load ${tabName}.html: ${response.status}`);
    }
    
    return await response.text();
  }

  renderContent(content) {
    this.contentContainer.innerHTML = `<div class="content-section">${content}</div>`;
  }

  // Utility method to refresh current tab content
  refreshCurrentTab() {
    this.contentCache.delete(this.currentTab);
    this.loadContent(this.currentTab);
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.exploreTabManager = new ExploreTabManager();
});