const AdminDashboard = {
    async init() {
        const container = document.getElementById('dashboard-content');
        if (!container) return;

        const { data: groups } = await supabase.from('groups').select('*');

        container.innerHTML = `
            <div style="padding: 10px;">
                <h2 style="color: #00d2d3; margin-bottom: 20px;">⚡ Admin Operations Panel</h2>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px;">
                    <!-- 1. O'QUVCHI QO'SHISH -->
                    <div style="background: #121721; padding: 20px; border-radius: 10px; border: 1px solid #1e2638;">
                        <h3>🎓 Yangi O'quvchi Qo'shish</h3>
                        <input type="text" id="admStudentName" placeholder="F.I.SH" style="width:100%; padding:10px; margin:8px 0; background:#1a2130; border:1px solid #2e3a52; color:white; border-radius:6px;">
                        <input type="text" id="admStudentUser" placeholder="Login" style="width:100%; padding:10px; margin:8px 0; background:#1a2130; border:1px solid #2e3a52; color:white; border-radius:6px;">
                        <input type="password" id="admStudentPass" placeholder="Parol" style="width:100%; padding:10px; margin:8px 0; background:#1a2130; border:1px solid #2e3a52; color:white; border-radius:6px;">
                        <button onclick="AdminDashboard.addStudent()" style="width:100%; background:#2ed573; color:white; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer;">💾 O'quvchini Saqlash</button>
                    </div>

                    <!-- 2. GURUH YARATISH -->
                    <div style="background: #121721; padding: 20px; border-radius: 10px; border: 1px solid #1e2638;">
                        <h3>📚 Yangi Guruh Qo'shish</h3>
                        <input type="text" id="admGroupName" placeholder="Guruh Nomi" style="width:100%; padding:10px; margin:8px 0; background:#1a2130; border:1px solid #2e3a52; color:white; border-radius:6px;">
                        <button onclick="AdminDashboard.addGroup()" style="width:100%; background:#0984e3; color:white; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer; margin-top:55px;">💾 Guruhni Saqlash</button>
                    </div>
                </div>

                <!-- 3. DAVOMAT QILISH BO'LIMI -->
                <div style="background: #121721; padding: 20px; border-radius: 10px; border: 1px solid #1e2638;">
                    <h3>📋 Kunlik Davomat Belgilash</h3>
                    <select id="admGroupSelect" onchange="AdminDashboard.loadStudentsForAttendance()" style="width:100%; padding:10px; margin:10px 0; background:#1a2130; border:1px solid #2e3a52; color:white; border-radius:6px;">
                        <option value="">-- Guruhni Tanlang --</option>
                        ${groups && groups.length ? groups.map(g => `<option value="${g.id}">${g.name}</option>`).join('') : ''}
                    </select>
                    <div id="attendance-list" style="margin-top: 15px;"></div>
                </div>
            </div>
        `;
    },

    async addStudent() {
        const full_name = document.getElementById('admStudentName').value.trim();
        const username = document.getElementById('admStudentUser').value.trim();
        const password = document.getElementById('admStudentPass').value.trim();

        if (!username || !password) return alert("Login va parolni kiriting!");
        const { error } = await supabase.from('users').insert([{ full_name, username, password, role: 'Student', xp: 0 }]);
        if (error) alert("Xatolik: " + error.message);
        else { alert("✅ O'quvchi qo'shildi!"); this.init(); }
    },

    async addGroup() {
        const name = document.getElementById('admGroupName').value.trim();
        if (!name) return alert("Guruh nomini kiriting!");
        const { error } = await supabase.from('groups').insert([{ name }]);
        if (error) alert("Xatolik: " + error.message);
        else { alert("✅ Guruh qo'shildi!"); this.init(); }
    },

    async loadStudentsForAttendance() {
        const list = document.getElementById('attendance-list');
        const { data: students } = await supabase.from('users').select('*').eq('role', 'Student');
        
        list.innerHTML = `
            <table style="width:100%; color:white; border-collapse:collapse;">
                ${students && students.map(s => `
                    <tr style="border-bottom:1px solid #1a2130;">
                        <td style="padding:10px;">${s.full_name || s.username}</td>
                        <td style="padding:10px; text-align:right;">
                            <button onclick="this.style.background='#2ed573'" style="background:#1a2130; color:white; border:none; padding:6px 12px; border-radius:4px; cursor:pointer;">✅ Keldi</button>
                            <button onclick="this.style.background='#ff4757'" style="background:#1a2130; color:white; border:none; padding:6px 12px; border-radius:4px; cursor:pointer;">❌ Kelmadi</button>
                        </td>
                    </tr>
                `).join('')}
            </table>
        `;
    }
};