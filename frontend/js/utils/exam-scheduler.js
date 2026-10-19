// js/utils/exam-scheduler.js
//
// Mavzu tugagach imtihon sanasini avtomatik belgilaydi:
// Qoida: mavzu qaysi kuni tugasa, imtihon KEYINGI OYNING 1-SANASIDA bo'ladi.
// Masalan: mavzu 30-iyulda tugadi -> imtihon 1-avgustda.
// Shu oraliqda (mavzu tugagan kundan imtihon kunigacha) "Mavzu" bo'limida
// yangi mashq qilish BLOKLANADI — faqat takrorlash mumkin.
//
// Barcha sanalar O'zbekiston vaqti (UTC+5) bo'yicha hisoblanadi.

const ExamScheduler = {
  STORAGE_KEY: "ilmhub_exam_schedule", // { [groupId]: { topicFinishedDate, examDate, locked } }

  // ---------- O'ZBEKISTON VAQTI (UTC+5) ----------
  _nowUZ(offsetDays = 0) {
    const now = new Date();
    const uzb = new Date(now.getTime() + (5 * 60 - now.getTimezoneOffset()) * 60000);
    uzb.setDate(uzb.getDate() + offsetDays);
    return uzb;
  },

  _formatDate(d) {
    return d.toISOString().split("T")[0]; // YYYY-MM-DD
  },

  // Berilgan sanadan keyingi oyning 1-sanasini hisoblaydi
  calculateExamDate(fromDate) {
    const d = new Date(fromDate);
    const examDate = new Date(Date.UTC(d.getFullYear(), d.getMonth() + 1, 1));
    return this._formatDate(examDate);
  },

  // ---------- SAQLASH ----------
  getAllSchedules() {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || "{}");
  },

  saveAllSchedules(data) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  },

  // Teacher/Admin/Director ("Mavzu tugadi" tugmasi) yoki AI shu funksiyani chaqiradi.
  // groupId - qaysi guruh uchun mavzu tugaganini bildiradi.
  markTopicFinished(groupId) {
    const today = this._nowUZ();
    const todayStr = this._formatDate(today);
    const examDate = this.calculateExamDate(today);

    const all = this.getAllSchedules();
    all[groupId] = {
      topicFinishedDate: todayStr,
      examDate: examDate,
      locked: true
    };
    this.saveAllSchedules(all);

    return examDate;
  },

  // Imtihon o'tgach yoki yangi mavzu qo'lda boshlanganda qulfni ochish
  unlockGroup(groupId) {
    const all = this.getAllSchedules();
    if (all[groupId]) {
      all[groupId].locked = false;
      this.saveAllSchedules(all);
    }
  },

  // "Mavzu" bo'limi hozir qulfmi?
  isTopicsLocked(groupId) {
    const all = this.getAllSchedules();
    const sched = all[groupId];
    if (!sched || !sched.locked) return false;

    // Imtihon kuni kelib/o'tib ketgan bo'lsa - avtomatik ochiladi
    const todayStr = this._formatDate(this._nowUZ());
    if (todayStr >= sched.examDate) {
      this.unlockGroup(groupId);
      return false;
    }
    return true;
  },

  getExamDate(groupId) {
    const all = this.getAllSchedules();
    return all[groupId]?.examDate || null;
  },

  getDaysUntilExam(groupId) {
    const examDate = this.getExamDate(groupId);
    if (!examDate) return null;
    const today = this._nowUZ();
    const exam = new Date(examDate + "T00:00:00Z");
    const diffMs = exam - Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  }
};

window.ExamScheduler = ExamScheduler;