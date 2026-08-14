/* ==========================================================================
   การท่า 67 Clicker - โค้ดหลักฉบับเรียบง่าย
   ========================================================================== */

// --------------------------------------------------------------------------
// 0. การตั้งค่า Supabase (กรอก URL และ ANON_KEY ของคุณที่นี่)
// --------------------------------------------------------------------------
const SUPABASE_URL = "https://your-supabase-project.supabase.co"; 
const SUPABASE_KEY = "your-anon-key-here";

let supabaseClient = null;
if (window.supabase && SUPABASE_URL.indexOf("your-supabase") === -1) {
    try {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    } catch(e) {}
}

// --------------------------------------------------------------------------
// 1. สถานะเกมและผู้เล่น
// --------------------------------------------------------------------------
let playerName = "ผู้เล่น 67";
let score = 0;
let totalScore = 0;
let scorePerSec = 0;
let soundOn = true;
let unlockedLevels = [1];
let inventory = {};

// --------------------------------------------------------------------------
// 2. ข้อมูลสินค้าในร้าน และ Meme Levels
// --------------------------------------------------------------------------
const SHOP_ITEMS = [
    { id: "kid_helper", name: "เด็กช่วยท่า 67", desc: "+0.1 คะแนน/วินาที", emoji: "🧒", baseCost: 20, costMult: 1.12, value: 0.1 },
    { id: "cheerleader", name: "เชียร์ลีดเดอร์", desc: "+0.5 คะแนน/วินาที", emoji: "📣", baseCost: 100, costMult: 1.14, value: 0.5 },
    { id: "dance_instructor", name: "ครูสอนเต้น", desc: "+3 คะแนน/วินาที", emoji: "💃", baseCost: 500, costMult: 1.16, value: 3 },
    { id: "robot_arm", name: "แขนกลหุ่นยนต์", desc: "+20 คะแนน/วินาที", emoji: "🦾", baseCost: 3000, costMult: 1.18, value: 20 },
    { id: "ai_clone", name: "โคลนนิ่ง AI", desc: "+150 คะแนน/วินาที", emoji: "🤖", baseCost: 25000, costMult: 1.20, value: 150 }
];

const MEME_LEVELS = [
    { level: 1, scoreReq: 0, title: "Zias: Nodding and Laughing", thumb: "https://cdn.vlipsy.com/clips/8HdVQCC3/thumbnail.webp", clipId: "8HdVQCC3" },
    { level: 2, scoreReq: 50, title: "Mutahar: Extreme Laugh", thumb: "https://cdn.vlipsy.com/clips/UlELJLF8/thumbnail.webp", clipId: "UlELJLF8" },
    { level: 3, scoreReq: 200, title: "Trying Not To Laugh", thumb: "https://cdn.vlipsy.com/clips/Ri6qh4EP/thumbnail.webp", clipId: "Ri6qh4EP" },
    { level: 4, scoreReq: 500, title: "Explosion Meme", thumb: "https://cdn.vlipsy.com/clips/9K8CxpwL/preview-small.jpg", clipId: "9K8CxpwL" },
    { level: 5, scoreReq: 1500, title: "Crying Then Laughing", thumb: "https://cdn.vlipsy.com/clips/fbjBIzWh/thumbnail.webp", clipId: "fbjBIzWh" }
];

// --------------------------------------------------------------------------
// 3. ดึง Element จาก HTML
// --------------------------------------------------------------------------
const elPlayerNameDisplay = document.getElementById('player-name-display');
const elBtnEditName = document.getElementById('btn-edit-name');
const elScore = document.getElementById('total-score');
const elPPS = document.getElementById('score-per-sec');
const elLevelText = document.getElementById('level-text');
const elHandLeft = document.getElementById('hand-left');
const elHandRight = document.getElementById('hand-right');
const elBtnClick = document.getElementById('btn-click');
const elHandsStage = document.getElementById('hands-stage');
const elFloatingContainer = document.getElementById('floating-container');
const elProgressFill = document.getElementById('progress-fill');
const elProgressTarget = document.getElementById('progress-target-text');
const elProgressHint = document.getElementById('progress-hint');
const elShopList = document.getElementById('shop-list');
const elMemeGallery = document.getElementById('meme-gallery');
const elLeaderboardList = document.getElementById('leaderboard-list');
const elBtnSound = document.getElementById('btn-sound');
const elSoundIcon = document.getElementById('sound-icon');
const elBgMemeVideo = document.getElementById('bg-meme-video-el');

