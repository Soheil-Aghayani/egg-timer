let countdown;
let secondsRemaining;
let isPaused = false;
let currentLabel = "";
let timerDone = false;

const timerDisplay = document.getElementById('countdown-text');
const alarm = document.getElementById('alarm-sound');
const selectionScreen = document.getElementById('egg-selection');
const pauseBtn = document.getElementById('pause-btn');
const factText = document.getElementById('egg-fact');
const header = document.querySelector('header');
const colorPicker = document.querySelector('.color-picker');
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
    "I am enormously proud of what I did for that chili.",
    "I'm a dynamic figure, often seen scaling walls and crushing ice.",
    "I have been known to remodel my kitchen over the weekend.",
    "I'm a private person. I don't want to be a public person.",
    "I don't need to be your best friend. I already have a best friend. Myself.",
    "I'm not a million miles away from a hot dog right now.",
    "When me president, they see. They see.",
    "Oscar, you're the smartest person I know. Besides me.",
    "I'm a bit of a wine connoisseur. I like the red one.",
    "Do you want to hear a joke? My life.",
    "I'm not slow. I'm just thorough.",
    "Chili. It's what's for dinner. And breakfast. And nap time."
];

const kevinWisdom = [
    "Never trust turtle. They too slow, they planning something.",
    "Mini cupcakes? As in the mini version of regular cupcakes? Honestly, where does it end?",
    "Chili belongs in pot. Not on floor. Floor make chili sad.",
    "I just want to lie on the beach and eat hot dogs. That's all I've ever wanted.",
    "A mistake plus keleven gets you home by seven. Math is easy.",
    "Why waste time say lot word when few word do trick?",
    "If you find office supplies, they yours now. Finders keepers.",
    "Cookies are just flat cakes. Think about it.",
    "Don't undercook the onions. Wait, no, DO undercook the onions. For the pot.",
    "Everything is better with a nap. Even naps.",
    "If someone give you gift, you take it. Even if it rocks.",
    "Bread is just a sponge for butter. Use it.",
    "A dog is a man's best friend. A hot dog is a Kevin's best friend.",
    "Work is hard. Nap is easy. Choose easy.",
    "Always carry a snack. You never know when hunger strike.",
    "If you fall, stay down for a bit. It's like a surprise nap.",
    "The world is big. My stomach is bigger.",
    "If you can't find it, it's not lost. It's just hiding.",
    "Sometimes I feel like a nut. Sometimes I don't.",
    "Be careful with the chili. It's heavy. Like my heart."
];

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

// Keyboard Listeners
document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('custom-modal');
    if (modal && !modal.classList.contains('hidden')) {
        if (e.key === 'Escape') {
            const timerArea = document.getElementById('modal-timer-area');
            // If timer is showing, use resetApp to restore main screen
            if (timerArea && !timerArea.classList.contains('hidden')) {
                resetApp();
            } else {
                closeModal(false);
            }
        }
        if (e.key === 'Enter') {
            const inputArea = document.getElementById('modal-input-area');
            if (inputArea && !inputArea.classList.contains('hidden')) {
                validateAndStart();
            }
        }
        
        // Focus Trap
        if (e.key === 'Tab') {
            const focusable = modal.querySelectorAll('button, input, [tabindex="0"]');
            if (focusable.length === 0) return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            
            if (e.shiftKey && document.activeElement === first) {
                last.focus();
                e.preventDefault();
            } else if (!e.shiftKey && document.activeElement === last) {
                first.focus();
                e.preventDefault();
            }
        }
    }
});

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
    clearInterval(countdown);
    secondsRemaining = seconds;
    currentLabel = label;
    isPaused = false;
    timerDone = false;
    
    selectionScreen.classList.add('hidden');
    if (colorPicker) colorPicker.classList.add('hidden');
    
    const modal = document.getElementById('custom-modal');
    const timerArea = document.getElementById('modal-timer-area');
    const inputArea = document.getElementById('modal-input-area');
    const warningArea = document.getElementById('modal-warning-area');
    const wisdomBox = document.getElementById('wisdom-box');
    const timerTitle = document.getElementById('timer-title');
    const timerEggImg = document.getElementById('timer-egg-img');

    modal.classList.remove('hidden');
    timerArea.classList.remove('hidden');
    inputArea.classList.add('hidden');
    warningArea.classList.add('hidden');
    if (wisdomBox) wisdomBox.classList.add('hidden');
    
    if (timerTitle) timerTitle.innerText = label + "...";
    if (timerEggImg) {
        timerEggImg.src = imgPath || 'assets/images/soft.png';
        timerEggImg.onclick = getWisdom; // Kevin egg click for wisdom
    }
    
    if (pauseBtn) {
        pauseBtn.innerText = "Pause";
        pauseBtn.classList.remove('hidden');
    }

    showRandomFact();
    runTimer();
}

