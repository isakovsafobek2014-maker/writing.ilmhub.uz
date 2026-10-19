const ExamModule = {
    init() {
        const container = document.getElementById('app-container');
        container.innerHTML = `
            <div style="background: white; padding: 25px; border-radius: 12px;">
                <h2>⏱️ Imtihon Bo'limi (Exam Mode)</h2>
                <p style="color: #d63031; font-weight: bold; margin: 10px 0;">Diqqat: Imtihon davomida sahifadan chiqish, boshqa tabga o'tish, DevTools ochish va nusxa ko'chirish taqiqlangan! Buzilsa hisobingiz avtomatik ban qilinadi.</p>
                
                <div style="padding: 20px; background: #f8f9fa; border-radius: 8px; margin-top: 15px;">
                    <p>Imtihon topshirish uchun tayyormisiz?</p>
                    <button onclick="ExamModule.startExam()" class="modal-btn btn-success" style="margin-top: 15px; width: auto; padding: 10px 25px;">
                        🚀 Boshlash
                    </button>
                </div>
            </div>
        `;
    },

    startExam() {
        if (typeof AntiCheat !== 'undefined') {
            AntiCheat.initExamMode();
        }
        alert("Imtihon boshlandi! Endi boshqa tabga o'tish, nusxa ko'chirish yoki DevTools ochish taqiqlangan.");
        // TODO: haqiqiy imtihon savollari shu yerga render qilinadi
    },

    // Imtihon tugaganda albatta shu chaqirilishi kerak, aks holda
    // tab-switch bloklovchi listenerlar ishlab turaveradi.
    finishExam() {
        if (typeof AntiCheat !== 'undefined') {
            AntiCheat.stopExamMode();
        }
        alert("Imtihon yakunlandi. Natijalaringiz saqlandi!");
    }
};