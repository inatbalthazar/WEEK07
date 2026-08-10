/* ==========================================================================
   การท่า 67 Clicker - Game Engine (ส่วนควบคุมตรรกะของเกมทั้งหมด)
   ========================================================================== */

// ─── GAME STATE ───
// ออบเจ็กต์ state ใช้สำหรับเก็บข้อมูลสถานะทั้งหมดของเกมในปัจจุบัน
const state = {
    score: 0,            // คะแนนที่ใช้ซื้อของได้ (จะลดลงเมื่อกดซื้อ)
    totalScore: 0,       // คะแนนรวมทั้งหมดที่หามาได้ (ไม่ลด ใช้ปลดล็อคด่าน)
    scorePerSec: 0,      // คะแนนที่เพิ่มขึ้นอัตโนมัติต่อวินาที (ได้จากของในร้าน)
    scorePerClick: 1,    // คะแนนที่ได้จากการกดคลิก 1 ครั้ง (เริ่มที่ 1)
    totalClicks: 0,      // จำนวนครั้งที่ผู้เล่นกดคลิกทั้งหมด
    currentLevel: 1,     // เลเวลปัจจุบันของ Meme วิดีโอ
    soundOn: true,       // สถานะการเปิด/ปิดเสียง (true = เปิด, false = ปิด)
    inventory: {},       // กระเป๋าเก็บของที่ซื้อมา (เช่น { kid_helper: 2 })
    unlockedMemes: new Set(), // เก็บรายชื่อเลเวลที่ปลดล็อคแล้ว (Set จะไม่เก็บซ้ำกัน)
    handSide: 'left',    // จดจำว่าคลิกล่าสุดมือไหนยกขึ้น (left หรือ right)
    startTime: Date.now()// บันทึกเวลาตอนเริ่มเล่นเกม (เป็นมิลลิวินาที)
};

// ─── MEME LEVELS (10 levels) ── vlipsy popular clips ───
// อาร์เรย์เก็บข้อมูลของ Meme แต่ละเลเวล
const MEME_LEVELS = [
    {
        level: 1,        // เลเวลของด่าน
        scoreReq: 0,     // คะแนนรวมที่ต้องการเพื่อปลดล็อคด่านนี้ (0 คือได้ตั้งแต่เริ่ม)
        title: "Zias: Nodding and Laughing", // ชื่อของ Meme
        thumb: "https://cdn.vlipsy.com/clips/8HdVQCC3/thumbnail.webp", // รูปภาพตัวอย่างขนาดเล็ก
        embedUrl: "https://vlipsy.com/vlip/8HdVQCC3/embed", // ลิงก์ที่ใช้ดึงวิดีโอ (ไม่ได้ใช้แล้ว)
        clipPage: "https://vlipsy.com/clips/zias-laughing-meme-8HdVQCC3" // ลิงก์หน้าเว็บหลักของคลิป
    },
    {
        level: 2,
        scoreReq: 50,    // ต้องมีคะแนนรวม 50 ขึ้นไปถึงจะปลดล็อค
        title: "Mutahar: Extreme Laugh",
        thumb: "https://cdn.vlipsy.com/clips/UlELJLF8/thumbnail.webp",
        embedUrl: "https://vlipsy.com/vlip/UlELJLF8/embed",
        clipPage: "https://vlipsy.com/clips/mutahar-extreme-laugh-UlELJLF8"
    },
    {
        level: 3,
        scoreReq: 200,
        title: "Trying Not To Laugh",
        thumb: "https://cdn.vlipsy.com/clips/Ri6qh4EP/thumbnail.webp",
        embedUrl: "https://vlipsy.com/vlip/Ri6qh4EP/embed",
        clipPage: "https://vlipsy.com/clips/dr-reasons-trying-not-to-laugh-Ri6qh4EP"
    },
    {
        level: 4,
        scoreReq: 500,
        title: "Explosion Meme",
        thumb: "https://cdn.vlipsy.com/clips/9K8CxpwL/preview-small.jpg",
        embedUrl: "https://vlipsy.com/vlip/9K8CxpwL/embed",
        clipPage: "https://vlipsy.com/clips/jos-bantes-explosion-meme-9K8CxpwL"
    },
    {
        level: 5,
        scoreReq: 1500,
        title: "Crying Then Laughing",
        thumb: "https://cdn.vlipsy.com/clips/fbjBIzWh/thumbnail.webp",
        embedUrl: "https://vlipsy.com/vlip/fbjBIzWh/embed",
        clipPage: "https://vlipsy.com/clips/african-boy-crying-then-laughing-fbjBIzWh"
    },
    {
        level: 6,
        scoreReq: 4000,
        title: "SpongeBob: A Few Moments Later",
        thumb: "https://cdn.vlipsy.com/clips/YvbfprNp/thumbnail.webp",
        embedUrl: "https://vlipsy.com/vlip/YvbfprNp/embed",
        clipPage: "https://vlipsy.com/clips/spongebob-squarepants-a-few-moments-later-YvbfprNp"
    },
    {
        level: 7,
        scoreReq: 10000,
        title: "Meow Cat Meme",
        thumb: "https://cdn.vlipsy.com/clips/VhvChBfW/thumbnail.webp",
        embedUrl: "https://vlipsy.com/vlip/VhvChBfW/embed",
        clipPage: "https://vlipsy.com/clips/meow-VhvChBfW"
    },
    {
        level: 8,
        scoreReq: 30000,
        title: "Forehead Slap in Crowd",
        thumb: "https://cdn.vlipsy.com/clips/aI8nvyjk/thumbnail.webp",
        embedUrl: "https://vlipsy.com/vlip/aI8nvyjk/embed",
        clipPage: "https://vlipsy.com/clips/naked-gun-33-13-forehead-slap-aI8nvyjk"
    },
    {
        level: 9,
        scoreReq: 80000,
        title: "Michael Rosen: Oh, Nice.",
        thumb: "https://cdn.vlipsy.com/clips/tVmiYVBz/preview-small.jpg",
        embedUrl: "https://vlipsy.com/vlip/tVmiYVBz/embed",
        clipPage: "https://vlipsy.com/clips/michael-rosen-noice-tVmiYVBz"
    },
    {
        level: 10,
        scoreReq: 200000,
        title: "Sound Effects: Fahhh!",
        thumb: "https://cdn.vlipsy.com/clips/go1N1q3o/thumbnail.webp",
        embedUrl: "https://vlipsy.com/vlip/go1N1q3o/embed",
        clipPage: "https://vlipsy.com/clips/sound-effects-fahhh-go1N1q3o"
    }
];

