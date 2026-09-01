// Anti-cheat nazorati
const AntiCheat = {
    init() {
        document.addEventListener('keydown', (e) => {
            if (
                e.key === 'F12' || 
                (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
                (e.ctrlKey && e.key === 'u')
            ) {
                e.preventDefault();
                alert("❌ Anti-Cheat: DevTools ishlatish taqiqlangan!");
            }
        });

        document.addEventListener('contextmenu', (e) => e.preventDefault());
    }
};

AntiCheat.init();