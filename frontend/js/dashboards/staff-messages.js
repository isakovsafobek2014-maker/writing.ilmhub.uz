// js/dashboards/staff-messages.js
//
// XODIMLAR UCHUN MESSAGES BO'LIMI (Director/Admin/Teacher/Developer)
//
// ========================================================================
// SUPABASE'DA BIR MARTA BAJARISH KERAK BO'LGAN SOZLAMALAR:
// ========================================================================
//
// Supabase sozlamalari uchun backend/sql/messaging-setup.sql faylini ishlating.
//
// ========================================================================

const StaffMessages = {
  currentStaff: null,   // { id, name, role }
  activeChannel: "staff", // 'staff' | 'student'
  selectedStudentGroup: null,
  showDirectory: false,
  mediaRecorder: null,
  audioChunks: [],
  isRecording: false,
  realtimeChannel: null,

  // Video yozish uchun
  videoRecorder: null,
  videoChunks: [],
  isRecordingVideo: false,
  videoStream: null,
  enhanceAnimFrame: null,

  // ---------------------------------------------------------
  // KIRISH NUQTASI
  // staffUser = { id, name, role }  (role: Director/Admin/Teacher/Developer)
  // ---------------------------------------------------------
  async init(staffUser, containerId = "app-container") {
    if (!staffUser || staffUser.role === "Student") {
      alert("⛔ Bu bo'limga faqat xodimlar kira oladi.");
      return;
    }
    if (typeof supabase === "undefined" || typeof supabase.from !== "function") {
      alert("❌ Supabase ulanmagan. Xabarlar bo'limiga ulanib bo'lmadi.");
      return;
    }
    this.destroy();
    this.currentStaff = staffUser;
    this.containerId = containerId;
    await this.render();
    this._subscribeRealtime();
  },

  destroy() {
    if (this.realtimeChannel && typeof supabase !== "undefined") {
      supabase.removeChannel(this.realtimeChannel);
      this.realtimeChannel = null;
    }
  },

  // ---------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------
  async render() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    const groups = JSON.parse(localStorage.getItem("ilmhub_groups") || "[]");

    container.innerHTML = `
      <div style="max-width: 900px; margin: 20px auto; font-family: sans-serif; color: #1e293b; height: 80vh; display: flex; flex-direction: column; position: relative;">

        <!-- Header -->
        <div style="background: white; padding: 16px 20px; border-radius: 12px 12px 0 0; box-shadow: 0 2px 4px rgba(0,0,0,0.05); display: flex; justify-content: space-between; align-items: center;">
          <h2 style="margin: 0; font-size: 18px;">💬 Messages</h2>
          <button id="sm-toggle-directory" style="padding: 8px 14px; background: #eff6ff; color: #2563eb; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 13px;">
            👥 Xodimlar ro'yxati
          </button>
        </div>

        <!-- Kanal tablari -->
        <div style="background: white; padding: 0 20px; display: flex; gap: 8px; border-bottom: 1px solid #e2e8f0;">
          <button id="sm-tab-staff" style="padding: 12px 16px; border: none; background: none; cursor: pointer; font-weight: bold; font-size: 14px; border-bottom: 3px solid ${this.activeChannel === 'staff' ? '#2563eb' : 'transparent'}; color: ${this.activeChannel === 'staff' ? '#2563eb' : '#64748b'};">
            🔒 Xodimlar Chat
          </button>
          <button id="sm-tab-student" style="padding: 12px 16px; border: none; background: none; cursor: pointer; font-weight: bold; font-size: 14px; border-bottom: 3px solid ${this.activeChannel === 'student' ? '#2563eb' : 'transparent'}; color: ${this.activeChannel === 'student' ? '#2563eb' : '#64748b'};">
            👁️ O'quvchilar Chat (faqat o'qish)
          </button>
        </div>

        <!-- Guruh tanlash (faqat student kanalida) -->
        ${this.activeChannel === 'student' ? `
          <div style="background: white; padding: 10px 20px; border-bottom: 1px solid #e2e8f0;">
            <select id="sm-group-select" style="padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 8px; width: 100%; max-width: 300px;">
              <option value="">-- O'quvchilar guruhini tanlang --</option>
              ${groups.map(g => `<option value="${this._escapeHtml(g.name)}" ${this.selectedStudentGroup === g.name ? 'selected' : ''}>${this._escapeHtml(g.name)}</option>`).join('')}
            </select>
          </div>
        ` : ''}

        <!-- Xabarlar ro'yxati -->
        <div id="sm-messages-list" style="flex: 1; overflow-y: auto; background: #f8fafc; padding: 16px 20px; display: flex; flex-direction: column; gap: 10px;">
          <p style="color: #94a3b8; text-align: center; margin-top: 40px;">Yuklanmoqda...</p>
        </div>

        <!-- Xodimlar direktoriyasi (overlay panel) -->
        <div id="sm-directory-panel" style="display: ${this.showDirectory ? 'flex' : 'none'}; position: absolute; top: 0; right: 0; width: 320px; height: 100%; background: white; box-shadow: -4px 0 12px rgba(0,0,0,0.1); flex-direction: column; z-index: 10; border-radius: 0 12px 12px 0;">
          <div style="padding: 16px; border-bottom: 1px solid #e2e8f0;">
            <h4 style="margin: 0 0 10px 0;">👥 Barcha Xodimlar</h4>
            <input id="sm-staff-search" placeholder="Xodim qidirish..." style="width: 100%; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 8px; box-sizing: border-box;" />
          </div>
          <div id="sm-staff-list" style="flex: 1; overflow-y: auto; padding: 10px;"></div>
        </div>

        <!-- Video yozish oynasi (yashirin, yozayotganda chiqadi) -->
        <div id="sm-video-preview-panel" style="display:none; position: fixed; bottom: 90px; right: 30px; width: 260px; background: black; border-radius: 14px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.4); z-index: 20;">
          <video id="sm-video-preview" autoplay muted playsinline style="width: 100%; display: block;"></video>
          <div style="position:absolute; top:8px; left:8px; background:#ef4444; color:white; font-size:11px; font-weight:bold; padding:3px 8px; border-radius:10px;">🔴 REC</div>
        </div>

        <!-- Yozish paneli (faqat staff kanalida yoziladi) -->
        ${this.activeChannel === 'staff' ? `
          <div style="background: white; padding: 14px 20px; border-radius: 0 0 12px 12px; box-shadow: 0 -2px 4px rgba(0,0,0,0.05); display: flex; gap: 10px; align-items: center;">
            <button id="sm-record-btn" title="Ovozli xabar" style="width: 42px; height: 42px; border-radius: 50%; border: none; background: ${this.isRecording ? '#ef4444' : '#f1f5f9'}; color: ${this.isRecording ? 'white' : '#334155'}; font-size: 18px; cursor: pointer; flex-shrink: 0;">
              🎙️
            </button>
            <button id="sm-video-btn" title="Video xabar" style="width: 42px; height: 42px; border-radius: 50%; border: none; background: ${this.isRecordingVideo ? '#ef4444' : '#f1f5f9'}; color: ${this.isRecordingVideo ? 'white' : '#334155'}; font-size: 18px; cursor: pointer; flex-shrink: 0;">
              📹
            </button>
            <input id="sm-text-input" placeholder="Xabar yozing..." style="flex: 1; padding: 12px 14px; border: 1px solid #cbd5e1; border-radius: 10px; font-size: 14px;" />
            <button id="sm-send-btn" style="padding: 12px 20px; background: #2563eb; color: white; border: none; border-radius: 10px; font-weight: bold; cursor: pointer;">
              Yuborish
            </button>
          </div>
        ` : `
          <div style="background: #fef9c3; padding: 12px 20px; text-align: center; color: #854d0e; font-size: 13px; border-radius: 0 0 12px 12px;">
            👁️ Bu kanalda faqat o'qiy olasiz — o'quvchilarga yoza olmaysiz.
          </div>
        `}
      </div>
    `;

    this.bindEvents();
    await this.loadMessages();
  },

  bindEvents() {
    document.getElementById("sm-tab-staff")?.addEventListener("click", () => {
      this.activeChannel = "staff";
      this.render();
    });
    document.getElementById("sm-tab-student")?.addEventListener("click", () => {
      this.activeChannel = "student";
      this.render();
    });
    document.getElementById("sm-group-select")?.addEventListener("change", (e) => {
      this.selectedStudentGroup = e.target.value;
      this.loadMessages();
    });
    document.getElementById("sm-toggle-directory")?.addEventListener("click", () => {
      this.showDirectory = !this.showDirectory;
      this.render();
      if (this.showDirectory) this.loadStaffDirectory();
    });
    document.getElementById("sm-staff-search")?.addEventListener("input", (e) => {
      this.loadStaffDirectory(e.target.value);
    });
    document.getElementById("sm-send-btn")?.addEventListener("click", () => this.sendTextMessage());
    document.getElementById("sm-text-input")?.addEventListener("keypress", (e) => {
      if (e.key === "Enter") this.sendTextMessage();
    });
    document.getElementById("sm-record-btn")?.addEventListener("click", () => this.toggleRecording());
    document.getElementById("sm-video-btn")?.addEventListener("click", () => this.toggleVideoRecording());

    if (this.showDirectory) this.loadStaffDirectory();
  },

  // ---------------------------------------------------------
  // XABARLARNI YUKLASH
  // ---------------------------------------------------------
  async loadMessages() {
    const list = document.getElementById("sm-messages-list");
    if (!list || typeof supabase === "undefined") return;

    try {
      let query = supabase.from("messages").select("*").order("created_at", { ascending: true });

      if (this.activeChannel === "staff") {
        query = query.eq("channel", "staff");
      } else {
        if (!this.selectedStudentGroup) {
          list.innerHTML = `<p style="color:#94a3b8;text-align:center;margin-top:40px;">Yuqoridan o'quvchilar guruhini tanlang.</p>`;
          return;
        }
        query = query.eq("channel", "student").eq("group_name", this.selectedStudentGroup);
      }

      const { data: messages, error } = await query;

      if (error) {
        list.innerHTML = `<p style="color:#ef4444;">Xabarlarni yuklashda xatolik: ${this._escapeHtml(error.message)}</p>`;
        return;
      }

      if (!messages || messages.length === 0) {
        list.innerHTML = `<p style="color:#94a3b8;text-align:center;margin-top:40px;">Hozircha xabarlar yo'q.</p>`;
        return;
      }

      list.innerHTML = messages.map(m => this._renderMessageBubble(m)).join("");
      list.scrollTop = list.scrollHeight;
    } catch (error) {
      console.error("StaffMessages.loadMessages xatolik:", error);
      if (list.isConnected) {
        list.innerHTML = "<p style='color:#ef4444;'>Xabarlarni yuklashda ulanish xatoligi yuz berdi.</p>";
      }
    }
  },

  _renderMessageBubble(m) {
    const isMe = this.currentStaff && String(m.sender_id) === String(this.currentStaff.id) && m.channel === "staff";
    const time = new Date(m.created_at).toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" });

    return `
      <div style="align-self: ${isMe ? 'flex-end' : 'flex-start'}; max-width: 70%;">
        <div style="font-size: 11px; color: #64748b; margin-bottom: 3px; ${isMe ? 'text-align:right;' : ''}">
          ${m.sender_name} <span style="opacity:0.6;">(${m.sender_role})</span>
        </div>
        <div style="background: ${isMe ? '#2563eb' : 'white'}; color: ${isMe ? 'white' : '#1e293b'}; padding: 10px 14px; border-radius: 14px; box-shadow: 0 1px 2px rgba(0,0,0,0.06); font-size: 14px;">
          ${m.video_url ? `<video controls src="${m.video_url}" style="max-width: 260px; border-radius: 10px; display:block;"></video>` : ''}
          ${m.audio_url ? `<audio controls src="${m.audio_url}" style="max-width: 220px; height: 36px;"></audio>` : ''}
          ${m.content ? `<div style="${(m.audio_url || m.video_url) ? 'margin-top:6px;' : ''}">${this._escapeHtml(m.content)}</div>` : ''}
        </div>
        <div style="font-size: 10px; color: #94a3b8; margin-top: 2px; ${isMe ? 'text-align:right;' : ''}">${time}</div>
      </div>
    `;
  },

  _escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  },

  // ---------------------------------------------------------
  // MATNLI XABAR YUBORISH (faqat staff kanaliga)
  // ---------------------------------------------------------
  async sendTextMessage() {
    const input = document.getElementById("sm-text-input");
    const text = input?.value.trim();
    if (!text || !this.currentStaff) return;

    let error;
    try {
      ({ error } = await supabase.from("messages").insert([{
        sender_id: String(this.currentStaff.id ?? this.currentStaff.username ?? this.currentStaff.role),
        sender_name: this.currentStaff.name || this.currentStaff.full_name || this.currentStaff.role,
        sender_role: this.currentStaff.role,
        channel: "staff",
        content: text
      }]));
    } catch (requestError) {
      console.error("Xodim xabarini yuborishda ulanish xatoligi:", requestError);
      alert("Xabar yuborilmadi: Supabase serveriga ulanishda xatolik.");
      return;
    }

    if (error) {
      console.error("Xodim xabarini yuborishda xatolik:", error.message);
      alert("Xabar yuborilmadi: " + error.message);
      return;
    }

    input.value = "";
    await this.loadMessages();
  },

  // ---------------------------------------------------------
  // OVOZLI XABAR (MediaRecorder -> Supabase Storage)
  // ---------------------------------------------------------
  async toggleRecording() {
    if (this.isRecording) {
      this.mediaRecorder.stop();
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = (e) => this.audioChunks.push(e.data);
      this.mediaRecorder.onstop = async () => {
        this.isRecording = false;
        const btn = document.getElementById("sm-record-btn");
        if (btn) { btn.style.background = "#f1f5f9"; btn.style.color = "#334155"; }
        stream.getTracks().forEach(t => t.stop());
        await this._uploadVoiceMessage();
      };

      this.mediaRecorder.start();
      this.isRecording = true;
      const btn = document.getElementById("sm-record-btn");
      if (btn) { btn.style.background = "#ef4444"; btn.style.color = "white"; }
    } catch (err) {
      alert("🎙️ Mikrofonga ruxsat berilmadi yoki xatolik yuz berdi: " + err.message);
    }
  },

  async _uploadVoiceMessage() {
    const blob = new Blob(this.audioChunks, { type: "audio/webm" });
    const fileName = `voice_${String(this.currentStaff.id ?? this.currentStaff.username ?? this.currentStaff.role)}_${Date.now()}.webm`;

    let uploadError;
    try {
      ({ error: uploadError } = await supabase.storage
        .from("voice-messages")
        .upload(fileName, blob, { contentType: "audio/webm" }));
    } catch (error) {
      console.error("Ovozli xabarni yuklashda ulanish xatoligi:", error);
      alert("Ovozli xabar yuborilmadi: Supabase serveriga ulanishda xatolik.");
      return;
    }

    if (uploadError) {
      alert("Ovozli xabarni yuklashda xatolik: " + uploadError.message);
      return;
    }

    const { data: urlData } = supabase.storage.from("voice-messages").getPublicUrl(fileName);

    let insertError;
    try {
      ({ error: insertError } = await supabase.from("messages").insert([{
        sender_id: String(this.currentStaff.id ?? this.currentStaff.username ?? this.currentStaff.role),
        sender_name: this.currentStaff.name || this.currentStaff.full_name || this.currentStaff.role,
        sender_role: this.currentStaff.role,
        channel: "staff",
        audio_url: urlData.publicUrl
      }]));
    } catch (error) {
      console.error("Ovozli xabar yozuvini saqlashda xatolik:", error);
      await supabase.storage.from("voice-messages").remove([fileName]);
      alert("Ovozli xabar chatga saqlanmadi: Supabase serveriga ulanishda xatolik.");
      return;
    }

    if (insertError) {
      console.error("Ovozli xabar yozuvini saqlashda xatolik:", insertError.message);
      await supabase.storage.from("voice-messages").remove([fileName]);
      alert("Ovozli xabar chatga saqlanmadi: " + insertError.message);
      return;
    }

    await this.loadMessages();
  },

  // ---------------------------------------------------------
  // VIDEO XABAR (yuqori aniqlikda yozib olish + jonli tiniqlashtirish filtri)
  // ---------------------------------------------------------
  // Eslatma: bu HAQIQIY "blur olib tashlash" (AI deblur) emas - brauzerda
  // shunday og'ir AI modelni ishga tushirish imkonsiz. Lekin kontrast/
  // ravshanlikni oshirib, ko'zga sezilarli darajada tiniqroq va sifatliroq
  // ko'rinish beradi, shu bilan birga video 720p (HD) sifatida yoziladi.
  async toggleVideoRecording() {
    if (this.isRecordingVideo) {
      this.videoRecorder.stop();
      return;
    }

    try {
      this.videoStream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, frameRate: { ideal: 30 } },
        audio: true
      });

      const previewPanel = document.getElementById("sm-video-preview-panel");
      const previewVideoEl = document.getElementById("sm-video-preview");
      previewPanel.style.display = "block";
      previewVideoEl.srcObject = this.videoStream;

      // Tiniqlashtirish uchun: video kadrlarini canvasga chizib, contrast/sharpness
      // filtrini qo'llaymiz, so'ng shu canvas oqimini yozib olamiz.
      const canvas = document.createElement("canvas");
      canvas.width = 1280;
      canvas.height = 720;
      const ctx = canvas.getContext("2d");
      ctx.filter = "contrast(1.25) saturate(1.15) brightness(1.06)";

      const drawFrame = () => {
        if (!this.isRecordingVideo && !this._videoStarting) return;
        ctx.drawImage(previewVideoEl, 0, 0, canvas.width, canvas.height);
        this.enhanceAnimFrame = requestAnimationFrame(drawFrame);
      };
      this._videoStarting = true;
      drawFrame();

      const enhancedStream = canvas.captureStream(30);
      // Asl audio yo'lini enhance qilingan video oqimiga qo'shamiz
      this.videoStream.getAudioTracks().forEach(track => enhancedStream.addTrack(track));

      this.videoRecorder = new MediaRecorder(enhancedStream, { mimeType: "video/webm" });
      this.videoChunks = [];

      this.videoRecorder.ondataavailable = (e) => this.videoChunks.push(e.data);
      this.videoRecorder.onstop = async () => {
        this.isRecordingVideo = false;
        this._videoStarting = false;
        cancelAnimationFrame(this.enhanceAnimFrame);
        previewPanel.style.display = "none";
        this.videoStream.getTracks().forEach(t => t.stop());

        const btn = document.getElementById("sm-video-btn");
        if (btn) { btn.style.background = "#f1f5f9"; btn.style.color = "#334155"; }

        await this._uploadVideoMessage();
      };

      this.videoRecorder.start();
      this.isRecordingVideo = true;
      const btn = document.getElementById("sm-video-btn");
      if (btn) { btn.style.background = "#ef4444"; btn.style.color = "white"; }
    } catch (err) {
      alert("📹 Kameraga ruxsat berilmadi yoki xatolik: " + err.message);
    }
  },

  async _uploadVideoMessage() {
    const blob = new Blob(this.videoChunks, { type: "video/webm" });
    const fileName = `video_${String(this.currentStaff.id ?? this.currentStaff.username ?? this.currentStaff.role)}_${Date.now()}.webm`;

    let uploadError;
    try {
      ({ error: uploadError } = await supabase.storage
        .from("video-messages")
        .upload(fileName, blob, { contentType: "video/webm" }));
    } catch (error) {
      console.error("Video xabarni yuklashda ulanish xatoligi:", error);
      alert("Video xabar yuborilmadi: Supabase serveriga ulanishda xatolik.");
      return;
    }

    if (uploadError) {
      alert("Video xabarni yuklashda xatolik: " + uploadError.message);
      return;
    }

    const { data: urlData } = supabase.storage.from("video-messages").getPublicUrl(fileName);

    let insertError;
    try {
      ({ error: insertError } = await supabase.from("messages").insert([{
        sender_id: String(this.currentStaff.id ?? this.currentStaff.username ?? this.currentStaff.role),
        sender_name: this.currentStaff.name || this.currentStaff.full_name || this.currentStaff.role,
        sender_role: this.currentStaff.role,
        channel: "staff",
        video_url: urlData.publicUrl
      }]));
    } catch (error) {
      console.error("Video xabar yozuvini saqlashda xatolik:", error);
      await supabase.storage.from("video-messages").remove([fileName]);
      alert("Video xabar chatga saqlanmadi: Supabase serveriga ulanishda xatolik.");
      return;
    }

    if (insertError) {
      console.error("Video xabar yozuvini saqlashda xatolik:", insertError.message);
      await supabase.storage.from("video-messages").remove([fileName]);
      alert("Video xabar chatga saqlanmadi: " + insertError.message);
      return;
    }

    await this.loadMessages();
  },

  // ---------------------------------------------------------
  // XODIMLAR DIREKTORIYASI (kontakt tanlash paneli)
  // ---------------------------------------------------------
  async loadStaffDirectory(searchTerm = "") {
    const listEl = document.getElementById("sm-staff-list");
    if (!listEl) return;

    const { data: staff, error } = await supabase.rpc("list_staff_directory");

    if (error) {
      listEl.innerHTML = `<p style="color:#ef4444; font-size:13px;">Xatolik: ${error.message}</p>`;
      return;
    }

    const filtered = (staff || []).filter(s =>
      !searchTerm || (s.display_name || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filtered.length === 0) {
      listEl.innerHTML = `<p style="color:#94a3b8; font-size:13px; text-align:center; margin-top:20px;">Xodim topilmadi.</p>`;
      return;
    }

    listEl.innerHTML = filtered.map((s, index) => `
      <div data-staff-index="${index}"
           style="padding: 10px 12px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 10px; margin-bottom: 4px;"
           onmouseover="this.style.background='#f1f5f9'" onmouseout="this.style.background='transparent'">
        <div style="width: 36px; height: 36px; border-radius: 50%; background: #dbeafe; color: #1e40af; display: flex; align-items: center; justify-content: center; font-weight: bold;">
          ${this._escapeHtml((s.display_name || "?").charAt(0).toUpperCase())}
        </div>
        <div>
          <div style="font-weight: bold; font-size: 14px;">${this._escapeHtml(s.display_name || s.role)}</div>
          <div style="font-size: 12px; color: #64748b;">${this._escapeHtml(s.role)}</div>
        </div>
      </div>
    `).join("");
    listEl.querySelectorAll("[data-staff-index]").forEach(element => {
      element.addEventListener("click", () => {
        const staff = filtered[Number(element.dataset.staffIndex)];
        if (staff) this.mentionStaff(staff.display_name || staff.role);
      });
    });
  },

  // Xodim tanlanganda staff-chat matn maydoniga @Ism qo'yadi va panelni yopadi
  mentionStaff(name) {
    this.showDirectory = false;
    this.activeChannel = "staff";
    this.render().then(() => {
      const input = document.getElementById("sm-text-input");
      if (input) {
        input.value = `@${name} `;
        input.focus();
      }
    });
  },

  // ---------------------------------------------------------
  // REALTIME (yangi xabar kelganda avtomatik yangilanadi)
  // ---------------------------------------------------------
  _subscribeRealtime() {
    if (typeof supabase === "undefined") return;
    if (this.realtimeChannel) supabase.removeChannel(this.realtimeChannel);

    this.realtimeChannel = supabase
      .channel("messages-live")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, () => {
        this.loadMessages();
      })
      .subscribe();
  }
};

window.StaffMessages = StaffMessages;