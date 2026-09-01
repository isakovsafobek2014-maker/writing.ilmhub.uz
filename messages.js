const MessagesModule = {
    init() {
        const container = document.getElementById('app-container');
        container.innerHTML = `
            <div style="background: white; padding: 25px; border-radius: 12px;">
                <h2>💬 Xabarlar</h2>
                <p style="color: #b2bec3; margin-top: 15px;">Hozircha sizda yangi bildirishnomalar yo'q.</p>
            </div>
        `;
    }
};