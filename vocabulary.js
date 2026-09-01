const VocabularyModule = {
    init() {
        const xpAmount = window.SystemStatus.isDevOnline ? 200 : 100;
        const container = document.getElementById('app-container');

        container.innerHTML = `
            <div style="background: white; padding: 25px; border-radius: 12px; text-align: center;">
                <h2>🔤 Vocabulary Builder</h2>
                
                <div style="margin: 30px 0; padding: 20px; background: #fdcb6e; color: #d63031; border-radius: 12px; font-size: 28px; font-weight: bold;">
                    AMBITIOUS
                </div>

                <p style="font-size: 18px; margin-bottom: 20px;">Ushbu so'zning o'zbekcha tarjimasi qaysi?</p>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; max-width: 400px; margin: 0 auto;">
                    <button onclick="VocabularyModule.check('A', ${xpAmount})" class="modal-btn btn-primary">A) Maqsadli / Intiluvchan</button>
                    <button onclick="VocabularyModule.check('B', ${xpAmount})" class="modal-btn btn-primary">B) Dangasa</button>
                    <button onclick="VocabularyModule.check('C', ${xpAmount})" class="modal-btn btn-primary">C) G'azabdor</button>
                    <button onclick="VocabularyModule.check('D', ${xpAmount})" class="modal-btn btn-primary">D) Quvnoq</button>
                </div>
            </div>
        `;
    },

    check(option, xp) {
        if (option === 'A') {
            alert(`To'g'ri! "Ambitious" - Intiluvchan degani. +${xp} XP! ✨`);
            StudentModule.init("O'quvchi", xp);
        } else {
            alert("Noto'g'ri, qaytadan urinib ko'ring!");
        }
    }
};