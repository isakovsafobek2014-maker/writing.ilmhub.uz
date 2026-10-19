const SpeakingModule = {
    currentItem: null,

    async init(containerId = 'app-container') {
        this._containerId = containerId;
        const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");

        if (currentUser && typeof TopicScheduler !== 'undefined') {
            if (!TopicScheduler.guardPracticeAccess(currentUser.group)) return;
        }

        this.currentItem = typeof ContentBank !== 'undefined'
            ? await ContentBank.getSpeakingItem(currentUser)
            : { sentence: "I love learning English with AI!" };

        const container = document.getElementById(containerId);
        container.innerHTML = `
            <div style="background: white; padding: 25px; border-radius: 12px; text-align: center;">
                <h2>🎙️ Speaking Practice</h2>
                <p style="margin: 15px 0;">Quyidagi gapni ovoz chiqarib takrorlang:</p>

                <div style="background: #eff6ff; padding: 15px; border-radius: 8px; color: #1e40af; font-size: 18px; font-weight: bold; margin-bottom: 20px;">
                    "${this.currentItem.sentence}"
                </div>

                <button onclick="SpeakingModule.recordDone()" class="modal-btn btn-primary" style="width: auto; padding: 12px 30px; font-size: 18px;">
                    🔴 Ovoz Yozishni Boshlash
                </button>
            </div>
        `;
    },

    recordDone() {
        alert('Mikrofon ruxsati so\'ralmoqda...');
        if (typeof AntiCheat !== 'undefined') AntiCheat.logExercise('speaking');
        if (typeof StudentGivedXP !== 'undefined') StudentGivedXP.addXP(10);
        this.init(this._containerId || 'app-container');
    }
};