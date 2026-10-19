// js/dashboards/director.js

const DirectorDashboard = {
  activeTab: "groups", // 'groups', 'students', 'staff'

  init() {
    this.render();
  },

  openMessagesSafe() {
    try {
      if (typeof StaffMessages === 'undefined') {
        alert("❌ XATOLIK: StaffMessages moduli yuklanmagan.\n\nindex.html'da shu qator borligini tekshiring:\n<script src=\"js/dashboards/staff-messages.js\"></script>");
        return;
      }
      if (!window.currentStaffUser) {
        alert("❌ XATOLIK: window.currentStaffUser topilmadi.\n\nlogin-modals.js eng oxirgi versiya bilan almashtirilganini tekshiring.");
        return;
      }
      StaffMessages.init(window.currentStaffUser, 'app-container');
    } catch (err) {
      alert("❌ XATOLIK (Messages ochishda): " + err.message + "\n\n" + (err.stack || ""));
    }
  },

  async render() {
    const container = document.getElementById("app-container");
    if (!container) return;

    const groups = JSON.parse(localStorage.getItem("ilmhub_groups") || "[]");
    const staff = JSON.parse(localStorage.getItem("ilmhub_staff_list") || "[]");

    const students = [];

    container.innerHTML = `
      <div style="max-width: 1000px; margin: 20px auto; color: #1e293b; font-family: sans-serif;">
        
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; background: white; padding: 15px 20px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); margin-bottom: 20px;">
          <div style="display:flex; align-items:center; gap:12px;">
            ${typeof LogoComponent !== 'undefined' ? LogoComponent.render(40, false) : ''}
            <div>
              <h2 style="margin: 0; font-size: 20px; color: #0f172a;">🏛️ Director Panel</h2>
              <p style="margin: 4px 0 0 0; font-size: 12px; color: #64748b;">O'quv markaz boshqaruvi va avto-parol generatsiyasi</p>
            </div>
          </div>
          <div style="display:flex; gap:10px;">
            <button id="dir-messages" style="padding: 8px 16px; background: #2563eb; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">
              💬 Xabarlar
            </button>
            <button id="dir-logout" style="padding: 8px 16px; background: #ef4444; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">
              🚪 Chiqish
            </button>
          </div>
        </div>

        <!-- 3 TA ALOHIDA BO'LIM TABLARI -->
        <div style="display: flex; gap: 10px; margin-bottom: 20px;">
          <button id="dir-tab-groups" style="flex: 1; padding: 12px; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; background: ${this.activeTab === 'groups' ? '#2563eb' : 'white'}; color: ${this.activeTab === 'groups' ? 'white' : '#64748b'}; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
            📚 1-BO'LIM: Guruhlar (${groups.length})
          </button>
          <button id="dir-tab-students" style="flex: 1; padding: 12px; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; background: ${this.activeTab === 'students' ? '#2563eb' : 'white'}; color: ${this.activeTab === 'students' ? 'white' : '#64748b'}; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
            👨‍🎓 2-BO'LIM: O'quvchilar <span id="dir-student-count">...</span>
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
                <option value="A1">A1 — Beginner</option>
                <option value="A2">A2 — Elementary</option>
                <option value="B1">B1 — Intermediate</option>
                <option value="B2">B2 — Upper-Intermediate</option>
                <option value="C1">C1 — Advanced</option>
                <option value="C2">C2 — Proficiency</option>
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
                    <button onclick="DirectorDashboard.deleteGroup(${JSON.stringify(String(g.id))})" style="background:#ef4444; color:#fff; border:none; padding:4px 8px; border-radius:6px; cursor:pointer;">🗑️</button>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- BO'LIM 2: O'QUVCHI QO'SHISH VA AI PAROL (SUPABASE) -->
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
            <div id="dir-student-list" style="display: flex; flex-direction: column; gap: 8px;">
              ${students.length === 0 ? '<p style="color:#94a3b8; font-size: 13px;">Yuklanmoqda...</p>' : students.map(s => `
                <div style="background: #f8fafc; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;">
                  <div>
                    <div>👤 <strong>${s.full_name}</strong> (${s.group_name || 'Guruhsiz'}) ${s.banned ? '<span style="background:#ef4444;color:white;padding:2px 8px;border-radius:10px;font-size:11px;margin-left:6px;">BAN</span>' : ''}</div>
                    <div style="font-size: 12px; color: #16a34a; margin-top: 4px;">
                      🔑 Login: <b>${s.username}</b> | Parol: <b>${s.password}</b>
                    </div>
                  </div>
                  <button onclick="DirectorDashboard.deleteStudent(${JSON.stringify(String(s.id))})" style="background:#ef4444; color:#fff; border:none; padding:4px 8px; border-radius:6px; cursor:pointer;">🗑️</button>
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
                  <button onclick="DirectorDashboard.deleteStaff(${JSON.stringify(String(st.id))})" style="background:#ef4444; color:#fff; border:none; padding:4px 8px; border-radius:6px; cursor:pointer;">🗑️</button>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

      </div>
    `;

    this.bindEvents();
    if (this.activeTab === "students") this.loadStudents();
  },

  async loadStudents() {
    const list = document.getElementById("dir-student-list");
    const count = document.getElementById("dir-student-count");
    if (!list || !count) return;
    if (typeof supabase === 'undefined') {
      this.renderStudentList(this.getLocalStudents(), list, count, "Supabase ulanmagan.");
      console.error("DirectorDashboard: Supabase mavjud emas.");
      return;
    }

    let result;
    try {
      result = await supabase.from("users").select("*").eq("role", "Student");
    } catch (error) {
      console.error("O'quvchilarni yuklashda kutilmagan xatolik:", error);
      if (list.isConnected) {
        this.renderStudentList(this.getLocalStudents(), list, count, "Supabase'ga ulanib bo'lmadi.");
      }
      return;
    }

    if (result.error) {
      console.error("O'quvchilarni yuklashda xatolik:", result.error.message);
      if (list.isConnected) {
        this.renderStudentList(this.getLocalStudents(), list, count, "Supabase o'quvchilarini yuklab bo'lmadi.");
      }
      return;
    }

    if (!list.isConnected || !count.isConnected) return;
    const localStudents = this.getLocalStudents();
    const knownUsernames = new Set((result.data || []).map(student => student.username));
    const students = [
      ...(result.data || []),
      ...localStudents.filter(student => !knownUsernames.has(student.username))
    ];
    this.renderStudentList(students, list, count);
  },

  getLocalStudents() {
    return JSON.parse(localStorage.getItem("ilmhub_students") || "[]").map(student => ({
      ...student,
      full_name: student.full_name || student.name,
      group_name: student.group_name || student.group,
      is_banned: student.is_banned || student.banned
    }));
  },

  saveLocalStudent(name, username, password, group) {
    const students = JSON.parse(localStorage.getItem("ilmhub_students") || "[]");
    const student = {
      id: Date.now(),
      name,
      full_name: name,
      username,
      password,
      role: "Student",
      group,
      group_name: group,
      xp: 0,
      banned: false
    };
    students.unshift(student);
    localStorage.setItem("ilmhub_students", JSON.stringify(students));
    return student;
  },

  renderStudentList(students, list, count, warning) {
    if (!list.isConnected || !count.isConnected) return;
    count.textContent = `(${students.length})`;
    list.innerHTML = students.length === 0
      ? `<p style='color:${warning ? '#ef4444' : '#94a3b8'}; font-size: 13px;'>${warning || "O'quvchilar yo'q"}</p>`
      : `${warning ? `<p style="color:#b45309; font-size: 13px;">${warning} Faqat shu qurilmada saqlangan o'quvchilar ko'rsatilmoqda.</p>` : ''}${students.map(student => `
          <div style="background: #f8fafc; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;">
            <div>
              <div>👤 <strong>${student.full_name || student.name}</strong> (${student.group_name || student.group || 'Guruhsiz'}) ${(student.is_banned || student.banned) ? '<span style="background:#ef4444;color:white;padding:2px 8px;border-radius:10px;font-size:11px;margin-left:6px;">BAN</span>' : ''}</div>
              <div style="font-size: 12px; color: #16a34a; margin-top: 4px;">
                🔑 Login: <b>${student.username}</b> | Parol: <b>${student.password}</b>
              </div>
            </div>
            <button onclick="DirectorDashboard.deleteStudent(${JSON.stringify(String(student.id))})" style="background:#ef4444; color:#fff; border:none; padding:4px 8px; border-radius:6px; cursor:pointer;">🗑️</button>
          </div>
        `).join('')}`;
  },

  bindEvents() {
    document.getElementById("dir-logout")?.addEventListener("click", () => {
      if (typeof Auth !== "undefined" && typeof Auth.logout === "function") Auth.logout();
      else location.reload();
    });
    document.getElementById("dir-messages")?.addEventListener("click", () => this.openMessagesSafe());

    document.getElementById("dir-tab-groups")?.addEventListener("click", () => { this.activeTab = "groups"; this.render(); });
    document.getElementById("dir-tab-students")?.addEventListener("click", () => { this.activeTab = "students"; this.render(); });
    document.getElementById("dir-tab-staff")?.addEventListener("click", () => { this.activeTab = "staff"; this.render(); });

    // Guruh saqlash (hozircha localStorage'da qoladi)
    document.getElementById("dir-save-group")?.addEventListener("click", () => {
      const name = document.getElementById("dir-group-name").value.trim();
      const stage = document.getElementById("dir-group-stage").value;
      if (!name) return alert("Guruh nomini kiriting!");

      const list = JSON.parse(localStorage.getItem("ilmhub_groups") || "[]");
      list.unshift({ id: Date.now(), name, stage });
      localStorage.setItem("ilmhub_groups", JSON.stringify(list));
      this.render();
    });

    // O'quvchi saqlash -> ENDI SUPABASE'GA YOZILADI
    document.getElementById("dir-save-stud")?.addEventListener("click", async () => {
      const name = document.getElementById("dir-stud-name").value.trim();
      const group = document.getElementById("dir-stud-group").value;
      if (!name || !group) return alert("O'quvchi ismi va guruhini tanlang!");
      const saveButton = document.getElementById("dir-save-stud");
      if (!saveButton || saveButton.disabled) return;
      saveButton.disabled = true;
      saveButton.textContent = "Saqlanmoqda...";

      const generatedPassword = typeof AIGivedPass !== 'undefined'
        ? AIGivedPass.generateStudentPassword(name)
        : "st#" + Math.floor(1000 + Math.random() * 9000);

      const username = name.toLowerCase().replace(/\s+/g, '_');

      if (typeof supabase === 'undefined') {
        saveButton.disabled = false;
        saveButton.textContent = "🔑 O'quvchini AI Parol Bilan Saqlash";
        alert("❌ Xatolik: Supabase ulanmagan.");
        return;
      }

      let result;
      try {
        result = await supabase.from("users").insert([{
          full_name: name,
          username: username,
          password: generatedPassword,
          role: "Student",
          group_name: group,
          xp: 0
        }]);
      } catch (error) {
        console.error("O'quvchini Supabase'ga saqlashda xatolik:", error);
        if (error instanceof TypeError && /fetch/i.test(error.message)) {
          this.saveLocalStudent(name, username, generatedPassword, group);
          alert(`⚠️ Supabase serveriga ulanilmadi. O'quvchi vaqtincha faqat shu qurilmada saqlandi.\n\nUsername: ${username}\nParol: ${generatedPassword}\n\nBoshqa qurilmalardan kirish uchun Supabase URL'ni tuzatish kerak.`);
          this.render();
          return;
        }
        alert("❌ O'quvchini saqlab bo'lmadi: " + error.message);
        saveButton.disabled = false;
        saveButton.textContent = "🔑 O'quvchini AI Parol Bilan Saqlash";
        return;
      }

      if (result.error) {
        console.error("O'quvchini Supabase'ga saqlashda xatolik:", result.error.message);
        alert("❌ O'quvchini saqlab bo'lmadi: " + result.error.message);
        saveButton.disabled = false;
        saveButton.textContent = "🔑 O'quvchini AI Parol Bilan Saqlash";
        return;
      }

      alert(`O'quvchi qo'shildi!\nUsername: ${username}\nParol: ${generatedPassword}`);
      this.render();
    });

    // Xodim saqlash (hozircha localStorage'da qoladi)
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
  async deleteGroup(id) {
    const groups = JSON.parse(localStorage.getItem("ilmhub_groups") || "[]");
    const group = groups.find(item => String(item.id) === String(id));
    if (!group) {
      alert("Guruh topilmadi yoki allaqachon o'chirilgan.");
      return;
    }
    if (!confirm(`"${group.name}" guruhini va unga biriktirilgan barcha o'quvchilar hamda XP/natijalarni butunlay o'chirasizmi? Bu amalni qaytarib bo'lmaydi.`)) return;

    if (typeof supabase !== "undefined") {
      let deletion;
      try {
        deletion = await supabase.rpc("delete_students_in_group", { p_group_name: group.name });
      } catch (error) {
        console.error("Guruh o'quvchilarini o'chirishda ulanish xatoligi:", error);
        alert("❌ Guruh o'chirilmadi: Supabase serveriga ulanishda xatolik.");
        return;
      }
      if (deletion.error) {
        console.error("Guruh o'quvchilarini o'chirishda xatolik:", deletion.error.message);
        alert("❌ Guruh o'chirilmadi: " + deletion.error.message);
        return;
      }

      let verification;
      try {
        verification = await supabase.from("users")
          .select("id")
          .eq("role", "Student")
          .eq("group_name", group.name)
          .limit(1);
      } catch (error) {
        console.error("Guruhdagi o'quvchilar o'chirilganini tekshirishda xatolik:", error);
        alert("Guruhdagi o'quvchilar o'chirilgani tekshirilmadi. Guruh saqlab qolindi.");
        return;
      }
      if (verification.error || (verification.data && verification.data.length > 0)) {
        console.error("Guruhdagi barcha o'quvchilarni o'chirib bo'lmadi:", verification.error?.message);
        alert("❌ Guruh o'chirilmadi. O'quvchilar bazada qolgan; Supabase users jadvali uchun DELETE RLS ruxsatini tekshiring.");
        return;
      }
    }

    const localStudents = JSON.parse(localStorage.getItem("ilmhub_students") || "[]");
    localStorage.setItem("ilmhub_students", JSON.stringify(
      localStudents.filter(student => (student.group_name || student.group) !== group.name)
    ));
    localStorage.setItem("ilmhub_groups", JSON.stringify(
      groups.filter(item => String(item.id) !== String(id))
    ));
    alert("Guruh, unga biriktirilgan o'quvchilar va ularning XP ma'lumotlari o'chirildi.");
    this.render();
  },

  async deleteStudent(id) {
    if (!confirm("Bu o'quvchini va unga tegishli XP/natijalarni butunlay o'chirishni tasdiqlaysizmi?")) return;

    const localStudents = JSON.parse(localStorage.getItem("ilmhub_students") || "[]");
    const remainingLocalStudents = localStudents.filter(student => String(student.id) !== String(id));
    if (remainingLocalStudents.length !== localStudents.length &&
        !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(id))) {
      localStorage.setItem("ilmhub_students", JSON.stringify(remainingLocalStudents));
      alert("Shu qurilmada saqlangan o'quvchi va uning XP ma'lumoti o'chirildi.");
      this.render();
      return;
    }

    if (typeof supabase === 'undefined') {
      alert("❌ Xatolik: Supabase ulanmagan.");
      return;
    }

    let deletion;
    try {
      deletion = await supabase.rpc("delete_student_account", { p_student_id: id });
    } catch (error) {
      console.error("O'quvchini o'chirishda ulanish xatoligi:", error);
      alert("❌ O'quvchini o'chirib bo'lmadi: Supabase serveriga ulanishda xatolik.");
      return;
    }

    if (deletion.error) {
      console.error("O'quvchini o'chirishda Supabase xatoligi:", deletion.error.message);
      alert("❌ O'quvchini o'chirishda xatolik: " + deletion.error.message);
      return;
    }

    let verification;
    try {
      verification = await supabase.from("users").select("id").eq("id", id).eq("role", "Student").maybeSingle();
    } catch (error) {
      console.error("O'quvchi o'chirilganini tekshirishda xatolik:", error);
      alert("O'chirish so'rovi yuborildi, lekin natijani tekshirib bo'lmadi. Supabase RLS siyosatlarini tekshiring.");
      return;
    }

    if (verification.error) {
      console.error("O'quvchi o'chirilganini tekshirishda Supabase xatoligi:", verification.error.message);
      alert("O'chirish so'rovi yuborildi, lekin natijani tekshirib bo'lmadi: " + verification.error.message);
      return;
    }

    if (verification.data) {
      alert("O'quvchi bazada qolib ketdi. staff-auth-setup.sql o'rnatilgani va unga bog'liq jadvallarni tekshiring.");
      return;
    }

    if (remainingLocalStudents.length !== localStudents.length) {
      localStorage.setItem("ilmhub_students", JSON.stringify(remainingLocalStudents));
    }

    alert("O'quvchi va unga bog'langan XP/natijalar butunlay o'chirildi.");
    this.render();
  },

  deleteStaff(id) {
    let list = JSON.parse(localStorage.getItem("ilmhub_staff_list") || "[]");
    if (!confirm("Bu xodimni o'chirishni tasdiqlaysizmi?")) return;
    const oldLength = list.length;
    list = list.filter(item => String(item.id) !== String(id));
    localStorage.setItem("ilmhub_staff_list", JSON.stringify(list));
    if (list.length === oldLength) {
      alert("Xodim topilmadi yoki allaqachon o'chirilgan.");
      return;
    }
    alert("Xodim o'chirildi.");
    this.render();
  }
};
window.DirectorDashboard=DirectorDashboard;