// ─── SHOP ITEMS ───
// อาร์เรย์เก็บข้อมูลของสินค้าในร้านค้า (ตัวช่วยคลิก)
const SHOP_ITEMS = [
    {
        id: "kid_helper",          // ไอดีอ้างอิงของสินค้า
        name: "ซื้อเด็กมาช่วยท่า 67",    // ชื่อสินค้าที่จะแสดงในหน้าเว็บ
        desc: "+0.1 คะแนน/วินาที ต่อคน",// คำอธิบายสินค้า
        emoji: "🧒",               // อิโมจิแทนรูปภาพ
        imgSrc: "",                // ลิงก์รูปภาพ (ทิ้งว่างไว้ก่อนเพื่อใช้ emoji แทน)
        baseCost: 20,              // ราคาเริ่มต้นตอนซื้อชิ้นแรก
        costMult: 1.12,            // ตัวคูณราคา (ซื้อชิ้นต่อไปจะแพงขึ้น 12%)
        type: "pps",               // pps = points per second (ช่วยเพิ่มคะแนนอัตโนมัติต่อวินาที)
        value: 0.1                 // จำนวนคะแนนที่จะเพิ่มให้ต่อ 1 ชิ้น
    },
    {
        id: "cheerleader",
        name: "จ้างเชียร์ลีดเดอร์กองเชียร์",
        desc: "+0.5 คะแนน/วินาที • ช่วยโบกมือให้เร้าใจ!",
        emoji: "📣",
        imgSrc: "",
        baseCost: 100,             // ราคาเริ่มต้น 100
        costMult: 1.14,            // ชิ้นต่อไปแพงขึ้น 14%
        type: "pps",
        value: 0.5
    },
    {
        id: "dance_instructor",
        name: "ครูสอนเต้นมืออาชีพ",
        desc: "+3 คะแนน/วินาที • ท่า 67 สวยงามกว่าเดิม!",
        emoji: "💃",
        imgSrc: "",
        baseCost: 500,
        costMult: 1.16,
        type: "pps",
        value: 3
    },
    {
        id: "robot_arm",
        name: "แขนกลหุ่นยนต์ท่า 67 อัตโนมัติ",
        desc: "+20 คะแนน/วินาที • แขนเหล็กไม่เมื่อย!",
        emoji: "🦾",
        imgSrc: "",
        baseCost: 3000,
        costMult: 1.18,
        type: "pps",
        value: 20
    },
    {
        id: "ai_clone",
        name: "โคลนนิ่ง AI ท่า 67 ข้ามมิติ",
        desc: "+150 คะแนน/วินาที • AI สร้างร่างจำลองทำท่า 67 ไม่หยุดพัก!",
        emoji: "🤖",
        imgSrc: "",
        baseCost: 25000,
        costMult: 1.20,
        type: "pps",
        value: 150
    }
];

// ─── WEB AUDIO SYNTH ───
// ใช้ Web Audio API สร้างเสียงสังเคราะห์ด้วยโค้ด (ไม่ต้องโหลดไฟล์ mp3 ให้หนักเครื่อง)
let audioCtx = null; // ตัวแปรเก็บ AudioContext

function initAudio() {
    // ฟังก์ชันสร้าง AudioContext หากยังไม่เคยถูกสร้างมาก่อน
    if (!audioCtx) {
        // รองรับทั้งเบราว์เซอร์ปกติและเบราว์เซอร์รุ่นเก่า (webkit)
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    // เบราว์เซอร์มักจะระงับเสียงไว้จนกว่าผู้ใช้จะคลิกหน้าเว็บ หากถูกระงับอยู่ให้เปิดทำงาน (resume)
    if (audioCtx.state === 'suspended') audioCtx.resume();
}

function playClickSound() {
    // ฟังก์ชันเล่นเสียง "ป๊อป" สั้นๆ เมื่อคลิกมือ
    if (!state.soundOn) return; // ถ้าปิดเสียงไว้ ก็ให้ออกจากฟังก์ชันนี้ไปเลย
    try {
        initAudio(); // ตรวจสอบและสร้างระบบเสียงก่อนเล่น
        const now = audioCtx.currentTime; // เวลาปัจจุบันของระบบเสียง
        const osc = audioCtx.createOscillator(); // สร้างตัวกำเนิดคลื่นเสียง (Oscillator)
        const gain = audioCtx.createGain(); // สร้างตัวควบคุมระดับเสียง (Volume/Gain)
        
        osc.type = 'sine'; // ใช้คลื่นเสียงแบบ sine (เสียงนุ่มๆ)
        osc.frequency.setValueAtTime(600, now); // เริ่มต้นความถี่เสียงที่ 600Hz
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.06); // ลดระดับเสียงลงอย่างรวดเร็วให้จบใน 0.06 วินาที
        
        gain.gain.setValueAtTime(0.35, now); // ตั้งความดังเสียงเริ่มต้นที่ 35%
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.06); // ลดความดังลงจนแทบไม่ได้ยินใน 0.06 วินาที
        
        osc.connect(gain); // ต่อตัวกำเนิดเสียงเข้ากับตัวควบคุมความดัง
        gain.connect(audioCtx.destination); // ต่อตัวควบคุมความดังออกลำโพงเครื่อง
        
        osc.start(now); // เริ่มเล่นเสียงทันที
        osc.stop(now + 0.06); // หยุดเล่นเสียงเมื่อผ่านไป 0.06 วินาที
    } catch (e) {} // ป้องกันแอปพังถ้าเบราว์เซอร์ไม่รองรับ
}

