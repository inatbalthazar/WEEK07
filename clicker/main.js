const SUPABASE_URL = "https://jdmdjstufehditcflxcd.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkbWRqc3R1ZmVoZGl0Y2ZseGNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxMjc4MzksImV4cCI6MjEwMjcwMzgzOX0.ZwPobRYXxiui0fKdPtnfLjpk6MDlP5C1cd4vDFHquTY";

const SHOP_ITEMS = [
    { id: "1", name: "เด็ก 67", desc: "+1 ครั้ง/วินาที", emoji: "🧒", baseCost: 20, costMult: 1.12, value: 1 },
    { id: "2", name: "เชียร์ลีดเดอร์", desc: "+2 ครั้ง/วินาที", emoji: "📣", baseCost: 100, costMult: 1.14, value: 2 },
    { id: "3", name: "ครูสอนเต้น", desc: "+3 ครั้ง/วินาที", emoji: "💃", baseCost: 500, costMult: 1.16, value: 3 },
    { id: "4", name: "แขนหุ่นยนต์", desc: "+20 ครั้ง/วินาที", emoji: "🦾", baseCost: 3000, costMult: 1.18, value: 20 },
    { id: "5", name: "AI", desc: "+150 ครั้ง/วินาที", emoji: "🤖", baseCost: 25000, costMult: 1.20, value: 150 }
];

const MEME_LEVELS = [
    { level: 1, scoreReq: 0, title: "Zias: Nodding and Laughing", thumb: "https://cdn.vlipsy.com/clips/8HdVQCC3/thumbnail.webp", clipId: "8HdVQCC3" },
    { level: 2, scoreReq: 50, title: "Mutahar: Extreme Laugh", thumb: "https://cdn.vlipsy.com/clips/UlELJLF8/thumbnail.webp", clipId: "UlELJLF8" },
    { level: 3, scoreReq: 200, title: "Trying Not To Laugh", thumb: "https://cdn.vlipsy.com/clips/Ri6qh4EP/thumbnail.webp", clipId: "Ri6qh4EP" },
    { level: 4, scoreReq: 500, title: "Explosion Meme", thumb: "https://cdn.vlipsy.com/clips/9K8CxpwL/preview-small.jpg", clipId: "9K8CxpwL" },
    { level: 5, scoreReq: 1500, title: "Crying Then Laughing", thumb: "https://cdn.vlipsy.com/clips/fbjBIzWh/thumbnail.webp", clipId: "fbjBIzWh" }
];

class ClickerGame {
    constructor() {
        this.playerName = "ผู้เล่น 67";
        this.score = 0;
        this.totalScore = 0;
        this.scorePerSec = 0;
        this.soundOn = true;
        this.unlockedLevels = [1];
        this.inventory = {};
        this.handToggle = false;
        this.currentVideoId = "";
        this.supabaseClient = null;

        this.initSupabase();
        this.initElements();
    }

    init() {
        this.loadGame();
        this.bindEvents();
        this.initShop();
        this.renderMemeGallery();
        this.updateBgMeme();
        this.updateLevelDisplay();
        this.updateUI();
        this.fetchLeaderboard();
        this.startLoop();
    }

    initSupabase() {
        if (window.supabase && SUPABASE_URL) {
            try {
                this.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
            } catch(e) {}
        }
    }

    initElements() {
        this.elPlayerNameDisplay = document.getElementById('player-name-display');
        this.elBtnEditName = document.getElementById('btn-edit-name');
        this.elScore = document.getElementById('total-score');
        this.elPPS = document.getElementById('score-per-sec');
        this.elLevelText = document.getElementById('level-text');
        this.elHandLeft = document.getElementById('hand-left');
        this.elHandRight = document.getElementById('hand-right');
        this.elBtnClick = document.getElementById('btn-click');
        this.elHandsStage = document.getElementById('hands-stage');
        this.elFloatingContainer = document.getElementById('floating-container');
        this.elProgressFill = document.getElementById('progress-fill');
        this.elProgressTarget = document.getElementById('progress-target-text');
        this.elProgressHint = document.getElementById('progress-hint');
        this.elShopList = document.getElementById('shop-list');
        this.elMemeGallery = document.getElementById('meme-gallery');
        this.elLeaderboardList = document.getElementById('leaderboard-list');
        this.elBtnSound = document.getElementById('btn-sound');
        this.elSoundIcon = document.getElementById('sound-icon');
        this.elBgMemeVideo = document.getElementById('bg-meme-video-el');
    }

