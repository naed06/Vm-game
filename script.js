/* --- LOCAL STORAGE LEADERBOARD INTERACTION MECHANICS --- */
const highscoreView = document.getElementById('highscore-view');
const highscoreTrigger = document.getElementById('highscore-trigger');
const highscoreBackBtn = document.getElementById('highscore-back-btn');
const leaderboardBody = document.getElementById('leaderboard-body');

// Track and save score at game over
function recordEndGameScore(finalScore) {
    let scores = JSON.parse(localStorage.getItem('tariff_titans_scores')) || [];
    const newEntry = {
        score: finalScore,
        date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
    };
    scores.push(newEntry);
    // Sort highest to lowest, trim down to top 10
    scores.sort((a, b) => b.score - a.score);
    scores = scores.slice(0, 10);
    localStorage.setItem('tariff_titans_scores', JSON.stringify(scores));
}

// Display top scores inside table layout
function updateLeaderboardDisplay() {
    if (!leaderboardBody) return;
    const scores = JSON.parse(localStorage.getItem('tariff_titans_scores')) || [];
    leaderboardBody.innerHTML = '';

    if (scores.length === 0) {
        leaderboardBody.innerHTML = `<tr><td colspan="3" style="text-align:center; color:var(--text-muted);">No records logged yet. Play a round!</td></tr>`;
        return;
    }

    scores.forEach((entry, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>#${index + 1}</td>
            <td>${entry.score} pts</td>
            <td>${entry.date}</td>
        `;
        leaderboardBody.appendChild(row);
    });
}

// View Controller Switching Events
if (highscoreTrigger) {
    highscoreTrigger.addEventListener('click', () => {
        updateLeaderboardDisplay();
        dashboardView.classList.add('hidden');
        highscoreView.classList.remove('hidden');
    });
}

if (highscoreBackBtn) {
    highscoreBackBtn.addEventListener('click', () => {
        highscoreView.classList.add('hidden');
        dashboardView.classList.remove('hidden');
    });
}

// Hook into existing game engine structure to record scores dynamically
const originalNextScenario = nextScenario;
nextScenario = function() {
    originalNextScenario();
    // If the scenario index exceeds active array length, the round is complete
    if (currentScenarioIndex >= activeScenarios.length && score > 0) {
        recordEndGameScore(score);
    }
};
