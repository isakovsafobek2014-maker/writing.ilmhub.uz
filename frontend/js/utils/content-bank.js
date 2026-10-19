// js/utils/content-bank.js
//
// Reading/Listening/Vocabulary/Speaking/Writing uchun UMUMIY KONTENT BANKI.
// CEFR: A1, A2, B1, B2, C1, C2.
//
// MUHIM: Standart (default) kontent shu faylning ichida (har doim mavjud,
// hech qayerga bog'liq emas). Lekin Dev/Teacher AI orqali YANGI qo'shgan
// kontent endi SUPABASE'dagi "content_items" jadvaliga yoziladi - shunda u
// BARCHA qurilmalardagi o'quvchilarga bir xilda ko'rinadi (localStorage kabi
// faqat bitta brauzerda qolib ketmaydi).

const ContentBank = {
  LAST_SHOWN_KEY: "ilmhub_last_shown",
  LEVELS: ["A1", "A2", "B1", "B2", "C1", "C2"],
  _cachedExtra: null, // Supabase'dan olingan qo'shimcha kontent keshi
  _pendingExtraRequest: null,
  _lastExtraRequestAt: 0,

  defaults: {
    reading: [
      { id: "r_a1_1", level: "A1", title: "My Family",
        text: "This is my family. I have a mother, a father and a sister. We live in a small house. I love my family very much.",
        question: "Oilada nechta farzand bor?",
        options: [{ t: "1", correct: false }, { t: "2", correct: true }, { t: "3", correct: false }] },
      { id: "r_a2_1", level: "A2", title: "Tom and Lucy",
        text: "Tom is twelve years old and he has a younger sister, Lucy. They live in a house with a big garden. In the garden there are many flowers and a small apple tree. Tom and Lucy like to play outside after school.",
        question: "Tom bog'da nimaga ega?",
        options: [{ t: "Bassein", correct: false }, { t: "Olma daraxti (Apple tree)", correct: true }, { t: "Garaj", correct: false }] },
      { id: "r_b1_1", title: "The Smart Little Dog", level: "B1",
        text: "Max is a small brown dog. He lives in a big house with his best friend, Tim. Every morning, Max brings the newspaper to Tim. Tim gives Max a delicious biscuit. Today, Max found a blue ball in the garden and played all day.",
        question: "Max bog'dan nima topib oldi?",
        options: [{ t: "Qizil koptok", correct: false }, { t: "Ko'k koptok (Blue ball)", correct: true }, { t: "Gazeta", correct: false }] },
      { id: "r_b2_1", level: "B2", title: "Remote Work",
        text: "Remote work has become increasingly popular since 2020. Many companies now offer flexible schedules, allowing employees to work from home. While this improves work-life balance, it can also blur the line between personal and professional time.",
        question: "Masofaviy ishning bir kamchiligi nima?",
        options: [{ t: "Ish va shaxsiy hayot chegarasi yo'qoladi", correct: true }, { t: "Maosh kamayadi", correct: false }, { t: "Ish soatlari cheklanadi", correct: false }] },
      { id: "r_c1_1", level: "C1", title: "Climate Change",
        text: "Climate change is one of the biggest challenges facing our planet today. Rising temperatures affect weather patterns, sea levels, and ecosystems worldwide. Scientists agree that reducing carbon emissions is essential to slow down this process.",
        question: "Matn asosan nima haqida?",
        options: [{ t: "Iqlim o'zgarishi", correct: true }, { t: "Sport musobaqalari", correct: false }, { t: "Ovqatlanish", correct: false }] },
      { id: "r_c2_1", level: "C2", title: "The Paradox of Choice",
        text: "Contemporary consumer culture presents individuals with an overwhelming array of choices, which, counterintuitively, often leads to diminished satisfaction rather than enhanced autonomy.",
        question: "\"Paradox of choice\" nimani anglatadi?",
        options: [{ t: "Ko'p tanlov ba'zan qoniqishni kamaytiradi", correct: true }, { t: "Tanlov qanchalik ko'p bo'lsa, shunchalik yaxshi", correct: false }, { t: "Tanlov hissiyotga bog'liq emas", correct: false }] }
    ],
    listening: [
      { id: "l_a1_1", level: "A1", audioText: "My name is Ali. I am a student.", question: "Ismi nima?", answerContains: "ali" },
      { id: "l_a2_1", level: "A2", audioText: "Welcome to our English learning platform", question: "Nima deyilgan edi?", answerContains: "welcome to our english learning platform" },
      { id: "l_b1_1", level: "B1", audioText: "The quick brown fox jumps over the lazy dog", question: "Qaysi hayvon sakrab o'tdi?", answerContains: "fox" },
      { id: "l_b2_1", level: "B2", audioText: "She bought three apples and two oranges from the market", question: "Necha ta olma sotib oldi?", answerContains: "three apples" },
      { id: "l_c1_1", level: "C1", audioText: "The meeting has been rescheduled to next Monday morning", question: "Uchrashuv qachonga ko'chirildi?", answerContains: "next monday morning" },
      { id: "l_c2_1", level: "C2", audioText: "Despite the initial setbacks, the research team remained committed to their long-term objectives", question: "Jamoa nima qildi?", answerContains: "remained committed" }
    ],
    vocabulary: [
      { id: "v_a1_1", level: "A1", word: "HAPPY", translation: "Xursand / Baxtli", options: ["Xursand / Baxtli", "G'amgin", "Charchagan", "Ochiq"], correctIndex: 0 },
      { id: "v_a2_1", level: "A2", word: "BRAVE", translation: "Botir / Jasur", options: ["Qo'rqoq", "Botir / Jasur", "Kichkina", "Sekin"], correctIndex: 1 },
      { id: "v_b1_1", level: "B1", word: "CURIOUS", translation: "Qiziquvchan", options: ["Qiziquvchan", "Loqayd", "Charchagan", "Jahldor"], correctIndex: 0 },
      { id: "v_b2_1", level: "B2", word: "RELIABLE", translation: "Ishonchli", options: ["Qiziqarli", "Ishonchli", "Qimmat", "Sekin"], correctIndex: 1 },
      { id: "v_c1_1", level: "C1", word: "AMBITIOUS", translation: "Maqsadli / Intiluvchan", options: ["Maqsadli / Intiluvchan", "Dangasa", "G'azabdor", "Quvnoq"], correctIndex: 0 },
      { id: "v_c2_1", level: "C2", word: "PERSISTENT", translation: "Qat'iyatli / Chidamli", options: ["Dangasa", "Asabiy", "Qat'iyatli / Chidamli", "Beparvo"], correctIndex: 2 }
    ],
    speaking: [
      { id: "s_a1_1", level: "A1", sentence: "I love my family very much!" },
      { id: "s_a2_1", level: "A2", sentence: "My favourite animal is a cat." },
      { id: "s_b1_1", level: "B1", sentence: "I love learning English with AI!" },
      { id: "s_b2_1", level: "B2", sentence: "Practice makes perfect every single day." },
      { id: "s_c1_1", level: "C1", sentence: "Public speaking helps you build confidence." },
      { id: "s_c2_1", level: "C2", sentence: "Effective communication requires both clarity and empathy." }
    ],
    writing: [
      { id: "w_a1_1", level: "A1", prompt: "Write 3 sentences about your family." },
      { id: "w_a2_1", level: "A2", prompt: "Describe your favourite animal and why you like it." },
      { id: "w_b1_1", level: "B1", prompt: "Describe your favorite hobby and why you like it." },
      { id: "w_b2_1", level: "B2", prompt: "Write about a memorable trip you have taken." },
      { id: "w_c1_1", level: "C1", prompt: "Discuss the advantages and disadvantages of remote work." },
      { id: "w_c2_1", level: "C2", prompt: "Analyze the impact of social media on modern communication." }
    ]
  },

  // ---------- SUPABASE'DAN QO'SHIMCHA KONTENTNI OLISH ----------
  async _fetchExtraFromSupabase() {
    if (typeof supabase === 'undefined') return {};
    try {
      const { data, error } = await supabase.from('content_items').select('*');
      if (error || !data) return {};

      const grouped = {};
      data.forEach(row => {
        if (!grouped[row.module_type]) grouped[row.module_type] = [];
        grouped[row.module_type].push({ id: `db_${row.id}`, level: row.level, ...row.data });
      });
      return grouped;
    } catch (e) {
      console.error("ContentBank: Supabase'dan o'qishda xatolik", e);
      return {};
    }
  },

  async _getAllContent() {
    const now = Date.now();
    if (!this._pendingExtraRequest && (this._cachedExtra === null || now - this._lastExtraRequestAt >= 30000)) {
      this._lastExtraRequestAt = now;
      this._pendingExtraRequest = this._fetchExtraFromSupabase()
        .then(extra => {
          this._cachedExtra = extra;
          return extra;
        })
        .finally(() => {
          this._pendingExtraRequest = null;
        });
    }

    let extra = this._cachedExtra || {};
    if (this._pendingExtraRequest) {
      extra = await new Promise(resolve => {
        const timeout = setTimeout(() => resolve(this._cachedExtra || {}), 1000);
        this._pendingExtraRequest.then(result => {
          clearTimeout(timeout);
          resolve(result);
        });
      });
    }

    const merged = {};
    for (const key of Object.keys(this.defaults)) {
      merged[key] = [...this.defaults[key], ...(extra[key] || [])];
    }
    return merged;
  },

  // AI/Teacher/Developer tomonidan yangi kontent qo'shish -> Supabase'ga yoziladi
  async addContent(moduleType, item) {
    const { level, ...data } = item;
    if (typeof supabase === 'undefined') {
      console.error("ContentBank.addContent: supabase mavjud emas");
      return false;
    }

    try {
      const { error } = await supabase.from('content_items').insert([{
        module_type: moduleType,
        level: level || "B1",
        data: data
      }]);
      if (error) {
        console.error("ContentBank.addContent xatolik:", error.message);
        return false;
      }
    } catch (error) {
      console.error("ContentBank.addContent: Supabase'ga ulanishda xatolik", error);
      return false;
    }

    return true;
  },

  getStudentLevel(student) {
    if (!student || !student.group) return "B1";
    const groups = JSON.parse(localStorage.getItem("ilmhub_groups") || "[]");
    const g = groups.find(x => x.name === student.group);
    if (!g || !g.stage) return "B1";
    const stageStr = g.stage.toUpperCase();
    const found = this.LEVELS.find(lvl => stageStr.includes(lvl));
    return found || "B1";
  },

  _pickFromPool(all, moduleType, level) {
    let pool = (all[moduleType] || []).filter(item => item.level === level);

    if (pool.length === 0) {
      const levelIdx = this.LEVELS.indexOf(level);
      for (let offset = 1; offset < this.LEVELS.length && pool.length === 0; offset++) {
        const lower = this.LEVELS[levelIdx - offset];
        const upper = this.LEVELS[levelIdx + offset];
        if (lower) pool = (all[moduleType] || []).filter(item => item.level === lower);
        if (pool.length === 0 && upper) pool = (all[moduleType] || []).filter(item => item.level === upper);
      }
    }
    if (pool.length === 0) pool = all[moduleType] || [];
    if (pool.length === 0) return null;

    const lastShownKey = `${this.LAST_SHOWN_KEY}_${moduleType}`;
    const lastId = localStorage.getItem(lastShownKey);
    let candidates = pool.filter(item => item.id !== lastId);
    if (candidates.length === 0) candidates = pool;

    const chosen = candidates[Math.floor(Math.random() * candidates.length)];
    localStorage.setItem(lastShownKey, chosen.id);
    return chosen;
  },

  async getReadingItem(student) {
    const all = await this._getAllContent();
    return this._pickFromPool(all, "reading", this.getStudentLevel(student));
  },
  async getListeningItem(student) {
    const all = await this._getAllContent();
    return this._pickFromPool(all, "listening", this.getStudentLevel(student));
  },
  async getVocabularyItem(student) {
    const all = await this._getAllContent();
    return this._pickFromPool(all, "vocabulary", this.getStudentLevel(student));
  },
  async getSpeakingItem(student) {
    const all = await this._getAllContent();
    return this._pickFromPool(all, "speaking", this.getStudentLevel(student));
  },
  async getWritingItem(student) {
    const all = await this._getAllContent();
    return this._pickFromPool(all, "writing", this.getStudentLevel(student));
  }
};

window.ContentBank = ContentBank;