    bindEvents() {
        if (this.elBtnEditName) {
            this.elBtnEditName.addEventListener('click', () => this.editPlayerName());
        }
        if (this.elBtnClick) {
            this.elBtnClick.addEventListener('click', (e) => this.handleClick(e));
        }
        if (this.elHandsStage) {
            this.elHandsStage.addEventListener('click', (e) => {
                if (e.target === this.elBtnClick || this.elBtnClick.contains(e.target)) return;
                this.handleClick(e);
            });
        }
        if (this.elBtnSound) {
            this.elBtnSound.addEventListener('click', () => this.toggleSound());
        }
        this.setupTabs();
    }

    formatNum(num) {
        if (num % 1 === 0) return num.toLocaleString();
        return num.toFixed(1);
    }

    getItemCost(item) {
        let count = this.inventory[item.id] || 0;
        return Math.floor(item.baseCost * Math.pow(item.costMult, count));
    }

    editPlayerName() {
        let newName = prompt("ระบุชื่อของคุณ:", this.playerName);
        if (newName && newName.trim() !== "" && newName.trim() !== this.playerName) {
            this.playerName = newName.trim();
            this.resetPlayerStats();
            if (this.elPlayerNameDisplay) this.elPlayerNameDisplay.textContent = this.playerName;
            this.saveGame();
        }
    }

    resetPlayerStats() {
        this.score = 0;
        this.totalScore = 0;
        this.scorePerSec = 0;
        this.inventory = {};
        this.unlockedLevels = [1];
        this.currentVideoId = "";

        this.recalcStats();
        this.updateBgMeme();
        this.renderMemeGallery();
        this.updateLevelDisplay();
        this.updateUI();
        this.updateShop();
    }

    toggleSound() {
        this.soundOn = !this.soundOn;
        if (this.elSoundIcon) this.elSoundIcon.textContent = this.soundOn ? '🔊' : '🔇';
        if (this.elBgMemeVideo) this.elBgMemeVideo.muted = !this.soundOn;
    }

    animateHands() {
        this.handToggle = !this.handToggle;
        if (this.elHandLeft && this.elHandRight) {
            this.elHandLeft.classList.toggle('raised', this.handToggle);
            this.elHandRight.classList.toggle('raised', !this.handToggle);
        }
    }

    spawnFloatText(text, event) {
        if (!this.elFloatingContainer || !this.elHandsStage) return;
        let floatEl = document.createElement('div');
        floatEl.className = 'float-text';
        floatEl.textContent = text;

        let rect = this.elHandsStage.getBoundingClientRect();
        let x = event ? (event.clientX - rect.left) : (rect.width / 2);
        let y = event ? (event.clientY - rect.top) : (rect.height / 2);

        floatEl.style.left = x + 'px';
        floatEl.style.top = y + 'px';

        this.elFloatingContainer.appendChild(floatEl);
        setTimeout(() => floatEl.remove(), 600);
    }

    handleClick(event) {
        this.score++;
        this.totalScore++;
        this.animateHands();
        this.spawnFloatText('+1', event);
        this.checkMemeUnlocks();
        this.updateUI();
    }

    recalcStats() {
        let pps = 0;
        for (let i = 0; i < SHOP_ITEMS.length; i++) {
            let count = this.inventory[SHOP_ITEMS[i].id] || 0;
            pps += SHOP_ITEMS[i].value * count;
        }
        this.scorePerSec = pps;
    }

    buyItem(item) {
        let cost = this.getItemCost(item);
        if (this.score < cost) return;
        this.score -= cost;
        this.inventory[item.id] = (this.inventory[item.id] || 0) + 1;
        this.recalcStats();
        this.updateUI();
        this.updateShop();
    }

    initShop() {
        if (!this.elShopList) return;
        this.elShopList.innerHTML = '';

        for (let i = 0; i < SHOP_ITEMS.length; i++) {
            let item = SHOP_ITEMS[i];
            let card = document.createElement('div');
            card.className = 'shop-item';
            card.id = 'shop-card-' + item.id;

            card.innerHTML = `
                <div class="item-left">
                    <span class="item-emoji">${item.emoji}</span>
                    <div class="item-details">
                        <span class="item-name">${item.name}</span>
                        <span class="item-desc">${item.desc}</span>
                        <span class="item-owned" id="owned-${item.id}"></span>
                    </div>
                </div>
                <button class="btn-buy" id="buy-${item.id}">
                    <span>ซื้อ</span>
                    <span class="cost" id="cost-${item.id}"></span>
                </button>
            `;

            card.querySelector('.btn-buy').onclick = () => this.buyItem(item);
            this.elShopList.appendChild(card);
        }
        this.updateShop();
    }

