// Global game variables
let builderDice = [0, 0, 0];
let currentDiceIndex = 0;
let builderSlots = { hundreds: null, tens: null, ones: null };
let bingoNumbers = [];
let bingoCallIndex = 0;
let bingoMarked = 0;
let concessionPrice = 247;
let totalMoney = 0;
let currentEquipmentProblem = null;

// Walk-A-Thon game variables
let walkathonCurrentQuestion = 0;
let walkathonScore = 0;
let walkathonPlayerName = '';

// Scoreboard Showdown (Comparison) game variables
let compareCurrentQuestion = 0;
let compareScore = 0;
let compareNum1 = 0;
let compareNum2 = 0;
let compareCorrectSymbol = '';
const compareTotalQuestions = 10;

// Odd or Even Ballpark game variables
let oddEvenCurrentQuestion = 0;
let oddEvenScore = 0;
let oddEvenCurrentNumber = 0;
const oddEvenTotalQuestions = 10;

const walkathonQuestions = [
    {
        question: "The goal is to walk 500 miles. What is the halfway point?",
        options: [200, 250, 300, 400],
        correct: 250,
        explanation: "Halfway to 500 is 500 ÷ 2 = 250 miles!",
        highlights: [250, 500]
    },
    {
        question: "If students walked 50 miles in the first week, how many more miles do they need to reach 500?",
        options: [400, 450, 475, 500],
        correct: 450,
        explanation: "500 - 50 = 450 miles left to go!",
        highlights: [50, 500]
    },
    {
        question: "After 3 weeks, students walked 275 miles. How many miles do they still need?",
        options: [225, 250, 275, 300],
        correct: 225,
        explanation: "500 - 275 = 225 miles remaining!",
        highlights: [275, 500]
    },
    {
        question: "The week before finishing, students had walked 475 miles. How many miles did they walk in the final week?",
        options: [15, 20, 25, 50],
        correct: 25,
        explanation: "500 - 475 = 25 miles in the final week!",
        highlights: [475, 500]
    }
];

// Baseball snacks array
const ballparkSnacks = [
    { name: "Ballpark Popcorn", description: "Fresh, buttery stadium popcorn!", emoji: "🍿" },
    { name: "Hot Dog Special", description: "Classic ballpark hot dog with mustard!", emoji: "🌭" },
    { name: "Peanuts & Cracker Jacks", description: "Traditional baseball snacks!", emoji: "🥜" },
    { name: "Cotton Candy", description: "Sweet, fluffy pink cotton candy!", emoji: "🍭" },
    { name: "Nachos Supreme", description: "Cheesy nachos with jalapeños!", emoji: "🧀" },
    { name: "Ice Cold Lemonade", description: "Refreshing ballpark lemonade!", emoji: "🍋" }
];

// Define functions before they're used in event listeners
function addMoney(amount) {
    totalMoney += amount;
    document.getElementById('totalMoney').textContent = `${totalMoney}`;
    // Update wallet display if it's open
    const walletDisplay = document.getElementById('walletTotalMoney');
    if (walletDisplay) {
        walletDisplay.textContent = `${totalMoney}`;
    }

    // Add animation to the cash register
    const cashRegister = document.querySelector('.cash-register');
    cashRegister.classList.add('celebrate');
    setTimeout(() => {
        cashRegister.classList.remove('celebrate');
    }, 600);
}

