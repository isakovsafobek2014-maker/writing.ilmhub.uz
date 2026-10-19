// js/utils/anticheat.js
//
// Anti-cheat tizimi. Hozircha localStorage asosida ishlaydi (ilmhub_students,
// currentUser bilan bir xil manba). Agar loyiha to'liq Supabase'ga o'tsa,
// faqat "getCurrentStudent / saveStudent / banStudent" funksiyalari ichidagi
// saqlash qismini almashtirish kifoya — qolgan mantiq o'zgarmaydi.

const AntiCheat = {
  examModeActive: false,
  topicLockActive: false,
  topicAttemptCount: 0,
  DAILY_REQUIRED_EXERCISES: 10,

  // ---------- YORDAMCHI: joriy o'quvchini olish/saqlash ----------
  getCurrentStudent() {
    return JSON.parse(localStorage.getItem("currentUser") || "null");
  },

  saveStudent(updated) {
    localStorage.setItem("currentUser", JSON.stringify(updated));
    const list = JSON.parse(localStorage.getItem("ilmhub_students") || "[]");
    const newList = list.map(s =>
      (s.id === updated.id || s.username === updated.username) ? { ...s, ...updated } : s
    );
    localStorage.setItem("ilmhub_students", JSON.stringify(newList));
  },

  // ---------- TO'LIQ HISOBNI BAN QILISH ----------
  banStudent(reason) {
    const student = this.getCurrentStudent();
    if (!student) return;

    student.banned = true;
    student.banReason = reason;
    student.bannedAt = new Date().toISOString();
    this.saveStudent(student);

    this.stopExamMode();

    alert(`🚫 Hisobingiz ban qilindi!\nSabab: ${reason}\n\nSavollar bo'lsa administratorga murojaat qiling.`);
    localStorage.removeItem("currentUser");
    window.location.reload();
  },

  // ---------- FAQAT "MAVZU" BO'LIMIDAN BAN QILISH ----------
  banFromTopics(reason) {
    const student = this.getCurrentStudent();
    if (!student) return;

    student.topicsBanned = true;
    student.topicsBanReason = reason;
    this.saveStudent(student);

    alert(`🚫 "Mavzu" bo'limidan ban qilindingiz!\nSabab: ${reason}`);
  },

  // ======================================================
  // 1. IMTIHON REJIMI (Tab-switch, DevTools, Copy-Paste)
  // ======================================================
  initExamMode() {
    this.examModeActive = true;

    this._visibilityHandler = () => {
      if (!this.examModeActive) return;
      if (document.hidden) {
        this.banStudent("Imtihon vaqtida boshqa oynaga/tabga o'tish (tab-switch)");
      }
    };

    this._blurHandler = () => {
      if (!this.examModeActive) return;
      // Ba'zi brauzerlarda visibilitychange ishlamasa, blur orqali ham ushlaymiz
      setTimeout(() => {
        if (this.examModeActive && document.hidden) {
          this.banStudent("Imtihon vaqtida oynadan chiqish (tab-switch)");
        }
      }, 50);
    };

    this._copyPasteHandler = (e) => {
      if (!this.examModeActive) return;
      e.preventDefault();
      this.banStudent("Imtihonda nusxa ko'chirish/joylashtirish (copy-paste)");
    };

    this._keydownHandler = (e) => {
      if (!this.examModeActive) return;

      // F12 yoki Ctrl+Shift+I/J/C (DevTools ochish urinishi)
      const isDevToolsCombo =
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && ["I", "J", "C", "i", "j", "c"].includes(e.key));

      if (isDevToolsCombo) {
        e.preventDefault();
        this._devToolsAttempted = true;
        alert("⚠️ Diqqat! DevTools ochish taqiqlangan. Yana urinsangiz hisobingiz ban qilinadi.");
        return;
      }

      // Agar DevTools ochishga urinilgan bo'lsa va shundan keyin Enter bossa -> ban
      // (konsolga kod joylab Enter bosish holatini qamrab oladi)
      if (this._devToolsAttempted && e.key === "Enter") {
        this.banStudent("DevTools orqali konsolga kod kiritishga urinish");
      }
    };

    document.addEventListener("visibilitychange", this._visibilityHandler);
    window.addEventListener("blur", this._blurHandler);
    document.addEventListener("copy", this._copyPasteHandler);
    document.addEventListener("paste", this._copyPasteHandler);
    document.addEventListener("keydown", this._keydownHandler);
  },

  stopExamMode() {
    this.examModeActive = false;
    document.removeEventListener("visibilitychange", this._visibilityHandler);
    window.removeEventListener("blur", this._blurHandler);
    document.removeEventListener("copy", this._copyPasteHandler);
    document.removeEventListener("paste", this._copyPasteHandler);
    document.removeEventListener("keydown", this._keydownHandler);
  },

  // ======================================================
  // 2. IMTIHON KUNI "MAVZU" BO'LIMINI QULFLASH
  // ======================================================
  // Imtihon kuni boshlanganda chaqiriladi (masalan progress/exam moduli orqali)
  lockTopicsForExamDay() {
    this.topicLockActive = true;
    this.topicAttemptCount = 0;
  },

  unlockTopics() {
    this.topicLockActive = false;
    this.topicAttemptCount = 0;
  },

  // "Mavzu" tugmasi bosilganda shu funksiya chaqirilishi kerak.
  // true qaytarsa - kirish mumkin, false qaytarsa - bloklangan.
  guardTopicsAccess() {
    const student = this.getCurrentStudent();
    if (student && student.topicsBanned) {
      alert("🚫 Siz \"Mavzu\" bo'limidan ban qilingansiz.");
      return false;
    }

    if (!this.topicLockActive) return true;

    this.topicAttemptCount++;

    if (this.topicAttemptCount >= 3) {
      this.banFromTopics("Imtihon kuni qulflangan \"Mavzu\" bo'limiga 3 marta kirishga urinish");
      return false;
    }

    alert(`⚠️ Bugun imtihon kuni, "Mavzu" bo'limi vaqtincha yopiq!\nUrinish: ${this.topicAttemptCount}/3 (3-marta urinsangiz bo'limdan ban qilinasiz)`);
    return false;
  },

  // ======================================================
  // 3. KUNLIK 10 TA MASHQ TALABI (Reading/Listening/Writing/Speaking)
  // ======================================================
  // Har bir mashq tugatilganda chaqiriladi: AntiCheat.logExercise('reading')
  logExercise(moduleType) {
    const student = this.getCurrentStudent();
    if (!student) return;

    const todayKey = this._todayKey();
    const storeKey = `ilmhub_daily_${student.id || student.username}_${todayKey}`;

    const counts = JSON.parse(localStorage.getItem(storeKey) || "{}");
    counts[moduleType] = (counts[moduleType] || 0) + 1;
    localStorage.setItem(storeKey, JSON.stringify(counts));
  },

  // Har kuni tizimga kirganda (masalan StudentDashboard.init ichida) chaqiriladi.
  // KECHAGI kunning barcha 4 bo'limi bo'yicha 10 tadan bajarilganmi tekshiradi.
  checkYesterdayQuota() {
    const student = this.getCurrentStudent();
    if (!student) return;

    const yesterdayKey = this._todayKey(-1);
    const storeKey = `ilmhub_daily_${student.id || student.username}_${yesterdayKey}`;
    const counts = JSON.parse(localStorage.getItem(storeKey) || "{}");

    // Agar kecha hech qanday faoliyat bo'lmagan bo'lsa ham, hisob yangi ochilgan
    // bo'lishi mumkin — shu sabab "ro'yxatdan o'tgan sana"ni tekshiramiz.
    if (student.registeredDate && student.registeredDate >= yesterdayKey) return;

    const modules = ["reading", "listening", "writing", "speaking"];
    const failedModules = modules.filter(m => (counts[m] || 0) < this.DAILY_REQUIRED_EXERCISES);

    if (failedModules.length > 0) {
      this.banStudent(
        `Kunlik talab bajarilmadi (${yesterdayKey}): ${failedModules.join(", ")} bo'limida ${this.DAILY_REQUIRED_EXERCISES} tadan kam mashq`
      );
    }
  },

  // ---------- YORDAMCHI: O'zbekiston vaqti (UTC+5) bo'yicha kun kaliti ----------
  _todayKey(dayOffset = 0) {
    const now = new Date();
    // UTC+5 ga o'tkazish
    const uzbTime = new Date(now.getTime() + (5 * 60 - now.getTimezoneOffset()) * 60000);
    uzbTime.setDate(uzbTime.getDate() + dayOffset);
    return uzbTime.toISOString().split("T")[0]; // YYYY-MM-DD
  }
};

window.AntiCheat = AntiCheat;