    updateShop() {
        for (let i = 0; i < SHOP_ITEMS.length; i++) {
            let item = SHOP_ITEMS[i];
            let count = this.inventory[item.id] || 0;
            let cost = this.getItemCost(item);

            let btn = document.getElementById('buy-' + item.id);
            let costEl = document.getElementById('cost-' + item.id);
            let ownedEl = document.getElementById('owned-' + item.id);
            let card = document.getElementById('shop-card-' + item.id);

            if (btn) btn.disabled = (this.score < cost);
            if (costEl) costEl.textContent = '🏆 ' + this.formatNum(cost);
            if (ownedEl) ownedEl.textContent = count > 0 ? 'มี: ' + count : '';
            if (card) card.classList.toggle('cant-afford', this.score < cost);
        }
    }

    checkMemeUnlocks() {
        for (let i = 0; i < MEME_LEVELS.length; i++) {
            let meme = MEME_LEVELS[i];
            if (this.totalScore >= meme.scoreReq && !this.unlockedLevels.includes(meme.level)) {
                this.unlockedLevels.push(meme.level);
                this.updateBgMeme();
                this.renderMemeGallery();
            }
        }
        this.updateLevelDisplay();
        this.updateShop();
    }

    updateBgMeme(clipIdOverride) {
        if (!this.elBgMemeVideo) return;
        let targetMeme = null;

        if (clipIdOverride) {
            targetMeme = MEME_LEVELS.find(m => m.clipId === clipIdOverride);
        } else {
            let highestLvl = Math.max(...this.unlockedLevels);
            targetMeme = MEME_LEVELS.find(m => m.level === highestLvl);
        }

        if (targetMeme && targetMeme.clipId !== this.currentVideoId) {
            this.currentVideoId = targetMeme.clipId;
            this.elBgMemeVideo.src = 'https://cdn.vlipsy.com/clips/meta/' + targetMeme.clipId + '/480p-watermark.mp4';
            this.elBgMemeVideo.muted = !this.soundOn;
            this.elBgMemeVideo.volume = 0.1;
        }
    }

    updateLevelDisplay() {
        let currentLvl = Math.max(...this.unlockedLevels);
        if (this.elLevelText) this.elLevelText.textContent = 'Level ' + currentLvl;

        let nextMeme = MEME_LEVELS.find(m => m.scoreReq > this.totalScore);

        if (nextMeme) {
            if (this.elProgressTarget) {
                this.elProgressTarget.textContent = 'Level ' + nextMeme.level + ' — ' + this.formatNum(nextMeme.scoreReq) + ' pts';
            }
            let prevReq = 0;
            for (let i = 0; i < MEME_LEVELS.length; i++) {
                if (MEME_LEVELS[i].scoreReq <= this.totalScore && MEME_LEVELS[i].scoreReq > prevReq) {
                    prevReq = MEME_LEVELS[i].scoreReq;
                }
            }

            let range = nextMeme.scoreReq - prevReq;
            let pct = Math.min(100, Math.max(0, ((this.totalScore - prevReq) / range) * 100));
            if (this.elProgressFill) this.elProgressFill.style.width = pct + '%';
            if (this.elProgressHint) {
                this.elProgressHint.textContent = '67 อีก ' + this.formatNum(nextMeme.scoreReq - this.totalScore) + ' ครั้งเพื่อปลดล็อค!';
            }
        } else {
            if (this.elProgressTarget) this.elProgressTarget.textContent = 'ปลดล็อคครบทุก Meme แล้ว! 🎊';
            if (this.elProgressFill) this.elProgressFill.style.width = '100%';
            if (this.elProgressHint) this.elProgressHint.textContent = 'ยินดีด้วย! คุณผ่านครบทุก Level!';
        }
    }

    renderMemeGallery() {
        if (!this.elMemeGallery) return;
        this.elMemeGallery.innerHTML = '';

        for (let i = 0; i < MEME_LEVELS.length; i++) {
            let meme = MEME_LEVELS[i];
            let isUnlocked = this.unlockedLevels.includes(meme.level);
            let isPlaying = (meme.clipId === this.currentVideoId);

            let card = document.createElement('div');
            card.className = 'meme-card' + (isUnlocked ? '' : ' locked') + (isPlaying ? ' now-playing' : '');

            card.innerHTML = `
                <img class="meme-thumb" src="${meme.thumb}" alt="${meme.title}" loading="lazy">
                <div class="meme-info">
                    <div class="meme-title">${meme.title}</div>
                    <div class="meme-level-tag">Level ${meme.level} • ${this.formatNum(meme.scoreReq)} pts</div>
                </div>
            `;

            if (isUnlocked) {
                card.onclick = () => {
                    this.updateBgMeme(meme.clipId);
                    this.renderMemeGallery();
                };
            }

            this.elMemeGallery.appendChild(card);
        }
    }

