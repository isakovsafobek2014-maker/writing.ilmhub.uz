// js/dashboards/director.js

const DirectorDashboard = {
  activeTab: "groups", // 'groups', 'students', 'staff'

  init() {
    this.render();
  },

  render() {
    const container = document.getElementById("app-container");
    if (!container) return;

    const groups = JSON.parse(localStorage.getItem("ilmhub_groups") || "[]");
    const students = JSON.parse(localStorage.getItem("ilmhub_students") || "[]");
    const staff = JSON.parse(localStorage.getItem("ilmhub_staff_list") || "[]");

    container.innerHTML = `
      <div style="max-width: 1000px; margin: 20px auto; color: #1e293b; font-family: sans-serif;">
        
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; background: white; padding: 15px 20px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); margin-bottom: 20px;">
          <div>
            <h2 style="margin: 0; font-size: 20px; color: #0f172a;">🏛️ Director Panel</h2>
            <p style="margin: 4px 0 0 0; font-size: 12px; color: #64748b;">O'quv markaz boshqaruvi va avto-parol generatsiyasi</p>
          </div>
          <button id="dir-logout" style="padding: 8px 16px; background: #ef4444; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">
            🚪 Chiqish
          </button>
        </div>

        <!-- 3 TA ALOHIDA BO'LIM TABLARI -->
        <div style="display: flex; gap: 10px; margin-bottom: 20px;">
          <button id="dir-tab-groups" style="flex: 1; padding: 12px; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; background: ${this.activeTab === 'groups' ? '#2563eb' : 'white'}; color: ${this.activeTab === 'groups' ? 'white' : '#64748b'}; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
            📚 1-BO'LIM: Guruhlar (${groups.length})
          </button>
          <button id="dir-tab-students" style="flex: 1; padding: 12px; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; background: ${this.activeTab === 'students' ? '#2563eb' : 'white'}; color: ${this.activeTab === 'students' ? 'white' : '#64748b'}; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
            👨‍🎓 2-BO'LIM: O'quvchilar (${students.length})
          </button>
          <button id="dir-tab-staff" style="flex: 1; padding: 12px; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; background: ${this.activeTab === 'staff' ? '#2563eb' : 'white'}; color: ${this.activeTab === 'staff' ? 'white' : '#64748b'}; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
            👨‍💼 3-BO'LIM: Xodimlar (${staff.length})
          </button>
        </div>

        <!-- BO'LIM 1: GURUHLAR VA ETAPLAR -->
        ${this.activeTab === 'groups' ? `
          <div style="background: white; padding: 25px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
            <h3 style="margin-top: 0; font-size: 16px;">➕ Yangi Guruh Qo'shish</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 15px;">
              <input id="dir-group-name" placeholder="Guruh nomi (Masalan: IELTS 7+)" style="padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px;" />
              <select id="dir-group-stage" style="padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px;">
                <option value="Beginner (1-etap)">Beginner (1-etap)</option>
                <option value="Elementary (2-etap)">Elementary (2-etap)</option>
                <option value="Pre-Intermediate (3-etap)">Pre-Intermediate (3-etap)</option>
                <option value="Intermediate (4-etap)">Intermediate (4-etap)</option>
                <option value="IELTS Standard (5-etap)">IELTS Standard (5-etap)</option>
              </select>
            </div>
            <button id="dir-save-group" style="width: 100%; padding: 10px; background: #2563eb; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; margin-bottom: 20px;">
              Guruhni Saqlash
            </button>

            <h4 style="font-size: 14px; color: #475569;">Mavjud Guruhlar</h4>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              ${groups.length === 0 ? '<p style="color:#94a3b8; font-size: 13px;">Guruhlar yo\'q</p>' : groups.map(g => `
                <div style="background: #f8fafc; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;">
                  <strong>📌 ${g.name}</strong>
                  <div>
                    <span style="background: #dbeafe; color: #1e40af; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: bold; margin-right: 8px;">${g.stage}</span>
                    <button onclick="DirectorDashboard.deleteGroup(${g.id})" style="background:#ef4444; color:#fff; border:none; padding:4px 8px; border-radius:6px; cursor:pointer;">🗑️</button>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- BO'LIM 2: O'QUVCHI QO'SHISH VA AI PAROL-->
        ${this.activeTab === 'students' ? `
          <div style="background: white; padding: 25px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
            <h3 style="margin-top: 0; font-size: 16px;">👨‍🎓 O'quvchi Qo'shish (AI Parol Avto-Yaratiladi)</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 15px;">
              <input id="dir-stud-name" placeholder="O'quvchi F.I.Sh" style="padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px;" />
              <select id="dir-stud-group" style="padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px;">
                <option value="">Guruhni tanlang</option>
                ${groups.map(g => `<option value="${g.name}">${g.name}</option>`).join('')}
              </select>
            </div>
            <button id="dir-save-stud" style="width: 100%; padding: 10px; background: #2563eb; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; margin-bottom: 20px;">
              🔑 O'quvchini AI Parol Bilan Saqlash
            </button>

            <h4 style="font-size: 14px; color: #475569;">O'quvchilar Ro'yxati</h4>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              ${students.length === 0 ? '<p style="color:#94a3b8; font-size: 13px;">O\'quvchilar yo\'q</p>' : students.map(s => `
                <div style="background: #f8fafc; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;">
                  <div>
                    <div>👤 <strong>${s.name}</strong> (${s.group})</div>
                    <div style="font-size: 12px; color: #16a34a; margin-top: 4px;">
                      🔑 Login: <b>${s.username}</b> | Parol: <b>${s.password}</b>
                    </div>
                  </div>
                  <button onclick="DirectorDashboard.deleteStudent(${s.id})" style="background:#ef4444; color:#fff; border:none; padding:4px 8px; border-radius:6px; cursor:pointer;">🗑️</button>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- BO'LIM 3: XODIM QO'SHISH -->
        ${this.activeTab === 'staff' ? `
          <div style="background: white; padding: 25px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
            <h3 style="margin-top: 0; font-size: 16px;">👨‍💼 Xodimlarni Boshqarish (O'qituvchi/Admin)</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 15px;">
              <input id="dir-staff-name" placeholder="F.I.Sh" style="padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px;" />
              <select id="dir-staff-role" style="padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px;">
                <option value="Teacher">O'qituvchi</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            <button id="dir-save-staff" style="width: 100%; padding: 10px; background: #2563eb; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; margin-bottom: 20px;">
              Xodimni Saqlash
            </button>

            <h4 style="font-size: 14px; color: #475569;">Xodimlar Ro'yxati</h4>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              ${staff.length === 0 ? '<p style="color:#94a3b8; font-size: 13px;">Xodimlar yo\'q</p>' : staff.map(st => `
                <div style="background: #f8fafc; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;">
                  <div>
                    <b>${st.name}</b> (${st.role})
                    <div style="font-size: 12px; color: #2563eb; margin-top: 2px;">🔑 Parol: ${st.password}</div>
                  </div>
                  <button onclick="DirectorDashboard.deleteStaff(${st.id})" style="background:#ef4444; color:#fff; border:none; padding:4px 8px; border-radius:6px; cursor:pointer;">🗑️</button>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

      </div>
    `;

    this.bindEvents();
  },

  bindEvents() {
    document.getElementById("dir-logout")?.addEventListener("click", () => location.reload());

    document.getElementById("dir-tab-groups")?.addEventListener("click", () => { this.activeTab = "groups"; this.render(); });
    document.getElementById("dir-tab-students")?.addEventListener("click", () => { this.activeTab = "students"; this.render(); });
    document.getElementById("dir-tab-staff")?.addEventListener("click", () => { this.activeTab = "staff"; this.render(); });

    // Guruh saqlash
    document.getElementById("dir-save-group")?.addEventListener("click", () => {
      const name = document.getElementById("dir-group-name").value.trim();
      const stage = document.getElementById("dir-group-stage").value;
      if (!name) return alert("Guruh nomini kiriting!");

      const list = JSON.parse(localStorage.getItem("ilmhub_groups") || "[]");
      list.unshift({ id: Date.now(), name, stage });
      localStorage.setItem("ilmhub_groups", JSON.stringify(list));
      this.render();
    });

    // O'quvchi saqlash (AI PAROL GENERATSIYASI BILAN)
    document.getElementById("dir-save-stud")?.addEventListener("click", () => {
      const name = document.getElementById("dir-stud-name").value.trim();
      const group = document.getElementById("dir-stud-group").value;
      if (!name || !group) return alert("O'quvchi ismi va guruhini tanlang!");

      // ai.givedpass.js dan foydalanib parol yaratamiz
      const generatedPassword = typeof AIGivedPass !== 'undefined' 
        ? AIGivedPass.generateStudentPassword(name) 
        : "st#" + Math.floor(1000 + Math.random() * 9000);

      const username = name.toLowerCase().replace(/\s+/g, '_');

      const list = JSON.parse(localStorage.getItem("ilmhub_students") || "[]");
      const newStudent = { id: Date.now(), name, group, username, password: generatedPassword, xp: 0 };
      list.unshift(newStudent);

      localStorage.setItem("ilmhub_students", JSON.stringify(list));
      alert(`O'quvchi qo'shildi!\nUsername: ${username}\nParol: ${generatedPassword}`);
      this.render();
    });

    // Xodim saqlash
    document.getElementById("dir-save-staff")?.addEventListener("click", () => {
      const name = document.getElementById("dir-staff-name").value.trim();
      const role = document.getElementById("dir-staff-role").value;
      if (!name) return alert("Xodim F.I.Sh ni kiriting!");

      const generatedPassword = typeof AIGivedPass !== 'undefined' 
        ? AIGivedPass.generateStudentPassword(name) 
        : "staff#" + Math.floor(1000 + Math.random() * 9000);

      const list = JSON.parse(localStorage.getItem("ilmhub_staff_list") || "[]");
      list.unshift({ id: Date.now(), name, role, password: generatedPassword });
      localStorage.setItem("ilmhub_staff_list", JSON.stringify(list));
      
      alert(`Xodim saqlandi!\nParol: ${generatedPassword}`);
      this.render();
    });
  },

  // O'chirish funksiyalari
  deleteGroup(id) {
    let list = JSON.parse(localStorage.getItem("ilmhub_groups") || "[]");
    list = list.filter(item => item.id !== id);
    localStorage.setItem("ilmhub_groups", JSON.stringify(list));
    this.render();
  },

  deleteStudent(id) {
    let list = JSON.parse(localStorage.getItem("ilmhub_students") || "[]");
    list = list.filter(item => item.id !== id);
    localStorage.setItem("ilmhub_students", JSON.stringify(list));
    this.render();
  },

  deleteStaff(id) {
    let list = JSON.parse(localStorage.getItem("ilmhub_staff_list") || "[]");
    list = list.filter(item => item.id !== id);
    localStorage.setItem("ilmhub_staff_list", JSON.stringify(list));
    this.render();
  }
};