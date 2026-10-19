const ReadingModule = {
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
            ? await ContentBank.getReadingItem(currentUser)
            : { title: "The Smart Little Dog", text: "Max is a small brown dog...", question: "Savol", options: [{t:"A", correct:true},{t:"B", correct:false}] };

        const item = this.currentItem;

        container.innerHTML = `
            <div style="background: white; padding: 25px; border-radius: 12px;">
                <h2>📖 Reading Practice</h2>
                
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 15px 0; line-height: 1.6;">
                    <h3>${item.title}</h3>
                    <p>${item.text}</p>
                </div>

                <div style="margin-bottom: 20px;">
                    <p style="font-weight: bold; margin-bottom: 10px;">Savol: ${item.question}</p>
                    ${item.options.map((opt, idx) => `
                        <label style="display: block; margin: 5px 0;">
                            <input type="radio" name="q1" value="${idx}"> ${String.fromCharCode(65 + idx)}) ${opt.t}
                        </label>
                    `).join('')}
                </div>

                <button onclick="ReadingModule.submitAnswer(${xpAmount})" class="modal-btn btn-success">
                    Javobni Tekshirish (+${xpAmount} XP)
                </button>
            </div>
        `;
    },

    submitAnswer(xp) {
        const selected = document.querySelector('input[name="q1"]:checked');
        if (!selected) {
            alert("Iltimos, javoblardan birini tanlang!");
            return;
        }

        const chosenOption = this.currentItem.options[parseInt(selected.value)];

        if (chosenOption && chosenOption.correct) {
            alert(`To'g'ri javob! 🎉 Sizga +${xp} XP berildi!`);
            if (typeof AntiCheat !== 'undefined') AntiCheat.logExercise('reading');
            if (typeof StudentGivedXP !== 'undefined') StudentGivedXP.addXP(xp);
            this.init(this._containerId || 'app-container');
        } else {
            alert("Noto'g'ri javob, yana bir bor matnni o'qib ko'ring.");
        }
    }
};