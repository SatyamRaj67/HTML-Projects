class ExploreTabManager {
  constructor() {
    this.contentContainer = document.getElementById("content-container");
    this.radioInputs = document.querySelectorAll(
      'input[type="radio"][name="tabs"]'
    );
    this.currentTab = "devlogs"; // Default to first tab
    this.contentCache = new Map();

    this.init();
  }

  init() {
    // Add change listeners to radio inputs
    this.radioInputs.forEach((radio) => {
      radio.addEventListener("change", (e) => {
        if (e.target.checked) {
          const tabName = this.getTabNameFromRadio(e.target);
          this.switchTab(tabName);
        }
      });
    });

    // Load default content for the checked radio
    const checkedRadio = document.querySelector(
      'input[type="radio"][name="tabs"]:checked'
    );
    if (checkedRadio) {
      const tabName = this.getTabNameFromRadio(checkedRadio);
      this.loadContent(tabName);
    }
  }

  getTabNameFromRadio(radio) {
    // Map radio IDs to tab names
    const tabMap = {
      "radio-1": "devlogs",
      "radio-2": "following",
      "radio-3": "gallery",
    };
    return tabMap[radio.id] || "devlogs";
  }

  switchTab(tabName) {
    if (tabName === this.currentTab) return;

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
