const Auth = {
    setSession(user) {
        localStorage.setItem('user_session', JSON.stringify(user));
        App.currentUser = user;
        App.renderDashboard();
    },

    logout() {
        if (confirm("Rostdan ham tizimdan chiqmoqchimisiz?")) {
            localStorage.removeItem('user_session');
            App.currentUser = { name: 'Mehmon', role: 'guest' };
            
            // Sahifani qayta yuklash yoki bosh sahifaga qaytarish
            window.location.reload();
        }
    }
};