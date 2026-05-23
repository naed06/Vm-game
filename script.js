// Navigation Elements
const dashboardView = document.getElementById('dashboard-view');
const gameView = document.getElementById('game-view');
const backBtn = document.getElementById('game-back-btn');

// Security Passcode Elements
const authPanel = document.getElementById('auth-panel');
const authClose = document.getElementById('auth-close');
const pinClear = document.getElementById('pin-clear');
const pinSubmit = document.getElementById('pin-submit');
const pinDots = document.querySelectorAll('.pin-dot');
const pinButtons = document.querySelectorAll('.pin-grid .pin-btn[data-value]');

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

// System Configurations
const SECRET_PASSPHRASE_PIN = "2026"; // Feel free to update this 4-digit code as required
let enteredPinBuffer = "";

// Global Master Dataset Pipeline States
let masterScenarios = [];
let activeScenarios = [];
let score = 0;
let timer;
let timeLeft = 20;
let currentScenarioIndex = 0;

// Dynamic File Fetcher Engine
async function loadQuestionsFromFile() {
    try {
        const response = await fetch('questions.json');
        if (!response.ok) throw new Error('No questions data file located');
        
        const rawData = await response.json();
        
        masterScenarios = rawData.map(item => ({
            text: item.text,
            options: item.options,
            correct: item.correct,
            active: item.active !== undefined ? item.active : true
        }));
        
        console.log("Master dataset loaded successfully from questions.json!");
    } catch (error) {
        console.error("Data pipeline load error, using default layout configuration:", error);
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

function compileActiveQuizScenarios() {
    activeScenarios = masterScenarios.filter(item => item.active === true);
}

/* --- SECURITY PIN AUTH LOGIC PIPELINE --- */
adminTrigger.addEventListener('click', () => {
    resetPinPadState();
    authPanel.classList.remove('hidden');
});

authClose.addEventListener('click', () => {
    authPanel.classList.add('hidden');
});

// Capture keypad presses
pinButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        if (enteredPinBuffer.length < 4) {
            enteredPinBuffer += btn.getAttribute('data-value');
            renderPinDots();
        }
    });
});

pinClear.addEventListener('click', () => {
    if (enteredPinBuffer.length > 0) {
        enteredPinBuffer = enteredPinBuffer.slice(0, -1);
        renderPinDots();
    }
});

pinSubmit.addEventListener('click', async () => {
    if (enteredPinBuffer === SECRET_PASSPHRASE_PIN) {
        authPanel.classList.add('hidden');
        if (masterScenarios.length === 0) {
            await loadQuestionsFromFile();
        }
        updateAdminPanelList();
        adminModal.classList.remove('hidden');
    } else {
        // Trigger verification failure pulse animation
        enteredPinBuffer = "";
        renderPinDots();
        alert("ACCESS DENIED: Invalid Passcode Security Signature.");
    }
});

function renderPinDots() {
    pinDots.forEach((dot, index) => {
        if (index < enteredPinBuffer.length) {
            dot.classList.add('filled');
        } else {
            dot.classList.remove('filled');
        }
    });
}

function resetPinPadState() {
    enteredPinBuffer = "";
    renderPinDots();
}

/* --- MAIN PANEL ENGINE HOOKS --- */
adminClose.addEventListener('click', () => {
    adminModal.classList.add('hidden');
});

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

// Render Administration System Engine Elements
function updateAdminPanelList() {
    scenariosListContainer.innerHTML = '';
    questionCountDisplay.textContent = masterScenarios.length;

    masterScenarios.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = `admin-item-card ${item.active ? '' : 'disabled'}`;
        
        card.innerHTML = `
            <div class="admin-item-info">
                <p>${item.text}</p>
                <div class="admin-item-meta">Ans: <strong>${item.correct}</strong></div>
            </div>
            <label class="switch-control">
                <input type="checkbox" ${item.active ? 'checked' : ''} data-index="${index}">
                <span class="switch-slider"></span>
            </label>
        `;
        
        card.querySelector('input').addEventListener('change', (e) => {
            const idx = parseInt(e.target.getAttribute('data-index'));
            masterScenarios[idx].active = e.target.checked;
            updateAdminPanelList();
        });

        scenariosListContainer.appendChild(card);
    });

    jsonOutput.value = JSON.stringify(masterScenarios, null, 4);
}

// Add New Scenario Action Builder Engine Trigger Hook
addScenarioBtn.addEventListener('click', () => {
    const textVal = formText.value.trim();
    const optA = formOptA.value.trim();
    const optB = formOptB.value.trim();
    const optC = formOptC.value.trim();
    const optD = formOptD.value.trim();
    const correctSelect = formCorrect.value;

    if (!textVal || !optA || !optB || !optC || !optD || !correctSelect) {
        alert("Please completely fill out all the question configuration parameters.");
        return;
    }

    const optionsArray = [optA, optB, optC, optD];
    let correctString = "";
    if (correctSelect === "A") correctString = optA;
    if (correctSelect === "B") correctString = optB;
    if (correctSelect === "C") correctString = optC;
    if (correctSelect === "D") correctString = optD;

    masterScenarios.push({
        text: textVal,
        options: optionsArray,
        correct: correctString,
        active: true
    });

    formText.value = '';
    formOptA.value = '';
    formOptB.value = '';
    formOptC.value = '';
    formOptD.value = '';
    formCorrect.value = '';

    updateAdminPanelList();
});

// Copy JSON Clipboard Tool System Hook Engine Element
copyJsonBtn.addEventListener('click', () => {
    jsonOutput.select();
    document.execCommand('copy');
    alert("Configurations copied successfully to clipboard! Update questions.json on GitHub.");
});

// GAMEPLAY SIMULATOR RUNTIME CONTROLLER
function startGame() {
    score = 0;
    currentScenarioIndex = 0;
    scoreDisplay.textContent = score;
   
    if (activeScenarios.length > 0) {
        loadScenario();
    } else {
        scenarioText.textContent = "No active scenarios available. Open configuration settings view to activate questions.";
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
        scenarioText.textContent = `Game Complete! Total Score: ${score} points.`;
        optionsContainer.innerHTML = '';
       
        const restartBtn = document.createElement('button');
        restartBtn.className = 'option-btn';
        restartBtn.style.gridColumn = '1 / -1';
        restartBtn.textContent = 'Play Again';
        restartBtn.addEventListener('click', startGame);
        optionsContainer.appendChild(restartBtn);
    }
}

document.querySelectorAll('.tile').forEach(tile => {
    tile.addEventListener('click', () => {
        const current = document.querySelector('.tile.focused');
        if (current) current.classList.remove('focused');
        tile.classList.add('focused');
    });
});