function runTimer() {
    const now = Date.now();
    const then = now + secondsRemaining * 1000;
    displayTimeLeft(secondsRemaining);
    countdown = setInterval(() => {
        if (isPaused) return;
        const secondsLeft = Math.round((then - Date.now()) / 1000);
        if (secondsLeft < 0) {
            clearInterval(countdown);
            playAlarm();
            return;
        }
        secondsRemaining = secondsLeft;
        displayTimeLeft(secondsLeft);
    }, 1000);
}

function togglePause() {
    isPaused = !isPaused;
    const timerTitle = document.getElementById('timer-title');
    if (isPaused) {
        clearInterval(countdown);
        pauseBtn.innerText = "Resume";
        if (timerTitle) timerTitle.innerText = "Paused...";
    } else {
        pauseBtn.innerText = "Pause";
        if (timerTitle) timerTitle.innerText = currentLabel + "...";
        runTimer();
    }
}

function openCustomModal() {
    const modal = document.getElementById('custom-modal');
    const inputArea = document.getElementById('modal-input-area');
    const timerArea = document.getElementById('modal-timer-area');
    const warningArea = document.getElementById('modal-warning-area');
    const subcontent = document.getElementById('modal-subcontent');
    const customImg = document.getElementById('custom-egg-img');
    const minsInput = document.getElementById('custom-minutes');

    modal.classList.remove('hidden');
    inputArea.classList.remove('hidden');
    timerArea.classList.add('hidden');
    warningArea.classList.add('hidden');
    subcontent.classList.add('hidden');
    
    minsInput.value = '';
    customImg.src = 'assets/images/who_am_i.png';
}

function updateCustomImage(val) {
    const mins = parseInt(val);
    const customImg = document.getElementById('custom-egg-img');
    if (!customImg) return;
    
    if (isNaN(mins) || mins <= 0) {
        customImg.src = 'assets/images/who_am_i.png';
        return;
    }

    if (mins === 6) customImg.src = 'assets/images/i_am_soft_boiled.png';
    else if (mins === 7) customImg.src = 'assets/images/i_am_jammy_yammy.png';
    else if (mins === 10) customImg.src = 'assets/images/i_am_hard_boiled.png';
    else if (mins >= 12 && mins <= 15) customImg.src = 'assets/images/six_pack_egg.png';
    else if (mins > 15) customImg.src = 'assets/images/sure_egg.png';
    else customImg.src = 'assets/images/who_am_i.png';
}

function validateAndStart() {
    const minsInput = document.getElementById('custom-minutes');
    const mins = parseInt(minsInput.value);

    if (isNaN(mins) || mins <= 0) {
        alert("Please enter a valid number of minutes!");
        return;
    }

    if (mins > 60) {
        showWarningArea();
        return;
    }

    const customImg = document.getElementById('custom-egg-img');
    startTimer(mins * 60, "Custom Egg", customImg.src);
}

