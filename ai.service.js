// backend/services/ai.service.js

const AIService = {
  // API Kalitni olish
  getApiKey() {
    return localStorage.getItem("ilmhub_ai_api_key") || "";
  },

  // API Kalitni saqlash
  setApiKey(key) {
    localStorage.setItem("ilmhub_ai_api_key", key);
  },

  // AI Bilan so'rov yuborish (Gemini API misolida)
  async generateResponse(promptText) {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      return "⚠️ AI ishlamayapti: API Key kiritilmagan. Lutfan, tizim sozlamalaridan Gemini API Key kiriting.";
    }

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptText }] }]
        })
      });

      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (err) {
      console.error("AI Error:", err);
      return "❌ AI so'rovida xatolik yuz berdi.";
    }
  }
};