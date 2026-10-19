// js/dashboards/developer.js

const DeveloperDashboard = {
  activeTab: "ai", // 'ai', 'staff', 'banned'
  autoAIActive: false,
  autoAITimer: null,

  init() {
    window.SystemStatus = window.SystemStatus || {};
    window.SystemStatus.isDevOnline = true;
    this.render();
  },

  // "Xabarlar" tugmasi - xato bo'lsa ekranga chiqaradi (konsol kerak emas)
  async openMessagesSafe() {
    try {
      if (typeof StaffMessages === 'undefined') {
        alert("❌ XATOLIK: StaffMessages moduli yuklanmagan.\n\nBuning sababi: js/dashboards/staff-messages.js fayli index.html'da ulanmagan yoki noto'g'ri joyda.\n\nindex.html'da shu qator borligini tekshiring:\n<script src=\"js/dashboards/staff-messages.js\"></script>");
        return;
      }
      if (typeof supabase === 'undefined' || typeof supabase.from !== 'function') {
        alert("❌ XATOLIK: Supabase to'g'ri ulanmagan.\n\njs/supabase-init.js fayli index.html'da BOSHQA barcha skriptlardan OLDIN yuklanganini tekshiring.");
        return;
      }
      await StaffMessages.init({ id: 'dev', name: 'Muhammadsafo', role: 'Developer' }, 'app-container');
    } catch (err) {
      alert("❌ XATOLIK (Messages ochishda): " + err.message + "\n\n" + (err.stack || ""));
    }
  },

  render() {
    const container = document.getElementById("app-container");
    if (!container) return;

    if (typeof confetti === 'function' && this.activeTab === 'ai') {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    }

    const staff = JSON.parse(localStorage.getItem("ilmhub_staff_list") || "[]");
    const students = JSON.parse(localStorage.getItem("ilmhub_students") || "[]");
    const bannedStudents = students.filter(s => s.banned);

    container.innerHTML = `
      <div style="max-width: 900px; margin: 20px auto; font-family: sans-serif; color: #1e293b;">
        <div style="background: white; padding: 20px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
          <div style="display:flex; align-items:center; gap:12px;">
            ${typeof LogoComponent !== 'undefined' ? LogoComponent.render(40, false) : ''}
            <div>
              <h2 style="margin: 0; font-size: 20px; color: #16a34a;">👨‍💻 Developer Panel (Muhammadsafo)</h2>
              <p style="margin: 4px 0 0 0; font-size: 12px; color: #64748b;">To'liq tizim boshqaruvi</p>
            </div>
          </div>
          <div style="display:flex; gap:10px;">
            <button onclick="DeveloperDashboard.openMessagesSafe()" style="padding: 8px 16px; background: #2563eb; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">
              💬 Xabarlar
            </button>
            <button onclick="location.reload()" style="padding: 8px 16px; background: #ef4444; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">
              🚪 Chiqish
            </button>
          </div>
        </div>

        <!-- TABLAR -->
        <div style="display: flex; gap: 10px; margin-bottom: 20px;">
          <button id="dev-tab-ai" style="flex: 1; padding: 12px; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; background: ${this.activeTab === 'ai' ? '#16a34a' : 'white'}; color: ${this.activeTab === 'ai' ? 'white' : '#64748b'}; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
            🤖 AI Generator
          </button>
          <button id="dev-tab-staff" style="flex: 1; padding: 12px; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; background: ${this.activeTab === 'staff' ? '#16a34a' : 'white'}; color: ${this.activeTab === 'staff' ? 'white' : '#64748b'}; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
            👨‍💼 Xodimlar (${staff.length})
          </button>
          <button id="dev-tab-banned" style="flex: 1; padding: 12px; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; background: ${this.activeTab === 'banned' ? '#16a34a' : 'white'}; color: ${this.activeTab === 'banned' ? 'white' : '#64748b'}; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
            🚫 Ban O'quvchilar (${bannedStudents.length})
          </button>
        </div>

        <!-- BO'LIM 1: AI GENERATOR -->
        ${this.activeTab === 'ai' ? `
          <div style="background: white; padding: 25px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
              <h3 style="margin: 0;">🤖 AI Generator: Yangi Reading va Test Yaratish</h3>
              <button onclick="DeveloperDashboard.toggleAutoAI()" style="padding: 8px 16px; background: ${this.autoAIActive ? '#dc2626' : '#16a34a'}; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 13px;">
                ${this.autoAIActive ? '⏹️ Avtomatikni to\'xtatish' : '🔄 Avtomatik yangilashni yoqish'}
              </button>
            </div>
            <p style="font-size: 14px; color: #64748b;">Mavzuni kiriting yoki avtomatik rejimni yoqing. Avtomatik rejim har 30 soniyada Reading, Listening, Speaking va Writing uchun bittadan yangi topshiriq yaratib, o'quvchilar kontent bankiga qo'shadi.</p>
            ${this.autoAIActive ? `<p style="font-size: 12px; color: #16a34a; font-weight: bold;">🟢 Avtomatik rejim FAOL — har 30 soniyada 4 ta yangi topshiriq qo'shiladi.</p>` : ''}

            <div style="display: flex; gap: 10px; margin-bottom: 15px; margin-top: 10px;">
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

            <!-- Avtomatik faoliyat jurnali -->
            <div id="dev-ai-auto-log" style="margin-top: 15px; max-height: 160px; overflow-y: auto; font-size: 12px; color: #64748b;"></div>
          </div>

          <!-- QO'LDA TO'LIQ READING YOZISH -->
          <div style="background: white; padding: 25px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); margin-top: 20px;">
            <h3 style="margin-top: 0;">✍️ To'liq Reading Qo'lda Yozish</h3>
            <p style="font-size: 13px; color: #64748b; margin-bottom: 15px;">Matnni va savolni o'zingiz to'liq yozing — bu AI simulyatsiyasi emas, to'g'ridan-to'g'ri bazaga tushadi.</p>

            <div style="display: grid; grid-template-columns: 1fr 140px; gap: 10px; margin-bottom: 12px;">
              <input id="dev-manual-title" placeholder="Sarlavha (masalan: A Day at the Zoo)" style="padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px;" />
              <select id="dev-manual-level" style="padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px;">
                <option value="A1">A1</option>
                <option value="A2">A2</option>
                <option value="B1" selected>B1</option>
                <option value="B2">B2</option>
                <option value="C1">C1</option>
                <option value="C2">C2</option>
              </select>
            </div>

            <textarea id="dev-manual-text" rows="6" placeholder="Reading matnini to'liq shu yerga yozing..." style="width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; margin-bottom: 12px; box-sizing: border-box; font-family: inherit;"></textarea>

            <input id="dev-manual-question" placeholder="Savol matni" style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; margin-bottom: 10px; box-sizing: border-box;" />

            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 12px;">
              <div style="display:flex; gap:6px; align-items:center;">
                <input type="radio" name="dev-manual-correct" value="0" checked>
                <input id="dev-manual-opt-0" placeholder="A variant" style="flex:1; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
              </div>
              <div style="display:flex; gap:6px; align-items:center;">
                <input type="radio" name="dev-manual-correct" value="1">
                <input id="dev-manual-opt-1" placeholder="B variant" style="flex:1; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
              </div>
              <div style="display:flex; gap:6px; align-items:center;">
                <input type="radio" name="dev-manual-correct" value="2">
                <input id="dev-manual-opt-2" placeholder="C variant (ixtiyoriy)" style="flex:1; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
              </div>
              <div style="display:flex; gap:6px; align-items:center;">
                <input type="radio" name="dev-manual-correct" value="3">
                <input id="dev-manual-opt-3" placeholder="D variant (ixtiyoriy)" style="flex:1; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
              </div>
            </div>
            <p style="font-size: 11px; color: #94a3b8; margin: -6px 0 12px 0;">Radio tugma bilan to'g'ri javobni belgilang.</p>

            <button onclick="DeveloperDashboard.saveManualReading()" style="width: 100%; padding: 12px; background: #16a34a; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">
              💾 Bazaga Qo'shish
            </button>
          </div>
        ` : ''}

        <!-- BO'LIM 2: XODIMLAR (Director / Admin / Teacher qo'shish) -->
        ${this.activeTab === 'staff' ? `
          <div style="background: white; padding: 25px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
            <h3 style="margin-top: 0; font-size: 16px;">👨‍💼 Xodim Qo'shish (Director / Admin / Teacher)</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 15px;">
              <input id="dev-staff-name" placeholder="F.I.Sh" style="padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px;" />
              <select id="dev-staff-role" style="padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px;">
                <option value="Director">Direktor</option>
                <option value="Admin">Admin</option>
                <option value="Teacher">O'qituvchi</option>
              </select>
            </div>
            <button id="dev-save-staff" style="width: 100%; padding: 10px; background: #16a34a; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; margin-bottom: 20px;">
              🔑 Xodimni AI Parol Bilan Saqlash
            </button>

            <h4 style="font-size: 14px; color: #475569;">Xodimlar Ro'yxati</h4>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              ${staff.length === 0 ? '<p style="color:#94a3b8; font-size: 13px;">Xodimlar yo\'q</p>' : staff.map(st => `
                <div style="background: #f8fafc; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;">
                  <div>
                    <b>${st.name}</b>
                    <span style="background: #dbeafe; color: #1e40af; padding: 2px 8px; border-radius: 20px; font-size: 11px; font-weight: bold; margin-left: 6px;">${st.role === 'Director' ? 'Direktor' : st.role === 'Admin' ? 'Admin' : "O'qituvchi"}</span>
                    <div style="font-size: 12px; color: #16a34a; margin-top: 4px;">🔑 Parol: <b>${st.password}</b></div>
                  </div>
                  <button onclick="DeveloperDashboard.deleteStaff(${st.id})" style="background:#ef4444; color:#fff; border:none; padding:6px 10px; border-radius:6px; cursor:pointer;">🗑️ O'chirish</button>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- BO'LIM 3: BAN QILINGAN O'QUVCHILAR -->
        ${this.activeTab === 'banned' ? `
          <div style="background: white; padding: 25px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
            <h3 style="margin-top: 0; font-size: 16px;">🚫 O'quvchilarni Ban Qilish / Ochish</h3>
            <p style="font-size: 13px; color: #64748b; margin-bottom: 15px;">Ban qilingan o'quvchi tizimga kira olmaydi.</p>

            <div style="display: flex; flex-direction: column; gap: 8px;">
              ${students.length === 0 ? '<p style="color:#94a3b8; font-size: 13px;">O\'quvchilar yo\'q</p>' : students.map(s => `
                <div style="background: ${s.banned ? '#fef2f2' : '#f8fafc'}; padding: 12px; border-radius: 8px; border: 1px solid ${s.banned ? '#fecaca' : '#e2e8f0'}; display: flex; justify-content: space-between; align-items: center;">
                  <div>
                    <b>${s.name}</b> ${s.group ? `(${s.group})` : ''}
                    ${s.banned ? '<span style="background:#ef4444; color:#fff; padding:2px 8px; border-radius:20px; font-size:11px; font-weight:bold; margin-left:6px;">BAN QILINGAN</span>' : ''}
                    <div style="font-size: 12px; color: #64748b; margin-top: 4px;">Login: ${s.username || '-'}</div>
                  </div>
                  <button onclick="DeveloperDashboard.toggleBanStudent(${s.id})" style="background:${s.banned ? '#16a34a' : '#ef4444'}; color:#fff; border:none; padding:6px 12px; border-radius:6px; cursor:pointer; font-weight:bold;">
                    ${s.banned ? '✅ Ban ni ochish' : '🚫 Ban qilish'}
                  </button>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

      </div>
    `;

    this.bindEvents();
  },

  bindEvents() {
    document.getElementById("dev-tab-ai")?.addEventListener("click", () => { this.activeTab = "ai"; this.render(); });
    document.getElementById("dev-tab-staff")?.addEventListener("click", () => { this.activeTab = "staff"; this.render(); });
    document.getElementById("dev-tab-banned")?.addEventListener("click", () => { this.activeTab = "banned"; this.render(); });

    document.getElementById("dev-save-staff")?.addEventListener("click", () => {
      const name = document.getElementById("dev-staff-name").value.trim();
      const role = document.getElementById("dev-staff-role").value;
      if (!name) return alert("Xodim F.I.Sh ni kiriting!");

      const generatedPassword = typeof AIGivedPass !== 'undefined'
        ? AIGivedPass.generateStudentPassword(name)
        : (role.toLowerCase() + "#" + Math.floor(1000 + Math.random() * 9000));

      const list = JSON.parse(localStorage.getItem("ilmhub_staff_list") || "[]");
      const username = name.toLowerCase().replace(/\s+/g, '_');
      list.unshift({ id: Date.now(), name, role, username, password: generatedPassword });
      localStorage.setItem("ilmhub_staff_list", JSON.stringify(list));

      alert(`Xodim saqlandi!\nRol: ${role}\nLogin: ${username}\nParol: ${generatedPassword}`);
      this.render();
    });
  },

  deleteStaff(id) {
    let list = JSON.parse(localStorage.getItem("ilmhub_staff_list") || "[]");
    list = list.filter(item => item.id !== id);
    localStorage.setItem("ilmhub_staff_list", JSON.stringify(list));
    this.render();
  },

  toggleBanStudent(id) {
    let list = JSON.parse(localStorage.getItem("ilmhub_students") || "[]");
    list = list.map(s => s.id === id ? { ...s, banned: !s.banned } : s);
    localStorage.setItem("ilmhub_students", JSON.stringify(list));
    this.render();
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

  async saveToReadingList() {
    const title = document.getElementById("out-title")?.innerText.replace("📖 Matn: ", "") || "AI Reading";
    const text = document.getElementById("out-text")?.innerText || "";

    if (typeof ContentBank !== 'undefined' && text) {
      await ContentBank.addContent('reading', {
        level: 'B1',
        title: title,
        text: text,
        question: `What is the text about?`,
        options: [{ t: title, correct: true }, { t: "Something else", correct: false }, { t: "Not related", correct: false }]
      });
    }

    alert("Yangi Reading matni muvaffaqiyatli saqlandi va o'quvchilar paneliga qo'shildi!");
  },

  // Dev to'liq matn + savolni qo'lda yozib, bazaga qo'shadi
  async saveManualReading() {
    const title = document.getElementById("dev-manual-title")?.value.trim();
    const level = document.getElementById("dev-manual-level")?.value;
    const text = document.getElementById("dev-manual-text")?.value.trim();
    const question = document.getElementById("dev-manual-question")?.value.trim();

    const optionTexts = [0, 1, 2, 3].map(i => document.getElementById(`dev-manual-opt-${i}`)?.value.trim());
    const correctIndex = parseInt(document.querySelector('input[name="dev-manual-correct"]:checked')?.value);

    if (!title || !text || !question || !optionTexts[0] || !optionTexts[1]) {
      alert("Iltimos, kamida sarlavha, matn, savol va A/B variantlarini to'ldiring!");
      return;
    }

    const options = optionTexts
      .map((t, idx) => ({ t, idx }))
      .filter(o => o.t)
      .map(o => ({ t: o.t, correct: o.idx === correctIndex }));

    if (typeof ContentBank === 'undefined') {
      alert("Xatolik: ContentBank yuklanmagan.");
      return;
    }

    await ContentBank.addContent('reading', { level, title, text, question, options });

    alert(`✅ "${title}" (${level}) bazaga qo'shildi!`);

    document.getElementById("dev-manual-title").value = "";
    document.getElementById("dev-manual-text").value = "";
    document.getElementById("dev-manual-question").value = "";
    [0, 1, 2, 3].forEach(i => { document.getElementById(`dev-manual-opt-${i}`).value = ""; });
  },

  toggleAutoAI() {
    this.autoAIActive = !this.autoAIActive;

    if (this.autoAIActive) {
      this._autoLog("🟢 Avtomatik rejim yoqildi. Birinchi 4 ta topshiriq yaratilmoqda.");
      this._autoGenerateCycle();
      this.autoAITimer = setInterval(() => this._autoGenerateCycle(), 30000);
    } else {
      this._autoLog("🔴 Avtomatik rejim o'chirildi.");
      clearInterval(this.autoAITimer);
      this.autoAITimer = null;
    }

    this.render();
  },

  async _autoGenerateCycle() {
    if (typeof ContentBank === 'undefined' || typeof ContentBank.addContent !== 'function') {
      console.error("DeveloperDashboard: ContentBank yuklanmagan.");
      this._autoLog("❌ ContentBank yuklanmagan — topshiriqlar saqlanmadi.");
      return;
    }

    const topics = ["Space", "Animals", "Technology", "Health", "Travel", "Sports", "Music", "Science", "Food", "History"];
    const topic = topics[Math.floor(Math.random() * topics.length)];
    const levels = ["A1", "A2", "B1", "B2", "C1", "C2"];
    const level = levels[Math.floor(Math.random() * levels.length)];
    const sentence = `Learning about ${topic.toLowerCase()} helps us understand the world.`;
    const results = await Promise.all([
      ContentBank.addContent('reading', {
        level,
        title: `About ${topic}`,
        text: `${topic} is an interesting subject. Learning about ${topic.toLowerCase()} helps students grow their knowledge and curiosity about the world.`,
        question: `What does learning about ${topic.toLowerCase()} help students do?`,
        options: [
          { t: "Grow their knowledge", correct: true },
          { t: "Forget everything", correct: false },
          { t: "Stop learning", correct: false }
        ]
      }),
      ContentBank.addContent('listening', {
        level,
        audioText: `${topic} is an interesting subject for students.`,
        question: "Which subject is mentioned in the audio?",
        answerContains: topic.toLowerCase()
      }),
      ContentBank.addContent('speaking', { level, sentence }),
      ContentBank.addContent('writing', {
        level,
        prompt: `Write a few sentences about ${topic.toLowerCase()} and explain why it is interesting.`
      })
    ]);

    const savedCount = results.filter(Boolean).length;
    if (savedCount === results.length) {
      this._autoLog(`✅ ${savedCount} ta topshiriq saqlandi: ${topic} (${level}) — Reading, Listening, Speaking, Writing.`);
    } else {
      console.error(`Automatic content save incomplete: ${savedCount}/${results.length} items saved.`);
      this._autoLog(`⚠️ ${savedCount}/4 ta topshiriq saqlandi. Supabase ulanishi yoki content_items jadvalini tekshiring.`);
    }
  },

  _autoLog(message) {
    const logEl = document.getElementById("dev-ai-auto-log");
    if (!logEl) return;
    const time = new Date().toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    logEl.innerHTML = `<div>[${time}] ${message}</div>` + logEl.innerHTML;
  }
};