function removeMoney(amount) {
    if (totalMoney >= amount) {
        totalMoney -= amount;
        document.getElementById('totalMoney').textContent = `${totalMoney}`;
        // Update wallet display if it's open
        const walletDisplay = document.getElementById('walletTotalMoney');
        if (walletDisplay) {
            walletDisplay.textContent = `${totalMoney}`;
        }

        // Add animation to the cash register
        const cashRegister = document.querySelector('.cash-register');
        cashRegister.classList.add('celebrate');
        setTimeout(() => {
            cashRegister.classList.remove('celebrate');
        }, 600);
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', function () {
    // Main menu navigation
    document.getElementById('builderCard').addEventListener('click', () => showGame('builder'));
    document.getElementById('bingoCard').addEventListener('click', () => showGame('bingo'));
    document.getElementById('concessionCard').addEventListener('click', () => showGame('concession'));
    document.getElementById('equipmentCard').addEventListener('click', () => showGame('equipment'));
    document.getElementById('walkathonCard').addEventListener('click', () => showGame('walkathon'));
    document.getElementById('compareCard').addEventListener('click', () => showGame('compare'));
    document.getElementById('oddEvenCard').addEventListener('click', () => showGame('oddEven'));

    // Back buttons
    document.getElementById('builderBackBtn').addEventListener('click', showMainMenu);
    document.getElementById('bingoBackBtn').addEventListener('click', showMainMenu);
    document.getElementById('concessionBackBtn').addEventListener('click', showMainMenu);
    document.getElementById('equipmentBackBtn').addEventListener('click', showMainMenu);
    document.getElementById('walkathonBackBtn').addEventListener('click', showMainMenu);
    document.getElementById('compareBackBtn').addEventListener('click', showMainMenu);
    document.getElementById('oddEvenBackBtn').addEventListener('click', showMainMenu);

    // Home Run Derby buttons
    document.getElementById('rollBtn').addEventListener('click', rollDice);

    // Stadium Bingo buttons
    document.getElementById('nextCallBtn').addEventListener('click', nextBingoCall);
    document.getElementById('resetBingoBtn').addEventListener('click', resetBingo);

    // Concession Stand buttons
    document.getElementById('ticketBtn').addEventListener('click', openTicketBooth);
    document.getElementById('closeTicket').addEventListener('click', closeTicketBooth);
    document.getElementById('hundred-btn').addEventListener('click', () => addMoney(100));
    document.getElementById('ten-btn').addEventListener('click', () => addMoney(10));
    document.getElementById('one-btn').addEventListener('click', () => addMoney(1));
    document.getElementById('hundred-plus').addEventListener('click', () => addMoney(100));
    document.getElementById('hundred-minus').addEventListener('click', () => removeMoney(100));
    document.getElementById('ten-plus').addEventListener('click', () => addMoney(10));
    document.getElementById('ten-minus').addEventListener('click', () => removeMoney(10));
    document.getElementById('one-plus').addEventListener('click', () => addMoney(1));
    document.getElementById('one-minus').addEventListener('click', () => removeMoney(1));
    document.getElementById('checkPurchaseBtn').addEventListener('click', checkConcessionPurchase);
    document.getElementById('resetConcessionBtn').addEventListener('click', resetConcession);

    // Equipment Counter buttons
    document.getElementById('checkAnswerBtn').addEventListener('click', checkEquipmentAnswer);
    document.getElementById('newProblemBtn').addEventListener('click', generateNewEquipmentProblem);

    // Walk-A-Thon buttons (removing modal button from initial load)
    document.getElementById('walkathonName').addEventListener('input', function () {
        document.getElementById('startWalkathonBtn').disabled = this.value.trim() === '';
    });
    document.getElementById('walkathonName').addEventListener('keypress', function (e) {
        if (e.key === 'Enter' && !document.getElementById('startWalkathonBtn').disabled) {
            startWalkathonGame();
        }
    });
    document.getElementById('startWalkathonBtn').addEventListener('click', startWalkathonGame);
    document.getElementById('walkathonRestartBtn').addEventListener('click', restartWalkathonGame);

    // Scoreboard Showdown (Comparison) buttons
    document.querySelectorAll('.compare-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            checkCompareAnswer(this.dataset.symbol);
        });
    });
    document.getElementById('compareNextBtn').addEventListener('click', nextCompareQuestion);
    document.getElementById('compareRestartBtn').addEventListener('click', restartCompareGame);

    // Odd or Even Ballpark buttons
    document.querySelectorAll('.odd-even-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            checkOddEvenAnswer(this.dataset.type);
        });
        btn.addEventListener('mouseover', function () {
            this.style.transform = 'scale(1.05) translateY(-5px)';
        });
        btn.addEventListener('mouseout', function () {
            this.style.transform = 'scale(1) translateY(0)';
        });
    });
    document.getElementById('oddEvenNextBtn').addEventListener('click', nextOddEvenQuestion);
    document.getElementById('oddEvenRestartBtn').addEventListener('click', restartOddEvenGame);
});

function showGame(gameId) {
    document.getElementById('mainMenu').style.display = 'none';
    document.querySelectorAll('.game-area').forEach(area => area.style.display = 'none');
    document.getElementById(gameId).style.display = 'block';

    // Initialize specific games
    if (gameId === 'bingo') initBingo();
    if (gameId === 'concession') initConcession();
    if (gameId === 'walkathon') initWalkathon();
    if (gameId === 'compare') initCompare();
    if (gameId === 'oddEven') initOddEven();
    if (gameId === 'equipment') {
        generateNewEquipmentProblem();
        // Focus will be set by generateNewEquipmentProblem()
    }
}

function showMainMenu() {
    document.getElementById('mainMenu').style.display = 'grid';
    document.querySelectorAll('.game-area').forEach(area => area.style.display = 'none');
}

// ===== HOME RUN DERBY GAME =====
function rollDice() {
    // Reset the game state first
    resetBuilder();

    builderDice = [
        Math.floor(Math.random() * 9) + 1,
        Math.floor(Math.random() * 9) + 1,
        Math.floor(Math.random() * 9) + 1
    ];

    document.getElementById('dice1').textContent = builderDice[0];
    document.getElementById('dice2').textContent = builderDice[1];
    document.getElementById('dice3').textContent = builderDice[2];

    document.getElementById('numberDisplay').textContent = 'Click a baseball, then a base!';

    // Add click handlers to dice (now bases)
    document.getElementById('dice1').onclick = () => selectDice(0);
    document.getElementById('dice2').onclick = () => selectDice(1);
    document.getElementById('dice3').onclick = () => selectDice(2);

    // Add click handlers to base slots
    document.querySelectorAll('.base-slot').forEach(slot => {
        slot.onclick = () => placeInSlot(slot.dataset.place);
    });
}

function selectDice(index) {
    if (builderDice[index] === null) return;

    currentDiceIndex = index;
    document.querySelectorAll('.base').forEach((base, i) => {
        base.style.background = i === index ? '#1976d2' : '#fffacd';
        base.style.color = i === index ? 'white' : '#8b4513';
    });
}

function placeInSlot(place) {
    if (currentDiceIndex === null || builderDice[currentDiceIndex] === null) return;
    if (builderSlots[place] !== null) return;

    builderSlots[place] = builderDice[currentDiceIndex];
    builderDice[currentDiceIndex] = null;

    // Update base slot display
    const slot = document.querySelector(`[data-place="${place}"]`);
    slot.textContent = builderSlots[place];
    slot.classList.add('filled');

    // Update base display
    document.querySelectorAll('.base')[currentDiceIndex].textContent = '⚾';
    document.querySelectorAll('.base')[currentDiceIndex].style.background = '#388e3c';
    document.querySelectorAll('.base')[currentDiceIndex].style.color = 'white';
    document.querySelectorAll('.base')[currentDiceIndex].onclick = null;

    updateBuilderNumber();
    currentDiceIndex = null;
}

