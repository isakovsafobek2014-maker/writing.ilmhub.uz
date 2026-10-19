// js/supabase-init.js
//
// Bu fayl BOSHQA BARCHA skriptlardan OLDIN yuklanadi
// (index.html'da Supabase CDN skriptidan keyin, lekin login-modals.js,
// developer.js va boshqalardan OLDIN).

const SUPABASE_URL = "https://qykkuccafkdowxkkvffw.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_2gu5-II5HbxhlrGpCUBs6w_kWtrAT8y";

// Global "supabase" o'zgaruvchisini KUTUBXONA emas, balki HAQIQIY CLIENT
// qilib qayta belgilaymiz - shundan keyin butun loyihada supabase.from(...)
// ishlay boshlaydi.
window.supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log("✅ Supabase client ulandi:", typeof window.supabase.from === "function" ? "OK" : "XATOLIK");