const Sidebar = {
  init(role) {
    const container = document.getElementById("sidebar-container");
    if (!container) return;

    container.innerHTML = `
      <div style="width: 220px; background: #161b22; height: 100%; border-right: 1px solid #30363d; padding: 15px; box-sizing: border-box; display: flex; flex-direction: column; gap: 10px;">
        <h3 style="color: #8b949e; font-size: 11px; margin: 0 0 5px 0; text-transform: uppercase; letter-spacing: 1px;">Menyu (${role})</h3>

        <!-- Har doim va ayniqsa 'dev' rolida ko'rinuvchi tugma -->
        <button id="side-nav-dev" style="width: 100%; padding: 10px; background: #238636; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; text-align: left;">
          🛠️ Developer Panel
        </button>

        <button id="side-nav-student" style="width: 100%; padding: 10px; background: #21262d; color: #c9d1d9; border: 1px solid #30363d; border-radius: 6px; cursor: pointer; text-align: left;">
          👨‍🎓 O'quv xonasi
        </button>
      </div>
    `;

    document.getElementById("side-nav-dev")?.addEventListener("click", () => {
      if (typeof DeveloperDashboard !== "undefined") DeveloperDashboard.init();
    });
  }
};