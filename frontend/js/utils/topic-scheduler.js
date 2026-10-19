// js/utils/topic-scheduler.js
//
// Mavzu tugashi -> Imtihon kuni avtomatik belgilanishi tizimi.
//
// QOIDA: Teacher (yoki AI) guruh uchun "mavzu tugadi" deb belgilasa,
// imtihon kuni AVTOMATIK ravishda "keyingi oyning 1-sanasi" (Toshkent
// vaqti, UTC+5) qilib belgilanadi.
//
// 3 ta FAZA:
//  1) "learning" — mavzu hali tugamagan, hammasi (mavzu + mashqlar) ochiq
//  2) "review"   — mavzu tugagan, imtihon kuni hali kelmagan:
//                   FAQAT mavzu takrorlash ochiq, oddiy mashqlar (reading/
//                   listening/writing/speaking practice) BLOKLANADI
//  3) "examday"  — bugun aynan imtihon kuni: "Mavzu" bo'limi AntiCheat
//                   orqali qulflanadi (3 marta urinsa -> ban)
//
// Ma'lumot localStorage'da "ilmhub_group_schedule" kaliti ostida,
// guruh nomi bo'yicha saqlanadi.

const TopicScheduler = {
  STORAGE_KEY: "ilmhub_group_schedule",

  // ---------- O'ZBEKISTON VAQTI (UTC+5) ----------
  getUzbNow() {
    const now = new Date();
    return new Date(now.getTime() + (5 * 60 - now.getTimezoneOffset()) * 60000);
  },

  formatDate(date) {
    return date.toISOString().split("T")[0]; // YYYY-MM-DD
  },

  // Berilgan "tugash sanasi"dan keyingi oyning 1-sanasini hisoblaydi
  computeExamDate(finishDateStr) {
    const d = new Date(finishDateStr + "T00:00:00");
    const examDate = new Date(d.getFullYear(), d.getMonth() + 1, 1);
    return this.formatDate(examDate);
  },

  // ---------- SAQLASH / OLISH ----------
  _getAllSchedules() {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || "{}");
  },

  _saveAllSchedules(data) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  },

  getGroupSchedule(groupName) {
    const all = this._getAllSchedules();
    return all[groupName] || null;
  },

  // ---------- ASOSIY: MAVZU TUGADI DEB BELGILASH ----------
  // teacher.js yoki messages.js dagi "Saqlash" tugmasidan, yoki AI matn
  // tahlilidan (processTeacherMessage) chaqiriladi.
  markTopicFinished(groupName, topicName = "") {
    if (!groupName) return null;

    const finishedDate = this.formatDate(this.getUzbNow());
    const examDate = this.computeExamDate(finishedDate);

    const all = this._getAllSchedules();
    all[groupName] = {
      topicName,
      topicFinishedDate: finishedDate,
      examDate: examDate,
      notifiedExamDay: false
    };
    this._saveAllSchedules(all);

    // Agar bugun aynan imtihon kuni bo'lib chiqsa (kam ehtimol, lekin himoya uchun)
    this._syncAntiCheatLock(groupName);

    console.log(`✅ "${groupName}" guruhi uchun mavzu tugadi. Imtihon kuni: ${examDate}`);
    return all[groupName];
  },

  // O'qituvchi/AI yozgan matnni tekshirib, "mavzu tugadi" degan niyatni aniqlaydi.
  // Messages bo'limida teacher xabar yozganda shu funksiya chaqirilishi kerak:
  //   TopicScheduler.processTeacherMessage(groupName, messageText)
  processTeacherMessage(groupName, messageText) {
    if (!messageText) return false;

    const text = messageText.toLowerCase();
    const finishKeywords = [
      "mavzu tugadi", "mavzu yakunlandi", "mavzular tugadi",
      "bu mavzu tugadi", "mavzuni tugatdik", "mavzu tamom"
    ];

    const isFinishSignal = finishKeywords.some(k => text.includes(k));
    if (isFinishSignal) {
      const schedule = this.markTopicFinished(groupName, messageText);
      return schedule;
    }
    return false;
  },

  // ---------- FAZANI ANIQLASH ----------
  getGroupPhase(groupName) {
    const schedule = this.getGroupSchedule(groupName);
    if (!schedule) return "learning"; // hali mavzu tugagani qayd etilmagan

    const todayStr = this.formatDate(this.getUzbNow());

    if (todayStr === schedule.examDate) return "examday";
    if (todayStr > schedule.examDate) return "learning"; // imtihon o'tib ketgan -> yangi sikl boshlandi deb hisoblanadi
    if (todayStr >= schedule.topicFinishedDate) return "review";

    return "learning";
  },

  getDaysUntilExam(groupName) {
    const schedule = this.getGroupSchedule(groupName);
    if (!schedule) return null;

    const today = this.getUzbNow();
    const exam = new Date(schedule.examDate + "T00:00:00");
    const diffMs = exam.setHours(0,0,0,0) - new Date(this.formatDate(today) + "T00:00:00").getTime();
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  },

  // ---------- ANTI-CHEAT BILAN SINXRONLASH ----------
  // Sahifa yuklanganda yoki dashboard render bo'lganda chaqirilishi kerak.
  _syncAntiCheatLock(groupName) {
    if (typeof AntiCheat === 'undefined') return;
    const phase = this.getGroupPhase(groupName);
    if (phase === "examday") {
      AntiCheat.lockTopicsForExamDay();
    } else {
      AntiCheat.unlockTopics();
    }
  },

  // ---------- MASHQLARGA (Reading/Listening/Writing/Speaking) TO'SIQ ----------
  // Har bir amaliy modul init() boshida chaqirilishi kerak:
  //   if (!TopicScheduler.guardPracticeAccess(currentUser.group)) return;
  guardPracticeAccess(groupName) {
    if (!groupName) return true; // guruhsiz (guest/eski hisoblar) uchun cheklov qo'yilmaydi

    this._syncAntiCheatLock(groupName);
    const phase = this.getGroupPhase(groupName);

    if (phase === "review") {
      const daysLeft = this.getDaysUntilExam(groupName);
      alert(`📚 Mavzu tugagan! Hozir faqat mavzuni takrorlash mumkin.\nOddiy mashqlar imtihongacha (${daysLeft} kun qoldi) yopiq.`);
      return false;
    }

    if (phase === "examday") {
      alert("⏱️ Bugun imtihon kuni! Oddiy mashqlar emas, imtihon bo'limiga o'ting.");
      return false;
    }

    return true; // "learning" fazasi -> ochiq
  },

  // Teacher/Director panelida guruh statusini ko'rsatish uchun
  getStatusLabel(groupName) {
    const phase = this.getGroupPhase(groupName);
    const schedule = this.getGroupSchedule(groupName);

    if (phase === "learning") return "🟢 O'qitish davom etmoqda";
    if (phase === "review") return `🟡 Mavzu tugagan — Imtihon: ${schedule.examDate} (${this.getDaysUntilExam(groupName)} kun qoldi)`;
    if (phase === "examday") return "🔴 BUGUN IMTIHON KUNI";
    return "";
  }
};

window.TopicScheduler = TopicScheduler;