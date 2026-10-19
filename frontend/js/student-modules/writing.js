const WritingModule = {
    currentItem: null,

    async init(containerId = 'app-container') {
        this._containerId = containerId;
        const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");

        if (currentUser && typeof TopicScheduler !== 'undefined') {
            if (!TopicScheduler.guardPracticeAccess(currentUser.group)) return;
        }

        const xpAmount = window.SystemStatus.isDevOnline ? 200 : 100;

        this.currentItem = typeof ContentBank !== 'undefined'
            ? await ContentBank.getWritingItem(currentUser)
            : { prompt: "Describe your favorite hobby and why you like it." };

        const container = document.getElementById(containerId);
        container.innerHTML = `
            <div style="background: white; padding: 25px; border-radius: 12px;">
                <h2>📝 Writing Practice Module</h2>
                <p style="margin-bottom: 15px; color: #636e72;">Mavzu: <strong>"${this.currentItem.prompt}"</strong></p>

                <textarea id="writingText" rows="8" placeholder="Ingliz tilida inshongizni yozing..." 
                          style="width: 100%; padding: 12px; border: 2px solid #dfe6e9; border-radius: 8px; font-size: 16px; margin-bottom: 15px;"></textarea>

                <button onclick="WritingModule.submitEssay(${xpAmount})" class="modal-btn btn-success">
                    Topshirish (+${xpAmount} XP)
                </button>
            </div>
        `;
    },

    submitEssay(earnedXp) {
        const text = document.getElementById('writingText').value.trim();
        if (text.length < 20) {
            alert("Insho juda qisqa! Kamida 20 ta belgi yozing.");
            return;
        }

        alert(`Barakalla! Insho topshirildi. Sizga +${earnedXp} XP berildi! 🎉`);
        if (typeof AntiCheat !== 'undefined') AntiCheat.logExercise('writing');
        if (typeof StudentGivedXP !== 'undefined') StudentGivedXP.addXP(earnedXp);
        this.init(this._containerId || 'app-container');
    }
};