const AIAssistantModule = {
    init() {
        const container = document.getElementById('app-container');
        container.innerHTML = `
            <div style="background: white; padding: 25px; border-radius: 12px;">
                <h2>🤖 AI English Tutor</h2>
                <div id="chatBox" style="height: 200px; border: 1px solid #dfe6e9; border-radius: 8px; padding: 15px; overflow-y: auto; margin: 15px 0;">
                    <p><strong>AI:</strong> Hello! How can I help you with your English today?</p>
                </div>
                <div style="display: flex; gap: 10px;">
                    <input type="text" id="aiQuery" class="modal-input" placeholder="Savolingizni yozing..." style="margin: 0;">
                    <button onclick="AIAssistantModule.send()" class="modal-btn btn-primary" style="width: auto; margin: 0; padding: 0 20px;">Yuborish</button>
                </div>
            </div>
        `;
    },

    send() {
        const input = document.getElementById('aiQuery');
        const chat = document.getElementById('chatBox');
        if (input.value.trim()) {
            chat.innerHTML += `<p style="margin-top: 10px;"><strong>Siz:</strong> ${input.value}</p>`;
            chat.innerHTML += `<p style="color: #0984e3;"><strong>AI:</strong> That's a great sentence! Keep practicing!</p>`;
            input.value = '';
            chat.scrollTop = chat.scrollHeight;
        }
    }
};