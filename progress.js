const ProgressManager = {
    REQUIRED_EXERCISES: 25,
    PASS_PERCENTAGE: 95,

    // Natijani saqlash va hisoblash
    async recordResult(studentId, moduleType, userAnswers, scorePercent) {
        if (!supabase) return;

        // DevOnline rejimida 2X XP beriladi
        let xpEarned = scorePercent;
        if (window.SystemStatus.isDevOnline) {
            xpEarned *= 2;
        }

        // 1. Practice Result jadvaliga saqlash
        await supabase.from('practice_results').insert([{
            student_id: studentId,
            module_type: moduleType,
            user_answer: JSON.stringify(userAnswers),
            score: scorePercent,
            xp_earned: xpEarned
        }]);

        // 2. User XP sini oshirish
        const { data: user } = await supabase.from('users').select('xp').eq('id', studentId).single();
        if (user) {
            await supabase.from('users').update({ xp: user.xp + xpEarned }).eq('id', studentId);
        }

        // 3. Progressni yangilash
        let { data: progress } = await supabase.from('student_progress').select('*').eq('student_id', studentId).single();

        if (!progress) {
            const { data: newP } = await supabase.from('student_progress').insert([{ student_id: studentId }]).select().single();
            progress = newP;
        }

        let completedKey = `${moduleType.toLowerCase()}_completed`;
        let scoreKey = `${moduleType.toLowerCase()}_score_avg`;

        let currentCount = progress[completedKey] || 0;
        let currentAvg = progress[scoreKey] || 0;

        let newCount = currentCount + 1;
        let newAvg = ((currentAvg * currentCount) + scorePercent) / newCount;

        let updateData = {};
        updateData[completedKey] = newCount;
        updateData[scoreKey] = Math.round(newAvg);

        await supabase.from('student_progress').update(updateData).eq('student_id', studentId);

        // 4. Imtihon unlock holatini tekshirish
        this.checkExamUnlock(studentId);
    },

    async checkExamUnlock(studentId) {
        const { data: p } = await supabase.from('student_progress').select('*').eq('student_id', studentId).single();
        if (!p) return;

        const isReadingOk = p.reading_completed >= this.REQUIRED_EXERCISES && p.reading_score_avg >= this.PASS_PERCENTAGE;
        const isListeningOk = p.listening_completed >= this.REQUIRED_EXERCISES && p.listening_score_avg >= this.PASS_PERCENTAGE;
        const isSpeakingOk = p.speaking_completed >= this.REQUIRED_EXERCISES && p.speaking_score_avg >= this.PASS_PERCENTAGE;
        const isWritingOk = p.writing_completed >= this.REQUIRED_EXERCISES && p.writing_score_avg >= this.PASS_PERCENTAGE;

        if (isReadingOk && isListeningOk && isSpeakingOk && isWritingOk) {
            await supabase.from('student_progress').update({ exam_unlocked: true }).eq('student_id', studentId);
            alert("🎉 Ajoyib natija! Barcha 4 moduldan 25 tadan mashqni 95%+ bajarib imtihon bo'limini ochdingiz!");
        }
    }
};