function updateBuilderNumber() {
    const hundreds = builderSlots.hundreds || 0;
    const tens = builderSlots.tens || 0;
    const ones = builderSlots.ones || 0;

    const number = hundreds * 100 + tens * 10 + ones;
    document.getElementById('numberDisplay').textContent = number;

    // Check if game is complete
    if (builderSlots.hundreds !== null && builderSlots.tens !== null && builderSlots.ones !== null) {
        document.getElementById('numberDisplay').textContent += ' 🏆';
        document.getElementById('numberDisplay').classList.add('celebrate');
    }
}

function resetBuilder() {
    builderDice = [0, 0, 0];
    currentDiceIndex = null;
    builderSlots = { hundreds: null, tens: null, ones: null };

    document.querySelectorAll('.base').forEach(base => {
        base.textContent = '?';
        base.style.background = '#fffacd';
        base.style.color = '#8b4513';
        base.onclick = null;
    });

    document.querySelectorAll('.base-slot').forEach(slot => {
        slot.classList.remove('filled');
        const placeName = slot.dataset.place === 'hundreds' ? 'Home Plate' :
            slot.dataset.place === 'tens' ? 'First Base' : 'Second Base';
        const multiplier = slot.dataset.place === 'hundreds' ? '100' :
            slot.dataset.place === 'tens' ? '10' : '1';
        slot.innerHTML = `<span>${placeName}</span><small>×${multiplier}</small>`;
        slot.onclick = null;
    });

    document.getElementById('numberDisplay').textContent = 'Click "Play Ball!" to start!';
    document.getElementById('numberDisplay').classList.remove('celebrate');
}

// ===== STADIUM BINGO GAME =====
function initBingo() {
    generateBingoCard();
    bingoCallIndex = 0;
    bingoMarked = 0;
    document.getElementById('callDisplay').textContent = 'Click "Next Announcement" to start!';
    document.getElementById('bingoFeedback').style.display = 'none';
}

function generateBingoCard() {
    const grid = document.getElementById('bingoGrid');
    grid.innerHTML = '';

    // Generate 25 random numbers for bingo card
    const numbers = [];
    while (numbers.length < 25) {
        const num = Math.floor(Math.random() * 900) + 100; // 3-digit numbers
        if (!numbers.includes(num)) {
            numbers.push(num);
        }
    }

    numbers.forEach((num, index) => {
        const cell = document.createElement('div');
        cell.className = 'stadium-seat';
        cell.textContent = num;
        cell.dataset.number = num;
        cell.addEventListener('click', () => markBingoCell(cell));
        grid.appendChild(cell);
    });

    bingoNumbers = numbers.slice();
    generateBingoCalls();
}

function generateBingoCalls() {
    const calls = [
        { text: "Find a seat with 4 in the hundreds place", answer: num => Math.floor(num / 100) === 4 },
        { text: "Find a seat with 7 in the tens place", answer: num => Math.floor((num % 100) / 10) === 7 },
        { text: "Find a seat with 3 in the ones place", answer: num => num % 10 === 3 },
        { text: "Find a seat with 5 in the hundreds place", answer: num => Math.floor(num / 100) === 5 },
        { text: "Find a seat with 0 in the tens place", answer: num => Math.floor((num % 100) / 10) === 0 },
        { text: "Find a seat with 8 in the ones place", answer: num => num % 10 === 8 },
        { text: "Find a seat with 2 in the hundreds place", answer: num => Math.floor(num / 100) === 2 },
        { text: "Find a seat with 9 in the tens place", answer: num => Math.floor((num % 100) / 10) === 9 },
        { text: "Find a seat with 1 in the ones place", answer: num => num % 10 === 1 },
        { text: "Find a seat with 6 in the hundreds place", answer: num => Math.floor(num / 100) === 6 }
    ];

    // Filter calls to only include those with valid answers on the card
    bingoNumbers.calls = calls.filter(call =>
        bingoNumbers.some(num => call.answer(num))
    ).slice(0, 8);
}

function nextBingoCall() {
    if (!bingoNumbers.calls || bingoCallIndex >= bingoNumbers.calls.length) {
        document.getElementById('callDisplay').textContent = 'Game Over! Great job finding your seats! ⚾';
        return;
    }

    const call = bingoNumbers.calls[bingoCallIndex];
    document.getElementById('callDisplay').textContent = call.text;
    bingoCallIndex++;
}

function markBingoCell(cell) {
    if (cell.classList.contains('marked')) return;
    if (bingoCallIndex === 0) return;

    const number = parseInt(cell.dataset.number);
    const currentCall = bingoNumbers.calls[bingoCallIndex - 1];

    if (currentCall && currentCall.answer(number)) {
        cell.classList.add('marked');
        bingoMarked++;
        showBingoFeedback('Home run! Great seat choice! ⚾', 'success');

        if (bingoMarked >= 5) {
            setTimeout(() => {
                showBingoFeedback('GRAND SLAM! You won the stadium game! 🏆', 'success');
            }, 1000);
        }
    } else {
        showBingoFeedback('Foul ball! Try a different seat!', 'error');
    }
}

function showBingoFeedback(message, type) {
    const feedback = document.getElementById('bingoFeedback');
    feedback.textContent = message;
    feedback.className = `feedback ${type}`;
    feedback.style.display = 'block';

    setTimeout(() => {
        feedback.style.display = 'none';
    }, 2000);
}

function resetBingo() {
    initBingo();
}

