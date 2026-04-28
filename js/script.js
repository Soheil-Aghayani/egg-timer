let countdown;
let secondsRemaining;
let isPaused = false;
let currentLabel = "";
let timerDone = false;

const timerDisplay = document.getElementById('countdown-text');
const eggTitle = document.getElementById('egg-type-title');
const timerEggImg = document.getElementById('timer-egg-img');
const alarm = document.getElementById('alarm-sound');
const selectionScreen = document.getElementById('egg-selection');
const timerScreen = document.getElementById('timer-display');
const pauseBtn = document.getElementById('pause-btn');
const factText = document.getElementById('egg-fact');
let secretClicks = 0;

const kevinQuotes = [
    "The trick is to undercook the onions. Everybody is going to get to know each other in the pot.",
    "It's probably the thing I do best.",
    "I'm serious about this stuff. I'm up the night before, pressing garlic, and dicing whole tomatoes.",
    "I toast my own ancho chiles.",
    "It's a recipe passed down from Malones for generations.",
    "Why waste time say lot word when few word do trick?",
    "I just want to lie on the beach and eat hot dogs. That's all I've ever wanted.",
    "Me think, why waste time say lot word, when few word do trick?",
    "A mistake plus keleven gets you home by seven.",
    "I am enormously proud of what I did for that chili."
];

const kevinWisdom = [
    "Never trust turtle. They too slow, they planning something.",
    "Mini cupcakes? As in the mini version of regular cupcakes, which is already a mini version of cake? Honestly, where does it end with you people?",
    "Chili belongs in pot. Not on floor. Floor make chili sad.",
    "I just want to lie on the beach and eat hot dogs. That's all I've ever wanted.",
    "A mistake plus keleven gets you home by seven. Math is easy.",
    "Why waste time say lot word when few word do trick?",
    "If you find office supplies, they yours now. Finders keepers.",
    "Cookies are just flat cakes. Think about it.",
    "Don't undercook the onions. Wait, no, DO undercook the onions. For the pot.",
    "Everything is better with a nap. Even naps."
];

function checkSecret() {
    secretClicks++;
    if (secretClicks >= 5) {
        const sketchbook = document.querySelector('.sketchbook');
        const surprise = document.getElementById('kevin-surprise');
        const quoteElem = document.getElementById('kevin-quote');
        
        sketchbook.classList.add('shake');
        surprise.classList.remove('kevin-hidden');
        
        if (quoteElem) {
            const randomQuote = kevinQuotes[Math.floor(Math.random() * kevinQuotes.length)];
            quoteElem.innerText = randomQuote;
        }
        
        // Stop shaking after animation
        setTimeout(() => sketchbook.classList.remove('shake'), 5000);
        secretClicks = 0;
    }
}

function hideSecret() {
    document.getElementById('kevin-surprise').classList.add('kevin-hidden');
}

function getWisdom() {
    if (!timerDone) return;
    const wisdomBox = document.getElementById('wisdom-box');
    const wisdomText = document.getElementById('kevin-wisdom-text');
    const randomIndex = Math.floor(Math.random() * kevinWisdom.length);
    
    wisdomText.innerText = "Kevin Wisdom: " + kevinWisdom[randomIndex];
    wisdomBox.classList.remove('hidden');
}

const eggFacts = [
    "Egg come from bird. Usually chicken.",
    "Egg round. No corner. Good for roll.",
    "Hard egg take long time. Soft egg fast.",
    "Ostrich egg big. One egg feed 10 Kevin.",
    "Egg have yellow part. Call it yolk.",
    "Egg shell made of rock stuff. Don't eat shell.",
    "Old egg float in water. Bad egg! Go away!",
    "Egg have lot protein. Make Kevin strong.",
    "Brown egg, white egg. Same inside.",
    "Chicken make one egg every day. Busy bird.",
    "Kevin like egg. Egg taste good.",
    "Some egg green. Dr. Seuss say they taste good with ham.",
    "Egg not have teeth. Don't worry, it not bite.",
    "If you drop egg, it break. Sad day. Big mess.",
    "Chickens talk to eggs. Egg say nothing. Rude.",
    "Egg can breathe! Shell has tiny holes. Tiny tiny.",
    "Kevin think breakfast came before egg. Logic.",
    "Egg in space? Astronaut eat them. Floating egg!",
    "One time Kevin eat 20 egg. Then Kevin nap for week."
];

