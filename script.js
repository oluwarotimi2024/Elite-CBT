<script>

let currentUser = null;

/* ------------------ SWITCH PAGE ------------------ */
function switchPage(pageId) {
    document.querySelectorAll('.page').forEach(p =>
        p.classList.remove('active-page')
    );

    document.getElementById(pageId).classList.add('active-page');

    if (pageId === 'page-forum') {
        renderForum();
    }
}

/* ------------------ START APP ------------------ */
function startApp() {
    let nameInput = document.getElementById('user-id')?.value?.trim();

    if (!nameInput) {
        alert("Please enter your name!");
        return;
    }

    currentUser = nameInput;
    document.getElementById('welcome-user').innerText =
        "Hello, " + nameInput;

    switchPage('page-home');
}

function initApp() {

    // Create automatic guest user
    currentUser = "Guest_" + Math.floor(Math.random() * 1000);

    // Set welcome name after splash
    setTimeout(() => {

        document.getElementById('welcome-user').innerText =
            "Hello, " + currentUser;

        switchPage('page-home');

    }, 5000);
}


/* ------------------ FORUM SEND (OFFLINE) ------------------ */
function sendForumMsg() {
    let input = document.getElementById('forum-input');

    if (!input.value || !currentUser) return;

    let messages = JSON.parse(localStorage.getItem("forum_messages")) || [];

    messages.push({
        user: currentUser,
        text: input.value,
        timeStr: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        })
    });

    localStorage.setItem("forum_messages", JSON.stringify(messages));

    input.value = "";

    renderForum();
}


/* ------------------ RENDER FORUM ------------------ */
function renderForum() {

    let box = document.getElementById('forum-box');
    if (!box) return;

    let messages = JSON.parse(localStorage.getItem("forum_messages")) || [];

    let html = "";

    messages.forEach(msg => {
        let isMe = msg.user === currentUser;

        html += `
        <div class="${isMe ? 'msg-mine' : 'msg-other'}">
            <small style="font-size:0.6rem;font-weight:bold;display:block;">
                ${isMe ? 'Me' : msg.user}
            </small>
            ${msg.text}
            <small style="display:block;font-size:0.5rem;opacity:0.5;text-align:right;">
                ${msg.timeStr}
            </small>
        </div>`;
    });

    box.innerHTML = html;
    box.scrollTop = box.scrollHeight;
}


/* ------------------ AI LOGIC ------------------ */
function askGiantAI() {
    let input = document.getElementById('ai-input');
    let box = document.getElementById('ai-chat-box');

    if (!input.value) return;

    box.innerHTML += `<div class="msg-mine">${input.value}</div>`;
    let q = input.value;
    input.value = "";

    box.scrollTop = box.scrollHeight;

    setTimeout(() => {

        let res = `
        I've analyzed "<b>${q}</b>". 
        <br><br>
        <button class="btn btn-gold" 
        style="font-size:0.7rem;padding:5px;"
        onclick="window.open('https://www.google.com/search?q=${q}+academic+answer')">
        REVEAL ANSWER
        </button>`;

        box.innerHTML +=
        `<div class="msg-other"><b>SOT AI:</b> ${res}</div>`;

        box.scrollTop = box.scrollHeight;

    }, 1000);
}

</script>