// ===== CONCESSION STAND GAME =====
function initConcession() {
    concessionPrice = Math.floor(Math.random() * 800) + 100; // $100-$899
    totalMoney = 0;

    // Pick a random snack
    const randomSnack = ballparkSnacks[Math.floor(Math.random() * ballparkSnacks.length)];
    document.getElementById('productEmoji').textContent = randomSnack.emoji;
    document.getElementById('productName').textContent = randomSnack.name;
    document.getElementById('productDescription').textContent = randomSnack.description;

    document.getElementById('concessionPrice').textContent = `${concessionPrice}`;
    document.getElementById('totalMoney').textContent = `${totalMoney}`;
    document.getElementById('concessionFeedback').style.display = 'none';
}

function openTicketBooth() {
    // Make sure ticket booth price is synced when opening
    document.getElementById('ticketConcessionPrice').textContent = `${concessionPrice}`;
    document.getElementById('ticketOverlay').style.display = 'flex';
}

function closeTicketBooth() {
    document.getElementById('ticketOverlay').style.display = 'none';
}

function checkConcessionPurchase() {
    const feedback = document.getElementById('concessionFeedback');

    if (totalMoney === concessionPrice) {
        feedback.textContent = '⚾ Perfect! You scored! Enjoy your ballpark snack!';
        feedback.className = 'feedback success';
        feedback.style.display = 'block';
    } else if (totalMoney > concessionPrice) {
        const change = totalMoney - concessionPrice;
        feedback.textContent = `💰 You have too much! You need ${change} in change.`;
        feedback.className = 'feedback error';
        feedback.style.display = 'block';
    } else {
        const needed = concessionPrice - totalMoney;
        feedback.textContent = `💸 You need ${needed} more to buy this snack!`;
        feedback.className = 'feedback error';
        feedback.style.display = 'block';
    }
}

function resetConcession() {
    initConcession();
    closeTicketBooth();
}

// ===== EQUIPMENT COUNTER GAME =====
function generateNewEquipmentProblem() {
    const gloves = Math.floor(Math.random() * 7); // 0-6 gloves
    const bats = Math.floor(Math.random() * 10); // 0-9 bats
    const balls = Math.floor(Math.random() * 10); // 0-9 balls

    currentEquipmentProblem = {
        gloves: gloves,
        bats: bats,
        balls: balls,
        answer: gloves * 100 + bats * 10 + balls
    };

    renderEquipment();
    document.getElementById('equipmentAnswer').value = '';
    document.getElementById('equipmentFeedback').style.display = 'none';

    // Auto-focus the input box
    setTimeout(() => {
        document.getElementById('equipmentAnswer').focus();
    }, 100);
}

function renderEquipment() {
    const container = document.getElementById('equipmentContainer');
    container.innerHTML = '';

    // Add glove blocks
    for (let i = 0; i < currentEquipmentProblem.gloves; i++) {
        const gloveBlock = document.createElement('div');
        gloveBlock.className = 'glove-block';

        for (let j = 0; j < 100; j++) {
            const cell = document.createElement('div');
            cell.className = 'glove-cell';
            gloveBlock.appendChild(cell);
        }

        container.appendChild(gloveBlock);
    }

    // Add bat blocks
    for (let i = 0; i < currentEquipmentProblem.bats; i++) {
        const batBlock = document.createElement('div');
        batBlock.className = 'bat-block';

        for (let j = 0; j < 10; j++) {
            const cell = document.createElement('div');
            cell.className = 'bat-cell';
            batBlock.appendChild(cell);
        }

        container.appendChild(batBlock);
    }

    // Add ball blocks
    for (let i = 0; i < currentEquipmentProblem.balls; i++) {
        const ballBlock = document.createElement('div');
        ballBlock.className = 'ball-block';
        container.appendChild(ballBlock);
    }
}

function checkEquipmentAnswer() {
    const userAnswer = parseInt(document.getElementById('equipmentAnswer').value);
    const feedback = document.getElementById('equipmentFeedback');

    if (isNaN(userAnswer)) {
        feedback.textContent = 'Please enter a number!';
        feedback.className = 'feedback error';
        feedback.style.display = 'block';
        // Keep focus in the input box
        document.getElementById('equipmentAnswer').focus();
        return;
    }

    if (userAnswer === currentEquipmentProblem.answer) {
        feedback.textContent = `⚾ Home Run! The total is ${currentEquipmentProblem.answer}!`;
        feedback.className = 'feedback success';
        feedback.style.display = 'block';

        // Add celebration animation to the container
        document.getElementById('equipmentContainer').classList.add('celebrate');
        setTimeout(() => {
            document.getElementById('equipmentContainer').classList.remove('celebrate');
        }, 600);
    } else {
        const hint = `${currentEquipmentProblem.gloves} gloves + ${currentEquipmentProblem.bats} bats + ${currentEquipmentProblem.balls} balls = ${currentEquipmentProblem.gloves}×100 + ${currentEquipmentProblem.bats}×10 + ${currentEquipmentProblem.balls}×1`;
        feedback.innerHTML = `⚾ Strike out! The correct answer is ${currentEquipmentProblem.answer}.<br><small>Hint: ${hint}</small>`;
        feedback.className = 'feedback error';
        feedback.style.display = 'block';
        // Keep focus in the input box for retry
        document.getElementById('equipmentAnswer').focus();
        document.getElementById('equipmentAnswer').select(); // Select text for easy replacement
    }
}

// ===== WALK-A-THON GAME =====
function initWalkathon() {
    walkathonCurrentQuestion = 0;
    walkathonScore = 0;
    walkathonPlayerName = '';
    document.getElementById('walkathonName').value = '';
    document.getElementById('startWalkathonBtn').disabled = true;

    document.getElementById('walkathonStart').style.display = 'block';
    document.getElementById('walkathonGame').style.display = 'none';
    document.getElementById('walkathonResults').style.display = 'none';

    createWalkathonNumberLine();
}