function playBuySound() {
    // ฟังก์ชันเล่นเสียง 3 โน้ต "ติ๊ง ติ๊ง ติ๊ง" เมื่อกดซื้อของสำเร็จ
    if (!state.soundOn) return;
    try {
        initAudio();
        const now = audioCtx.currentTime;
        // อาเรย์เก็บความถี่ 3 โน้ต: C5 (523Hz), E5 (659Hz), G5 (784Hz)
        [523, 659, 784].forEach((f, i) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            
            // i * 0.06 คือการตั้งหน่วงเวลา โน้ตตัวที่ 2 และ 3 จะเล่นช้ากว่าตัวแรกตามลำดับ
            osc.frequency.setValueAtTime(f, now + i * 0.06); 
            gain.gain.setValueAtTime(0.15, now + i * 0.06); // ความดัง 15%
            gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.06 + 0.12);
            
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            
            osc.start(now + i * 0.06); // เริ่มเล่นตามการหน่วงเวลา
            osc.stop(now + i * 0.06 + 0.12); // แต่ละโน้ตมีความยาว 0.12 วินาที
        });
    } catch (e) {}
}

function playUnlockSound() {
    // ฟังก์ชันเล่นเสียงฉลอง 4 โน้ต เมื่อปลดล็อคด่านใหม่
    if (!state.soundOn) return;
    try {
        initAudio();
        const now = audioCtx.currentTime;
        // อาเรย์ 4 โน้ต
        [440, 554, 659, 880].forEach((f, i) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            
            osc.type = 'triangle'; // ใช้คลื่นเสียงแบบสามเหลี่ยม (ฟังดูเหมือนเกม 8-bit มากขึ้น)
            osc.frequency.setValueAtTime(f, now + i * 0.08); // หน่วงเวลาแต่ละโน้ต 0.08 วินาที
            gain.gain.setValueAtTime(0.2, now + i * 0.08); // ความดัง 20%
            gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.08 + 0.2);
            
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            
            osc.start(now + i * 0.08);
            osc.stop(now + i * 0.08 + 0.2);
        });
    } catch (e) {}
}

// ─── DOM ELEMENTS ───
// ดึงชิ้นส่วน HTML มาเก็บไว้ในตัวแปร JavaScript เพื่อให้จัดการง่ายและโค้ดทำงานเร็วขึ้น
const elScore = document.getElementById('total-score'); // ตัวเลขคะแนนรวม
const elPPS = document.getElementById('score-per-sec'); // ตัวเลขคะแนนต่อวินาที
const elPPC = document.getElementById('score-per-click'); // ตัวเลขคะแนนต่อการคลิก 1 ครั้ง
const elLevelText = document.getElementById('level-text'); // ป้ายแสดงเลเวลปัจจุบัน
const elHandLeft = document.getElementById('hand-left'); // กล่องมือซ้าย
const elHandRight = document.getElementById('hand-right'); // กล่องมือขวา
const elBtnClick = document.getElementById('btn-click'); // ปุ่มกดท่า 67 วงกลมใหญ่
const elHandsStage = document.getElementById('hands-stage'); // เวทีมือ
const elFloatingContainer = document.getElementById('floating-container'); // พื้นที่ให้ตัวเลขลอยขึ้นมา
const elProgressFill = document.getElementById('progress-fill'); // แถบหลอดความคืบหน้า
const elProgressTarget = document.getElementById('progress-target-text'); // ข้อความเป้าหมายบนหลอดความคืบหน้า
const elProgressHint = document.getElementById('progress-hint'); // คำใบ้ด้านล่างหลอด
const elShopList = document.getElementById('shop-list'); // กล่องรายชื่อสินค้า
const elMemeGallery = document.getElementById('meme-gallery'); // กล่องรวม Meme
const elBtnSound = document.getElementById('btn-sound'); // ปุ่มเปิด/ปิดเสียง
const elSoundIcon = document.getElementById('sound-icon'); // ไอคอนรูปลำโพง
const elBtnReset = document.getElementById('btn-reset'); // ปุ่มเริ่มเกมใหม่
const elToastContainer = document.getElementById('toast-container'); // กล่องเก็บข้อความแจ้งเตือนมุมล่าง
const elBgMemeVideo = document.getElementById('bg-meme-video-el'); // แท็กวิดีโอพื้นหลัง (สำหรับเล่น Meme)

// ─── UTILITY ───
// ฟังก์ชันจัดรูปแบบตัวเลขให้สวยงาม อ่านง่าย (เช่น 1500 -> 1.5k)
function formatNum(n) {
    if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M'; // ถ้าเกิน 1 ล้าน ย่อเป็น M
    if (n >= 1e3) return (n / 1e3).toFixed(1) + 'k'; // ถ้าเกิน 1 พัน ย่อเป็น k
    return n % 1 === 0 ? n.toLocaleString() : n.toFixed(1); // ตัวเลขปกติใส่ลูกน้ำ, ถ้ามีทศนิยมให้แสดง 1 ตำแหน่ง
}

// ฟังก์ชันคำนวณราคาสินค้าชิ้นต่อไป (ราคาจะเพิ่มขึ้นเรื่อยๆ ตามจำนวนที่ซื้อไปแล้ว)
function getItemCost(item) {
    const count = state.inventory[item.id] || 0; // เช็คว่าเราซื้อชิ้นนี้ไปกี่อันแล้ว (ถ้ายังไม่ซื้อก็เป็น 0)
    // คำนวณราคา = ราคาเริ่มต้น * (ตัวคูณ ยกกำลัง จำนวนที่มี)
    return Math.floor(item.baseCost * Math.pow(item.costMult, count));
}

