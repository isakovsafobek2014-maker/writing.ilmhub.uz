const Auth = {
    setSession(user) {
        localStorage.setItem('user_session', JSON.stringify(user));
        App.currentUser = user;
        App.renderDashboard();
    },

    async signOutSupabase() {
        if (typeof supabase === 'undefined' || !supabase.auth) return null;
        const { error } = await supabase.auth.signOut();
        return error || null;
    },

    async logout() {
        if (confirm("Rostdan ham tizimdan chiqmoqchimisiz?")) {
            try {
                const error = await this.signOutSupabase();
                if (error) {
                    console.error("Supabase sessiyasidan chiqishda xatolik:", error.message);
                    alert("❌ Hisobdan xavfsiz chiqib bo'lmadi: " + error.message);
                    return;
                }
            } catch (error) {
                console.error("Supabase sessiyasidan chiqishda xatolik:", error);
                alert("❌ Hisobdan xavfsiz chiqib bo'lmadi. Qayta urinib ko'ring.");
                return;
            }
            localStorage.removeItem('user_session');
            App.currentUser = { name: 'Mehmon', role: 'guest' };
            window.location.reload();
        }
    }
};