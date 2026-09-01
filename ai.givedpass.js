// js/student-modules/ai-assistant.js

const AIAssistant = {
  prompts: [
    "Write 3 sentences about your favourite animal and why you like it.",
    "Describe what you usually eat for breakfast in English.",
    "Write a short paragraph about your best friend.",
    "Tell me about your favourite hobby and when you do it."
  ],

  // AI topshiriq berish interfeysi
  renderWritingChallenge(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const randomPrompt = this.prompts[Math.floor(Math.random() * this.prompts.length)];

    container.innerHTML = `
      <div style="background:#fff; padding:24px; border-radius:12px; border-left:5px solid #8b5cf6;">
        <h3 style="margin-top:0; color:#5b21b6;">🤖 AI Writing Challenge</h3>
        <p style="font-size:16px; font-weight:600; color:#1e293b;">"${randomPrompt}"</p>

        <textarea 
          id="ai-writing-input" 
          rows="5" 
          placeholder="Javobingizni ingliz tilida yozing..." 
          style="width:100%; padding:12px; border:1px solid #cbd5e1; border-radius:8px; font-family:sans-serif; margin-top:10px;"
        ></textarea>

        <div style="margin-top:12px; display:flex; justify-content:space-between; align-items:center;">
          <button 
            onclick="AIAssistant.submitWriting()" 
            style="padding:10px 20px; background:#8b5cf6; color:#fff; border:none; border-radius:8px; cursor:pointer; font-weight:bold;"
          >
            🚀 AI ga topshirish
          </button>
          <span id="ai-status" style="font-size:14px; color:#64748b;"></span>
        </div>

        <div id="ai-feedback" style="margin-top:15px; display:none; padding:12px; background:#f3e8ff; border-radius:8px; color:#4c1d95;"></div>
      </div>
    `;
  },

  // Yozilgan matnni AI orqali simulyatsiya/tekshirish
  submitWriting() {
    const text = document.getElementById('ai-writing-input').value.trim();
    const feedbackBox = document.getElementById('ai-feedback');
    const status = document.getElementById('ai-status');

    if (!text) {
      alert("Iltimos, avval matn yozing!");
      return;
    }

    status.innerText = "AI tekshirmoqda...";

    setTimeout(() => {
      status.innerText = "";
      feedbackBox.style.display = "block";
      
      const wordCount = text.split(/\s+/).length;
      feedbackBox.innerHTML = `
        <strong>💡 AI Baho:</strong> Juda yaxshi harakat!<br>
        <strong>So'zlar soni:</strong> ${wordCount} ta so'z.<br>
        <strong>Maslahat:</strong> Grammatikaga va tinish belgilariga e'tibor bering. +15 XP berildi!
      `;
    }, 1200);
  }
};