// ─── HAND ANIMATION ───
let handToggle = false; // ตัวแปรเก็บว่ากำลังสลับเป็นมือไหน (false=ยกมือซ้าย, true=ยกมือขวา)

function animateHands() {
    // ฟังก์ชันนี้จะสลับคลาส 'raised' ระหว่างมือซ้ายและขวา
    handToggle = !handToggle; // สลับค่า true/false ไปเรื่อยๆ ทุกครั้งที่เรียกใช้
    if (handToggle) {
        elHandLeft.classList.add('raised'); // ยกมือซ้าย
        elHandRight.classList.remove('raised'); // เอามือขวาลง
    } else {
        elHandLeft.classList.remove('raised'); // เอามือซ้ายลง
        elHandRight.classList.add('raised'); // ยกมือขวา
    }
}

// ระบบขยับมืออัตโนมัติตามคะแนนต่อวินาทีที่เรามี
let autoHandInterval = null; // ตัวแปรเก็บ ID ของ Interval เพื่อเอาไว้หยุด

function updateAutoHandAnimation() {
    // ล้างลูปเก่าทิ้งก่อน (ถ้ามี)
    if (autoHandInterval) clearInterval(autoHandInterval);

    if (state.scorePerSec > 0) {
        // คำนวณความเร็วในการสลับมือ (ยิ่งคะแนนต่อวินาทีเยอะ ยิ่งสลับเร็ว)
        // หน่วงเวลาอย่างน้อย 100ms และอย่างมาก 800ms
        const intervalMs = Math.max(100, Math.min(800, 500 / state.scorePerSec * 10));
        
        // สั่งให้สลับมืออัตโนมัติตามระยะเวลาที่คำนวณได้
        autoHandInterval = setInterval(() => {
            animateHands();
        }, intervalMs);
    }
}

// ─── CLICK HANDLER ───
// ฟังก์ชันที่ถูกเรียกเมื่อผู้เล่นกดคลิกตรงกลาง
function handleClick(e) {
    initAudio(); // ตรวจสอบระบบเสียงทุกครั้งที่คลิก
    const earned = state.scorePerClick; // ดึงค่าคะแนนต่อคลิกปัจจุบัน
    
    state.score += earned; // เพิ่มคะแนนสำหรับใช้ซื้อของ
    state.totalScore += earned; // เพิ่มคะแนนรวมสะสม (เพื่อปลดล็อค Meme)
    state.totalClicks += 1; // นับจำนวนครั้งที่คลิกเพิ่มขึ้น

    playClickSound(); // เล่นเสียงป๊อป
    animateHands(); // สลับมือซ้ายขวา 1 ครั้ง
    spawnFloat(`+${formatNum(earned)}`, e); // เสกตัวเลขคะแนนให้ลอยขึ้นมาจากจุดที่คลิก
    checkMemeUnlocks(); // ตรวจสอบว่าคะแนนถึงเป้าหมายปลดล็อคด่านใหม่หรือยัง
    updateUI(); // อัปเดตตัวเลขบนหน้าจอ
}

function spawnFloat(text, event) {
    // สร้างตัวเลขลอย (Floating Text) เมื่อมีการคลิกหรือเด้งคะแนนอัตโนมัติ
    const el = document.createElement('div'); // สร้างกล่อง div ใหม่
    el.className = 'float-text'; // ใส่คลาสให้เป็นตัวเลขลอย
    el.textContent = text; // ใส่ข้อความ (เช่น "+1")

    const stageRect = elHandsStage.getBoundingClientRect(); // หาขนาดและตำแหน่งของเวที
    // สุ่มตำแหน่งเริ่มต้นให้ลอยอยู่ตรงกลางเวที (กรณีคะแนนขึ้นอัตโนมัติ ไม่ได้ใช้เมาส์คลิก)
    let x = stageRect.width / 2 + (Math.random() * 60 - 30);
    let y = stageRect.height / 2 + (Math.random() * 30 - 15);

    // ถ้ามีการคลิกเมาส์จริงๆ ให้ตัวเลขลอยขึ้นมาจากจุดที่เมาส์อยู่
    if (event && event.clientX) {
        x = event.clientX - stageRect.left + (Math.random() * 30 - 15);
        y = event.clientY - stageRect.top + (Math.random() * 20 - 10);
    }

    el.style.left = x + 'px'; // กำหนดตำแหน่งแกน X
    el.style.top = y + 'px'; // กำหนดตำแหน่งแกน Y

    elFloatingContainer.appendChild(el); // เอาตัวเลขใส่ลงไปในหน้าเว็บ (แสดงผลทันที)
    
    // ตั้งเวลาลบตัวเลขนี้ทิ้งหลังจากผ่านไป 700 มิลลิวินาที (เพื่อให้แอนิเมชันลอยเสร็จพอดี และไม่กินแรม)
    setTimeout(() => el.remove(), 700);
}

// ─── MEME UNLOCK LOGIC ───
let lastPlayedMeme = null; // ตัวแปรเก็บว่ากำลังดู Meme ตัวไหนอยู่
let currentBgMemeLevel = 0; // ตัวแปรเก็บว่าตอนนี้วิดีโอพื้นหลังเล่น Meme เลเวลไหนอยู่

function checkMemeUnlocks() {
    // วนลูปเช็ค Meme แต่ละเลเวลว่าคะแนนเราถึงเกณฑ์หรือยัง
    for (const meme of MEME_LEVELS) {
        // ถ้าคะแนนรวมถึงเกณฑ์ และ ยังไม่เคยปลดล็อค Meme เลเวลนี้
        if (state.totalScore >= meme.scoreReq && !state.unlockedMemes.has(meme.level)) {
            state.unlockedMemes.add(meme.level); // บันทึกว่าปลดล็อคเลเวลนี้แล้ว
            state.currentLevel = meme.level; // อัปเดตเลเวลปัจจุบัน

            playUnlockSound(); // เล่นเสียงฉลองตอนปลดล็อค
            showToast(`🎉 Level ${meme.level} ปลดล็อค: ${meme.title}`); // แสดงข้อความเด้งเตือนมุมจอ

            lastPlayedMeme = meme; // ตั้งค่าให้ Meme ที่เพิ่งปลดล็อคเป็นตัวล่าสุด

            // เปลี่ยนวิดีโอพื้นหลังให้เป็น Meme ที่เพิ่งปลดล็อคทันที
            updateBgMeme();

            renderMemeGallery(); // วาดหน้ารวม Meme ใหม่ (เพื่อปลดล็อคภาพที่ถูกล็อกไว้)
        }
    }
    updateLevelDisplay(); // อัปเดตหลอดความคืบหน้าด้านล่าง
}

