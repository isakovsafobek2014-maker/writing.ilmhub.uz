// frontend/js/components/sidebar.js

function renderSidebar() {
  const container = document.getElementById("sidebar-container");
  if (!container) return;

  container.innerHTML = `
    <div style="width: 220px; background: #161b22; height: 100%; border-right: 1px solid #30363d; padding: 15px; display: flex; flex-direction: column; gap: 10px;">
      <h3 style="color: #8b949e; font-size: 12px; margin-bottom: 5px; text-transform: uppercase;">Menyu</h3>

      <button id="nav-dev" style="width: 100%; padding: 10px 12px; background: #238636; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; text-align: left; display: flex; align-items: center; gap: 8px;">
        🛠️ Developer Panel
      </button>

      <button id="nav-students" style="width: 100%; padding: 10px 12px; background: #21262d; color: #c9d1d9; border: 1px solid #30363d; border-radius: 6px; font-weight: bold; cursor: pointer; text-align: left;">
        👨‍🎓 O'quvchilar
      </button>
    </div>
  `;

  // Developer panel tugmasi bosilganda oynani ochish
  document.getElementById("nav-dev")?.addEventListener("click", () => {
    if (typeof renderDeveloperDashboard === "function") {
      renderDeveloperDashboard("dashboard-content");
    }
  });
}

// Global yuklash
window.renderSidebar = renderSidebar;