function createWalkathonNumberLine(highlights = []) {
    const marks = [0, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500];
    const numberLine = document.getElementById('walkathonNumberLine');
    numberLine.innerHTML = '';

    marks.forEach(mark => {
        const markDiv = document.createElement('div');
        markDiv.style.display = 'flex';
        markDiv.style.flexDirection = 'column';
        markDiv.style.alignItems = 'center';
        markDiv.style.position = 'relative';

        const tick = document.createElement('div');
        tick.style.width = highlights.includes(mark) ? '4px' : '3px';
        tick.style.height = highlights.includes(mark) ? '25px' : '20px';
        tick.style.background = highlights.includes(mark) ? '#f44336' : '#333';
        tick.style.marginBottom = '10px';

        const label = document.createElement('span');
        label.style.fontSize = highlights.includes(mark) ? '14px' : '12px';
        label.style.fontWeight = 'bold';
        label.style.color = highlights.includes(mark) ? '#f44336' : '#333';
        label.textContent = mark;

        markDiv.appendChild(tick);
        markDiv.appendChild(label);
        numberLine.appendChild(markDiv);
    });
}

function startWalkathonGame() {
    walkathonPlayerName = document.getElementById('walkathonName').value.trim();
    if (walkathonPlayerName) {
        document.getElementById('walkathonStart').style.display = 'none';
        document.getElementById('walkathonGame').style.display = 'block';
        displayWalkathonQuestion();
    }
}

function displayWalkathonQuestion() {
    const question = walkathonQuestions[walkathonCurrentQuestion];
    document.getElementById('walkathonQuestion').textContent = question.question;
    document.getElementById('walkathonQuestionNum').textContent = `Question ${walkathonCurrentQuestion + 1} of ${walkathonQuestions.length}`;
    document.getElementById('walkathonScore').textContent = walkathonScore;

    createWalkathonNumberLine(question.highlights);

    // Create options
    const optionsContainer = document.getElementById('walkathonOptions');
    optionsContainer.innerHTML = '';
    question.options.forEach(option => {
        const optionBtn = document.createElement('button');
        optionBtn.style.background = '#e3f2fd';
        optionBtn.style.border = '3px solid #2196f3';
        optionBtn.style.color = '#1976d2';
        optionBtn.style.padding = '20px';
        optionBtn.style.fontSize = '1.2em';
        optionBtn.style.fontWeight = 'bold';
        optionBtn.style.borderRadius = '10px';
        optionBtn.style.cursor = 'pointer';
        optionBtn.style.transition = 'all 0.3s';
        optionBtn.style.textAlign = 'center';
        optionBtn.textContent = `${option} miles`;
        optionBtn.addEventListener('click', () => selectWalkathonAnswer(option, optionBtn));
        optionBtn.addEventListener('mouseover', function () {
            this.style.background = '#bbdefb';
            this.style.transform = 'scale(1.05)';
        });
        optionBtn.addEventListener('mouseout', function () {
            this.style.background = '#e3f2fd';
            this.style.transform = 'scale(1)';
        });
        optionsContainer.appendChild(optionBtn);
    });

    // Hide feedback and next button (no longer needed since we use modal)
}

function selectWalkathonAnswer(selectedAnswer, selectedBtn) {
    const question = walkathonQuestions[walkathonCurrentQuestion];
    const allOptions = document.querySelectorAll('#walkathonOptions button');

    // Disable all options
    allOptions.forEach(option => {
        option.style.pointerEvents = 'none';
        option.style.background = '#f5f5f5';
        option.style.borderColor = '#ccc';
        option.style.color = '#999';
    });

    // Show correct/incorrect styling
    allOptions.forEach(option => {
        const optionValue = parseInt(option.textContent);
        if (optionValue === question.correct) {
            option.style.background = '#c8e6c9';
            option.style.borderColor = '#4caf50';
            option.style.color = '#2e7d32';
        } else if (optionValue === selectedAnswer) {
            option.style.background = '#ffcdd2';
            option.style.borderColor = '#f44336';
            option.style.color = '#c62828';
        }
    });

    // Show modal with feedback
    setTimeout(() => {
        showWalkathonModal(selectedAnswer === question.correct, question.explanation);
    }, 500);
}

function showWalkathonModal(isCorrect, explanation) {
    // Create modal dynamically if it doesn't exist
    let modal = document.getElementById('walkathonModal');
    if (!modal) {
        modal = createWalkathonModal();
    }

    const emoji = document.getElementById('walkathonModalEmoji');
    const title = document.getElementById('walkathonModalTitle');
    const text = document.getElementById('walkathonModalText');
    const nextBtn = document.getElementById('walkathonModalNextBtn');

    if (isCorrect) {
        walkathonScore++;
        // Update the score display immediately
        const scoreDisplay = document.getElementById('walkathonScore');
        if (scoreDisplay) {
            scoreDisplay.textContent = walkathonScore;
        }
        emoji.textContent = '🎉';
        title.textContent = 'Correct!';
        title.style.color = '#2e7d32';
    } else {
        emoji.textContent = '❌';
        title.textContent = 'Not quite right.';
        title.style.color = '#d32f2f';
    }

    text.textContent = explanation;

    // Update button text
    if (walkathonCurrentQuestion < walkathonQuestions.length - 1) {
        nextBtn.textContent = 'Next Question 👟';
    } else {
        nextBtn.textContent = 'See Results! 🏁';
    }

    modal.style.display = 'flex';
}

