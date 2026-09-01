// js/models/login-modals.js

const LoginModals = {
  // Barcha modallar uchun umumiy Logo va Brending
  getHeaderHTML() {
    const svgLogo = `
      <svg width="64" height="64" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style="border-radius: 12px; box-shadow: 0 4px 10px rgba(37, 99, 235, 0.25);">
        <rect width="100" height="100" rx="20" fill="#0052CC"/>
        <path d="M 25 60 C 25 35, 75 35, 75 60" stroke="#FFFFFF" stroke-width="10" stroke-linecap="round" fill="none"/>
        <path d="M 25 65 L 75 65 L 50 75 Z" fill="#FFFFFF"/>
        <polygon points="50,42 55,50 50,58 45,50" fill="#FFC700"/>
      </svg>
    `;

    return `
      <div style="text-align: center; margin-bottom: 20px;">
        <div style="display: flex; justify-content: center; align-items: center;">
          <img src="images/logo.png" alt="IlmHub Logo" 
               onerror="this.onerror=null; this.style.display='none'; this.nextElementSibling.style.display='block';" 
               style="width: 64px; height: 64px; border-radius: 12px; object-fit: cover;" />
          <div style="display: none;">${svgLogo}</div>
        </div>
        <div style="font-weight: 800; font-size: 18px; color: #1e293b; margin-top: 8px; letter-spacing: 0.5px; font-family: sans-serif;">
          ilmhub.writing
        </div>
      </div>
    `;
  },

  openModal(type) {
    const container = document.getElementById("modal-container");
    if (!container) return;

    // 1. DEVELOPER MODALI
    if (type === 'devModal') {
      container.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 9999;">
          <div style="background: white; padding: 30px; border-radius: 16px; width: 320px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); font-family: sans-serif;">
            
            ${this.getHeaderHTML()}

            <h3 style="margin-top: 0; color: #1e293b; text-align: center; font-size: 16px;">👨‍💻 Developer Kirish</h3>
            <p style="font-size: 13px; color: #64748b; text-align: center; margin-bottom: 15px;">Muhammadsafo, parolingizni kiriting:</p>
            
            <input type="password" id="dev-pass-input" placeholder="Parol" style="width: 100%; padding: 11px; border: 1px solid #cbd5e1; border-radius: 8px; margin-bottom: 12px; box-sizing: border-box; outline: none; font-size: 14px;" />
            <button id="dev-login-btn" style="width: 100%; padding: 11px; background: #2563eb; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 14px;">Kirish</button>
            <button onclick="LoginModals.closeModal()" style="width: 100%; padding: 8px; background: transparent; color: #64748b; border: none; margin-top: 8px; cursor: pointer; font-size: 13px;">Bekor qilish</button>
          </div>
        </div>
      `;

      const input = document.getElementById("dev-pass-input");
      const btn = document.getElementById("dev-login-btn");

      const submitDev = () => {
        if (input.value === "Muhammadsafo_2014") {
          this.closeModal();
          if (typeof DeveloperDashboard !== 'undefined') {
            DeveloperDashboard.init();
          }
        } else {
          alert("❌ Parol noto'g'ri!");
        }
      };

      btn.addEventListener("click", submitDev);
      input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") submitDev();
      });

      setTimeout(() => input.focus(), 100);

    // 2. XODIMLAR MODALI
    } else if (type === 'staffModal') {
      container.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 9999;">
          <div style="background: white; padding: 30px; border-radius: 16px; width: 320px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); font-family: sans-serif;">
            
            ${this.getHeaderHTML()}

            <h3 style="margin-top: 0; color: #1e293b; text-align: center; font-size: 16px; margin-bottom: 15px;">🏛️ Xodimlar Kirishi</h3>
            
            <input type="text" id="staff-user-input" placeholder="F.I.Sh yoki Username" style="width: 100%; padding: 11px; border: 1px solid #cbd5e1; border-radius: 8px; margin-bottom: 10px; box-sizing: border-box; outline: none; font-size: 14px;" />
            <input type="password" id="staff-pass-input" placeholder="Parol" style="width: 100%; padding: 11px; border: 1px solid #cbd5e1; border-radius: 8px; margin-bottom: 12px; box-sizing: border-box; outline: none; font-size: 14px;" />
            <button id="staff-login-btn" style="width: 100%; padding: 11px; background: #2563eb; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 14px;">Kirish</button>
            <button onclick="LoginModals.closeModal()" style="width: 100%; padding: 8px; background: transparent; color: #64748b; border: none; margin-top: 8px; cursor: pointer; font-size: 13px;">Bekor qilish</button>
          </div>
        </div>
      `;

      const userInput = document.getElementById("staff-user-input");
      const passInput = document.getElementById("staff-pass-input");
      const btn = document.getElementById("staff-login-btn");

      const submitStaff = () => {
        const user = userInput.value.trim().toLowerCase();
        const pass = passInput.value.trim();

        const staffList = JSON.parse(localStorage.getItem("ilmhub_staff_list") || "[]");
        const foundStaff = staffList.find(s => 
          (s.name.toLowerCase() === user || (s.username && s.username.toLowerCase() === user)) && 
          s.password === pass
        );

        if (foundStaff) {
          this.closeModal();
          if (foundStaff.role === "Director") {
            if (typeof DirectorDashboard !== 'undefined') DirectorDashboard.init();
          } else if (foundStaff.role === "Teacher") {
            if (typeof TeacherDashboard !== 'undefined') TeacherDashboard.init();
          } else if (foundStaff.role === "Admin") {
            if (typeof AdminDashboard !== 'undefined') AdminDashboard.init();
          }
        } else {
          alert("❌ Xodim topilmadi yoki parol noto'g'ri!");
        }
      };

      btn.addEventListener("click", submitStaff);
      userInput.addEventListener("keypress", (e) => { if (e.key === "Enter") passInput.focus(); });
      passInput.addEventListener("keypress", (e) => { if (e.key === "Enter") submitStaff(); });

      setTimeout(() => userInput.focus(), 100);

    // 3. O'QUVCHI MODALI (FAQAT 1 TA TEXTBOX: AI BERGAN ID/PAROL)
    } else if (type === 'studentModal') {
      container.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 9999;">
          <div style="background: white; padding: 30px; border-radius: 16px; width: 320px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); font-family: sans-serif;">
            
            ${this.getHeaderHTML()}

            <h3 style="margin-top: 0; color: #1e293b; text-align: center; font-size: 16px; margin-bottom: 6px;">🎓 O'quvchi Kirishi</h3>
            <p style="font-size: 12px; color: #64748b; text-align: center; margin-top: 0; margin-bottom: 15px;">AI bergan maxsus ID (parol)ingizni kiriting:</p>
            
            <input type="text" id="student-id-input" placeholder="Masalan: st#9029" style="width: 100%; padding: 11px; border: 1px solid #cbd5e1; border-radius: 8px; margin-bottom: 12px; box-sizing: border-box; outline: none; font-size: 14px;" />
            
            <button id="student-login-btn" style="width: 100%; padding: 11px; background: #16a34a; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 14px;">Kirish</button>
            <button onclick="LoginModals.closeModal()" style="width: 100%; padding: 8px; background: transparent; color: #64748b; border: none; margin-top: 8px; cursor: pointer; font-size: 13px;">Bekor qilish</button>
          </div>
        </div>
      `;

      const idInput = document.getElementById("student-id-input");
      const btn = document.getElementById("student-login-btn");

      const submitStudent = () => {
        const studentId = idInput.value.trim();

        if (!studentId) {
          return alert("Iltimos, AI bergan ID parolni kiriting!");
        }

        const studentsList = JSON.parse(localStorage.getItem("ilmhub_students") || "[]");
        
        // Kiritilgan ID (st#9029) orqali o'quvchini izlash
        const foundStudent = studentsList.find(s => 
          s.password === studentId || s.username === studentId
        );

        if (foundStudent) {
          localStorage.setItem("currentUser", JSON.stringify(foundStudent));
          this.closeModal();

          if (typeof StudentDashboard !== 'undefined') {
            StudentDashboard.init(foundStudent);
          } else {
            alert("Xatolik: StudentDashboard kodi topilmadi!");
          }
        } else {
          alert("❌ Bunday ID (parol)li o'quvchi topilmadi!\nMasalan: st#9029 ekanligini qayta tekshiring.");
        }
      };

      btn.addEventListener("click", submitStudent);
      idInput.addEventListener("keypress", (e) => { if (e.key === "Enter") submitStudent(); });

      setTimeout(() => idInput.focus(), 100);
    }
  },

  closeModal() {
    const container = document.getElementById("modal-container");
    if (container) container.innerHTML = "";
  }
};