// ─── BACKGROUND MEME VIDEO ───
function updateBgMeme() {
    // หาเลเวลที่สูงที่สุดที่ผู้เล่นปลดล็อคแล้วตอนนี้
    // เอา Set มาแปลงเป็น Array แล้วเรียงจากมากไปน้อย
    const unlockedLevels = [...state.unlockedMemes].sort((a, b) => b - a);
    const latestLevel = unlockedLevels[0] || 1; // เอาอันแรก (สูงสุด) ถ้าไม่มีให้ใช้ 1
    const meme = MEME_LEVELS.find(m => m.level === latestLevel); // ดึงข้อมูล Meme ตามเลเวล

    // ถ้าเจอข้อมูล Meme และ เลเวลนั้นยังไม่ได้ถูกตั้งเป็นพื้นหลัง
    if (meme && latestLevel !== currentBgMemeLevel) {
        currentBgMemeLevel = latestLevel; // จำไว้ว่ากำลังเล่นเลเวลนี้อยู่ จะได้ไม่โหลดซ้ำ
        
        // ดึงเอาเฉพาะรหัสวิดีโอจากลิงก์ embed (เช่น จาก "https://vlipsy.com/vlip/8HdVQCC3/embed" เอาแค่ "8HdVQCC3")
        const clipId = meme.embedUrl.split('/')[4];
        
        // สั่งให้แท็กวิดีโอไปโหลดไฟล์ .mp4 มาเล่นโดยตรง (แก้ปัญหา Page Not Found ของ embed)
        elBgMemeVideo.src = `https://cdn.vlipsy.com/clips/meta/${clipId}/480p-watermark.mp4`;
        
        // ตั้งค่าว่าวิดีโอมีเสียงไหม ขึ้นอยู่กับการเปิดปิดเสียงของผู้เล่น
        elBgMemeVideo.muted = !state.soundOn;
    }
}

function updateLevelDisplay() {
    // หาเลเวลสูงสุดที่ปลดล็อคแล้ว เพื่อเอาไปแสดงตรงมุมซ้ายบน
    const currentLvl = Math.max(...[...state.unlockedMemes], 1);
    elLevelText.textContent = `Level ${currentLvl}`;

    // หาเป้าหมายต่อไปว่าต้องใช้คะแนนอีกเท่าไหร่
    const nextMeme = MEME_LEVELS.find(m => m.scoreReq > state.totalScore);
    
    if (nextMeme) { // ถ้ายังเหลือ Meme ให้ปลดล็อค
        // แสดงข้อความบอกว่าเลเวลต่อไปต้องใช้กี่คะแนน
        elProgressTarget.textContent = `Level ${nextMeme.level} — ${formatNum(nextMeme.scoreReq)} pts`;

        // หาว่าเลเวลล่าสุดใช้คะแนนปลดล็อคเท่าไหร่ เพื่อเป็นฐานในการคำนวณหลอดพลัง
        const prevReq = MEME_LEVELS
            .filter(m => m.scoreReq <= state.totalScore)
            .reduce((max, m) => Math.max(max, m.scoreReq), 0);

        // คำนวณช่วงคะแนนจากเลเวลล่าสุด ไป เลเวลต่อไป
        const range = nextMeme.scoreReq - prevReq;
        // คำนวณว่าตอนนี้เราทำคะแนนเกินเลเวลล่าสุดมาเท่าไหร่แล้ว
        const progress = state.totalScore - prevReq;
        // คำนวณเป็นเปอร์เซ็นต์ (ไม่เกิน 100%)
        const pct = Math.min(100, (progress / range) * 100);
        
        elProgressFill.style.width = pct + '%'; // ยืดความยาวของแถบสีหลอดพลังตามเปอร์เซ็นต์
        
        // แสดงคำใบ้บอกว่าขาดอีกกี่คะแนน
        elProgressHint.textContent = `อีก ${formatNum(nextMeme.scoreReq - state.totalScore)} คะแนนเพื่อปลดล็อค Meme ถัดไป!`;
    } else { // ถ้าไม่มี Meme ให้ปลดล็อคแล้ว (ตัน)
        elProgressTarget.textContent = 'ปลดล็อคครบทุก Meme แล้ว! 🎊'; // บอกว่าเกมจบแล้ว
        elProgressFill.style.width = '100%'; // หลอดเต็ม 100% ตลอดกาล
        elProgressHint.textContent = 'ยินดีด้วย! คุณเป็นราชาแห่งท่า 67!';
    }
}


// ─── SHOP ───
// ฟังก์ชันเรียกทำงานตอนผู้เล่นกดปุ่ม "ซื้อ"
function buyItem(item) {
    const cost = getItemCost(item); // คำนวณราคาปัจจุบันของสินค้านั้น
    if (state.score >= cost) { // ถ้าเรามีคะแนนพอที่จะซื้อ
        state.score -= cost; // หักคะแนน
        // บันทึกว่าซื้อสินค้านี้เพิ่มไปอีก 1 ชิ้น
        state.inventory[item.id] = (state.inventory[item.id] || 0) + 1;
        
        playBuySound(); // เล่นเสียงซื้อสำเร็จ
        recalcStats(); // คำนวณค่าสถานะใหม่ทั้งหมด (PPS/PPC)
        updateUI(); // อัปเดตตัวเลขคะแนนบนหน้าจอ
        updateShop(); // อัปเดตปุ่มต่างๆ ในร้าน (ปุ่มไหนแพงเกินไปจะถูกปิด)
    }
}

