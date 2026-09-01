const StudentDashboard = {
    init() {
        const container = document.getElementById('dashboard-content');
        if (!container) return;

        const user = App.currentUser || { name: "Mehmon", role: "guest" };

        container.innerHTML = `
            <div style="padding: 10px;">
                <div style="background: linear-gradient(135deg, #0984e3, #6c5ce7); padding: 20px; border-radius: 12px; margin-bottom: 25px; color: white;">
                    <h2 style="margin: 0;">Xush kelibsiz, ${user.name}! 👋</h2>
                    <p style="margin-top: 5px; opacity: 0.8;">${user.role === 'guest' ? 'Mehmon rejimidassiz. Mashqlarni bajarib ko\'ring!' : `XP Ballaringiz: ${user.xp || 0}`}</p>
                </div>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                    <div onclick="WritingModule.init()" style="background: #121721; padding: 20px; border-radius: 10px; border: 1px solid #1e2638; cursor: pointer; text-align: center;">
                        <div style="font-size: 36px;">✍️</div>
                        <h3 style="color: #fff; margin: 10px 0 5px 0;">Writing</h3>
                        <span style="color: #808e9b; font-size: 12px;">Insho & Tayping</span>
                    </div>

                    <div onclick="SpeakingModule.init()" style="background: #121721; padding: 20px; border-radius: 10px; border: 1px solid #1e2638; cursor: pointer; text-align: center;">
                        <div style="font-size: 36px;">🗣️</div>
                        <h3 style="color: #fff; margin: 10px 0 5px 0;">Speaking</h3>
                        <span style="color: #808e9b; font-size: 12px;">Ovozli topshiriqlar</span>
                    </div>

                    <div onclick="ReadingModule.init()" style="background: #121721; padding: 20px; border-radius: 10px; border: 1px solid #1e2638; cursor: pointer; text-align: center;">
                        <div style="font-size: 36px;">📖</div>
                        <h3 style="color: #fff; margin: 10px 0 5px 0;">Reading</h3>
                        <span style="color: #808e9b; font-size: 12px;">Matn va Savollar</span>
                    </div>

                    <div onclick="ListeningModule.init()" style="background: #121721; padding: 20px; border-radius: 10px; border: 1px solid #1e2638; cursor: pointer; text-align: center;">
                        <div style="font-size: 36px;">🎧</div>
                        <h3 style="color: #fff; margin: 10px 0 5px 0;">Listening</h3>
                        <span style="color: #808e9b; font-size: 12px;">Audio topshiriqlar</span>
                    </div>
                </div>
            </div>
        `;
    }
};