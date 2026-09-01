const WritingModule = {
    init() {
        const xpAmount = window.SystemStatus.isDevOnline ? 200 : 100;

        const container = document.getElementById('app-container');
        container.innerHTML = `
            <div style="background: white; padding: 25px; border-radius: 12px;">
                <h2>📝 Writing Practice Module</h2>
                <p style="margin-bottom: 15px; color: #636e72;">Mavzu: <strong>"Describe your favorite hobby and why you like it."</strong></p>

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
        StudentModule.init("O'quvchi", earnedXp);
    }
};