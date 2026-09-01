const LeaderboardModule = {
    init() {
        const container = document.getElementById('app-container');
        container.innerHTML = `
            <div style="background: white; padding: 25px; border-radius: 12px;">
                <h2>🏆 Top O'quvchilar (Leaderboard)</h2>
                <ol style="margin: 20px 0 0 20px; line-height: 2;">
                    <li><strong>Muhammadsafo</strong> - 9999 XP 👑</li>
                    <li>O'quvchi #1 - 450 XP</li>
                    <li>O'quvchi #2 - 300 XP</li>
                </ol>
            </div>
        `;
    }
};