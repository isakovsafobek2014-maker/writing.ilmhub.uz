const ListeningModule = {
    currentItem: null,

    async init(containerId = 'app-container') {
        this._containerId = containerId;
        const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");

        if (currentUser && typeof TopicScheduler !== 'undefined') {
            if (!TopicScheduler.guardPracticeAccess(currentUser.group)) return;
        }

        const xpAmount = window.SystemStatus.isDevOnline ? 200 : 100;
        const container = document.getElementById(containerId);

        this.currentItem = typeof ContentBank !== 'undefined'
            ? await ContentBank.getListeningItem(currentUser)
            : { audioText: "Welcome to our English learning platform", question: "Nima deyildi?", answerContains: "welcome to our english learning platform" };

        const item = this.currentItem;

        container.innerHTML = `
            <div style="background: white; padding: 25px; border-radius: 12px;">
                <h2>🎧 Listening Practice</h2>
                <p style="color: #636e72; margin-bottom: 15px;">Matnni eshitish uchun tugmani bosing:</p>

                <button onclick="ListeningModule.playAudio()" class="modal-btn btn-primary" style="width: auto; padding: 10px 20px; margin-bottom: 20px;">
                    🔊 Ovozni Eshitish
                </button>

                <div style="margin-bottom: 20px;">
                    <p style="font-weight: bold;">${item.question}</p>
                    <input type="text" id="listeningInput" class="modal-input" placeholder="Bu yerga yozing..." style="margin-top: 10px;">
                </div>

                <button onclick="ListeningModule.checkInput(${xpAmount})" class="modal-btn btn-success">
                    Tekshirish (+${xpAmount} XP)
                </button>
            </div>
        `;
    },

    playAudio() {
        const msg = new SpeechSynthesisUtterance(this.currentItem.audioText);
        msg.lang = 'en-US';
        window.speechSynthesis.speak(msg);
    },

    checkInput(xp) {
        const text = document.getElementById('listeningInput').value.trim().toLowerCase();
        if (text.includes(this.currentItem.answerContains)) {
            alert(`Ajoyib eshitish qobiliyati! +${xp} XP to'pladingiz! 🚀`);
            if (typeof AntiCheat !== 'undefined') AntiCheat.logExercise('listening');
            if (typeof StudentGivedXP !== 'undefined') StudentGivedXP.addXP(xp);
            this.init(this._containerId || 'app-container');
        } else {
            alert("Biroz xatolik bor, qaytadan eshitib ko'ring!");
        }
    },

    // Bot orqali berilgan pass kodni ochish (YouTube listening video)
    async redeemPass() {
        const input = document.getElementById('listeningPassInput');
        const resultBox = document.getElementById('listeningPassResult');
        const code = input.value.trim().toUpperCase();

        if (!code) {
            alert("Iltimos, pass kodni kiriting!");
            return;
        }

        if (typeof supabase === 'undefined') {
            alert("Xatolik: Supabase ulanmagan.");
            return;
        }

        const { data: pass, error: passError } = await supabase
            .from('listening_passes')
            .select('*, listening_content(*)')
            .eq('pass_code', code)
            .single();

        if (passError || !pass) {
            resultBox.innerHTML = `<p style="color:#ef4444; font-size:13px;">❌ Bunday pass kod topilmadi.</p>`;
            return;
        }

        const content = pass.listening_content;
        if (!content) {
            resultBox.innerHTML = `<p style="color:#ef4444; font-size:13px;">❌ Bu kodga bog'langan video topilmadi.</p>`;
            return;
        }

        const videoIdMatch = content.youtube_url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{6,})/);
        const videoId = videoIdMatch ? videoIdMatch[1] : null;

        resultBox.innerHTML = `
            <h4 style="margin: 0 0 10px 0;">🎬 ${content.title}</h4>
            ${videoId ? `
                <div style="position:relative; padding-bottom:56.25%; height:0; overflow:hidden; border-radius:10px;">
                    <iframe src="https://www.youtube.com/embed/${videoId}" style="position:absolute; top:0; left:0; width:100%; height:100%; border:none;" allowfullscreen></iframe>
                </div>
            ` : `<a href="${content.youtube_url}" target="_blank">${content.youtube_url}</a>`}
        `;

        if (!pass.used) {
            await supabase.from('listening_passes').update({ used: true, used_at: new Date().toISOString() }).eq('id', pass.id);
        }

        if (typeof AntiCheat !== 'undefined') AntiCheat.logExercise('listening');
    }
};