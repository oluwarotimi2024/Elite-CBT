let currentUser = null;
let usedReceipts = JSON.parse(localStorage.getItem('sot_used_receipts') || "[]");

function initApp() {
    renderForum();
    document.getElementById('quote-text').innerText = "🔥 Excellence Driven - SOT Academy 2026";
}

// --- FIXED FORUM ---
function sendForumMsg() {
    let input = document.getElementById('forum-input');
    if(!input.value || !currentUser) return;
    let chats = JSON.parse(localStorage.getItem('sot_forum') || "[]");
    chats.push({ user: currentUser, text: input.value });
    localStorage.setItem('sot_forum', JSON.stringify(chats));
    input.value = "";
    renderForum();
}

function renderForum() {
    let box = document.getElementById('forum-box');
    if(!box) return;
    let chats = JSON.parse(localStorage.getItem('sot_forum') || "[]");
    box.innerHTML = chats.map(c => {
        let isMe = c.user === currentUser;
        return `<div class="${isMe ? 'msg-mine' : 'msg-student'}">
            <small style="font-size:0.6rem; display:block;">${c.user}</small>
            ${c.text}
        </div>`;
    }).join('');
    box.scrollTop = box.scrollHeight;
}

// --- GIANT AI ---
function askGiantAI() {
    let input = document.getElementById('ai-input');
    let box = document.getElementById('ai-chat-box');
    if(!input.value) return;
    
    box.innerHTML += `<div class="msg-mine">${input.value}</div>`;
    let query = input.value;
    input.value = "";

    setTimeout(() => {
        let response = `I am analyzing "${query}". For the full SOT Academy breakdown, click research or WhatsApp Sunday. <br><br> <button class="btn-blue" style="padding:5px; font-size:0.7rem;" onclick="window.open('https://www.google.com/search?q=${query}+academic+answer')">RESEARCH ANSWER</button>`;
        box.innerHTML += `<div class="msg-student"><b>SOT AI:</b> ${response}</div>`;
        box.scrollTop = box.scrollHeight;
        window.speechSynthesis.speak(new SpeechSynthesisUtterance("Analyzing your question."));
    }, 800);
}

// --- AUTH ---
function handleAuth(type) {
    let u = document.getElementById(type==='login'?'user-id':'reg-user').value.trim();
    let p = document.getElementById(type==='login'?'user-pass':'reg-pass').value.trim();
    let users = JSON.parse(localStorage.getItem('sot_users') || "{}");
    
    if(!u || !p) return alert("Fill all fields");

    if(type === 'signup') {
        users[u] = {pass:p, library:false};
        localStorage.setItem('sot_users', JSON.stringify(users));
        alert("Success! Now Login."); toggleAuth('login');
    } else {
        if(users[u] && users[u].pass === p) {
            currentUser = u;
            document.getElementById('auth-overlay').style.display='none';
            document.getElementById('welcome-text').innerText = "Student: " + u;
            renderForum();
        } else alert("Wrong details");
    }
}

// --- UTILS ---
function switchTab(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active-page'));
    document.getElementById(id).classList.add('active-page');
    if(id === 'page-forum') renderForum();
}
function goHome() { switchTab('page-home'); }
function toggleAuth(m) { 
    document.getElementById('login-form').style.display = m==='login'?'block':'none'; 
    document.getElementById('signup-form').style.display = m==='signup'?'block':'none'; 
}

// --- PAYMENT ---
function submitPay() {
    let file = document.getElementById('pay-file').files[0];
    if(!file) return alert("Select receipt");
    let id = file.name + file.size;
    if(usedReceipts.includes(id)) return alert("Receipt already used!");

    alert("AI Scanning for Sunday Oluwarotimi / 09024301199...");
    setTimeout(() => {
        let users = JSON.parse(localStorage.getItem('sot_users'));
        users[currentUser].library = true;
        localStorage.setItem('sot_users', JSON.stringify(users));
        usedReceipts.push(id);
        localStorage.setItem('sot_used_receipts', JSON.stringify(usedReceipts));
        alert("VERIFIED! Library Unlocked.");
        openLibrary();
    }, 2500);
}

function openLibrary() {
    let users = JSON.parse(localStorage.getItem('sot_users'));
    if(users[currentUser] && users[currentUser].library) {
        document.getElementById('lib-lock').style.display='none';
        document.getElementById('lib-content').style.display='block';
    }
    switchTab('page-library');
}

function loadSubjects(d) {
    document.getElementById('dept-title').innerText = d + " DEPARTMENT";
    let subs = {
        'Science': ['Physics', 'Biology', 'Chemistry', 'Further Maths', 'Geography', 'Computer'],
        'Art': ['Government', 'Literature', 'History', 'CRS/IRS', 'French', 'Yoruba'],
        'Commercial': ['Economics', 'Accounting', 'Commerce', 'Insurance', 'Marketing', 'Office']
    };
    let html = "";
    subs[d].forEach(s => html += `<button class="btn btn-blue" onclick="alert('${s} exam starting...')">${s}</button>`);
    document.getElementById('sub-list').innerHTML = html;
    switchTab('page-subs');
}
