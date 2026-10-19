const AppShell = {
  currentTheme: localStorage.getItem("ilmhub_theme") || "light",

  init() {
    this.applyTheme();
    this.renderHome();
  },

  applyTheme() {
    const isDark = this.currentTheme === "dark";
    document.body.style.background = isDark ? "#e5e7eb" : "#f3f4f6";
    document.body.style.color = isDark ? "#e2e8f0" : "#0f172a";
    document.body.style.transition = "all 0.25s ease";
    localStorage.setItem("ilmhub_theme", this.currentTheme);
  },

  toggleTheme() {
    this.currentTheme = this.currentTheme === "dark" ? "light" : "dark";
    this.applyTheme();
    this.renderHome();
  },

  renderHome() {
    const container = document.getElementById("app-container");
    if (!container) return;

    const isDark = this.currentTheme === "dark";

    container.innerHTML = `
      <style>
        * { box-sizing: border-box; }
        body { margin: 0; font-family: Arial, sans-serif; }
        .top-home {
          width: 100%;
          background: linear-gradient(90deg, #5a68db 0%, #6e5ae7 100%);
          padding: 14px 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: white;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.12);
        }
        .brand-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          background: transparent;
          border: none;
          color: white;
          cursor: pointer;
          font-size: 22px;
          font-weight: 700;
          padding: 0;
        }
        .brand-icon {
          width: 28px;
          height: 28px;
          border-radius: 10px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.18);
          font-size: 18px;
          font-weight: 700;
        }
        .theme-toggle {
          border: none;
          border-radius: 10px;
          padding: 10px 16px;
          cursor: pointer;
          font-weight: 700;
          background: ${isDark ? "#f8fafc" : "#111827"};
          color: ${isDark ? "#111827" : "#f8fafc"};
        }
        .home-box {
          max-width: 1100px;
          margin: 32px auto 0;
          padding: 30px 22px 12px;
          border-radius: 18px;
          background: ${isDark ? "#111827" : "#f8fafc"};
          color: ${isDark ? "#f1f5f9" : "#0f172a"};
          box-shadow: 0 8px 22px rgba(15, 23, 42, 0.08);
        }
        .home-title {
          text-align: center;
          font-size: 22px;
          font-weight: 700;
          margin: 0 0 28px;
        }
        .cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 18px;
        }
        .role-btn {
          background: ${isDark ? "#1f2937" : "#ffffff"};
          border: 1px solid ${isDark ? "#374151" : "#e2e8f0"};
          color: ${isDark ? "#f1f5f9" : "#111827"};
          border-radius: 16px;
          padding: 22px 14px;
          cursor: pointer;
          min-height: 190px;
          text-align: center;
          box-shadow: 0 8px 18px rgba(15, 23, 42, 0.05);
        }
        .role-icon {
          font-size: 42px;
          margin-bottom: 10px;
          display: block;
        }
        .role-name {
          font-size: 18px;
          font-weight: 800;
          margin: 10px 0 8px;
        }
        .role-sub {
          font-size: 14px;
          color: ${isDark ? "#cbd5e1" : "#475569"};
          line-height: 1.4;
        }
        .info-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 18px;
          margin-top: 26px;
          padding-bottom: 10px;
        }
        .info-box {
          background: ${isDark ? "#1f2937" : "#ffffff"};
          border: 1px solid ${isDark ? "#374151" : "#e2e8f0"};
          border-radius: 14px;
          padding: 18px 16px;
          min-height: 130px;
        }
        .info-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 12px;
        }
        .info-list {
          display: grid;
          gap: 8px;
          color: ${isDark ? "#0000" : "#445566"};
          font-size: 14px;
          line-height: 1.5;
        }
      </style>

      <header class="top-home">
        <button class="brand-btn" onclick="AppShell.renderHome()">
          <span class="brand-icon">✦</span>
          <span>Writing.Ilmhub.Uz</span>
        </button>

        <button class="theme-toggle" onclick="AppShell.toggleTheme()">
          ${isDark ? "☀️ Light" : "🌙 Dark"}
        </button>
      </header>

      <div class="home-box">
        <h2 class="home-title">Tizimga kirish turini tanlang:</h2>

        <div class="cards">
          <button class="role-btn" onclick="LoginModals.openModal('devModal')">
            <span class="role-icon">🧑‍💻</span>
            <div class="role-name">Developer</div>
            <div class="role-sub">Muhammadsafov (Tizim egasi)</div>
          </button>

          <button class="role-btn" onclick="LoginModals.openModal('staffModal')">
            <span class="role-icon">🏛️</span>
            <div class="role-name">Xodimlar</div>
            <div class="role-sub">Director, Admin va Teacherlar</div>
          </button>

          <button class="role-btn" onclick="LoginModals.openModal('studentModal')">
            <span class="role-icon">🎓</span>
            <div class="role-name">O'quvchi</div>
            <div class="role-sub">Mashqlar bajarish va XP to'plash</div>
          </button>

          <button class="role-btn" onclick="LoginModals.openModal('guestModal')">
            <span class="role-icon">👤</span>
            <div class="role-name">Mehmon</div>
            <div class="role-sub">Sinov rejimi va takliflar</div>
          </button>
        </div>

        <div class="info-row">
          <div class="info-box">
            <div class="info-title">📍 IlmHub — ilmchilar yetibish chig'idan maskan</div>
            <div class="info-list">
              <div>📞 Aloqa: +998909615060</div>
              <div>📍 Manzil: Namangan shahar, Oxunboboyev ko‘chasi, 96-uy.</div>
              <div>📧 Mo'ljal: Oxunboboyev Bulvar kafesi yonida Grads Biznes savdo markazi 1-qavati.</div>
            </div>
          </div>

          <div class="info-box">
            <div class="info-title">🧠 About the Developer</div>
            <div class="info-list">
              <div>"Hello! My name is Muhammadsafov and I am 12 years old. I am the creator of this application. If you like using this app, please feel free to leave your feedback!"</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
};

window.AppShell = AppShell;
window.goHome = () => AppShell.renderHome();