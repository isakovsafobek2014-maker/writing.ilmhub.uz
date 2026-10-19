const VocabularyModule = {
    currentItem: null,

    async init() {
        const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
        const xpAmount = window.SystemStatus.isDevOnline ? 200 : 100;
        const container = document.getElementById('app-container');

        this.currentItem = typeof ContentBank !== 'undefined'
            ? await ContentBank.getVocabularyItem(currentUser)
            : { word: "AMBITIOUS", options: ["Maqsadli / Intiluvchan", "Dangasa", "G'azabdor", "Quvnoq"], correctIndex: 0 };

        const item = this.currentItem;
        const letters = ['A', 'B', 'C', 'D'];

        container.innerHTML = `
            <div style="background: white; padding: 25px; border-radius: 12px; text-align: center;">
                <h2>🔤 Vocabulary Builder</h2>
                
                <div style="margin: 30px 0; padding: 20px; background: #fdcb6e; color: #d63031; border-radius: 12px; font-size: 28px; font-weight: bold;">
                    ${item.word}
                </div>

                <p style="font-size: 18px; margin-bottom: 20px;">Ushbu so'zning o'zbekcha tarjimasi qaysi?</p>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; max-width: 400px; margin: 0 auto;">
                    ${item.options.map((opt, idx) => `
                        <button onclick="VocabularyModule.check(${idx}, ${xpAmount})" class="modal-btn btn-primary">${letters[idx]}) ${opt}</button>
                    `).join('')}
                </div>
            </div>
        `;
    },

    check(idx, xp) {
        if (idx === this.currentItem.correctIndex) {
            alert(`To'g'ri! "${this.currentItem.word}" - ${this.currentItem.options[this.currentItem.correctIndex]} degani. +${xp} XP! ✨`);
            if (typeof AntiCheat !== 'undefined') AntiCheat.logExercise('vocabulary');
            StudentModule.init("O'quvchi", xp);
        } else {
            alert("Noto'g'ri, qaytadan urinib ko'ring!");
        }
    }
};