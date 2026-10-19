// js/student-modules/messages.js
//
// O'QUVCHI TOMONIDAGI MESSAGES BO'LIMI
// - O'quvchi faqat OʻZ GURUHINING kanaliga yozadi/o'qiydi.
// - Xodimlar (StaffMessages orqali) shu kanalni o'qiy oladi, lekin bu yerga yozolmaydi.
// - Bir o'quvchi ikkinchisiga so'kinsa -> AntiCheat.banStudent() chaqiriladi (asosiy so'kinish so'zlari ro'yxati bilan, oddiy filter).

const StudentMessages = {
  currentStudent: null,
  containerId: "app-container",
  realtimeChannel: null,

  // Juda oddiy so'kinish so'zlari filtri (kengaytirish mumkin)
  bannedWords: ["ahmoq", "jinni", "iflos", "yaramas", "Dalbayob", "Onang", "Xarromi", "isqirt", "onangni skay"],

  async init(student, containerId = "app-container") {
    if (!student) return;
    if (typeof supabase === "undefined" || typeof supabase.from !== "function") {
      alert("❌ Supabase ulanmagan. Xabarlar bo'limiga ulanish imkoni yo'q.");
      return;
    }
    if (this.realtimeChannel) {
      supabase.removeChannel(this.realtimeChannel);
      this.realtimeChannel = null;
    }
    this.currentStudent = {
      ...student,
      name: student.name || student.full_name || student.username,
      group: student.group || student.group_name || null
    };
    this.containerId = containerId;
    await this.render();
    this._subscribeRealtime();
  },

  async render() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    if (!this.currentStudent.group) {
      container.innerHTML = `
        <div style="background: white; padding: 25px; border-radius: 12px; text-align: center;">
          <h3>💬 Xabarlar</h3>
          <p style="color:#94a3b8;">Siz hali biror guruhga biriktirilmagansiz, shuning uchun guruh chatiga kira olmaysiz.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div style="background: white; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); height: 65vh; display: flex; flex-direction: column; overflow: hidden;">
        <div style="padding: 14px 18px; border-bottom: 1px solid #e2e8f0; background: #f8fafc;">
          <h3 style="margin: 0; font-size: 15px;">💬 ${this.currentStudent.group} guruh chati</h3>
          <p style="margin: 2px 0 0 0; font-size: 12px; color: #94a3b8;">O'qituvchilaringiz bu yerni kuzatib boradi.</p>
        </div>

        <div id="stu-msg-list" style="flex: 1; overflow-y: auto; padding: 14px 18px; background: #f8fafc; display: flex; flex-direction: column; gap: 8px;">
          <p style="color:#94a3b8; text-align:center; margin-top:30px;">Yuklanmoqda...</p>
        </div>

        <div style="padding: 12px 18px; border-top: 1px solid #e2e8f0; display: flex; gap: 8px; align-items: center;">
          <button id="stu-record-btn" style="width: 40px; height: 40px; border-radius: 50%; border: none; background: #f1f5f9; cursor: pointer; font-size: 16px; flex-shrink: 0;">🎙️</button>
          <input id="stu-msg-input" placeholder="Xabar yozing..." style="flex: 1; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 10px; font-size: 14px;" />
          <button id="stu-msg-send" style="padding: 10px 18px; background: #2563eb; color: white; border: none; border-radius: 10px; font-weight: bold; cursor: pointer;">Yuborish</button>
        </div>
      </div>
    `;

    document.getElementById("stu-msg-send")?.addEventListener("click", () => this.sendMessage());
    document.getElementById("stu-msg-input")?.addEventListener("keypress", (e) => { if (e.key === "Enter") this.sendMessage(); });
    document.getElementById("stu-record-btn")?.addEventListener("click", () => this.recordVoice());

    await this.loadMessages();
  },

  async loadMessages() {
    const list = document.getElementById("stu-msg-list");
    if (!list || typeof supabase === 'undefined') return;

    let messages;
    let error;
    try {
      ({ data: messages, error } = await supabase
        .from("messages")
        .select("*")
        .eq("channel", "student")
        .eq("group_name", this.currentStudent.group)
        .order("created_at", { ascending: true }));
    } catch (requestError) {
      console.error("O'quvchi xabarlarini yuklashda ulanish xatoligi:", requestError);
      if (list.isConnected) list.innerHTML = "<p style='color:#ef4444;'>Xabarlar serveriga ulanib bo'lmadi.</p>";
      return;
    }

    if (error) {
      list.innerHTML = `<p style="color:#ef4444;">Xatolik: ${error.message}</p>`;
      return;
    }

    if (!messages || messages.length === 0) {
      list.innerHTML = `<p style="color:#94a3b8; text-align:center; margin-top:30px;">Hozircha xabarlar yo'q. Birinchi bo'lib yozing!</p>`;
      return;
    }

    list.innerHTML = messages.map(m => this._bubble(m)).join("");
    list.scrollTop = list.scrollHeight;
  },

  _bubble(m) {
    const isMe = String(m.sender_id) === String(this.currentStudent.id || this.currentStudent.username);
    const time = new Date(m.created_at).toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" });
    return `
      <div style="align-self: ${isMe ? 'flex-end' : 'flex-start'}; max-width: 75%;">
        <div style="font-size: 11px; color: #64748b; margin-bottom: 2px; ${isMe ? 'text-align:right;' : ''}">${m.sender_name}</div>
        <div style="background: ${isMe ? '#2563eb' : 'white'}; color: ${isMe ? 'white' : '#1e293b'}; padding: 9px 13px; border-radius: 13px; font-size: 14px; box-shadow: 0 1px 2px rgba(0,0,0,0.06);">
          ${m.audio_url ? `<audio controls src="${m.audio_url}" style="max-width:200px; height:34px;"></audio>` : ''}
          ${m.content ? `<div>${this._escape(m.content)}</div>` : ''}
        </div>
        <div style="font-size: 10px; color:#94a3b8; margin-top:2px; ${isMe ? 'text-align:right;' : ''}">${time}</div>
      </div>
    `;
  },

  _escape(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  },

  // Oddiy so'kinish filtri -> topilsa yuborilmaydi va ban qilinadi
  _containsBannedWord(text) {
    const lower = text.toLowerCase();
    return this.bannedWords.some(w => lower.includes(w));
  },

  async sendMessage() {
    const input = document.getElementById("stu-msg-input");
    const text = input?.value.trim();
    if (!text || !this.currentStudent) return;

    if (this._containsBannedWord(text)) {
      if (typeof AntiCheat !== 'undefined') {
        AntiCheat.banStudent("Guruh chatida boshqa o'quvchiga nisbatan so'kinish/haqorat");
      } else {
        alert("🚫 Bunday so'zlarni ishlatish taqiqlangan!");
      }
      return;
    }

    let error;
    try {
      ({ error } = await supabase.from("messages").insert([{
        sender_id: String(this.currentStudent.id || this.currentStudent.username),
        sender_name: this.currentStudent.name || this.currentStudent.full_name || this.currentStudent.username,
        sender_role: "Student",
        channel: "student",
        group_name: this.currentStudent.group,
        content: text
      }]));
    } catch (requestError) {
      console.error("O'quvchi xabarini yuborishda ulanish xatoligi:", requestError);
      alert("Xabar yuborilmadi: Supabase serveriga ulanishda xatolik.");
      return;
    }

    if (error) {
      console.error("O'quvchi xabarini yuborishda xatolik:", error.message);
      alert("Xabar yuborilmadi: " + error.message);
      return;
    }

    input.value = "";
    await this.loadMessages();
  },

  async recordVoice() {
    const btn = document.getElementById("stu-record-btn");
    if (this._recorder && this._isRecording) {
      this._recorder.stop();
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this._recorder = new MediaRecorder(stream);
      this._chunks = [];
      this._recorder.ondataavailable = (e) => this._chunks.push(e.data);
      this._recorder.onstop = async () => {
        this._isRecording = false;
        if (btn) { btn.style.background = "#f1f5f9"; }
        stream.getTracks().forEach(t => t.stop());

        const blob = new Blob(this._chunks, { type: "audio/webm" });
        const fileName = `voice_stu_${String(this.currentStudent.id || this.currentStudent.username)}_${Date.now()}.webm`;
        try {
          const { error: uploadError } = await supabase.storage
            .from("voice-messages")
            .upload(fileName, blob, { contentType: "audio/webm" });
          if (uploadError) {
            alert("Ovozli xabar yuklanmadi: " + uploadError.message);
            return;
          }

          const { data: urlData } = supabase.storage.from("voice-messages").getPublicUrl(fileName);
          const { error: insertError } = await supabase.from("messages").insert([{
            sender_id: String(this.currentStudent.id || this.currentStudent.username),
            sender_name: this.currentStudent.name || this.currentStudent.full_name || this.currentStudent.username,
            sender_role: "Student",
            channel: "student",
            group_name: this.currentStudent.group,
            audio_url: urlData.publicUrl
          }]);

          if (insertError) {
            console.error("Ovozli xabar yozuvini saqlashda xatolik:", insertError.message);
            await supabase.storage.from("voice-messages").remove([fileName]);
            alert("Ovozli xabar chatga yuborilmadi: " + insertError.message);
            return;
          }
          await this.loadMessages();
        } catch (error) {
          console.error("Ovozli xabar yuborishda xatolik:", error);
          alert("Ovozli xabar yuborilmadi: " + error.message);
        }
      };
      this._recorder.start();
      this._isRecording = true;
      if (btn) { btn.style.background = "#ef4444"; }
    } catch (err) {
      alert("Mikrofonga ruxsat berilmadi: " + err.message);
    }
  },

  _subscribeRealtime() {
    if (typeof supabase === 'undefined') return;
    if (this.realtimeChannel) supabase.removeChannel(this.realtimeChannel);
    this.realtimeChannel = supabase
      .channel("student-messages-live")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, () => this.loadMessages())
      .subscribe();
  }
};

window.StudentMessages = StudentMessages; 