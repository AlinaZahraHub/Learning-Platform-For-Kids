// Helper for sounds
function playSound(file) {
    const audio = new Audio(`../Audio/${file}.mp3`);
    audio.play();
}

let selected = [];

function selectColor(color) {
    if (selected.length < 2 && !selected.includes(color)) {
        selected.push(color);
        if (selected.length === 2) performMix();
    }
}

function performMix() {
    const pot = document.getElementById('gummyPot');
    let mixColor = "white";

    if (selected.includes('red') && selected.includes('yellow')) mixColor = "#FFA500";
    else if (selected.includes('blue') && selected.includes('yellow')) mixColor = "#008000";
    else if (selected.includes('red') && selected.includes('blue')) mixColor = "#800080";
    else if (selected.includes('white')) {
        let base = selected.find(c => c !== 'white');
        if (base === 'red') mixColor = "#FFC0CB";
        else if (base === 'blue') mixColor = "#ADD8E6";
    } 
    else if (selected.includes('black')) {
        let base = selected.find(c => c !== 'black');
        if (base === 'red') mixColor = "#8B0000";
        else if (base === 'blue') mixColor = "#00008B";
        else if (base === 'yellow') mixColor = "#808000";
    }
    
    pot.style.backgroundColor = mixColor;
    playSound('clap');
    pot.innerHTML = `<span style="color:white; font-size:2rem; text-shadow: 1px 1px 2px black;">Ta-da!</span>`;
}

function resetMix() {
    selected = [];
    const pot = document.getElementById('gummyPot');
    pot.style.backgroundColor = "white";
    pot.innerHTML = `<span style="font-size:2rem; color:#777;">Mix me!</span>`;
}

function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');
    document.getElementById(tabId).style.display = 'block';
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('btn-' + tabId.replace('sorter','sort')).classList.add('active');
}

function allowDrop(ev) { ev.preventDefault(); }
function drag(ev) { ev.dataTransfer.setData("text", ev.target.id); }
function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    var target = ev.target;
    
    const colorMap = {
        'red-gummy': 'red-basket',
        'blue-gummy': 'blue-basket',
        'yellow-gummy': 'yellow-basket',
        'green-gummy': 'green-basket',
        'pink-gummy': 'pink-basket',
        'purple-gummy': 'purple-basket',
        'brown-gummy': 'brown-basket',
        'black-gummy': 'black-basket',
        'orange-gummy': 'orange-basket',
        'white-gummy': 'white-basket'
    };
    
    if (colorMap[data] === target.id) {
        target.appendChild(document.getElementById(data));
        playSound('clap');
    } else {
        playSound('wrong');
    }
}

function resetSort() {
    const pool = document.getElementById('gummy-pool');
    const items = document.querySelectorAll('.gummy-item');
    items.forEach(item => {
        pool.appendChild(item);
    });
}

function revealGummy(element, color) {
    playSound(color.toLowerCase());
    if (!element.classList.contains('gummy-revealed')) {
        element.innerHTML = `<span style="font-size: 2rem;">🐻</span><br>${color}`;
        element.classList.add('gummy-revealed');
        element.style.color = 'white';
        element.style.textShadow = '2px 2px 4px #000';
        element.style.textAlign = 'center';
    } else {
        element.style.backgroundColor = color.toLowerCase();
        element.style.color = 'white';
        element.style.textShadow = '2px 2px 4px #000';
        element.style.textAlign = 'center';
    }
}

function resetHide() {
    const leaves = document.querySelectorAll('.leaf');
    leaves.forEach(leaf => {
        leaf.innerHTML = 'Leaf 🍃';
        leaf.style.backgroundColor = '#2E8B57';
        leaf.classList.remove('gummy-revealed');
        leaf.style.color = 'white';
        leaf.style.textShadow = '2px 2px 4px #000';
    });
}

const colors = ['red', 'blue', 'yellow', 'green', 'pink', 'purple', 'brown', 'black', 'orange', 'white'];