    async submitScoreToSupabase() {
        if (!this.supabaseClient) return;
        try {
            await this.supabaseClient
                .from('leaderboard')
                .upsert({ player_name: this.playerName, total_score: Math.floor(this.totalScore) }, { onConflict: 'player_name' });
            this.fetchLeaderboard();
        } catch(e) {}
    }

    async fetchLeaderboard() {
        if (!this.elLeaderboardList) return;
        this.elLeaderboardList.innerHTML = '<div class="lb-loading">กำลังโหลดอันดับ...</div>';

        if (!this.supabaseClient) {
            this.elLeaderboardList.innerHTML = `
                <div class="leaderboard-item my-rank">
                    <span>🥇 ${this.playerName} (คุณ)</span>
                    <strong>${this.formatNum(Math.floor(this.totalScore))} pts</strong>
                </div>
            `;
            return;
        }

        try {
            let { data, error } = await this.supabaseClient
                .from('leaderboard')
                .select('*')
                .order('total_score', { ascending: false })
                .limit(10);

            if (error || !data) {
                this.elLeaderboardList.innerHTML = '<div class="lb-error">ไม่สามารถดึงข้อมูลอันดับได้</div>';
                return;
            }

            let html = '';
            for (let i = 0; i < data.length; i++) {
                let row = data[i];
                let rankEmoji = i === 0 ? '🥇' : (i === 1 ? '🥈' : (i === 2 ? '🥉' : `#${i + 1}`));
                let isMe = (row.player_name === this.playerName);
                html += `
                    <div class="leaderboard-item ${isMe ? 'my-rank' : ''}">
                        <span>${rankEmoji} ${row.player_name} ${isMe ? '(คุณ)' : ''}</span>
                        <strong>${this.formatNum(row.total_score)} pts</strong>
                    </div>
                `;
            }
            this.elLeaderboardList.innerHTML = html;
        } catch(e) {
            this.elLeaderboardList.innerHTML = '<div class="lb-error">เกิดข้อผิดพลาดในการโหลดข้อมูล</div>';
        }
    }

    updateUI() {
        if (this.elScore) this.elScore.textContent = this.formatNum(this.score);
        if (this.elPPS) this.elPPS.textContent = this.formatNum(this.scorePerSec);
    }

    startLoop() {
        setInterval(() => {
            if (this.scorePerSec > 0) {
                let earned = this.scorePerSec / 10;
                this.score += earned;
                this.totalScore += earned;
                this.checkMemeUnlocks();
                this.updateShop();
            }
            this.updateUI();
        }, 100);

        setInterval(() => this.saveGame(), 5000);
    }

    saveGame() {
        localStorage.setItem('tha67_save', JSON.stringify({
            playerName: this.playerName,
            score: this.score,
            totalScore: this.totalScore,
            inventory: this.inventory,
            unlockedLevels: this.unlockedLevels
        }));
        this.submitScoreToSupabase();
    }

    loadGame() {
        let savedString = localStorage.getItem('tha67_save');
        if (savedString) {
            try {
                let data = JSON.parse(savedString);
                if (data.playerName) this.playerName = data.playerName;
                if (data.score !== undefined) this.score = data.score;
                if (data.totalScore !== undefined) this.totalScore = data.totalScore;
                if (data.inventory !== undefined) this.inventory = data.inventory;
                if (data.unlockedLevels !== undefined) this.unlockedLevels = data.unlockedLevels;
                this.recalcStats();
            } catch (e) {}
        }
        if (!this.unlockedLevels.includes(1)) this.unlockedLevels.push(1);
        if (this.elPlayerNameDisplay) this.elPlayerNameDisplay.textContent = this.playerName;
    }

    setupTabs() {
        let tabBtns = document.querySelectorAll('.panel-tab');
        let tabContents = document.querySelectorAll('.tab-content');

        tabBtns.forEach(btn => {
            btn.onclick = function() {
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                this.classList.add('active');
                let targetId = this.getAttribute('data-tab');
                document.getElementById(targetId).classList.add('active');
            };
        });
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const game = new ClickerGame();
    game.init();
});