function recalcStats() {
    // ฟังก์ชันสำหรับคำนวณค่าสถานะใหม่ทั้งหมด (เรียกใช้ตอนเข้าเกม หรือตอนซื้อของใหม่)
    let pps = 0; // pps = Points Per Second (คะแนนอัตโนมัติต่อวินาที)
    let ppc = 1; // ppc = Points Per Click (คะแนนต่อการกด 1 ครั้ง เริ่มที่ 1)

    // วนลูปดูสินค้าทุกชนิดที่มีในเกม
    SHOP_ITEMS.forEach(item => {
        const count = state.inventory[item.id] || 0; // หาว่าเรามีสินค้านี้กี่ชิ้น
        // ถ้าเป็นของที่เพิ่มคะแนนต่อวินาที ก็บวกเพิ่มไป (ค่าของของชิ้นนั้น * จำนวนที่มี)
        if (item.type === 'pps') pps += item.value * count;
        // ถ้าเป็นของที่เพิ่มคะแนนต่อคลิก ก็บวกเพิ่มไป
        if (item.type === 'ppc') ppc += item.value * count;
    });

    // บันทึกค่าที่คำนวณได้กลับลงไปในตัวแปร state
    state.scorePerSec = pps;
    state.scorePerClick = ppc;
    
    // อัปเดตความเร็วในการขยับมืออัตโนมัติ (ยิ่ง pps เยอะ ยิ่งขยับเร็ว)
    updateAutoHandAnimation();
}

function initShop() {
    // ฟังก์ชันวาดหน้าตาร้านค้าตอนเปิดเกม (ทำแค่ครั้งเดียว)
    elShopList.innerHTML = ''; // ล้างข้อมูลเก่าทิ้งให้หมดก่อน

    // วนลูปสร้างปุ่มสินค้าแต่ละอัน
    SHOP_ITEMS.forEach(item => {
        const card = document.createElement('div'); // สร้างกล่อง div เป็นการ์ดสินค้า
        card.className = `shop-item`; // ใส่คลาส css

        // ยัด HTML ของหน้าตาสินค้าเข้าไป
        card.innerHTML = `
            <div class="item-left">
                <div class="item-icon-box">
                    <!-- ถ้ามีลิงก์รูป ก็ใส่รูป ถ้าไม่มีให้ปล่อยว่าง -->
                    ${item.imgSrc ? `<img src="${item.imgSrc}" alt="${item.name}">` : ''}
                    <span class="item-emoji">${item.emoji}</span> <!-- อิโมจิสินค้า -->
                </div>
                <div class="item-details">
                    <span class="item-name">${item.name}</span> <!-- ชื่อสินค้า -->
                    <span class="item-desc">${item.desc}</span> <!-- คำอธิบายสินค้า -->
                    <!-- กล่องสำหรับบอกว่ามีสินค้านี้กี่ชิ้น (ปล่อยว่างไว้ก่อน เดี๋ยวให้ JS เติมทีหลัง) -->
                    <span class="item-owned" id="shop-owned-${item.id}"></span>
                </div>
            </div>
            <!-- ปุ่มกดซื้อสินค้า -->
            <button class="btn-buy" id="shop-btn-${item.id}">
                <span>ซื้อ</span>
                <!-- กล่องแสดงราคาสินค้า -->
                <span class="cost" id="shop-cost-${item.id}"></span>
            </button>
        `;

        // สั่งให้ปุ่มซื้อสินค้าคลิกได้
        card.querySelector('.btn-buy').addEventListener('click', (e) => {
            e.stopPropagation(); // ป้องกันไม่ให้การคลิกทะลุไปโดนกล่องด้านหลัง
            buyItem(item); // เรียกใช้ฟังก์ชันซื้อสินค้าที่เราคลิก
        });

        // เอาการ์ดสินค้ายัดลงไปในหน้าร้านค้า
        elShopList.appendChild(card);
    });
    
    // พอสร้างโครงเสร็จ ก็เรียกอัปเดตข้อมูลตัวเลข (ราคา/ปุ่มเปิดปิด) ให้เป็นปัจจุบัน
    updateShop();
}

function updateShop() {
    // ฟังก์ชันนี้จะถูกเรียกซ้ำๆ บ่อยมาก เพื่ออัปเดตสถานะปุ่มซื้อว่ากดได้ไหม (มีเงินพอไหม)
    SHOP_ITEMS.forEach(item => {
        const count = state.inventory[item.id] || 0; // จำนวนที่มี
        const cost = getItemCost(item); // ราคาชิ้นต่อไป
        const canAfford = state.score >= cost; // มีเงินพอซื้อไหม (true/false)

        // ดึงชิ้นส่วน HTML ของสินค้านั้นๆ มา
        const btn = document.getElementById(`shop-btn-${item.id}`);
        const costEl = document.getElementById(`shop-cost-${item.id}`);
        const ownedEl = document.getElementById(`shop-owned-${item.id}`);
        
        if (btn) {
            btn.disabled = !canAfford; // ถ้าเงินไม่พอ ให้ปุ่มกดไม่ได้ (disabled)
            
            // หาการ์ดสินค้าตัวแม่ของปุ่มนี้
            const card = btn.closest('.shop-item');
            if (canAfford) card.classList.remove('cant-afford'); // เงินพอ เอาสีเทาออก
            else card.classList.add('cant-afford'); // เงินไม่พอ ใส่สีเทาให้การ์ด
        }
        
        // อัปเดตข้อความแสดงราคาให้เป็นปัจจุบัน
        if (costEl) costEl.textContent = `🏆 ${formatNum(cost)}`;
        
        // อัปเดตข้อความจำนวนของที่มี
        if (ownedEl) ownedEl.textContent = count > 0 ? `มีแล้ว: ${count}` : '';
    });
}