function startParade() {
    const track = document.getElementById('paradeTrack');
    track.innerHTML = '';
    colors.forEach((color, index) => {
        const gummy = document.createElement('div');
        gummy.className = 'marching-gummy';
        gummy.style.backgroundColor = color;
        if (color === 'white') gummy.style.color = 'black';
        gummy.style.left = (index * 80) + 'px';
        gummy.innerText = '🐻';
        track.appendChild(gummy);
        
        setTimeout(() => {
            playSound(color.toLowerCase()); 
            gummy.style.transform = 'translateY(-30px)';
            setTimeout(() => { gummy.style.transform = 'translateY(0px)'; }, 500);
        }, index * 1000); 
    });

    setTimeout(() => {
        playSound('clap');
    }, colors.length * 1000 + 500);
}

function resetParade() {
    document.getElementById('paradeTrack').innerHTML = '';
}

let currentScore = 0;
let currentCategory = "";

const questionBank = {
    'Mix & Match': [
        { q: "Which two colors make Orange?", a: true, opt: ["Red + Yellow", "Blue + Red"] },
        { q: "What color do you get by mixing Blue and Yellow?", a: true, opt: ["Green", "Purple"] }
    ],
    'Sorting Champion': [
        { q: "Where does the Red gummy go?", a: true, opt: ["Red Bucket", "Blue Bucket"] },
        { q: "Where does the Yellow gummy go?", a: true, opt: ["Yellow Bucket", "Black Bucket"] }
    ],
    'Hidden Shade': [
        { q: "I am hiding under a green leaf, what color am I?", a: true, opt: ["Green", "White"] },
        { q: "If I am hidden and look like the night sky, what color am I?", a: true, opt: ["Black", "Pink"] }
    ],
    'Rainbow Quest': [
        { q: "Which color comes after Red in the rainbow?", a: true, opt: ["Orange", "Purple"] },
        { q: "What is the very last color in a rainbow?", a: true, opt: ["Violet", "Red"] }
    ]
};

function runQuiz(type) {
    document.getElementById('quiz-menu').style.display = 'none';
    document.getElementById('quiz-area').style.display = 'block';
    currentCategory = type;

    if (type === 'Master Reward') {
        let qArea = document.getElementById('question');
        qArea.innerText = `Rainbow Reward: You have ${currentScore} points! ` + 
                          (currentScore >= 40 ? "You are a Rainbow Master! 🏆" : "Keep learning to earn your trophy!");
        document.getElementById('options').innerHTML = `<button class="quiz-btn" onclick="returnToMenu()">Back to Menu</button>`;
        return;
    }

    const questions = questionBank[type];
    const randQ = questions[Math.floor(Math.random() * questions.length)];
    
    let qArea = document.getElementById('question');
    let optArea = document.getElementById('options');
    
    qArea.innerText = randQ.q;
    optArea.innerHTML = `<button class="quiz-btn" onclick="checkAnswer(true)">${randQ.opt[0]}</button>
                         <button class="quiz-btn" onclick="checkAnswer(false)">${randQ.opt[1]}</button>
                         <br><button class="quiz-btn" style="background:#ddd; margin-top:20px;" onclick="returnToMenu()">Back to Menu</button>`;
}

function checkAnswer(isCorrect) {
    let qArea = document.getElementById('question');
    if (isCorrect) {
        currentScore += 10;
        playSound('clap');
        qArea.innerText = "Yay! Correct! 🌟";
    } else {
        playSound('wrong');
        qArea.innerText = "Nice try! Try another one!";
    }
    
    document.getElementById('score-board').innerText = "Score: " + currentScore;
    document.getElementById('options').innerHTML = `<button class="quiz-btn" onclick="returnToMenu()">Back to Menu</button>`;
}

function returnToMenu() {
    document.getElementById('quiz-menu').style.display = 'grid';
    document.getElementById('quiz-area').style.display = 'none';
}