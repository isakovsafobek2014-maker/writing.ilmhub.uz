const TeacherDashboard = {
    init() {
        const container = document.getElementById('app-container');
        if (!container) return;

        container.innerHTML = `
            <div style="max-width: 1000px; margin: 20px auto; background: white; padding: 25px; border-radius: 12px; font-family: sans-serif; color: #1e293b; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08);">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div style="display:flex; align-items:center; gap:12px;">
                        ${typeof LogoComponent !== 'undefined' ? LogoComponent.render(40, false) : ''}
                        <h2 style="margin:0;">👨‍🏫 O'qituvchi Paneli</h2>
                    </div>
                    <div style="display:flex; gap:10px; align-items:center;">
                        <button onclick="StaffMessages.init(window.currentStaffUser, 'app-container')" style="padding:8px 16px; background:#2563eb; color:white; border:none; border-radius:8px; font-weight:bold; cursor:pointer;">💬 Xabarlar</button>
                        <button onclick="TeacherDashboard.logout()" style="padding:8px 16px; background:#ef4444; color:white; border:none; border-radius:8px; font-weight:bold; cursor:pointer;">🚪 Chiqish</button>
                    </div>
                </div>
                <p style="margin: 10px 0; color: #636e72;">O'quvchilarning vazifalari va baholarini tekshirish.</p>
                
                <div style="margin-top: 20px; padding: 20px; background: #f8fafc; border-radius: 10px; border: 1px solid #e2e8f0;">
                    <h3 style="margin: 0 0 6px;">✍️ O'quvchilarga insho mashqi berish</h3>
                    <p style="margin: 0 0 15px; color: #64748b; font-size: 13px;">Yozgan topshirig'ingiz barcha o'quvchilarning Writing bo'limida chiqadi.</p>

                    <div style="display:grid; grid-template-columns: 1fr 160px; gap:12px; margin-bottom:12px;">
                        <input id="teacher-writing-title" placeholder="Mavzu nomi (masalan: My Family)" style="padding:11px; border:1px solid #cbd5e1; border-radius:8px; box-sizing:border-box;" />
                        <select id="teacher-writing-level" style="padding:11px; border:1px solid #cbd5e1; border-radius:8px; background:white;">
                            <option value="A1">A1 — Beginner</option>
                            <option value="A2">A2 — Elementary</option>
                            <option value="B1" selected>B1 — Intermediate</option>
                            <option value="B2">B2 — Upper-Intermediate</option>
                            <option value="C1">C1 — Advanced</option>
                            <option value="C2">C2 — Proficiency</option>
                        </select>
                    </div>

                    <textarea id="teacher-writing-prompt" rows="5" placeholder="O'quvchi nima haqida insho yozsin? Masalan: Write 8 sentences about your family and describe your favourite person." style="width:100%; padding:12px; border:1px solid #cbd5e1; border-radius:8px; box-sizing:border-box; resize:vertical; font-family:sans-serif; margin-bottom:12px;"></textarea>
                    <button id="teacher-save-writing" style="width:100%; padding:12px; background:#16a34a; color:white; border:none; border-radius:8px; font-weight:bold; cursor:pointer;">📤 O'quvchilarga yuborish</button>
                </div>

                <div style="margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                    <h4>Tekshirilmagan Insholar (Writing):</h4>
                    <p style="color: #b2bec3; margin-top: 10px;">Hozircha yangi insholar mavjud emas.</p>
                </div>
            </div>
        `;

        document.getElementById('teacher-save-writing')?.addEventListener('click', () => this.saveWritingExercise());
    },

    async saveWritingExercise() {
        const titleInput = document.getElementById('teacher-writing-title');
        const promptInput = document.getElementById('teacher-writing-prompt');
        const levelInput = document.getElementById('teacher-writing-level');
        const title = titleInput?.value.trim();
        const prompt = promptInput?.value.trim();
        const level = levelInput?.value || 'B1';

        if (!title || !prompt) {
            alert("Mavzu nomi va insho topshirig'ini kiriting!");
            return;
        }

        if (typeof ContentBank === 'undefined' || typeof ContentBank.addContent !== 'function') {
            alert("❌ Xatolik: ContentBank yuklanmagan.");
            return;
        }

        const button = document.getElementById('teacher-save-writing');
        if (button) {
            button.disabled = true;
            button.innerText = '⏳ Saqlanmoqda...';
        }

        try {
            const saved = await ContentBank.addContent('writing', { level, title, prompt });
            if (saved === false) return;

            alert("✅ Insho mashqi o'quvchilarga yuborildi!");
            titleInput.value = '';
            promptInput.value = '';
        } finally {
            if (button) {
                button.disabled = false;
                button.innerText = "📤 O'quvchilarga yuborish";
            }
        }
    },

    logout() {
        if (typeof Auth !== 'undefined' && typeof Auth.logout === 'function') {
            Auth.logout();
            return;
        }
        window.location.reload();
    }
};