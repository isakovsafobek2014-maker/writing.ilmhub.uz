// O'quvchi shaxsiy xonasi va mashqlar bo'limi

const StudentDashboard = {
  activeTab: "reading",
  readingStep: 0,
  listeningStep: 0,

  readingQuestions: [
    {
      text: "Lions are known as the kings of the jungle. They live in groups called pride. Lions mostly sleep during the day and hunt at night.",
      question: "Do lions hunt during the day?",
      correctAnswer: false,
    },
    {
      text: "Eagles have very sharp eyes. They can see small animals from high in the sky. Eagles usually fly very high.",
      question: "Can eagles see small animals from the sky?",
      correctAnswer: true,
    }
  ],

  listeningQuestions: [
    {
      audioText: "The quick brown fox jumps over the lazy dog.",
      question: "Audioda qaysi hayvon sakrab o'tdi?",
      options: [
        { title: "Fox (Tulki)", isCorrect: true },
        { title: "Cat (Mushuk)", isCorrect: false }
      ]
    },
    {
      audioText: "She bought three apples and two oranges from the market.",
      question: "U bozorlikda nechta olma sotib oldi?",
      options: [
        { title: "Three (3 ta)", isCorrect: true },
        { title: "Five (5 ta)", isCorrect: false }
      ]
    }
  ],

  init(studentData) {
    this.student = studentData || JSON.parse(localStorage.getItem("currentUser")) || { name: "O'quvchi", xp: 0 };
    this.render();
  },

  render() {
    const container = document.getElementById("app-container");
    if (!container) return;

    const currentUser = JSON.parse(localStorage.getItem("currentUser")) || this.student;

    container.innerHTML = `
      <div style="max-width: 1000px; margin: 20px auto; font-family: sans-serif; color: #1e293b;">
        
        <!-- Yuqori panel -->
        <div style="background: white; padding: 20px; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <div>
            <h2 style="margin: 0; font-size: 22px;">🎓 Salom, ${currentUser.name || 'O\'quvchi'}!</h2>
            <p style="margin: 4px 0 0 0; color: #64748b; font-size: 14px;">Bugungi ingliz tili darslarini bajarishga tayyormisiz?</p>
          </div>
          <div style="display: flex; align-items: center; gap: 15px;">
            <div id="student-xp-display" style="background: #fef3c7; color: #d97706; padding: 8px 16px; border-radius: 20px; font-weight: bold; font-size: 16px;">
              ⭐ ${currentUser.xp || 0} XP
            </div>
            <button onclick="localStorage.removeItem('currentUser'); location.reload();" style="background: #ef4444; color: white; border: none; padding: 10px 16px; border-radius: 10px; cursor: pointer; font-weight: bold;">
              🚪 Chiqish
            </button>
          </div>
        </div>

        <!-- Bo'limlar menyusi -->
        <div style="display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap;">
          <button onclick="StudentDashboard.switchTab('reading')" style="${this.getTabStyle('reading')}">📖 Mutolaa (Reading)</button>
          <button onclick="StudentDashboard.switchTab('speaking')" style="${this.getTabStyle('speaking')}">🎙️ So'zlashuv (Speaking)</button>
          <button onclick="StudentDashboard.switchTab('writing')" style="${this.getTabStyle('writing')}">✍️ Yozish (Writing)</button>
          <button onclick="StudentDashboard.switchTab('listening')" style="${this.getTabStyle('listening')}">🎧 Tinglash (Listening)</button>
          <button onclick="StudentDashboard.switchTab('leaderboard')" style="${this.getTabStyle('leaderboard')}">🏆 Reyting</button>
        </div>

        <!-- Asosiy ishchi maydon -->
        <div id="student-tab-content"></div>

      </div>
    `;

    this.renderTabContent();
  },

  getTabStyle(tabName) {
    const isActive = this.activeTab === tabName;
    return `
      flex: 1; min-width: 140px; padding: 12px; border: none; border-radius: 10px; font-weight: bold; cursor: pointer;
      background: ${isActive ? '#2563eb' : 'white'};
      color: ${isActive ? 'white' : '#64748b'};
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    `;
  },

  switchTab(tabName) {
    this.activeTab = tabName;
    this.render();
  },

  // Mutolaa bo'limi javobini tekshirish
  checkReadingAnswer(userAnswer) {
    const q = this.readingQuestions[this.readingStep];
    if (userAnswer === q.correctAnswer) {
      StudentGivedXP.addXP(10);
      this.readingStep = (this.readingStep + 1) % this.readingQuestions.length;
      this.renderTabContent();
    } else {
      StudentGivedXP.removeXP(10); // Xato bo'lsa -10 XP ayriladi
    }
  },

  // Tinglash bo'limi javobini tekshirish
  checkListeningAnswer(isCorrect) {
    if (isCorrect) {
      StudentGivedXP.addXP(10);
      this.listeningStep = (this.listeningStep + 1) % this.listeningQuestions.length;
      this.renderTabContent();
    } else {
      StudentGivedXP.removeXP(10); // Xato bo'lsa -10 XP ayriladi
    }
  },

  renderTabContent() {
    const content = document.getElementById("student-tab-content");
    if (!content) return;

    // 1. READING
    if (this.activeTab === "reading") {
      const q = this.readingQuestions[this.readingStep];
      content.innerHTML = `
        <div style="background: white; padding: 25px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
          <h3>📖 Matnni o'qing va javob bering</h3>
          <p style="background: #f8fafc; padding: 15px; border-radius: 8px; line-height: 1.6; font-size: 16px;">
            ${q.text}
          </p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #e2e8f0;" />
          <p style="font-size: 16px;"><strong>Savol: ${q.question}</strong></p>
          
          <button onclick="StudentDashboard.checkReadingAnswer(true)" style="padding: 10px 25px; background: #2563eb; color: white; border: none; border-radius: 8px; font-weight: bold; margin-right: 10px; cursor: pointer;">True (To'g'ri)</button>
          <button onclick="StudentDashboard.checkReadingAnswer(false)" style="padding: 10px 25px; background: #2563eb; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">False (Noto'g'ri)</button>
        </div>
      `;
    } 
    
    // 2. SPEAKING
    else if (this.activeTab === "speaking") {
      content.innerHTML = `
        <div style="background: white; padding: 25px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
          <h3>🎙️ Ovozli talaffuz mashqi</h3>
          <p style="font-size: 15px;">Pastdagi gapni eshiting va mikrofonga aytib bering:</p>
          
          <div style="background: #eff6ff; padding: 15px; border-radius: 8px; color: #1e40af; font-size: 18px; font-weight: bold; margin-bottom: 15px;">
            "I love learning English with AI!"
          </div>
          
          <div style="display: flex; gap: 10px; margin-bottom: 15px;">
            <button onclick="StudentGivedXP.speakText('I love learning English with AI!')" style="padding: 11px 18px; background: #2563eb; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">
              🔊 To'g'ri talaffuzni eshitish
            </button>
            <button onclick="StudentGivedXP.startVoiceInput('speaking-result-input')" style="padding: 11px 18px; background: #dc2626; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">
              🎙️ Gapirishni boshlash
            </button>
          </div>

          <input id="speaking-result-input" placeholder="Siz aytgan gap bu yerda ko'rinadi..." style="width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; margin-bottom: 15px; box-sizing: border-box;" />
          
          <button onclick="
            const val = document.getElementById('speaking-result-input').value.trim();
            if(!val) {
              StudentGivedXP.removeXP(10);
            } else {
              StudentGivedXP.addXP(10);
              document.getElementById('speaking-result-input').value = '';
            }
          " style="padding: 11px 25px; background: #16a34a; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">
            ✅ Topshirish (+10 XP)
          </button>
        </div>
      `;
    } 

    // 3. WRITING
    else if (this.activeTab === "writing") {
      content.innerHTML = `
        <div style="background: white; padding: 25px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
          <h3>✍️ Insho va Yozish mashqi</h3>
          <p style="font-size: 15px; font-weight: bold; color: #334155;">Mavzu: "Write 3 sentences about your favourite school subject."</p>

          <textarea 
            id="writing-text-input" 
            rows="5" 
            placeholder="Javobingizni shu yerga yozing yoki mikrofondan foydalaning..." 
            style="width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-family: sans-serif; box-sizing: border-box; margin-bottom: 15px;"
          ></textarea>

          <div style="display: flex; justify-content: space-between;">
            <button onclick="StudentGivedXP.startVoiceInput('writing-text-input')" style="padding: 11px 18px; background: #4f46e5; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">
              🎙️ Mikrofondan aytib yozish
            </button>
            <button onclick="
              const val = document.getElementById('writing-text-input').value.trim();
              if(!val) {
                StudentGivedXP.removeXP(10);
              } else {
                StudentGivedXP.addXP(15);
                document.getElementById('writing-text-input').value = '';
              }
            " style="padding: 11px 25px; background: #16a34a; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">
              🚀 Topshirish (+15 XP)
            </button>
          </div>
        </div>
      `;
    } 

    // 4. LISTENING
    else if (this.activeTab === "listening") {
      const q = this.listeningQuestions[this.listeningStep];
      content.innerHTML = `
        <div style="background: white; padding: 25px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
          <h3>🎧 Tinglab tushunish</h3>
          <p style="font-size: 15px;">Tugmani bosib audioni eshiting va savolga javob bering:</p>
          
          <button onclick="StudentGivedXP.speakText('${q.audioText}')" style="padding: 12px 20px; background: #2563eb; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; margin-bottom: 20px;">
            🔊 Audioni eshitish
          </button>
          
          <p style="font-size: 16px;"><strong>${q.question}</strong></p>
          
          <div style="display: flex; gap: 10px;">
            ${q.options.map(opt => `
              <button onclick="StudentDashboard.checkListeningAnswer(${opt.isCorrect})" style="padding: 10px 20px; background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 8px; font-weight: bold; cursor: pointer;">
                ${opt.title}
              </button>
            `).join('')}
          </div>
        </div>
      `;
    } 

    // 5. REYTING
    else if (this.activeTab === "leaderboard") {
      const students = JSON.parse(localStorage.getItem("ilmhub_students") || "[]");
      students.sort((a, b) => (b.xp || 0) - (a.xp || 0));

      content.innerHTML = `
        <div style="background: white; padding: 25px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
          <h3>🏆 O'quvchilar Reytingi</h3>
          <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 15px;">
            ${students.length === 0 ? '<p>Reyting hali shakllanmagan.</p>' : students.map((s, idx) => `
              <div style="display: flex; justify-content: space-between; padding: 12px 16px; background: ${idx === 0 ? '#fef3c7' : '#f8fafc'}; border-radius: 8px; border: 1px solid ${idx === 0 ? '#fde68a' : '#e2e8f0'};">
                <span>${idx === 0 ? '👑 1' : idx + 1}. 👤 ${s.name} (${s.group || 'Guruhsiz'})</span>
                <span style="color: #d97706; font-weight: bold;">⭐ ${s.xp || 0} XP</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }
  }
};