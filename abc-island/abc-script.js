// ----------------------------------------------------
// 1. GLOBAL VARIABLES & DATA
// ----------------------------------------------------
let score = 0;
let timeLeft = 10;
let timerInterval;
let currentLevel = 'easy';

const wordData = [
    { letter: 'A', word: 'Apple', emoji: '🍎', audio: 'A_for_Apple.mp3' },
    { letter: 'B', word: 'Ball', emoji: '⚽', audio: 'B_for_Ball.mp3' },
    { letter: 'C', word: 'Cat', emoji: '🐱', audio: 'C_for_Cat.mp3' },
    { letter: 'D', word: 'Dog', emoji: '🐶', audio: 'D_for_Dog.mp3' },
    { letter: 'E', word: 'Elephant', emoji: '🐘', audio: 'E_for_Elephant.mp3' },
    { letter: 'F', word: 'Fish', emoji: '🐟', audio: 'F_for_Fish.mp3' },
    { letter: 'G', word: 'Grapes', emoji: '🍇', audio: 'G_for_Grapes.mp3' },
    { letter: 'H', word: 'Hat', emoji: '🧢', audio: 'H_for_Hat.mp3' },
    { letter: 'I', word: 'Ice Cream', emoji: '🍦', audio: 'I_for_IceCream.mp3' },
    { letter: 'J', word: 'Jug', emoji: '🍶', audio: 'J_for_Jug.mp3' },
    { letter: 'K', word: 'Kite', emoji: '🪁', audio: 'K_for_Kite.mp3' },
    { letter: 'L', word: 'Lion', emoji: '🦁', audio: 'L_for_Lion.mp3' },
    { letter: 'M', word: 'Monkey', emoji: '🐒', audio: 'M_for_Monkey.mp3' },
    { letter: 'N', word: 'Nest', emoji: '🐦', audio: 'N_for_Nest.mp3' },
    { letter: 'O', word: 'Owl', emoji: '🦉', audio: 'O_for_Owl.mp3' },
    { letter: 'P', word: 'Parrot', emoji: '🦜', audio: 'P_for_Parrot.mp3' },
    { letter: 'Q', word: 'Queen', emoji: '👑', audio: 'Q_for_Queen.mp3' },
    { letter: 'R', word: 'Rabbit', emoji: '🐰', audio: 'R_for_Rabbit.mp3' },
    { letter: 'S', word: 'Sun', emoji: '☀️', audio: 'S_for_Sun.mp3' },
    { letter: 'T', word: 'Tiger', emoji: '🐯', audio: 'T_for_Tiger.mp3' },
    { letter: 'U', word: 'Umbrella', emoji: '☂️', audio: 'U_for_Umbrella.mp3' },
    { letter: 'V', word: 'Van', emoji: '🚐', audio: 'V_for_Van.mp3' },
    { letter: 'W', word: 'Watch', emoji: '⌚', audio: 'W_for_Watch.mp3' },
    { letter: 'X', word: 'Xylophone', emoji: '🎹', audio: 'X_for_Xylophone.mp3' },
    { letter: 'Y', word: 'Yak', emoji: '🐂', audio: 'Y_for_Yak.mp3' },
    { letter: 'Z', word: 'Zebra', emoji: '🦓', audio: 'Z_for_Zebra.mp3' }
];

// ----------------------------------------------------
// 2. INITIALIZATION (Runs once on load)
// ----------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    // Alphabet Grid
    const alphabetGrid = document.getElementById('alphabetGrid');
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").forEach((letter, index) => {
        const card = document.createElement('div');
        card.className = 'lollipop-card';
        card.onclick = () => { new Audio(`../Audio/${letter}.mp3`).play().catch(()=>{}); };
        card.innerHTML = `<div class="lollipop-head" style="background-color: ${['#ff7675','#74b9ff','#fdcb6e','#e17055','#b2bec3','#a29bfe','#55efc4'][index%7]}">${letter}</div><div class="lollipop-stick"></div>`;
        alphabetGrid.appendChild(card);
    });

    // Words Grid
    const wordsGrid = document.getElementById('wordsGrid');
    wordData.forEach(item => {
        const card = document.createElement('div');
        card.className = 'word-card';
        card.onclick = () => new Audio(`../Audio/${item.audio}`).play().catch(()=>{});
        card.innerHTML = `<div class="word-emoji">${item.emoji}</div><h3>${item.letter}</h3><p>${item.word}</p>`;
        wordsGrid.appendChild(card);
    });
});

// ----------------------------------------------------
// 3. TAB & QUIZ LOGIC
// ----------------------------------------------------
function openTab(evt, tabName) {
    let tabcontent = document.getElementsByClassName("tab-content");
    for (let i = 0; i < tabcontent.length; i++) tabcontent[i].style.display = "none";
    let tablinks = document.getElementsByClassName("tab-btn");
    for (let i = 0; i < tablinks.length; i++) tablinks[i].classList.remove("active");
    
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.classList.add("active");
    
    if (tabName === 'quiz') renderQuizUI();
    else clearInterval(timerInterval);
}

function renderQuizUI() {
    const quizDiv = document.getElementById('quizContainer');
    quizDiv.innerHTML = `
        <div class="level-container">
            <button class="level-btn ${currentLevel === 'easy' ? 'active' : ''}" onclick="setLevel('easy')">Easy</button>
            <button class="level-btn ${currentLevel === 'hard' ? 'active' : ''}" onclick="setLevel('hard')">Hard</button>
        </div>
        <h2 id="question">Loading...</h2>
        <div id="options" class="options-grid"></div>
        <p id="feedback" style="font-weight:bold;"></p>
    `;
    startQuiz();
}

function setLevel(l) { currentLevel = l; renderQuizUI(); }
function closeModal() { document.getElementById('rewardModal').style.display = 'none'; score = 0; document.getElementById('scoreBoard').innerText = `Score: 0`; }

function startQuiz() {
    clearInterval(timerInterval);
    timeLeft = 10;
    document.getElementById('timer').innerText = `⏰ 10s`;
    
    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').innerText = `⏰ ${timeLeft}s`;
        if (timeLeft <= 0) { clearInterval(timerInterval); startQuiz(); }
    }, 1000);

    const correct = wordData[Math.floor(Math.random() * wordData.length)];
    document.getElementById('question').innerText = currentLevel === 'easy' ? `Which one is for: ${correct.word}?` : `Starts with: ${correct.letter}?`;
    
    const optionsGrid = document.getElementById('options');
    optionsGrid.innerHTML = '';
    let options = [correct];
    while(options.length < 3) {
        let rand = wordData[Math.floor(Math.random() * wordData.length)];
        if(!options.includes(rand)) options.push(rand);
    }
    options.sort(() => Math.random() - 0.5);
    
   options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'quiz-btn';
        btn.innerHTML = `<div style="font-size: 2rem;">${opt.emoji}</div> ${opt.word}`;
        btn.onclick = () => {
            if(opt.letter === correct.letter) {
                // Correct Answer
                score += 10;
                document.getElementById('scoreBoard').innerText = `Score: ${score}`;
                if(score >= 50) document.getElementById('rewardModal').style.display = 'flex';
                
                // Play success sounds
                new Audio('../Audio/clap.mp3').play().catch(()=>{});
                new Audio('../Audio/yay.mp3').play().catch(()=>{});
                
                startQuiz();
            } else { 
                // Incorrect Answer
                document.getElementById('feedback').innerText = "Try again! ❌"; 
                // Play wrong sound
                new Audio('../Audio/wrong.mp3').play().catch(()=>{});
            }
        };
        optionsGrid.appendChild(btn);
    });
}