const donutContainer = document.getElementById('donutDisplay');
const numberGrid = document.getElementById('numberGrid');
let targetCount = 3, currentDropped = 0, targetFind = 0, score = 0;

for(let i = 1; i <= 10; i++) {
    const btn = document.createElement('button');
    btn.className = 'lollipop-head';
    btn.innerText = i;
    btn.onclick = () => showDonuts(i);
    numberGrid.appendChild(btn);
}

function showDonuts(count) {
    donutContainer.innerHTML = '';
    new Audio(`../Audio/${count}.mp3`).play().catch(()=>{});
    for(let i = 0; i < count; i++) {
        const donut = document.createElement('span');
        donut.innerText = '🍩';
        donut.style.fontSize = '3.5rem';
        donut.style.animation = 'pop 0.5s ease';
        donutContainer.appendChild(donut);
    }
}

function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(t => t.style.display = 'none');
    document.getElementById(tabName).style.display = 'block';
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('btn-' + tabName).classList.add('active');
    if(tabName === 'hide-seek') setupHideSeek();
}

function newGame() {
    targetCount = Math.floor(Math.random() * 10) + 1;
    currentDropped = 0;
    document.getElementById('boxLabel').innerText = "Drop " + targetCount + " stars here!";
    document.getElementById('dropBox').innerHTML = "";
    const container = document.getElementById('itemsContainer');
    container.innerHTML = '';
    for(let i = 0; i < 10; i++) {
        const star = document.createElement('span');
        star.className = 'draggable';
        star.draggable = true;
        star.innerText = '⭐';
        star.ondragstart = (ev) => ev.dataTransfer.setData("text", ev.target.innerText);
        container.appendChild(star);
    }
}

function allowDrop(ev) { ev.preventDefault(); }
function drop(ev) {
    ev.preventDefault();
    if (currentDropped < targetCount) {
        const item = document.createElement("span");
        item.innerText = ev.dataTransfer.getData("text");
        item.style.fontSize = "3rem";
        ev.target.appendChild(item);
        currentDropped++;
        new Audio('../Audio/pop.mp3').play().catch(()=>{});
        if (currentDropped === targetCount) {
            document.getElementById('boxLabel').innerHTML = "🎉 Excellent Job!";
            new Audio('../Audio/clap.mp3').play().catch(()=>{});
            setTimeout(newGame, 2000);
        }
    }
}

function setupHideSeek() {
    const grid = document.getElementById('gardenGrid');
    grid.innerHTML = '';
    targetFind = Math.floor(Math.random() * 10) + 1;
    document.getElementById('findInstruction').innerText = "Can you find the number " + targetFind + "?";
    new Audio(`../Audio/find_${targetFind}.mp3`).play().catch(()=>{});
    let numbers = [];
    for(let i = 0; i < 6; i++) { numbers.push(Math.floor(Math.random() * 10) + 1); }
    const randomIndex = Math.floor(Math.random() * 6);
    numbers[randomIndex] = targetFind;
    for(let i = 0; i < 6; i++) {
        const bush = document.createElement('div');
        bush.className = 'bush';
        bush.innerText = "?";
        bush.onclick = () => reveal(bush, numbers[i]);
        grid.appendChild(bush);
    }
}

function playSuccessSound() { new Audio('../Audio/clap.mp3').play().catch(()=>{}); }

function reveal(el, num) {
    el.innerText = num;
    el.classList.add('revealed');
    if(num === targetFind) {
        document.getElementById('findInstruction').innerText = "🎉 Found it!";
        playSuccessSound();
        setTimeout(setupHideSeek, 2500);
    } else {
        new Audio('../Audio/wrong.mp3').play().catch(()=>{});
    }
}

function startParade() {
    const track = document.getElementById('paradeTrack');
    track.innerHTML = '';
    for(let i = 1; i <= 10; i++) {
        setTimeout(() => {
            const lolly = document.createElement('div');
            lolly.className = 'marching-lollipop';
            lolly.innerText = i;
            track.appendChild(lolly);
            new Audio(`../Audio/${i}.mp3`).play().catch(()=>{});
            setTimeout(() => lolly.remove(), 4000);
        }, i * 1000);
    }
}

