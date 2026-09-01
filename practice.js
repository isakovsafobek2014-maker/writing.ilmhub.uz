// js/student-modules/practice.js

const PracticeModule = {
  // 1. READING QUIZ MASHQLARI
  readingQuizzes: [
    {
      id: 1,
      title: "My Favourite Season",
      text: "Summer is my favourite season because the weather is warm and sunny. I love going to the park with my friends and eating ice cream.",
      questions: [
        {
          question: "Why does the author like summer?",
          options: ["Because it is cold", "Because it is warm and sunny", "Because it rains"],
          correct: 1
        },
        {
          question: "What does the author like eating?",
          options: ["Pizza", "Soup", "Ice cream"],
          correct: 2
        }
      ]
    }
  ],

  // 2. SPEAKING FLASHCARDS (Mevalar, Hayvonlar, Harakatlar)
  speakingCards: [
    { category: "Fruits", word: "apple", translation: "Olma", emoji: "🍎" },
    { category: "Fruits", word: "banana", translation: "Banan", emoji: "🍌" },
    { category: "Animals", word: "cat", translation: "Mushuk", emoji: "🐱" },
    { category: "Animals", word: "dog", translation: "Kuchuk", emoji: "🐶" },
    { category: "Actions", word: "running", translation: "Yugurish", emoji: "🏃" },
    { category: "Actions", word: "reading", translation: "O'qish", emoji: "📖" }
  ],

  // Reading Quiz render qilish
  renderReadingQuiz(quizId, containerId) {
    const quiz = this.readingQuizzes.find(q => q.id === quizId);
    const container = document.getElementById(containerId);
    if (!quiz || !container) return;

    let html = `
      <div class="quiz-card" style="background:#fff; padding:20px; border-radius:12px; margin-bottom:20px;">
        <h3>📖 ${quiz.title}</h3>
        <p style="font-size:16px; color:#334155; line-height:1.6;">${quiz.text}</p>
        <hr style="margin:20px 0; border:0; border-top:1px solid #e2e8f0;">
    `;

    quiz.questions.forEach((q, qIdx) => {
      html += `
        <div style="margin-bottom:15px;">
          <p><strong>${qIdx + 1}. ${q.question}</strong></p>
          <div style="display:flex; gap:10px; flex-wrap:wrap;">
            ${q.options.map((opt, oIdx) => `
              <button 
                onclick="PracticeModule.checkAnswer(${quizId}, ${qIdx}, ${oIdx}, this)" 
                style="padding:8px 16px; border:1px solid #cbd5e1; background:#f8fafc; border-radius:8px; cursor:pointer;"
              >
                ${opt}
              </button>
            `).join('')}
          </div>
        </div>
      `;
    });

    html += `</div>`;
    container.innerHTML = html;
  },

  // Javobni tekshirish va XP berish
  checkAnswer(quizId, qIdx, selectedIdx, btn) {
    const quiz = this.readingQuizzes.find(q => q.id === quizId);
    const question = quiz.questions[qIdx];
    const parent = btn.parentElement;

    // Tugmalarni faolsizlantirish
    Array.from(parent.children).forEach(child => child.disabled = true);

    if (selectedIdx === question.correct) {
      btn.style.background = "#22c55e";
      btn.style.color = "#fff";
      btn.style.borderColor = "#22c55e";
      alert("To'g'ri javob! +10 XP 🎯");
    } else {
      btn.style.background = "#ef4444";
      btn.style.color = "#fff";
      btn.style.borderColor = "#ef4444";
      alert("Xato javob! Qayta urinib ko'ring.");
    }
  },

  // Speaking Flashcard render qilish
  renderSpeakingCard(category, containerId) {
    const container = document.getElementById(containerId);
    const filtered = this.speakingCards.filter(c => c.category === category);
    if (!container || filtered.length === 0) return;

    const item = filtered[Math.floor(Math.random() * filtered.length)];

    container.innerHTML = `
      <div style="background:#fff; padding:30px; border-radius:16px; text-align:center; box-shadow:0 4px 6px -1px rgba(0,0,0,0.1);">
        <div style="font-size:80px; margin-bottom:10px;">${item.emoji}</div>
        <h2 style="margin:0; color:#1e293b;">${item.word.toUpperCase()}</h2>
        <p style="color:#64748b; margin-top:5px;">(${item.translation})</p>
        <button 
          onclick="SpeechUtil.listenAndCheck('${item.word}')" 
          style="margin-top:15px; padding:12px 24px; background:#2563eb; color:#fff; border:none; border-radius:10px; cursor:pointer; font-weight:bold;"
        >
          🎙️ Talaffuz qilish
        </button>
      </div>
    `;
  }
};