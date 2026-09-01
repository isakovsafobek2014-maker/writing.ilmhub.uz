// Supabase sozlamalari
const SUPABASE_URL = "https://YOUR_SUPABASE_PROJECT_ID.supabase.co";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";

const supabase = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

window.SystemStatus = {
    isDevOnline: false,
    currentUser: null
};

function getTashkentTime() {
    return new Date().toLocaleString("en-US", { timeZone: "Asia/Tashkent" });
}