// Auth va Ban Middleware
const AuthMiddleware = {
    checkRole(requiredRole, userRole) {
        if (requiredRole !== userRole) {
            alert("Sizda ushbu bo'limga kirish huquqi yo'q!");
            return false;
        }
        return true;
    },

    isUserBanned(user) {
        if (user && user.is_banned) {
            alert("Sizning hisobingiz taqiqlangan (Banned)!");
            return true;
        }
        return false;
    }
};