function createWalkathonModal() {
    // Create modal HTML dynamically
    const modal = document.createElement('div');
    modal.id = 'walkathonModal';
    modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); display: none; z-index: 1001; justify-content: center; align-items: center;';

    const modalContent = document.createElement('div');
    modalContent.style.cssText = 'background: white; border-radius: 20px; padding: 40px; text-align: center; box-shadow: 0 15px 35px rgba(0,0,0,0.3); max-width: 500px; width: 90%; border: 3px solid #8b4513;';

    const emoji = document.createElement('div');
    emoji.id = 'walkathonModalEmoji';
    emoji.style.cssText = 'font-size: 4em; margin-bottom: 20px;';
    emoji.textContent = '🎉';

    const title = document.createElement('div');
    title.id = 'walkathonModalTitle';
    title.style.cssText = 'font-size: 2em; font-weight: bold; margin-bottom: 20px; color: #2e7d32;';
    title.textContent = 'Correct!';

    const text = document.createElement('div');
    text.id = 'walkathonModalText';
    text.style.cssText = 'font-size: 1.3em; color: #555; margin-bottom: 30px; line-height: 1.4;';
    text.textContent = 'Great job!';

    const nextBtn = document.createElement('button');
    nextBtn.id = 'walkathonModalNextBtn';
    nextBtn.className = 'btn btn-success';
    nextBtn.style.cssText = 'font-size: 1.3em; padding: 15px 30px; background: #388e3c; color: white; border: none; border-radius: 10px; cursor: pointer; font-weight: bold; transition: all 0.3s;';
    nextBtn.textContent = 'Next Question 👟';
    nextBtn.onclick = nextWalkathonQuestionFromModal;

    modalContent.appendChild(emoji);
    modalContent.appendChild(title);
    modalContent.appendChild(text);
    modalContent.appendChild(nextBtn);
    modal.appendChild(modalContent);

    document.body.appendChild(modal);

    return modal;
}

function nextWalkathonQuestionFromModal() {
    // Close modal
    const modal = document.getElementById('walkathonModal');
    if (modal) {
        modal.style.display = 'none';
    }

    if (walkathonCurrentQuestion < walkathonQuestions.length - 1) {
        walkathonCurrentQuestion++;
        displayWalkathonQuestion();
    } else {
        showWalkathonResults();
    }
}

function showWalkathonResults() {
    document.getElementById('walkathonGame').style.display = 'none';
    document.getElementById('walkathonResults').style.display = 'block';

    document.getElementById('walkathonFinalName').textContent = walkathonPlayerName;
    document.getElementById('walkathonFinalScore').textContent = walkathonScore;

    const percentage = Math.round((walkathonScore / walkathonQuestions.length) * 100);

    if (percentage >= 75) {
        document.getElementById('walkathonResultsEmoji').textContent = '🏆';
        document.getElementById('walkathonResultsMessage').textContent = "Excellent! You're a number line champion!";
    } else if (percentage >= 50) {
        document.getElementById('walkathonResultsEmoji').textContent = '⭐';
        document.getElementById('walkathonResultsMessage').textContent = "Good job! Keep practicing those number skills!";
    } else {
        document.getElementById('walkathonResultsEmoji').textContent = '🌟';
        document.getElementById('walkathonResultsMessage').textContent = "Nice try! Practice makes perfect!";
    }
}

function restartWalkathonGame() {
    initWalkathon();
}

// ===== SCOREBOARD SHOWDOWN (COMPARISON) GAME =====
function initCompare() {
    compareCurrentQuestion = 0;
    compareScore = 0;
    document.getElementById('compareScore').textContent = compareScore;
    document.getElementById('compareResults').style.display = 'none';
    document.getElementById('compareFeedback').style.display = 'none';
    document.getElementById('compareNextBtn').style.display = 'none';

    // Enable all buttons
    document.querySelectorAll('.compare-btn').forEach(btn => {
        btn.style.pointerEvents = 'auto';
        btn.style.opacity = '1';
    });

    generateCompareQuestion();
}

function generateCompareQuestion() {
    compareCurrentQuestion++;
    document.getElementById('compareQuestionNum').textContent = `Question ${compareCurrentQuestion} of ${compareTotalQuestions}`;
    document.getElementById('compareFeedback').style.display = 'none';
    document.getElementById('compareNextBtn').style.display = 'none';

    // Generate two random numbers (1-999)
    compareNum1 = Math.floor(Math.random() * 999) + 1;
    compareNum2 = Math.floor(Math.random() * 999) + 1;

    // Determine correct symbol
    if (compareNum1 < compareNum2) {
        compareCorrectSymbol = '<';
    } else if (compareNum1 > compareNum2) {
        compareCorrectSymbol = '>';
    } else {
        compareCorrectSymbol = '=';
    }

    // Display numbers
    document.getElementById('compareNum1').textContent = compareNum1;
    document.getElementById('compareNum2').textContent = compareNum2;

    // Enable all buttons
    document.querySelectorAll('.compare-btn').forEach(btn => {
        btn.style.pointerEvents = 'auto';
        btn.style.opacity = '1';
        // Reset button styles
        if (btn.dataset.symbol === '<') {
            btn.style.background = '#e3f2fd';
            btn.style.borderColor = '#1976d2';
            btn.style.color = '#1976d2';
        } else if (btn.dataset.symbol === '=') {
            btn.style.background = '#fff9c4';
            btn.style.borderColor = '#f57c00';
            btn.style.color = '#f57c00';
        } else {
            btn.style.background = '#ffcdd2';
            btn.style.borderColor = '#d32f2f';
            btn.style.color = '#d32f2f';
        }
    });
}