function showWarningArea() {
    document.getElementById('modal-input-area').classList.add('hidden');
    const warningArea = document.getElementById('modal-warning-area');
    const text = document.getElementById('modal-text');
    const buttons = document.getElementById('warning-buttons');
    const subcontent = document.getElementById('modal-subcontent');

    warningArea.classList.remove('hidden');
    text.innerText = "do you know you're boiling an egg?";
    subcontent.classList.add('hidden');
    subcontent.innerHTML = '';
    
    buttons.innerHTML = `
        <button class="modal-btn" onclick="handleWarning('yes')">yes</button>
        <button class="modal-btn" onclick="handleWarning('meow')">meow</button>
        <button class="modal-btn" onclick="handleWarning('no')">no sorry let me change that</button>
    `;
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        const btn = document.querySelector('.copy-btn');
        if (btn) {
            const oldText = btn.innerText;
            btn.innerText = "Copied!";
            setTimeout(() => btn.innerText = oldText, 2000);
        }
    });
}

function handleWarning(choice) {
    const text = document.getElementById('modal-text');
    const buttons = document.getElementById('warning-buttons');
    const subcontent = document.getElementById('modal-subcontent');

    if (choice === 'yes') {
        const email = "soheyl.aghayani+egg@gmail.com";
        text.innerText = "okay, but at the end show us what you got.";
        buttons.innerHTML = '<button class="modal-btn" onclick="closeModal(true)">OK, start timer</button>';
        subcontent.innerHTML = `
            <div class="email-container">
                <p style="font-size: 1.2rem; color: #d32f2f; margin: 0;">Email: ${email}</p>
                <button class="copy-btn" onclick="copyToClipboard('${email}')">Copy Email</button>
            </div>
        `;
        subcontent.classList.remove('hidden');
    } else if (choice === 'meow') {
        text.innerText = "No cat allowed!";
        buttons.innerHTML = '';
        subcontent.innerHTML = `
            <img src="assets/images/meow.png" alt="Cat?">
            <p>What is 2 + 2? <input type="number" id="cat-math" oninput="checkCatMath(this.value)"></p>
        `;
        subcontent.classList.remove('hidden');
    } else {
        openCustomModal();
    }
}

function checkCatMath(val) {
    if (val == "4") {
        const subcontent = document.getElementById('modal-subcontent');
        subcontent.innerHTML += '<p style="color: green;">You not cat. OK.</p>';
        setTimeout(() => closeModal(true), 1000);
    }
}

function closeModal(start) {
    if (start) {
        const mins = parseInt(document.getElementById('custom-minutes').value) || 61;
        startTimer(mins * 60, "Very Long Egg", 'assets/images/sure_egg.png');
    } else {
        document.getElementById('custom-modal').classList.add('hidden');
    }
}

function displayTimeLeft(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainderSeconds = seconds % 60;
    const display = `${minutes}:${remainderSeconds < 10 ? '0' : ''}${remainderSeconds}`;
    if (timerDisplay) timerDisplay.innerText = display;
    document.title = display + " - Boiling...";
}

function playAlarm() {
    timerDone = true;
    const timerTitle = document.getElementById('timer-title');
    if (timerTitle) timerTitle.innerText = "CLICK EGG FOR WISDOM!";
    if (pauseBtn) pauseBtn.classList.add('hidden');
    createConfetti();
    alarm.currentTime = 0;
    alarm.play().catch(error => console.log("Play failed"));
}

function resetApp() {
    clearInterval(countdown);
    alarm.pause();
    alarm.currentTime = 0;
    selectionScreen.classList.remove('hidden');
    if (colorPicker) colorPicker.classList.remove('hidden');
    header.classList.remove('hidden');
    document.getElementById('custom-modal').classList.add('hidden');
    if (pauseBtn) pauseBtn.classList.remove('hidden');
    document.title = "The Whimsical Egg Timer";
}