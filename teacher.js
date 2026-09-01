const TeacherDashboard = {
    init() {
        const container = document.getElementById('app-container');
        container.innerHTML = `
            <div style="background: white; padding: 25px; border-radius: 12px;">
                <h2>👨‍🏫 O'qituvchi Paneli</h2>
                <p style="margin: 10px 0; color: #636e72;">O'quvchilarning vazifalari va baholarini tekshirish.</p>
                
                <div style="margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                    <h4>Tekshirilmagan Insholar (Writing):</h4>
                    <p style="color: #b2bec3; margin-top: 10px;">Hozircha yangi insholar mavjud emas.</p>
                </div>
            </div>
        `;
    }
};