function checkCompareAnswer(selectedSymbol) {
    const feedback = document.getElementById('compareFeedback');
    const isCorrect = selectedSymbol === compareCorrectSymbol;

    // Disable all buttons after selection
    document.querySelectorAll('.compare-btn').forEach(btn => {
        btn.style.pointerEvents = 'none';

        // Highlight correct answer in green
        if (btn.dataset.symbol === compareCorrectSymbol) {
            btn.style.background = '#c8e6c9';
            btn.style.borderColor = '#4caf50';
            btn.style.color = '#2e7d32';
        }

        // Highlight wrong answer in red if it was selected
        if (btn.dataset.symbol === selectedSymbol && !isCorrect) {
            btn.style.background = '#ffcdd2';
            btn.style.borderColor = '#f44336';
            btn.style.color = '#c62828';
        }

        // Fade out non-selected wrong answers
        if (btn.dataset.symbol !== compareCorrectSymbol && btn.dataset.symbol !== selectedSymbol) {
            btn.style.opacity = '0.3';
        }
    });

    if (isCorrect) {
        compareScore++;
        document.getElementById('compareScore').textContent = compareScore;
        feedback.textContent = `⚾ Home Run! ${compareNum1} ${compareCorrectSymbol} ${compareNum2} is correct!`;
        feedback.className = 'feedback success';
    } else {
        feedback.textContent = `❌ Strike out! The correct answer is ${compareNum1} ${compareCorrectSymbol} ${compareNum2}`;
        feedback.className = 'feedback error';
    }

    feedback.style.display = 'block';

    // Show next button or results
    if (compareCurrentQuestion < compareTotalQuestions) {
        document.getElementById('compareNextBtn').style.display = 'block';
    } else {
        setTimeout(() => {
            showCompareResults();
        }, 2000);
    }
}

function nextCompareQuestion() {
    if (compareCurrentQuestion < compareTotalQuestions) {
        generateCompareQuestion();
    }
}

function showCompareResults() {
    // Hide game elements
    document.getElementById('compareFeedback').style.display = 'none';
    document.getElementById('compareNextBtn').style.display = 'none';
    document.querySelectorAll('.compare-btn').forEach(btn => btn.parentElement.style.display = 'none');

    // Show results
    const results = document.getElementById('compareResults');
    results.style.display = 'block';

    document.getElementById('compareFinalScore').textContent = compareScore;

    const percentage = Math.round((compareScore / compareTotalQuestions) * 100);

    if (percentage >= 90) {
        document.getElementById('compareResultsEmoji').textContent = '🏆';
        document.getElementById('compareResultsMessage').textContent = "Perfect game! You're a comparison champion!";
    } else if (percentage >= 70) {
        document.getElementById('compareResultsEmoji').textContent = '⭐';
        document.getElementById('compareResultsMessage').textContent = "Great job! You really know your comparison symbols!";
    } else if (percentage >= 50) {
        document.getElementById('compareResultsEmoji').textContent = '👍';
        document.getElementById('compareResultsMessage').textContent = "Good effort! Keep practicing those comparisons!";
    } else {
        document.getElementById('compareResultsEmoji').textContent = '🌟';
        document.getElementById('compareResultsMessage').textContent = "Nice try! Practice makes perfect!";
    }
}

function restartCompareGame() {
    // Show game elements again
    document.querySelectorAll('.compare-btn').forEach(btn => btn.parentElement.style.display = 'flex');
    initCompare();
}

// ===== ODD OR EVEN BALLPARK GAME =====
function initOddEven() {
    oddEvenCurrentQuestion = 0;
    oddEvenScore = 0;
    document.getElementById('oddEvenScore').textContent = oddEvenScore;
    document.getElementById('oddEvenResults').style.display = 'none';
    document.getElementById('oddEvenFeedback').style.display = 'none';
    document.getElementById('oddEvenNextBtn').style.display = 'none';
    document.getElementById('oddEvenVisual').style.display = 'none';

    // Enable all buttons
    document.querySelectorAll('.odd-even-btn').forEach(btn => {
        btn.style.pointerEvents = 'auto';
        btn.style.opacity = '1';
    });

    generateOddEvenQuestion();
}

function generateOddEvenQuestion() {
    oddEvenCurrentQuestion++;
    document.getElementById('oddEvenFeedback').style.display = 'none';
    document.getElementById('oddEvenNextBtn').style.display = 'none';
    document.getElementById('oddEvenVisual').style.display = 'none';

    // Generate random number (1-100 for easier learning, can include up to 999)
    oddEvenCurrentNumber = Math.floor(Math.random() * 100) + 1;

    // Display the number
    document.getElementById('oddEvenNumber').textContent = oddEvenCurrentNumber;

    // Enable all buttons and reset styles
    document.querySelectorAll('.odd-even-btn').forEach(btn => {
        btn.style.pointerEvents = 'auto';
        btn.style.opacity = '1';
        if (btn.dataset.type === 'even') {
            btn.style.background = 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)';
            btn.style.borderColor = '#0d47a1';
        } else {
            btn.style.background = 'linear-gradient(135deg, #d32f2f 0%, #f44336 100%)';
            btn.style.borderColor = '#b71c1c';
        }
    });
}

