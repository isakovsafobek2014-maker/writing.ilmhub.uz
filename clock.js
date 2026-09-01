const LiveClock = {
    init(containerId) {
        const targetElement = document.getElementById(containerId);
        if (!targetElement) return;

        // Har 1 sekundda vaqtni yangilab turish
        setInterval(() => {
            const now = new Date();
            
            // O'zbekiston vaqtini (Asia/Tashkent) olish
            const optionsTime = {
                timeZone: 'Asia/Tashkent',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            };
            
            const optionsDate = {
                timeZone: 'Asia/Tashkent',
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            };

            const timeString = new Intl.DateTimeFormat('uz-UZ', optionsTime).format(now);
            const dateString = new Intl.DateTimeFormat('uz-UZ', optionsDate).format(now).replace(/\//g, '.');

            // Ko'rsatilgan dizaynga moslab chiqarish
            targetElement.innerHTML = `
                <div style="font-family: monospace; background: #1e272e; color: #d2dae2; padding: 6px 12px; border-radius: 6px; display: inline-block; text-align: center; border: 1px solid #3d3d3d; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">
                    <div style="font-size: 16px; font-weight: bold; color: #00d2d3; letter-spacing: 1px;">${timeString}</div>
                    <div style="font-size: 12px; color: #808e9b;">${dateString}</div>
                </div>
            `;
        }, 1000);
    }
};