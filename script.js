// Screens
const mainMenu = document.getElementById('main-menu');
const gameScreen = document.getElementById('game-screen');

// Triggers & Back Elements
const startGameBtn = document.getElementById('start-game-btn');
const backBtn = document.getElementById('back-btn');
const adminBtn = document.getElementById('admin-btn');

// Gameplay Dom Hooks
const questionText = document.getElementById('question-text');
const optionsGrid = document.getElementById('options-grid');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('time-left');

// Passcode Panels
const pinModal = document.getElementById('pin-modal');
const pinInput = document.getElementById('pin-input');
const pinCancel = document.getElementById('pin-cancel');
const pinSubmit = document.getElementById('pin-submit');

// Administration Panels
const adminModal = document.getElementById('admin-modal');
const adminClose = document.getElementById('admin-close');
const questionsList = document.getElementById('questions-list');
const jsonOutput = document.getElementById('json-output');

// Admin Input Fields
const newQText = document.getElementById('new-q-text');
const newQA = document.getElementById('new-q-a');
const newQB = document.getElementById('new-q-b');
const newQC = document.getElementById('new-q-c');
const newQD = document.getElementById('new-q-d');
const newQCorrect = document.getElementById('new-q-correct');
const saveQBtn = document.getElementById('save-q-btn');
const copyJsonBtn = document.getElementById('copy-json');

// Global System Variables
const ADMIN_PIN = "2026";
let masterScenarios = [];
let score = 0;
let timer;
let timeLeft = 20;
let currentQuestionIndex = 0;

// Dynamic Data Fetcher Pipeline
async function fetchQuestions() {
    try {
        const response = await fetch('questions.json');
        if (!response.ok) throw new Error("Could not find file");
        masterScenarios = await response.json();
    } catch (err) {
        console.log("No file found, setting defaults.");
        masterScenarios = [
            {
                text: "What is the primary baseline price point for light airtime options?",
                options: ["£12.00/mo", "£15.00/mo", "£29.99/mo", "£39.99/mo"],
                correct: "£12.00/mo"
            }
        ];
    }
    updateAdminView();
}

// MAIN APP ROUTING ENGINE
startGameBtn.addEventListener('click', async () => {
    if (masterScenarios.length === 0) {
        await fetchQuestions();
    }
    mainMenu.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    runGameEngine();
});

backBtn.addEventListener('click', () => {
    clearInterval(timer);
    gameScreen.classList.add('hidden');
    mainMenu.classList.remove('hidden');
});

/* --- SECURITY PIN HANDLERS --- */
adminBtn.addEventListener('click', () => {
    pinInput.value = "";
    pinModal.classList.remove('hidden');
});

pinCancel.addEventListener('click', () => {
    pinModal.classList.add('hidden');
});

pinSubmit.addEventListener('click', async () => {
    if (pinInput.value === ADMIN_PIN) {
        pinModal.classList.add('hidden');
        if (masterScenarios.length === 0) {
            await fetchQuestions();
        }
        adminModal.classList.remove('hidden');
    } else {
        alert("Incorrect PIN");
        pinInput.value = "";
    }
});

/* --- ADMINISTRATION ENGINE CONTROLLERS --- */
adminClose.addEventListener('click', () => {
    adminModal.classList.add('hidden');
});

saveQBtn.addEventListener('click', () => {
    const qText = newQText.value.trim();
    const optA = newQA.value.trim();
    const optB = newQB.value.trim();
    const optC = newQC.value.trim();
    const optD = newQD.value.trim();
    const correctLetter = newQCorrect.value;

    if (!qText || !optA || !optB || !optC || !optD || !correctLetter) {
        alert("Fill in all properties before trying to commit data.");
        return;
    }

    const opts = [optA, optB, optC, optD];
    let correctString = "";
    if (correctLetter === "A") correctString = optA;
    if (correctLetter === "B") correctString = optB;
    if (correctLetter === "C") correctString = optC;
    if (correctLetter === "D") correctString = optD;

    masterScenarios.push({
        text: qText,
        options: opts,
        correct: correctString
    });

    newQText.value = "";
    newQA.value = "";
    newQB.value = "";
    newQC.value = "";
    newQD.value = "";
    newQCorrect.value = "";

    updateAdminView();
});

function updateAdminView() {
    questionsList.innerHTML = "";
    masterScenarios.forEach((item, index) => {
        const itemRow = document.createElement('div');
        itemRow.className = "q-list-item";
        itemRow.innerHTML = `
            <span><strong>#${index + 1}:</strong> ${item.text.substring(0, 30)}...</span>
            <button class="delete-btn" onclick="removeQuestion(${index})">🗑️</button>
        `;
        questionsList.appendChild(itemRow);
    });
    jsonOutput.value = JSON.stringify(masterScenarios, null, 4);
}

window.removeQuestion = function(index) {
    masterScenarios.splice(index, 1);
    updateAdminView();
};

copyJsonBtn.addEventListener('click', () => {
    jsonOutput.select();
    document.execCommand('copy');
    alert("JSON Data configuration package copied!");
});

/* --- GAME RUNTIME LOOP CORE --- */
function runGameEngine() {
    score = 0;
    currentQuestionIndex = 0;
    scoreDisplay.textContent = score;
    renderQuestion();
}

function renderQuestion() {
    clearInterval(timer);
    timeLeft = 20;
    timerDisplay.textContent = timeLeft;

    timer = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            advanceEngine();
        }
    }, 1000);

    const currentData = masterScenarios[currentQuestionIndex];
    questionText.textContent = currentData.text;
    optionsGrid.innerHTML = "";

    currentData.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = "option-btn";
        btn.textContent = opt;
        btn.addEventListener('click', () => evaluateChoice(btn, opt, currentData.correct));
        optionsGrid.appendChild(btn);
    });
}

function evaluateChoice(selectedBtn, pickedVal, realVal) {
    clearInterval(timer);
    const options = optionsGrid.querySelectorAll('.option-btn');
    options.forEach(b => b.style.pointerEvents = "none");

    if (pickedVal === realVal) {
        selectedBtn.classList.add('correct');
        score += 100;
        scoreDisplay.textContent = score;
    } else {
        selectedBtn.classList.add('wrong');
        options.forEach(b => {
            if (b.textContent === realVal) b.classList.add('correct');
        });
    }

    setTimeout(() => {
        advanceEngine();
    }, 1500);
}

function advanceEngine() {
    currentQuestionIndex++;
    if (currentQuestionIndex < masterScenarios.length) {
        renderQuestion();
    } else {
        questionText.textContent = `Sprint Finished! Final Score: ${score}`;
        optionsGrid.innerHTML = "";
        
        const resetBtn = document.createElement('button');
        resetBtn.className = "option-btn";
        resetBtn.textContent = "Restart Sprint Loop";
        resetBtn.style.textAlign = "center";
        resetBtn.addEventListener('click', runGameEngine);
        optionsGrid.appendChild(resetBtn);
    }
}

// Warm up pipeline cache
fetchQuestions();
