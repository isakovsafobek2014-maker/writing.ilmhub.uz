-- 1. Tizim foydalanuvchilari jadvali
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('Developer', 'Director', 'Admin', 'Teacher', 'Student', 'Guest')) NOT NULL,
    stage VARCHAR(50) DEFAULT 'Kids',
    xp INTEGER DEFAULT 0,
    is_banned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Mashqlar va Natijalar jadvali
CREATE TABLE IF NOT EXISTS practice_results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES users(id) ON DELETE CASCADE,
    module_type VARCHAR(50) NOT NULL,
    score INTEGER NOT NULL,
    xp_earned INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Developer akkauntini kiritish
INSERT INTO users (full_name, username, password, role, xp)
VALUES ('Muhammadsafo', 'Muhammadsafo', 'Muhammadsafo_2014', 'Developer', 9999)
ON CONFLICT (username) DO NOTHING;