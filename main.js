// === GLOBAL CONFIG ===
let audioCtx;
function getAudioContext() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    return audioCtx;
}

let activeLesson = 1;
// 8 States (Index 0 unused, 1-7 used)
let lessonStates = [false, false, false, false, false, false, false, false];

// === NAVIGATION ===
function switchLesson(lessonNum) {
    activeLesson = lessonNum;
    
    // Hide all
    document.querySelectorAll('.lesson-container').forEach(el => {
        el.classList.remove('active');
        el.style.display = 'none'; 
    });
    
    // Show selected
    const activeEl = document.getElementById(`lesson${lessonNum}`);
    activeEl.style.display = 'grid';
    setTimeout(() => activeEl.classList.add('active'), 10);

    // Update Buttons
    document.querySelectorAll('nav button').forEach(el => el.className = '');
    const btn = document.getElementById(`nav-l${lessonNum}`);
    btn.classList.add('active', `active-l${lessonNum}`);

    resizeCanvases();
}

function resizeCanvases() {
    document.querySelectorAll('canvas').forEach(cvs => {
        cvs.width = cvs.clientWidth;
        cvs.height = cvs.clientHeight;
    });
}
window.addEventListener('resize', resizeCanvases);

// === AUDIO TOGGLE SYSTEM ===
async function toggleAudio(lessonId) {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') await ctx.resume();

    const btn = document.getElementById(`btn-l${lessonId}`);
    const isPlaying = lessonStates[lessonId];

    if (isPlaying) {
        stopLesson(lessonId);
        btn.innerText = "Start Engine";
        btn.classList.remove(`active-l${lessonId}`);
        lessonStates[lessonId] = false;
    } else {
        // Stop all others first
        for(let i=1; i<=7; i++) {
            if(lessonStates[i]) toggleAudio(i); 
        }
        
        lessonStates[lessonId] = true; 
        startLesson(lessonId);
        btn.innerText = "Stop / Mute";
        btn.classList.add(`active-l${lessonId}`);
    }
}

// Router
function startLesson(id) {
    if(id===1 && typeof startL1 === 'function') startL1();
    if(id===2 && typeof startL2 === 'function') startL2();
    if(id===3 && typeof startL3 === 'function') startL3();
    if(id===4 && typeof startL4 === 'function') startL4();
    if(id===5 && typeof startL5 === 'function') startL5();
    if(id===6 && typeof startL6 === 'function') startL6();
    if(id===7 && typeof startL7 === 'function') startL7();
}

function stopLesson(id) {
    if(id===1 && typeof stopL1 === 'function') stopL1();
    if(id===2 && typeof stopL2 === 'function') stopL2();
    if(id===3 && typeof stopL3 === 'function') stopL3();
    if(id===4 && typeof stopL4 === 'function') stopL4();
    if(id===5 && typeof stopL5 === 'function') stopL5();
    if(id===6 && typeof stopL6 === 'function') stopL6();
    if(id===7 && typeof stopL7 === 'function') stopL7();
}

// Helper: Common Draw Function
function drawWave(ana, cvs, col) {
    const ctx = cvs.getContext('2d'); 
    const w=cvs.width; const h=cvs.height;
    const d = new Uint8Array(ana.frequencyBinCount); 
    ana.getByteTimeDomainData(d);
    
    ctx.fillStyle='#080808'; 
    ctx.fillRect(0,0,w,h);
    ctx.lineWidth=2; 
    ctx.strokeStyle=col; 
    ctx.beginPath();
    
    let x=0; 
    const sw=w/d.length;
    
    // Simple Zero Crossing Trigger
    let startIdx = 0;
    for(let i=1; i<d.length/2; i++) {
        if(d[i-1] < 128 && d[i] >= 128) {
            startIdx = i;
            break;
        }
    }

    for (let i = startIdx; i < d.length; i++) {
        const y = (d[i]/128.0)*h/2;
        if(i===startIdx) ctx.moveTo(x,y); else ctx.lineTo(x,y);
        x+=sw;
    }
    ctx.stroke();
}

// Helper: Distortion Curve
function makeDistortionCurve(k) {
    const n = 44100; 
    const curve = new Float32Array(n); 
    const deg = Math.PI / 180;
    for (let i=0; i<n; ++i) { 
        const x = (i*2)/n - 1; 
        curve[i] = (3+k)*x*20*deg/(Math.PI+k*Math.abs(x)); 
    }
    return curve;
}

// Initial Call
switchLesson(1);