// ─── MEME GALLERY RENDER ───
function renderMemeGallery() {
    // ฟังก์ชันวาดหน้ารวม Meme ด้านล่าง
    elMemeGallery.innerHTML = ''; // ล้างข้อมูลเก่าทิ้ง

    MEME_LEVELS.forEach(meme => {
        // เช็คว่าผู้เล่นปลดล็อค Meme นี้หรือยัง
        const isUnlocked = state.unlockedMemes.has(meme.level);
        // เช็คว่าผู้เล่นกำลังดู Meme นี้เป็นพื้นหลังอยู่หรือเปล่า
        const isPlaying = lastPlayedMeme && lastPlayedMeme.level === meme.level;

        const card = document.createElement('div');
        // ใส่คลาสบอกสถานะ (locked = ยังไม่ปลดล็อค, now-playing = กำลังเล่น)
        card.className = `meme-card ${isUnlocked ? '' : 'locked'} ${isPlaying ? 'now-playing' : ''}`;

        // โครงสร้าง HTML ของการ์ด Meme
        card.innerHTML = `
            <!-- รูปลายน้ำตัวอย่าง (ถ้ายังไม่ปลดล็อค CSS จะทำให้มืดๆ เบลอๆ) -->
            <img class="meme-thumb" src="${meme.thumb}" alt="${meme.title}" loading="lazy">
            <div class="meme-info">
                <div class="meme-title">${meme.title}</div>
                <div class="meme-level-tag">Level ${meme.level} • ${formatNum(meme.scoreReq)} pts</div>
            </div>
        `;

        // ถ้าปลดล็อคแล้ว ให้สามารถคลิกที่การ์ดเพื่อเลือกดู Meme นั้นได้
        if (isUnlocked) {
            card.addEventListener('click', () => {
                lastPlayedMeme = meme;
                currentBgMemeLevel = meme.level;
                
                // สกัดคลิปไอดีแล้วเปลี่ยนวิดีโอพื้นหลัง
                const clipId = meme.embedUrl.split('/')[4];
                elBgMemeVideo.src = `https://cdn.vlipsy.com/clips/meta/${clipId}/480p-watermark.mp4`;
                elBgMemeVideo.muted = !state.soundOn;

                renderMemeGallery(); // วาดหน้านี้ใหม่เพื่อย้ายแถบ 'now-playing' มาที่การ์ดนี้แทน
            });
        }

        elMemeGallery.appendChild(card); // เอาการ์ดใส่ในหน้าเว็บ
    });
}

// ─── UI UPDATE ───
function updateUI() {
    // ฟังก์ชันอัปเดตตัวเลขบนหน้าจอทั้งหมดให้ตรงกับข้อมูลใน state ล่าสุด
    elScore.textContent = formatNum(state.score); // คะแนนปัจจุบัน
    elPPS.textContent = formatNum(state.scorePerSec); // คะแนนต่อวินาที
    elPPC.textContent = formatNum(state.scorePerClick); // คะแนนต่อการคลิก
}

// ─── GAME LOOP ───
let lastTick = Date.now(); // เก็บเวลาที่ลูปทำงานรอบก่อนหน้า

function gameLoop() {
    // ลูปหลักของเกม ทำงานตลอดเวลาที่เปิดหน้าเว็บทิ้งไว้ (ประมาณ 60 รอบต่อวินาที)
    const now = Date.now();
    const dt = (now - lastTick) / 1000; // dt (Delta Time) = เวลาที่ผ่านไปนับจากรอบก่อนหน้า (วินาที)
    lastTick = now;

    // ระบบเพิ่มคะแนนอัตโนมัติ
    if (state.scorePerSec > 0) {
        // คะแนนที่ได้ = คะแนนต่อวินาที * เวลาที่ผ่านไป
        const earned = state.scorePerSec * dt;
        state.score += earned;
        state.totalScore += earned;
    }

    checkMemeUnlocks(); // ตรวจสอบปลดล็อค Meme (เผื่อคะแนนเด้งจนถึงเป้าหมาย)
    updateUI(); // อัปเดตตัวเลขบนจอ

    // อัปเดตสถานะปุ่มในร้านค้าเป็นระยะๆ (เช็คว่าตังค์พอซื้อไหม)
    updateShop();

    // สั่งให้เบราว์เซอร์เรียกฟังก์ชันนี้อีกครั้งในเฟรมถัดไป
    requestAnimationFrame(gameLoop);
}

// ─── SAVE / LOAD ───
function saveGame() {
    // ฟังก์ชันบันทึกเกมลง LocalStorage ของเบราว์เซอร์ (ปิดหน้าเว็บแล้วไม่หาย)
    const data = {
        score: state.score,
        totalScore: state.totalScore,
        totalClicks: state.totalClicks,
        currentLevel: state.currentLevel,
        inventory: state.inventory,
        unlockedMemes: [...state.unlockedMemes], // แปลง Set เป็น Array เพื่อให้เซฟลง JSON ได้
        startTime: state.startTime
    };
    localStorage.setItem('tha67_save', JSON.stringify(data)); // บันทึกเป็นข้อความแบบ JSON
}

function loadGame() {
    // ฟังก์ชันโหลดข้อมูลเกมที่บันทึกไว้
    const raw = localStorage.getItem('tha67_save');
    if (raw) {
        try {
            const d = JSON.parse(raw); // แปลง JSON กลับมาเป็นข้อมูล
            // เอาข้อมูลที่โหลดได้มาทับลงใน state
            state.score = d.score || 0;
            state.totalScore = d.totalScore || 0;
            state.totalClicks = d.totalClicks || 0;
            state.currentLevel = d.currentLevel || 1;
            state.inventory = d.inventory || {};
            state.unlockedMemes = new Set(d.unlockedMemes || []);
            state.startTime = d.startTime || Date.now();
            recalcStats(); // คำนวณค่าต่างๆ ใหม่ตามของที่มี
        } catch (e) {
            console.error('Load error', e);
        }
    }
    // โกงนิดหน่อย: ให้ Meme เลเวล 1 ปลดล็อคไว้เสมอตั้งแต่เริ่ม
    state.unlockedMemes.add(1);
}