// --------------------------------------------------------------------------
// 4. ฟังก์ชันช่วยเหลือและระบบชื่อผู้เล่น
// --------------------------------------------------------------------------
function formatNum(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num % 1 === 0 ? num.toLocaleString() : num.toFixed(1);
}

function getItemCost(item) {
    let count = inventory[item.id] || 0;
    return Math.floor(item.baseCost * (item.costMult ** count));
}

function updatePlayerNameDisplay() {
    if (elPlayerNameDisplay) {
        elPlayerNameDisplay.textContent = playerName;
    }
}

function editPlayerName() {
    let newName = prompt("กรุณาระบุชื่อของคุณ:", playerName);
    if (newName && newName.trim() !== "") {
        playerName = newName.trim();
        updatePlayerNameDisplay();
        saveGame();
        submitScoreToSupabase();
    }
}

// --------------------------------------------------------------------------
// 5. แอนิเมชันมือสลับ & ตัวเลขเด้ง
// --------------------------------------------------------------------------
let handToggle = false;
function animateHands() {
    handToggle = !handToggle;
    elHandLeft.classList.toggle('raised', handToggle);
    elHandRight.classList.toggle('raised', !handToggle);
}

function spawnFloatText(text, event) {
    let floatEl = document.createElement('div');
    floatEl.className = 'float-text';
    floatEl.textContent = text;
    let rect = elHandsStage.getBoundingClientRect();
    let x = event ? (event.clientX - rect.left) : (rect.width / 2);
    let y = event ? (event.clientY - rect.top) : (rect.height / 2);
    floatEl.style.left = x + 'px';
    floatEl.style.top = y + 'px';
    elFloatingContainer.appendChild(floatEl);
    setTimeout(function() { floatEl.remove(); }, 600);
}

// --------------------------------------------------------------------------
// 6. คลิกทำท่า 67
// --------------------------------------------------------------------------
function handleClick(event) {
    score += 1;
    totalScore += 1;
    animateHands();
    spawnFloatText('+1', event);
    checkMemeUnlocks();
    updateUI();
}

// --------------------------------------------------------------------------
// 7. ร้านค้า (Shop)
// --------------------------------------------------------------------------
function recalcStats() {
    let pps = 0;
    for (let i = 0; i < SHOP_ITEMS.length; i++) {
        pps += SHOP_ITEMS[i].value * (inventory[SHOP_ITEMS[i].id] || 0);
    }
    scorePerSec = pps;
}

function buyItem(item) {
    let cost = getItemCost(item);
    if (score >= cost) {
        score -= cost;
        inventory[item.id] = (inventory[item.id] || 0) + 1;
        recalcStats();
        updateUI();
        updateShop();
    }
}

function initShop() {
    elShopList.innerHTML = '';
    for (let i = 0; i < SHOP_ITEMS.length; i++) {
        let item = SHOP_ITEMS[i];
        let card = document.createElement('div');
        card.className = 'shop-item';
        card.innerHTML = `
            <div class="item-left">
                <span class="item-emoji">${item.emoji}</span>
                <div class="item-details">
                    <span class="item-name">${item.name}</span>
                    <span class="item-desc">${item.desc}</span>
                    <span class="item-owned" id="shop-owned-${item.id}"></span>
                </div>
            </div>
            <button class="btn-buy" id="shop-btn-${item.id}">
                <span>ซื้อ</span>
                <span class="cost" id="shop-cost-${item.id}"></span>
            </button>
        `;
        card.querySelector('.btn-buy').onclick = function() { buyItem(item); };
        elShopList.appendChild(card);
    }
    updateShop();
}

function updateShop() {
    for (let i = 0; i < SHOP_ITEMS.length; i++) {
        let item = SHOP_ITEMS[i];
        let count = inventory[item.id] || 0;
        let cost = getItemCost(item);
        let canAfford = (score >= cost);
        let btn = document.getElementById('shop-btn-' + item.id);
        let costEl = document.getElementById('shop-cost-' + item.id);
        let ownedEl = document.getElementById('shop-owned-' + item.id);

        if (btn) {
            btn.disabled = !canAfford;
            btn.closest('.shop-item').classList.toggle('cant-afford', !canAfford);
        }
        if (costEl) costEl.textContent = '🏆 ' + formatNum(cost);
        if (ownedEl) ownedEl.textContent = count > 0 ? ('มีแล้ว: ' + count) : '';
    }
}

// --------------------------------------------------------------------------
// 8. Level & Meme Background
// --------------------------------------------------------------------------
let currentVideoId = "";

function getMaxUnlockedLevel() {
    return Math.max(...unlockedLevels);
}