function checkOddEvenAnswer(selectedType) {
    const isEven = oddEvenCurrentNumber % 2 === 0;
    const correctType = isEven ? 'even' : 'odd';
    const isCorrect = selectedType === correctType;
    const feedback = document.getElementById('oddEvenFeedback');

    // Disable all buttons after selection
    document.querySelectorAll('.odd-even-btn').forEach(btn => {
        btn.style.pointerEvents = 'none';

        // Highlight correct answer in bright green
        if (btn.dataset.type === correctType) {
            btn.style.background = 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)';
            btn.style.borderColor = '#2e7d32';
        }

        // Highlight wrong answer if it was selected
        if (btn.dataset.type === selectedType && !isCorrect) {
            btn.style.background = 'linear-gradient(135deg, #757575 0%, #9e9e9e 100%)';
            btn.style.borderColor = '#424242';
        }

        // Fade out non-selected wrong answer
        if (btn.dataset.type !== correctType && btn.dataset.type !== selectedType) {
            btn.style.opacity = '0.3';
        }
    });

    // Show visual helper
    showOddEvenVisual();

    if (isCorrect) {
        oddEvenScore++;
        document.getElementById('oddEvenScore').textContent = oddEvenScore;
        const lastDigit = oddEvenCurrentNumber % 10;
        feedback.innerHTML = `⚾ Home Run! ${oddEvenCurrentNumber} is ${correctType.toUpperCase()}!<br><small>It ends in ${lastDigit}, which is an ${correctType} number.</small>`;
        feedback.className = 'feedback success';
    } else {
        const lastDigit = oddEvenCurrentNumber % 10;
        feedback.innerHTML = `❌ Strike out! ${oddEvenCurrentNumber} is ${correctType.toUpperCase()}, not ${selectedType}!<br><small>Look at the last digit: ${lastDigit} is an ${correctType} number.</small>`;
        feedback.className = 'feedback error';
    }

    feedback.style.display = 'block';

    // Show next button or results
    if (oddEvenCurrentQuestion < oddEvenTotalQuestions) {
        document.getElementById('oddEvenNextBtn').style.display = 'block';
    } else {
        setTimeout(() => {
            showOddEvenResults();
        }, 3000);
    }
}

function showOddEvenVisual() {
    const visual = document.getElementById('oddEvenVisual');
    const pairsContainer = document.getElementById('oddEvenPairs');
    const pairsText = document.getElementById('oddEvenPairsText');

    pairsContainer.innerHTML = '';

    // Create visual representation of pairs (limited to first 10 for space)
    const pairs = Math.floor(oddEvenCurrentNumber / 2);
    const hasLeftover = oddEvenCurrentNumber % 2 === 1;
    const displayPairs = Math.min(pairs, 10);

    // Show pairs with more spacing between pairs
    for (let i = 0; i < displayPairs; i++) {
        const pair = document.createElement('div');
        pair.style.cssText = 'display: flex; gap: 2px; margin: 3px;';
        pair.innerHTML = '<div style="width: 18px; height: 18px; background: #4caf50; border-radius: 50%; border: 1px solid #2e7d32;"></div><div style="width: 18px; height: 18px; background: #4caf50; border-radius: 50%; border: 1px solid #2e7d32;"></div>';
        pairsContainer.appendChild(pair);
    }

    if (pairs > 10) {
        const more = document.createElement('div');
        more.style.cssText = 'font-size: 0.8em; color: #666; margin: 3px;';
        more.textContent = `+${pairs - 10} more pairs...`;
        pairsContainer.appendChild(more);
    }

    // Show leftover if odd
    if (hasLeftover) {
        const leftover = document.createElement('div');
        leftover.style.cssText = 'display: flex; gap: 2px; margin: 3px;';
        leftover.innerHTML = '<div style="width: 18px; height: 18px; background: #ff9800; border-radius: 50%; border: 1px solid #f57c00;"></div><div style="width: 18px; height: 18px; border: 1px dashed #ccc; border-radius: 50%;"></div>';
        pairsContainer.appendChild(leftover);
    }

    // Set text
    if (hasLeftover) {
        pairsText.innerHTML = `<span style="color: #f57c00;">+1 left</span> → <strong style="color: #d32f2f;">ODD</strong>`;
    } else {
        pairsText.innerHTML = `All paired → <strong style="color: #1976d2;">EVEN</strong>`;
    }

    visual.style.display = 'block';
}

function nextOddEvenQuestion() {
    if (oddEvenCurrentQuestion < oddEvenTotalQuestions) {
        generateOddEvenQuestion();
    }
}

function showOddEvenResults() {
    // Hide game elements
    document.getElementById('oddEvenFeedback').style.display = 'none';
    document.getElementById('oddEvenNextBtn').style.display = 'none';
    document.getElementById('oddEvenVisual').style.display = 'none';
    document.querySelectorAll('.odd-even-btn').forEach(btn => btn.style.display = 'none');
    document.getElementById('oddEvenNumber').parentElement.parentElement.style.display = 'none';

    // Show results
    const results = document.getElementById('oddEvenResults');
    results.style.display = 'block';

    document.getElementById('oddEvenFinalScore').textContent = oddEvenScore;

    const percentage = Math.round((oddEvenScore / oddEvenTotalQuestions) * 100);

    if (percentage >= 90) {
        document.getElementById('oddEvenResultsEmoji').textContent = '🏆';
        document.getElementById('oddEvenResultsMessage').textContent = "Perfect! You're an odd and even expert!";
    } else if (percentage >= 70) {
        document.getElementById('oddEvenResultsEmoji').textContent = '⭐';
        document.getElementById('oddEvenResultsMessage').textContent = "Great job! You really understand odd and even!";
    } else if (percentage >= 50) {
        document.getElementById('oddEvenResultsEmoji').textContent = '👍';
        document.getElementById('oddEvenResultsMessage').textContent = "Good effort! Keep practicing!";
    } else {
        document.getElementById('oddEvenResultsEmoji').textContent = '🌟';
        document.getElementById('oddEvenResultsMessage').textContent = "Nice try! Remember: Even ends in 0,2,4,6,8!";
    }
}

function restartOddEvenGame() {
    // Show game elements again
    document.querySelectorAll('.odd-even-btn').forEach(btn => btn.style.display = 'block');
    document.getElementById('oddEvenNumber').parentElement.parentElement.style.display = 'block';
    initOddEven();
}
