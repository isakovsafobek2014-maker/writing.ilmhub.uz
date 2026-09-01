const ExamModule = {
    init() {
        const container = document.getElementById('app-container');
        container.innerHTML = `
            <div style="background: white; padding: 25px; border-radius: 12px;">
                <h2>⏱️ Imtihon Bo'limi (Exam Mode)</h2>
                <p style="color: #d63031; font-weight: bold; margin: 10px 0;">Diqqat: Imtihon davomida sahifadan chiqish va devtools ochish taqiqlangan!</p>
                
                <div style="padding: 20px; background: #f8f9fa; border-radius: 8px; margin-top: 15px;">
                    <p>Imtihon topshirish uchun tayyormisiz?</p>
                    <button onclick="alert('Imtihon tez orada boshlanadi!')" class="modal-btn btn-success" style="margin-top: 15px; width: auto; padding: 10px 25px;">
                        🚀 Boshlash
                    </button>
                </div>
            </div>
        `;
    }
};