function resetGame() {
    // ฟังก์ชันเริ่มเกมใหม่
    if (confirm('เริ่มใหม่ทั้งหมดจริงๆ ใช่ไหม? (คะแนนและ Meme ที่ปลดล็อคจะหายหมด)')) {
        localStorage.removeItem('tha67_save'); // ลบข้อมูลที่เซฟไว้
        location.reload(); // รีเฟรชหน้าเว็บ
    }
}

// ─── TOAST ───
function showToast(msg) {
    // ฟังก์ชันสร้างกล่องข้อความแจ้งเตือนที่ลอยขึ้นมามุมขวาล่าง
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    elToastContainer.appendChild(t);
    // ตั้งเวลาให้ลบตัวเองทิ้งไปหลังจาก 4.5 วินาที
    setTimeout(() => t.remove(), 4500);
}

// ─── BACKGROUND PARTICLES ───
function spawnBgParticles() {
    // ฟังก์ชันสร้างจุดสีๆ เล็กๆ ลอยอยู่ข้างหลัง (เพื่อความสวยงาม)
    const container = document.getElementById('bg-particles');
    const colors = ['#7c3aed', '#ec4899', '#f59e0b', '#10b981']; // โทนสีที่ใช้
    for (let i = 0; i < 20; i++) { // สร้าง 20 จุด
        const p = document.createElement('div');
        p.className = 'bg-particle';
        const size = 3 + Math.random() * 6; // สุ่มขนาด
        p.style.width = size + 'px';
        p.style.height = size + 'px';
        p.style.left = Math.random() * 100 + '%'; // สุ่มตำแหน่งแนวนอน
        p.style.background = colors[Math.floor(Math.random() * colors.length)]; // สุ่มสี
        p.style.animationDuration = (12 + Math.random() * 18) + 's'; // สุ่มความเร็วในการลอย
        p.style.animationDelay = (Math.random() * 15) + 's'; // สุ่มจังหวะเริ่มต้น
        container.appendChild(p);
    }
}

// ─── TAB SWITCHING ───
function setupTabs() {
    // ฟังก์ชันจัดการปุ่มแท็บ (ร้านค้า / Meme) ตรงแผงควบคุมด้านขวา
    const tabs = document.querySelectorAll('.panel-tab'); // หาปุ่มแท็บทั้งหมด
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // เมื่อคลิกปุ่มใดปุ่มหนึ่ง ให้เอาคลาส active ออกจากปุ่มและหน้าจอทั้งหมดก่อน
            tabs.forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            // แล้วค่อยใส่คลาส active ให้ปุ่มที่เพิ่งถูกคลิก
            tab.classList.add('active');
            // และดึงหน้าจอเนื้อหาของแท็บนั้นมาแสดง
            document.getElementById(tab.dataset.tab).classList.add('active');
        });
    });
}

// ─── INIT ───
// ส่วนเริ่มต้นทำงาน (ทำงานเมื่อหน้าเว็บโหลดเสร็จทั้งหมด)
window.addEventListener('DOMContentLoaded', () => {
    loadGame(); // โหลดเกม
    spawnBgParticles(); // สร้างจุดแสงพื้นหลัง
    setupTabs(); // ตั้งค่าแท็บ

    // ผูกคำสั่งเมื่อมีการคลิกที่ปุ่มกลางจอ
    elBtnClick.addEventListener('click', handleClick);
    
    // ผูกคำสั่งเมื่อคลิกพื้นที่รอบๆ ปุ่ม (เวที)
    elHandsStage.addEventListener('click', (e) => {
        // ถ้าเป็นการคลิกที่ปุ่มวงกลมโดยตรง ให้ข้ามไป (เพราะฟังก์ชันปุ่มมันทำงานอยู่แล้ว เดี๋ยวจะซ้ำสองรอบ)
        if (e.target === elBtnClick || elBtnClick.contains(e.target)) return;
        handleClick(e); // ไม่งั้นก็ถือว่าเป็นการคลิกเหมือนกัน
    });

    // ผูกคำสั่งรองรับการกด Spacebar แทนการคลิกเมาส์
    window.addEventListener('keydown', (e) => {
        // ถ้ากด Spacebar และไม่ได้กำลังพิมพ์ข้อความอะไรอยู่
        if (e.code === 'Space' && e.target.tagName !== 'BUTTON' && e.target.tagName !== 'INPUT') {
            e.preventDefault(); // ป้องกันไม่ให้หน้าเว็บเลื่อนลง
            handleClick(e);
        }
    });

    // ผูกปุ่มเปิด/ปิดเสียง
    elBtnSound.addEventListener('click', () => {
        state.soundOn = !state.soundOn; // สลับสถานะ (ถ้าเป็น true จะกลายเป็น false และสลับไปมา)
        elSoundIcon.textContent = state.soundOn ? '🔊' : '🔇'; // เปลี่ยนไอคอน
        showToast(state.soundOn ? '🔊 เปิดเสียงแล้ว' : '🔇 ปิดเสียงแล้ว'); // แจ้งเตือนผู้เล่น
        
        // สั่งให้วิดีโอพื้นหลังเปิด/ปิดเสียงตามด้วย
        if (elBgMemeVideo) {
            elBgMemeVideo.muted = !state.soundOn;
        }
    });

    // ผูกปุ่มเริ่มเกมใหม่
    elBtnReset.addEventListener('click', resetGame);

    // ตั้งเวลาให้เกมทำการเซฟอัตโนมัติทุกๆ 8 วินาที (8000 มิลลิวินาที)
    setInterval(saveGame, 8000);

    initShop();
    renderMemeGallery();
    updateBgMeme();
    updateLevelDisplay();
    updateUI();
    requestAnimationFrame(gameLoop);
});
