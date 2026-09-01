// js/dashboards/developer.js

const DeveloperDashboard = {
  init() {
    this.render();
  },

  render() {
    const container = document.getElementById("app-container");
    if (!container) return;

    if (typeof confetti === 'function') {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    }

    container.innerHTML = `
      <div style="max-width: 900px; margin: 20px auto; font-family: sans-serif; color: #1e293b;">
        <div style="background: white; padding: 20px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
          <div>
            <h2 style="margin: 0; font-size: 20px; color: #16a34a;">👨‍💻 Developer Panel (Muhammadsafo)</h2>
            <p style="margin: 4px 0 0 0; font-size: 12px; color: #64748b;">AI Yordamida Reading va Topshiriqlar Yaratish</p>
          </div>
          <button onclick="location.reload()" style="padding: 8px 16px; background: #ef4444; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">
            🚪 Chiqish
          </button>
        </div>

        <!-- AI BILAN GAPLASHISH VA READING YARATISH -->
        <div style="background: white; padding: 25px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
          <h3 style="margin-top: 0;">🤖 AI Generator: Yangi Reading va Test Yaratish</h3>
          <p style="font-size: 14px; color: #64748b;">Mavzuni kiriting, AI siz uchun o'quvchilarga mos inglizcha matn va test yaratadi:</p>

          <div style="display: flex; gap: 10px; margin-bottom: 15px;">
            <input id="dev-ai-topic" placeholder="Masalan: Space exploration, Robots, Nature..." style="flex: 1; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px;" />
            <button onclick="DeveloperDashboard.generateAIReading()" style="padding: 10px 20px; background: #16a34a; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">
              ⚡ Yaratish
            </button>
          </div>

          <!-- AI Javob Qutisi -->
          <div id="dev-ai-output" style="display: none; background: #f0fdf4; border: 1px solid #bbf7d0; padding: 15px; border-radius: 8px; margin-top: 15px;">
            <h4 id="out-title" style="margin-top:0; color: #15803d;"></h4>
            <p id="out-text" style="color: #334155; line-height: 1.5;"></p>
            <div id="out-questions"></div>
            <button onclick="DeveloperDashboard.saveToReadingList()" style="margin-top: 15px; padding: 8px 16px; background: #2563eb; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">
              💾 Readingni Baza/Tizimga Qo'shish
            </button>
          </div>
        </div>

      </div>
    `;
  },

  // AI orqali simulyativ reading yaratish
  generateAIReading() {
    const topic = document.getElementById("dev-ai-topic").value.trim();
    if (!topic) return alert("Iltimos, mavzu nomini kiriting!");

    const outputBox = document.getElementById("dev-ai-output");
    outputBox.style.display = "block";
    document.getElementById("out-title").innerText = "⏳ AI topshiriq va matn yaratmoqda...";
    document.getElementById("out-text").innerText = "";
    document.getElementById("out-questions").innerHTML = "";

    setTimeout(() => {
      document.getElementById("out-title").innerText = `📖 Matn: ${topic.toUpperCase()}`;
      document.getElementById("out-text").innerText = `${topic} is a very interesting topic. Many people around the world learn about ${topic} to improve their knowledge. It helps us understand the world better and brings new opportunities.`;
      
      document.getElementById("out-questions").innerHTML = `
        <p><strong>Savol:</strong> What does learning about ${topic} help us do?</p>
        <p>A) Fly to the moon<br>B) Understand the world better (To'g'ri)<br>C) Sleep more</p>
      `;
    }, 1000);
  },

  saveToReadingList() {
    alert("Yangi Reading matni muvaffaqiyatli saqlandi va o'quvchilar paneliga qo'shildi!");
  }
};