const ListeningModule = {
    init() {
        const xpAmount = window.SystemStatus.isDevOnline ? 200 : 100;
        const container = document.getElementById('app-container');

        container.innerHTML = `
            <div style="background: white; padding: 25px; border-radius: 12px;">
                <h2>🎧 Listening Practice</h2>
                <p style="color: #636e72; margin-bottom: 15px;">Matnni eshitish uchun tugmani bosing:</p>

                <button onclick="ListeningModule.playAudio()" class="modal-btn btn-primary" style="width: auto; padding: 10px 20px; margin-bottom: 20px;">
                    🔊 Ovozni Eshitish
                </button>

                <div style="margin-bottom: 20px;">
                    <p style="font-weight: bold;">Eshitgan so'zingizni yozing:</p>
                    <input type="text" id="listeningInput" class="modal-input" placeholder="Bu yerga yozing..." style="margin-top: 10px;">
                </div>

                <button onclick="ListeningModule.checkInput(${xpAmount})" class="modal-btn btn-success">
                    Tekshirish (+${xpAmount} XP)
                </button>
            </div>
        `;
    },

    playAudio() {
        const msg = new SpeechSynthesisUtterance("Welcome to our English learning platform");
        msg.lang = 'en-US';
        window.speechSynthesis.speak(msg);
    },

    checkInput(xp) {
        const text = document.getElementById('listeningInput').value.trim().toLowerCase();
        if (text.includes("welcome to our english learning platform")) {
            alert(`Ajoyib eshitish qobiliyati! +${xp} XP to'pladingiz! 🚀`);
            StudentModule.init("O me'yoriy O'quvchi", xp);
        } else {
            alert("Biroz xatolik bor, qaytadan eshitib ko'ring!");
        }
    }
};