function checkMemeUnlocks() {
    for (let i = 0; i < MEME_LEVELS.length; i++) {
        let meme = MEME_LEVELS[i];
        if (totalScore >= meme.scoreReq && !unlockedLevels.includes(meme.level)) {
            unlockedLevels.push(meme.level);
            updateBgMeme();
            renderMemeGallery();
        }
    }
    updateLevelDisplay();
}

function updateBgMeme(clipIdOverride) {
    let targetMeme = null;
    if (clipIdOverride) {
        for (let i = 0; i < MEME_LEVELS.length; i++) {
            if (MEME_LEVELS[i].clipId === clipIdOverride) {
                targetMeme = MEME_LEVELS[i];
                break;
            }
        }
    } else {
        let highestLvl = getMaxUnlockedLevel();
        for (let i = 0; i < MEME_LEVELS.length; i++) {
            if (MEME_LEVELS[i].level === highestLvl) {
                targetMeme = MEME_LEVELS[i];
                break;
            }
        }
    }

    if (targetMeme && targetMeme.clipId !== currentVideoId) {
        currentVideoId = targetMeme.clipId;
        elBgMemeVideo.src = 'https://cdn.vlipsy.com/clips/meta/' + targetMeme.clipId + '/480p-watermark.mp4';
        elBgMemeVideo.muted = !soundOn;
        elBgMemeVideo.volume = 0.1;
    }
}

function updateLevelDisplay() {
    let currentLvl = getMaxUnlockedLevel();
    elLevelText.textContent = 'Level ' + currentLvl;

    let nextMeme = null;
    for (let i = 0; i < MEME_LEVELS.length; i++) {
        if (MEME_LEVELS[i].scoreReq > totalScore) {
            nextMeme = MEME_LEVELS[i];
            break;
        }
    }

    if (nextMeme) {
        elProgressTarget.textContent = 'Level ' + nextMeme.level + ' — ' + formatNum(nextMeme.scoreReq) + ' pts';
        let prevReq = 0;
        for (let i = 0; i < MEME_LEVELS.length; i++) {
            if (MEME_LEVELS[i].scoreReq <= totalScore && MEME_LEVELS[i].scoreReq > prevReq) {
                prevReq = MEME_LEVELS[i].scoreReq;
            }
        }
        let range = nextMeme.scoreReq - prevReq;
        let pct = Math.min(100, Math.max(0, ((totalScore - prevReq) / range) * 100));
        elProgressFill.style.width = pct + '%';
        elProgressHint.textContent = 'อีก ' + formatNum(nextMeme.scoreReq - totalScore) + ' คะแนนเพื่อปลดล็อค!';
    } else {
        elProgressTarget.textContent = 'ปลดล็อคครบทุก Meme แล้ว! 🎊';
        elProgressFill.style.width = '100%';
        elProgressHint.textContent = 'ยินดีด้วย! คุณผ่านครบทุก Level!';
    }
}

function renderMemeGallery() {
    elMemeGallery.innerHTML = '';
    for (let i = 0; i < MEME_LEVELS.length; i++) {
        let meme = MEME_LEVELS[i];
        let isUnlocked = unlockedLevels.includes(meme.level);
        let isPlaying = (meme.clipId === currentVideoId);

        let card = document.createElement('div');
        card.className = 'meme-card' + (isUnlocked ? '' : ' locked') + (isPlaying ? ' now-playing' : '');
        card.innerHTML = `
            <img class="meme-thumb" src="${meme.thumb}" alt="${meme.title}" loading="lazy">
            <div class="meme-info">
                <div class="meme-title">${meme.title}</div>
                <div class="meme-level-tag">Level ${meme.level} • ${formatNum(meme.scoreReq)} pts</div>
            </div>
        `;
        if (isUnlocked) {
            card.addEventListener('click', function() {
                updateBgMeme(meme.clipId);
                renderMemeGallery();
            });
        }
        elMemeGallery.appendChild(card);
    }
}

// --------------------------------------------------------------------------
// 9. ระบบ Supabase Leaderboard
// --------------------------------------------------------------------------
async function submitScoreToSupabase() {
    if (!supabaseClient) return;
    try {
        await supabaseClient
            .from('leaderboard')
            .upsert({ player_name: playerName, total_score: Math.floor(totalScore) }, { onConflict: 'player_name' });
        fetchLeaderboard();
    } catch(e) {}
}

