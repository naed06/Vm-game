// Navigation Elements
const dashboardView = document.getElementById('dashboard-view');
const gameView = document.getElementById('game-view');
const backBtn = document.getElementById('game-back-btn');

// Game Engine Elements
const scenarioText = document.getElementById('scenario-text');
const optionsContainer = document.getElementById('options-container');
const scoreDisplay = document.getElementById('game-score');
const timerDisplay = document.getElementById('game-timer');

// Game State Variables
let score = 0;
let timer;
let timeLeft = 20;
let currentScenarioIndex = 0;

// Authentic Retail Core Tariff Scenarios
const scenarios = [
    {
        text: "Customer needs an absolute budget entry-level plan primarily for light usage and occasional browsing. What is the lowest available price point?",
        options: ["£29.99/mo", "£19.99/mo", "£17.99/mo", "£22.99/mo"],
        correct: "£19.99/mo"
    },
    {
        text: "A heavy user who streams movies and games online, requires a premium, completely unrestricted connection. What is the top tier solus tariff pricing?",
        options: ["£29.99/mo", "£38.49/mo", "£39.99/mo", "£25.00/mo"],
        correct: "£29.99/mo"
    },
    {
        text: "A family is looking for a balanced mid-tier plan that offers solid data capability without breaking the bank. Which solus broadband pricing fits this sweet spot?",
        options: ["£38.49/mo", "£29.99/mo", "£22.99/mo", "£39.99/mo"],
        correct: "£22.99/mo"
    }
    {
        text: "How much extra does it cost to add on Netflix for customers looking at our broadband options",
        options: ["£2.00/mo", "£3.00/mo", "£2.99/mo", "£3.99/mo"],
        correct: "£2.00/mo"
    }
];

// Switch views into the game
document.getElementById('tile-titan').addEventListener('click', () => {
    dashboardView.classList.add('hidden');
    gameView.classList.remove('hidden');
    startGame();
});

// Switch back to dashboard
backBtn.addEventListener('click', () => {
    clearInterval(timer);
    gameView.classList.add('hidden');
    dashboardView.classList.remove('hidden');
});

function startGame() {
    score = 0;
    currentScenarioIndex = 0;
    scoreDisplay.textContent = score;
    loadScenario();
}

function loadScenario() {
    clearInterval(timer);
    timeLeft = 20;
    timerDisplay.textContent = timeLeft;
    
    timer = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            nextScenario();
        }
    }, 1000);

    const currentScenario = scenarios[currentScenarioIndex];
    scenarioText.textContent = currentScenario.text;
    optionsContainer.innerHTML = '';

    currentScenario.options.forEach(option => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        button.textContent = option;
        button.addEventListener('click', () => checkAnswer(button, option, currentScenario.correct));
        optionsContainer.appendChild(button);
    });
}

function checkAnswer(selectedButton, chosenOption, correctOption) {
    clearInterval(timer); 
    
    const allButtons = document.querySelectorAll('.option-btn');
    allButtons.forEach(btn => btn.style.pointerEvents = 'none');

    if (chosenOption === correctOption) {
        selectedButton.classList.add('correct');
        score += 100;
        scoreDisplay.textContent = score;
    } else {
        selectedButton.classList.add('wrong');
        allButtons.forEach(btn => {
            if (btn.textContent === correctOption) btn.classList.add('correct');
        });
    }

    setTimeout(() => {
        nextScenario();
    }, 1500);
}

function nextScenario() {
    currentScenarioIndex++;
    if (currentScenarioIndex < scenarios.length) {
        loadScenario();
    } else {
        scenarioText.textContent = `Game Complete! You scored a fantastic ${score} points. Excellent performance!`;
        optionsContainer.innerHTML = '';
        
        const restartBtn = document.createElement('button');
        restartBtn.className = 'option-btn';
        restartBtn.style.gridColumn = '1 / -1';
        restartBtn.textContent = 'Play Again';
        restartBtn.addEventListener('click', startGame);
        optionsContainer.appendChild(restartBtn);
    }
}

// Hub selection visual management logic loop
document.querySelectorAll('.tile').forEach(tile => {
    tile.addEventListener('click', () => {
        const current = document.querySelector('.tile.focused');
        if (current) current.classList.remove('focused');
        tile.classList.add('focused');
    });
});
