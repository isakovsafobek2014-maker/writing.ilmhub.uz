const ReadingModule = {
    init() {
        const xpAmount = window.SystemStatus.isDevOnline ? 200 : 100;
        const container = document.getElementById('app-container');

        container.innerHTML = `
            <div style="background: white; padding: 25px; border-radius: 12px;">
                <h2>📖 Reading Practice</h2>
                
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 15px 0; line-height: 1.6;">
                    <h3>The Smart Little Dog</h3>
                    <p>Max is a small brown dog. He lives in a big house with his best friend, Tim. Every morning, Max brings the newspaper to Tim. Tim gives Max a delicious biscuit. Today, Max found a blue ball in the garden and played all day.</p>
                </div>

                <div style="margin-bottom: 20px;">
                    <p style="font-weight: bold; margin-bottom: 10px;">Savol: Max bog'dan nima topib oldi?</p>
                    <label style="display: block; margin: 5px 0;"><input type="radio" name="q1" value="A"> A) Qizil koptok</label>
                    <label style="display: block; margin: 5px 0;"><input type="radio" name="q1" value="B"> B) Ko'k koptok (Blue ball)</label>
                    <label style="display: block; margin: 5px 0;"><input type="radio" name="q1" value="C"> C) Gazeta</label>
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

        if (selected.value === 'B') {
            alert(`To'g'ri javob! 🎉 Sizga +${xp} XP berildi!`);
            StudentModule.init("O'quvchi", xp);
        } else {
            alert("Noto'g me'yoriy javob, yana bir bor matnni o'qib ko'ring.");
        }
    }
};