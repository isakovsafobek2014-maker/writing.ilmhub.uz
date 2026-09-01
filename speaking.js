const SpeakingModule = {
    init() {
        const container = document.getElementById('app-container');
        container.innerHTML = `
            <div style="background: white; padding: 25px; border-radius: 12px; text-align: center;">
                <h2>🎙️ Speaking Practice</h2>
                <p style="margin: 15px 0;">Ovozli topshiriqni mikrofon orqali yozib oling:</p>

                <button onclick="alert('Mikrofon ruxsati so\'ralmoqda...')" class="modal-btn btn-primary" style="width: auto; padding: 12px 30px; font-size: 18px;">
                    🔴 Ovoz Yozishni Boshlash
                </button>
            </div>
        `;
    }
};