let currentUser = null;
let meetingLink = "https://meet.google.com/your-class-link"; 
let usedReceipts = JSON.parse(localStorage.getItem('sot_used_receipts') || "[]");

function initApp() {
    renderForum();
    document.getElementById('quote-text').innerText = "🔥 Excellence Driven - SOT Academy 2026";
}

// --- STUDENT FORUM LOGIC ---
function sendForumMsg() {
    let input = document.getElementById('forum-input');
    if(!input.value) return;
    let chats = JSON.parse(localStorage.getItem('sot_forum') || "[]");
    chats.push({ user: currentUser, text: input.value, time: new Date().toLocaleTimeString() });
    localStorage.setItem('sot_forum', JSON.stringify(chats));
    input.value = "";
    renderForum();
}

function renderForum() {
    let box = document.getElementById('forum-box');
    let chats = JSON.parse(localStorage.getItem('sot_forum') || "[]");
    box.innerHTML = chats.map(c => `<div class="msg msg-student"><b>${c.user}:</b> ${c.text} <br><small style="font-size:0.6rem; opacity:0.6;">${c.time}</small></div>`).join('');
    box.scrollTop = box.scrollHeight;
}

// --- GIANT AI + VOICE ---
async function askGiantAI() {
    let input = document.getElementById('ai-input').value;
    if(!input) return;
    let box = document.getElementById('ai-chat-box');
    box.innerHTML += `<div class="msg msg-user">${input}</div>`;
    
    setTimeout(() => {
        let res = `Researching "${input}"... Click below for full analysis or WhatsApp 09024301199. <br><br> <button class="btn-blue" style="font-size:0.7rem;" onclick="window.open('https://www.google.com/search?q=${input}', '_blank')">GLOBAL RESEARCH</button>`;
        box.innerHTML += `<div class="msg msg-ai">${res}</div>`;
        window.speechSynthesis.speak(new SpeechSynthesisUtterance("I am finding the answer for " + input));
        box.scrollTop = box.scrollHeight;
    }, 1000);
    document.getElementById('ai-input').value = "";
}

// --- AUTO-RECEIPT VERIFY ---
function submitPay() {
    let file = document.getElementById('pay-file').files[0];
    if(!file) return alert("Select receipt");
    let id = file.name + file.size;
    if(usedReceipts.includes(id)) return alert("Receipt already used!");

    alert("AI Scanning for Sunday Oluwarotimi / 09024301199 / ₦700...");
    setTimeout(() => {
        let users = JSON.parse(localStorage.getItem('sot_users'));
        users[currentUser].library = true;
        localStorage.setItem('sot_users', JSON.stringify(users));
        usedReceipts.push(id);
        localStorage.setItem('sot_used_receipts', JSON.stringify(usedReceipts));
        alert("VERIFIED! Library Unlocked.");
        openLibrary();
    }, 3000);
}

// --- NAVIGATION & AUTH ---
function handleAuth(type) {
    let u = document.getElementById(type==='login'?'user-id':'reg-user').value;
    let p = document.getElementById(type==='login'?'user-pass':'reg-pass').value;
    let users = JSON.parse(localStorage.getItem('sot_users') || "{}");
    if(type === 'signup') {
        users[u] = {pass:p, library:false};
        localStorage.setItem('sot_users', JSON.stringify(users));
        alert("Created! Now Login."); toggleAuth('login');
    } else {
        if(users[u] && users[u].pass === p) {
            currentUser = u;
            document.getElementById('auth-overlay').style.display='none';
            document.getElementById('welcome-text').innerText = "Hello, " + u;
        } else alert("Error");
    }
}

function openLibrary() {
    let users = JSON.parse(localStorage.getItem('sot_users'));
    if(users[currentUser].library) {
        document.getElementById('lib-lock').style.display='none';
        document.getElementById('lib-content').style.display='block';
    }
    switchTab('page-library');
}

function joinMeeting() { window.open(meetingLink, '_blank'); }
function switchTab(id) { document.querySelectorAll('.page').forEach(p => p.classList.remove('active-page')); document.getElementById(id).classList.add('active-page'); }
function goHome() { switchTab('page-home'); }
function toggleAuth(m) { document.getElementById('login-form').style.display = m==='login'?'block':'none'; document.getElementById('signup-form').style.display = m==='signup'?'block':'none'; }