function createConfetti() {
    const colors = ['#ffcb05', '#4a90e2', '#ff6b6b', '#51cf66', '#fcc419'];
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
        confetti.style.opacity = Math.random();
        document.body.appendChild(confetti);
        
        // Remove after animation
        setTimeout(() => confetti.remove(), 5000);
    }
}

function changeColor(color) {
    document.querySelector('.sketchbook').style.backgroundColor = color;
}

function showRandomFact() {
    if (!factText) return;
    const randomIndex = Math.floor(Math.random() * eggFacts.length);
    factText.innerText = "Egg Truth: " + eggFacts[randomIndex];
}

function startTimer(seconds, label, imgPath) {
    secondsRemaining = seconds;
    currentLabel = label;
    isPaused = false;
    timerDone = false;
    document.getElementById('wisdom-box').classList.add('hidden');
    
    if (pauseBtn) {
        pauseBtn.innerText = "Pause";
        pauseBtn.classList.remove('hidden');
    }

    if (timerEggImg) {
        timerEggImg.src = imgPath || 'assets/images/soft.png';
    }

    // 1. UI Swapping
    selectionScreen.classList.add('hidden');
    timerScreen.classList.remove('hidden');
    eggTitle.innerText = label + "...";
    showRandomFact();

    runTimer();
}

function runTimer() {
    clearInterval(countdown);
    
    const now = Date.now();
    const then = now + secondsRemaining * 1000;

    displayTimeLeft(secondsRemaining);

    countdown = setInterval(() => {
        if (isPaused) return;

        const secondsLeft = Math.round((then - Date.now()) / 1000);
        secondsRemaining = secondsLeft;

        if (secondsLeft < 0) {
            clearInterval(countdown);
            playAlarm();
            return;
        }

        displayTimeLeft(secondsLeft);
    }, 1000);
}

function togglePause() {
    isPaused = !isPaused;
    if (isPaused) {
        clearInterval(countdown);
        pauseBtn.innerText = "Resume";
        eggTitle.innerText = "Paused...";
    } else {
        pauseBtn.innerText = "Pause";
        eggTitle.innerText = currentLabel + "...";
        runTimer();
    }
}

function startCustomTimer() {
    const mins = document.getElementById('custom-minutes').value;
    if (mins > 0) {
        startTimer(mins * 60, "Custom Egg", 'assets/images/soft.png');
    } else {
        alert("Please enter a valid number of minutes!");
    }
}

function displayTimeLeft(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainderSeconds = seconds % 60;
    const display = `${minutes}:${remainderSeconds < 10 ? '0' : ''}${remainderSeconds}`;
    timerDisplay.innerText = display;
    document.title = display + " - Boiling...";
}

function playAlarm() {
    timerDone = true;
    eggTitle.innerText = "CLICK EGG FOR WISDOM!";
    if (pauseBtn) pauseBtn.classList.add('hidden');
    createConfetti();
    alarm.currentTime = 0; // Start song from beginning
    alarm.play().catch(error => {
        console.log("Browser blocked autoplay. Make sure you interacted with the page first!");
    });
}

function resetApp() {
    clearInterval(countdown);
    alarm.pause();
    alarm.currentTime = 0;
    selectionScreen.classList.remove('hidden');
    timerScreen.classList.add('hidden');
    if (pauseBtn) pauseBtn.classList.remove('hidden');
    document.title = "The Whimsical Egg Timer";
}