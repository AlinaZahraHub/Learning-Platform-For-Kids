function playSound(file) { const audio = new Audio(`../Audio/${file}.mp3`); audio.play(); }

function switchGame(gameId) {
    document.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');
    document.getElementById(gameId).style.display = 'block';
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('btn-' + gameId).classList.add('active');
}

function allowDrop(ev) { ev.preventDefault(); }
function drag(ev) { ev.dataTransfer.setData("text", ev.target.id); }

function dropCandy(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    var target = ev.target;
    const candyMap = { 'red-candy': 'red-basket', 'blue-candy': 'blue-basket', 'yellow-candy': 'yellow-basket', 'green-candy': 'green-basket', 'orange-candy': 'orange-basket', 'purple-candy': 'purple-basket', 'pink-candy': 'pink-basket', 'brown-candy': 'brown-basket', 'cyan-candy': 'cyan-basket', 'grey-candy': 'grey-basket' };
    if (candyMap[data] === target.id) {
        var candy = document.getElementById(data);
        candy.style.width = "40px"; candy.style.height = "40px";
        target.appendChild(candy);
        playSound('clap');
    } else { playSound('wrong'); }
}

let currentLevel = 1;
function dropGumdrop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    var target = ev.target;
    if (target.classList.contains('basket')) {
        var originalGumdrop = document.getElementById(data);
        var clone = originalGumdrop.cloneNode(true);
        clone.style.width = "40px"; clone.style.height = "40px";
        target.appendChild(clone);
        var targetBucket = "bucket-" + currentLevel;
        var currentCount = target.querySelectorAll('.gummy-item').length;
        if (target.id === targetBucket && currentCount === currentLevel) {
            playSound('clap');
            target.style.borderColor = "green";
            currentLevel++;
            if (currentLevel <= 3) {
                document.getElementById('instruction').innerText = "Perfect! Now, Level " + currentLevel + ": Put " + currentLevel + " gumdrop(s) in Bucket #" + currentLevel;
            } else {
                document.getElementById('instruction').innerText = "Level Complete! Math Master! 🏆";
            }
        } else if (target.id !== targetBucket) {
            playSound('wrong');
            target.style.borderColor = "orange";
        }
    }
}

const pathLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
let currentPathIndex = 0;
function initSweetPath() {
    const container = document.getElementById('sweet-path');
    if (!container) return;
    container.innerHTML = '';
    pathLetters.forEach(letter => {
        const div = document.createElement('div');
        div.className = 'letter-mat';
        div.innerText = letter;
        div.onclick = () => checkLetter(letter, div);
        container.appendChild(div);
    });
}
function checkLetter(letter, element) {
    if (letter === pathLetters[currentPathIndex]) {
        element.classList.add('correct');
        playSound('clap');
        currentPathIndex++;
        if (currentPathIndex < pathLetters.length) {
            document.getElementById('path-instruction').innerText = "Good job! Now find: " + pathLetters[currentPathIndex];
        } else {
            document.getElementById('path-instruction').innerText = "You crossed the river! 🏆";
        }
    } else { playSound('wrong'); }
}

const poolItems = ['A', '5', 'B', '2', 'C', '8'];
function initPond() {
    const pond = document.getElementById('fishing-pond');
    if (!pond) return;
    pond.innerHTML = '';
    poolItems.forEach((item) => {
        const pop = document.createElement('div');
        pop.className = 'lollipop-catch';
        pop.style.left = (Math.random() * 80) + '%';
        pop.style.top = (Math.random() * 60) + '%';
        pop.innerHTML = '🍭<br><b>' + item + '</b>';
        pop.onclick = () => catchLollipop(pop, item);
        pond.appendChild(pop);
    });
}
// Replace your existing catchLollipop function with this one
function catchLollipop(element, value) {
    // Check if already caught
    if (element.parentElement.id === 'catch-bucket') return;

    // Create a temporary selection area
    const pond = document.getElementById('fishing-pond');
    const choiceContainer = document.createElement('div');
    choiceContainer.className = 'selection-area';
    
    // Generate 3 options (the correct one + 2 random ones)
    const options = [value, 'X', 'Y'].sort(() => Math.random() - 0.5);
    
    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.innerText = opt;
        btn.className = 'choice-btn';
        btn.onclick = () => {
            if (opt === value) {
                playSound('clap');
                document.getElementById('catch-bucket').appendChild(element);
                element.style.position = 'static';
                choiceContainer.remove();
            } else {
                playSound('wrong');
                btn.style.background = "#e74c3c"; // Red for wrong
            }
        };
        choiceContainer.appendChild(btn);
    });

    pond.appendChild(choiceContainer);
    // Remove container after a few seconds if not clicked
    setTimeout(() => { if(pond.contains(choiceContainer)) choiceContainer.remove(); }, 5000);
}

function resetSortingGame() { location.reload(); }
function resetGumdropGame() {
    currentLevel = 1;
    document.getElementById('instruction').innerText = "Level 1: Put 1 gumdrop in Bucket #1";
    document.querySelectorAll('.basket').forEach(b => {
        const items = b.querySelectorAll('.gummy-item');
        items.forEach(item => item.remove());
        b.style.borderColor = "";
    });
}
function resetSweetPath() {
    currentPathIndex = 0;
    document.getElementById('path-instruction').innerText = "Listen... find the letter: A";
    document.querySelectorAll('.letter-mat').forEach(m => m.classList.remove('correct'));
}
function resetFishingGame() {
    document.getElementById('catch-bucket').innerHTML = '<h3>My Catch Bucket</h3>';
    initPond();
}