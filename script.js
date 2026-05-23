// Navigation Elements
const dashboardView = document.getElementById('dashboard-view');
const gameView = document.getElementById('game-view');
const backBtn = document.getElementById('game-back-btn');

// Game Engine Elements
const scenarioText = document.getElementById('scenario-text');
const optionsContainer = document.getElementById('options-container');
const scoreDisplay = document.getElementById('game-score');
const timerDisplay = document.getElementById('game-timer');

// Admin Panel Elements
const adminModal = document.getElementById('admin-panel');
const adminTrigger = document.getElementById('settings-trigger');
const adminClose = document.getElementById('admin-close');
const scenariosListContainer = document.getElementById('scenarios-list-container');
const questionCountDisplay = document.getElementById('question-count');
const jsonOutput = document.getElementById('json-output');

// Admin Form Inputs
const formText = document.getElementById('form-text');
const formOptA = document.getElementById('form-optA');
const formOptB = document.getElementById('form-optB');
const formOptC = document.getElementById('form-optC');
const formOptD = document.getElementById('form-optD');
const formCorrect = document.getElementById('form-correct');
const addScenarioBtn = document.getElementById('add-scenario-btn');
const copyJsonBtn = document.getElementById('copy-json-btn');

// Global Master Question Bank State
let masterScenarios = []; // Holds absolute array with loaded visibility data properties
let activeScenarios = []; // Filtered live quiz queue configuration
let score = 0;
let timer;
let timeLeft = 20;
let currentScenarioIndex = 0;

// Dynamic File Fetcher Engine
async function loadQuestionsFromFile() {
    try {
        const response = await fetch('questions.json');
        if (!response.ok) throw new Error('Failed to load file assets');
        
        const rawData = await response.json();
        
        // Ensure every question has an absolute visible runtime state property toggle
        masterScenarios = rawData.map(item => ({
            text: item.text,
            options: item.options,
            correct: item.correct,
            active: item.active !== undefined ? item.active : true
        }));
        
        console.log("Master dataset loaded successfully!");
    } catch (error) {
        console.error("Data pipeline initialization error:", error);
        // Fallback placeholder data if file does not exist yet
        masterScenarios = [
            {
                text: "Customer needs an absolute budget entry-level plan primarily for light WhatsApp usage. What is the lowest airtime price point?",
                options: ["£29.99/mo", "£12.00/mo", "£39.99/mo", "£15.00/mo"],
                correct: "£12.00/mo",
                active: true
            }
        ];
    }
    updateAdminPanelList();
}

// Filter out only active state toggled data structures for the active quiz queue configuration
function compileActiveQuizScenarios() {
    activeScenarios = masterScenarios.filter(item => item.active === true);
}

// Admin Panel Modals Toggle Triggers
adminTrigger.addEventListener('click', async () => {
    if (masterScenarios.length === 0) {
        await loadQuestionsFromFile();
    }
    updateAdminPanelList();
    adminModal.classList.remove('hidden');
});

adminClose.addEventListener('click', () => {
    adminModal.classList.add('hidden');
});

// Launch Game Mode View Port Trigger Hook
document.getElementById('tile-titan').addEventListener('click', async () => {
    if (masterScenarios.length === 0) {
        await loadQuestionsFromFile();
    }
    
    compileActiveQuizScenarios();
    
    dashboardView.classList.add('hidden');
    gameView.classList.remove('hidden');
    startGame();
});

backBtn.addEventListener('click', () => {
    clearInterval(timer);
    gameView.classList.add('hidden');
    dashboardView.classList.remove('hidden');
});

// Render List & Export Data Generator Pipeline
function updateAdminPanelList() {
    scenariosListContainer.innerHTML = '';
    questionCountDisplay.textContent = masterScenarios.length;

    masterScenarios.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = `admin-item-card ${item.active ? '' : 'disabled'}`;
        
        card.innerHTML = `
            <div class="admin-item-info">
                <p>${item.text}</p>
                <div class="admin-item-meta">Ans: <strong>${item.correct}</strong> | Total Choices: ${item.options.length}</div>
            </div>
            <label class="switch-control">
                <input type="checkbox" ${item.active ? 'checked' : ''} data-index="${index}">
                <span class="switch-slider"></span>
            </label>
        `;
        
        // Interactive Toggle Trigger Event Handler Wire Frame Link
        card.querySelector('input').addEventListener('change', (e) => {
            const idx = parseInt(e.target.getAttribute('data-index'));
            masterScenarios[idx].active = e.target.checked;
            updateAdminPanelList();
        });

        scenariosListContainer.appendChild(card);
    });

    // Auto update JSON output box visualization
    jsonOutput.value = JSON.stringify(masterScenarios, null, 4);
}

// Add New Scenario Form Submissions Engine Hook
addScenarioBtn.addEventListener('click', () => {
    const textVal = formText.value.trim();
    const optA = formOptA.value.trim();
    const optB = formOptB.value.trim();
    const optC = formOptC.value.trim();
    const optD = formOptD.value.trim();
    const correctSelect = formCorrect.value;

    if (!textVal || !optA || !optB || !optC || !optD || !correctSelect) {
        alert("Please completely fill out the scenario script parameters and options block.");
        return;
    }

    const optionsArray = [optA, optB, optC, optD];
    let correctString = "";
    if (correctSelect === "A") correctString = optA;
    if (correctSelect === "B") correctString = optB;
    if (correctSelect === "C") correctString = optC;
    if (correctSelect === "D") correctString = optD;

    // Push structured block object array elements data structures
    masterScenarios.push({
        text: textVal,
        options: optionsArray,
        correct: correctString,
        active: true
    });

    // Clear UI inputs components
    formText.value = '';
    formOptA.value = '';
    formOptB.value = '';
    formOptC.value = '';
    formOptD.value = '';
    formCorrect.value = '';

    updateAdminPanelList();
});

// Copy Data File Output Exporter Clipboard Event Engine Tool Hook
copyJsonBtn.addEventListener('click', () => {
    jsonOutput.select();
    document.execCommand('copy');
    alert("JSON configurations copied to clipboard! Paste this block data directly into questions.json on GitHub.");
});

// CORE LIVE QUIZ GAME GAMEPLAY RUNTIME ENGINE
function startGame() {
    score = 0;
    currentScenarioIndex = 0;
    scoreDisplay.textContent = score;
    
    if (activeScenarios.length > 0) {
        loadScenario();
    } else {
        scenarioText.textContent = "No active scenarios selected. Open settings to check question toggles.";
        optionsContainer.innerHTML = '';
    }
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

    const currentScenario = activeScenarios[currentScenarioIndex];
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
    if (currentScenarioIndex < activeScenarios.length) {
        loadScenario();
    } else {
        scenarioText.textContent = `Game Complete! You scored ${score} points.`;
        optionsContainer.innerHTML = '';
        
        const restartBtn = document.createElement('button');
        restartBtn.className = 'option-btn';
        restartBtn.style.gridColumn = '1 / -1';
        restartBtn.textContent = 'Play Again';
        restartBtn.addEventListener('click', startGame);
        optionsContainer.appendChild(restartBtn);
    }
}

// Hub selection visual management logic loop toggle tracking loop layout elements UI tracking configuration
document.querySelectorAll('.tile').forEach(tile => {
    tile.addEventListener('click', () => {
        const current = document.querySelector('.tile.focused');
        if (current) current.classList.remove('focused');
        tile.classList.add('focused');
    });
});
