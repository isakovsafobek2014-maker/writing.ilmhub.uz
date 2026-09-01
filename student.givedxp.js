// O'quvchi ballari (+XP / -XP) va ovozli tizim moduli

const StudentGivedXP = {
  // 1. XP Qo'shish (+10 XP)
  addXP(amount) {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) return;

    currentUser.xp = (currentUser.xp || 0) + amount;
    this.updateUserAndStorage(currentUser);

    alert(`🎉 Baraka bering! To'g'ri javob uchun +${amount} XP berildi!`);
  },

  // 2. XP Olmay/Ayrish (-10 XP)
  removeXP(amount) {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) return;

    // XP 0 dan kam bo'lib ketmasligini ta'minlash
    const currentXP = currentUser.xp || 0;
    currentUser.xp = Math.max(0, currentXP - amount);
    
    this.updateUserAndStorage(currentUser);

    alert(`❌ Noto'g'ri javob! Sizdan -${amount} XP olib tashlandi.`);
  },

  // Xotirani va ekrandagi XP ko'rsatkichini yangilash
  updateUserAndStorage(currentUser) {
    localStorage.setItem("currentUser", JSON.stringify(currentUser));

    const studentsList = JSON.parse(localStorage.getItem("ilmhub_students") || "[]");
    const updatedList = studentsList.map(s => {
      if (s.id === currentUser.id || s.password === currentUser.password || s.username === currentUser.username) {
        return { ...s, xp: currentUser.xp };
      }
      return s;
    });
    localStorage.setItem("ilmhub_students", JSON.stringify(updatedList));

    const xpDisplay = document.getElementById("student-xp-display");
    if (xpDisplay) {
      xpDisplay.innerText = `⭐ ${currentUser.xp} XP`;
    }
  },

  // 3. Matnni ovozli o'qish
  speakText(text) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Qurilmangizda ovozli o'qish funksiyasi ishlamayapti.");
    }
  },

  // 4. Mikrofondan yozib olish
  startVoiceInput(targetInputId) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      return alert("Mikrofon orqali yozish uchun Google Chrome brauzeridan foydalaning.");
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    const targetInput = document.getElementById(targetInputId);
    if (targetInput) targetInput.placeholder = "🎙️ AI tinglamoqda, gapiring...";

    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (targetInput) {
        targetInput.value = (targetInput.value ? targetInput.value + " " : "") + transcript;
      }
    };

    recognition.onerror = () => {
      alert("Ovozni aniqlashda xatolik yuz berdi. Mikrofon ruxsatini tekshiring.");
    };

    recognition.onend = () => {
      if (targetInput && !targetInput.value) {
        targetInput.placeholder = "Javobingizni yozing yoki gapiring...";
      }
    };
  }
};