function launchQuiz(type) {
    const area = document.getElementById('activeQuizArea');
    area.innerHTML = ''; 
    if(type === 'visual') renderVisualRecognition();
    else if(type === 'missing') renderMissingPassenger();
    else if(type === 'monster') renderMonster();
    else if(type === 'memory') renderMemoryMatch();
    else if(type === 'reward') showReward();
}

function renderVisualRecognition() {
    let target = Math.floor(Math.random() * 9) + 1;
    let html = `<h3>Which plate has ${target} donuts?</h3><div class="alphabet-grid">`;
    for(let i=1; i<=3; i++) {
        let count = (i === 1) ? target : Math.floor(Math.random() * 10) + 1;
        html += `<button class="option-btn" onclick="checkQuiz(${count === target})">${"🍩".repeat(count)}</button>`;
    }
    document.getElementById('activeQuizArea').innerHTML = html + `</div>`;
}

function renderMissingPassenger() {
    let n1 = Math.floor(Math.random() * 7) + 1;
    document.getElementById('activeQuizArea').innerHTML = `<h3>Complete the sequence:</h3>
        <p style="font-size:2rem">${n1}, ${n1+1}, __, ${n1+3}</p>
        <button class="option-btn" onclick="checkQuiz(true)">${n1+2}</button>
        <button class="option-btn" onclick="checkQuiz(false)">9</button>`;
}

function renderMonster() {
    const area = document.getElementById('activeQuizArea');
    const targetNum = Math.floor(Math.random() * 5) + 1;
    area.innerHTML = `
        <div class="monster-card">
            <div class="monster-avatar">👾</div>
            <h3>Monster needs ${targetNum} snacks!</h3>
            <div class="match-grid" id="monsterOptions"></div>
        </div>
    `;
    const optionsGrid = document.getElementById('monsterOptions');
    let choices = [targetNum, Math.floor(Math.random() * 9) + 1, Math.floor(Math.random() * 9) + 1];
    choices.sort(() => Math.random() - 0.5);
    choices.forEach(num => {
        const btn = document.createElement('button');
        btn.className = 'match-btn';
        btn.innerText = num;
        btn.onclick = () => {
            if(num === targetNum) {
                checkQuiz(true);
                area.innerHTML = "<h3>Yay! Monster is full! 🍬</h3>";
            } else {
                checkQuiz(false);
            }
        };
        optionsGrid.appendChild(btn);
    });
}

function renderMemoryMatch() {
    const area = document.getElementById('activeQuizArea');
    const num1 = Math.floor(Math.random() * 5) + 1;
    const num2 = Math.floor(Math.random() * 5) + 1;
    
    area.innerHTML = `
        <h3>Memory Match: Find the same number!</h3>
        <div style="display:flex; justify-content:center; gap:20px; margin-top:15px;">
            <button class="option-btn" id="card1" onclick="flipCard(this, ${num1})">?</button>
            <button class="option-btn" id="card2" onclick="flipCard(this, ${num2})">?</button>
        </div>
    `;
    
    window.tempMatch = { card1: num1, card2: num2, flipped: [] };
}

function flipCard(el, val) {
    if(window.tempMatch.flipped.length >= 2) return;
    el.innerText = val;
    window.tempMatch.flipped.push({el, val});
    
    if(window.tempMatch.flipped.length === 2) {
        setTimeout(() => {
            const [c1, c2] = window.tempMatch.flipped;
            if(c1.val === c2.val) {
                checkQuiz(true);
                document.getElementById('activeQuizArea').innerHTML = "<h3>Matched! Well done! 🎉</h3>";
            } else {
                c1.el.innerText = "?";
                c2.el.innerText = "?";
                checkQuiz(false);
                window.tempMatch.flipped = [];
            }
        }, 800);
    }
}

function showReward() {
    if(score >= 50) document.getElementById('masterModal').style.display = 'flex';
    else alert("Need 50 points to be a Valley Master!");
}

function checkQuiz(isCorrect) {
    if(isCorrect) { score += 10; new Audio('../Audio/clap.mp3').play().catch(()=>{}); }
    else new Audio('../Audio/wrong.mp3').play().catch(()=>{});
    document.getElementById('scoreDisplay').innerText = "Score: " + score;
}

function closeModal() { document.getElementById('masterModal').style.display = 'none'; }

newGame();