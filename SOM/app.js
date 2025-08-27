const toggleButton = document.getElementById("toggle-btn");
const sidebar = document.getElementById("sidebar");

function toggleSidebar() {
  sidebar.classList.toggle("close");
  toggleButton.classList.toggle("rotate");

  localStorage.setItem(
    "sidebarState",
    sidebar.classList.contains("close") ? "closed" : "open"
  );
}
function restoreSidebarState() {
  const savedState = localStorage.getItem("sidebarState");

  if (savedState === "closed") {
    // Temporarily disable transitions
    sidebar.style.transition = "none";
    toggleButton.style.transition = "none";

    // Apply the closed state
    sidebar.classList.add("close");
    toggleButton.classList.add("rotate");

    // Re-enable transitions after a brief delay
    setTimeout(() => {
      sidebar.style.transition = "";
      toggleButton.style.transition = "";
    }, 10);
  } else {
    sidebar.classList.remove("close");
    toggleButton.classList.remove("rotate");
  }
}

restoreSidebarState();