async function fetchLeaderboard() {
    if (!elLeaderboardList) return;
    elLeaderboardList.innerHTML = '<div class="lb-loading">กำลังโหลดอันดับ...</div>';

    if (!supabaseClient) {
        elLeaderboardList.innerHTML = `
            <div class="lb-demo-notice">
                ⚠️ ยังไม่ได้ใส่ Supabase URL & Key<br>
                <small>กรุณาตั้งค่า <code>SUPABASE_URL</code> ในไฟล์ main.js</small>
            </div>
            <div class="leaderboard-item my-rank">
                <span>🥇 ${playerName} (คุณ)</span>
                <strong>${formatNum(Math.floor(totalScore))} pts</strong>
            </div>
        `;
        return;
    }

    try {
        let { data, error } = await supabaseClient
            .from('leaderboard')
            .select('*')
            .order('total_score', { ascending: false })
            .limit(10);

        if (error || !data) {
            elLeaderboardList.innerHTML = '<div class="lb-error">ไม่สามารถดึงข้อมูลอันดับได้</div>';
            return;
        }

        let html = '';
        for (let i = 0; i < data.length; i++) {
            let row = data[i];
            let rankEmoji = i === 0 ? '🥇' : (i === 1 ? '🥈' : (i === 2 ? '🥉' : `#${i + 1}`));
            let isMe = row.player_name === playerName;
            html += `
                <div class="leaderboard-item ${isMe ? 'my-rank' : ''}">
                    <span>${rankEmoji} ${row.player_name} ${isMe ? '(คุณ)' : ''}</span>
                    <strong>${formatNum(row.total_score)} pts</strong>
                </div>
            `;
        }
        elLeaderboardList.innerHTML = html;
    } catch(e) {
        elLeaderboardList.innerHTML = '<div class="lb-error">เกิดข้อผิดพลาดในการโหลดข้อมูล</div>';
    }
}

// --------------------------------------------------------------------------
// 10. UI & Game Loop (setInterval ทุก 0.1 วินาที)
// --------------------------------------------------------------------------
function updateUI() {
    elScore.textContent = formatNum(score);
    elPPS.textContent = formatNum(scorePerSec);
}

setInterval(function() {
    if (scorePerSec > 0) {
        let earned = scorePerSec / 10;
        score += earned;
        totalScore += earned;
        checkMemeUnlocks();
    }
    updateUI();
    updateShop();
}, 100);

// --------------------------------------------------------------------------
// 11. LocalStorage & Utility
// --------------------------------------------------------------------------
function saveGame() {
    localStorage.setItem('tha67_save', JSON.stringify({
        playerName: playerName,
        score: score,
        totalScore: totalScore,
        inventory: inventory,
        unlockedLevels: unlockedLevels
    }));
    submitScoreToSupabase();
}

function loadGame() {
    let savedString = localStorage.getItem('tha67_save');
    if (savedString) {
        try {
            let data = JSON.parse(savedString);
            if (data.playerName) playerName = data.playerName;
            if (data.score !== undefined) score = data.score;
            if (data.totalScore !== undefined) totalScore = data.totalScore;
            if (data.inventory !== undefined) inventory = data.inventory;
            if (data.unlockedLevels !== undefined) unlockedLevels = data.unlockedLevels;
            recalcStats();
        } catch (e) {}
    }
    if (!unlockedLevels.includes(1)) unlockedLevels.push(1);
    updatePlayerNameDisplay();
}



function setupTabs() {
    let tabBtns = document.querySelectorAll('.panel-tab');
    for (let i = 0; i < tabBtns.length; i++) {
        tabBtns[i].onclick = function() {
            document.querySelectorAll('.panel-tab').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            let targetId = this.getAttribute('data-tab');
            document.getElementById(targetId).classList.add('active');
        };
    }
}

// --------------------------------------------------------------------------
// 12. Start Game
// --------------------------------------------------------------------------
window.addEventListener('DOMContentLoaded', function() {
    loadGame();
    setupTabs();

    if (elBtnEditName) {
        elBtnEditName.addEventListener('click', editPlayerName);
    }

    let btnRefreshLb = document.getElementById('btn-refresh-lb');
    if (btnRefreshLb) {
        btnRefreshLb.addEventListener('click', fetchLeaderboard);
    }

    elBtnClick.addEventListener('click', handleClick);
    elHandsStage.addEventListener('click', function(e) {
        if (e.target === elBtnClick || elBtnClick.contains(e.target)) return;
        handleClick(e);
    });

    elBtnSound.addEventListener('click', function() {
        soundOn = !soundOn;
        elSoundIcon.textContent = soundOn ? '🔊' : '🔇';
        if (elBgMemeVideo) elBgMemeVideo.muted = !soundOn;
    });

    setInterval(saveGame, 5000);

    initShop();
    renderMemeGallery();
    updateBgMeme();
    updateLevelDisplay();
    updateUI();
    fetchLeaderboard();
});
