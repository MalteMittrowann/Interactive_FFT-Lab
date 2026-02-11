let l6_oscs = []; 
let l6_gain, l6_ana;

function startL6() {
    const ctx = getAudioContext();
    l6_ana = ctx.createAnalyser(); 
    l6_ana.fftSize = 2048;
    
    l6_gain = ctx.createGain(); 
    l6_gain.value = 0.3;
    
    l6_gain.connect(l6_ana); 
    l6_ana.connect(ctx.destination);
    
    l6_oscs = [];
    
    for(let i=1; i<=8; i++) {
        const osc = ctx.createOscillator(); 
        osc.frequency.value = 220*i;
        
        const g = ctx.createGain(); 
        const el = document.getElementById(`l6-osc${i}`);
        g.gain.value = el ? parseFloat(el.value) : 0;
        
        osc.connect(g); 
        g.connect(l6_gain); 
        osc.start();
        
        l6_oscs.push({osc, g});
        
        if(el) el.oninput = (e) => { 
            if(lessonStates[6]) g.gain.setTargetAtTime(parseFloat(e.target.value), audioCtx.currentTime, 0.05); 
        };
    }
    drawL6();
}

function stopL6() { 
    l6_oscs.forEach(o => o.osc.stop()); 
    if(l6_gain) l6_gain.disconnect(); 
}

function drawL6() {
    if(!lessonStates[6]) return;
    requestAnimationFrame(drawL6);
    if(activeLesson !== 6) return;
    
    drawWave(l6_ana, document.getElementById('l6-timeCanvas'), '#4caf50');
    
    const cvs = document.getElementById('l6-freqCanvas'); 
    const ctx = cvs.getContext('2d');
    const data = new Uint8Array(l6_ana.frequencyBinCount); 
    l6_ana.getByteFrequencyData(data);
    
    ctx.fillStyle='#080808'; 
    ctx.fillRect(0,0,cvs.width,cvs.height);
    
    const bars=100; 
    const bw=cvs.width/bars;
    
    for(let i=0; i<bars; i++) {
        const h = (data[i]/255)*cvs.height;
        ctx.fillStyle=`hsl(${i*5+100},70%,50%)`; 
        ctx.fillRect(i*bw, cvs.height-h, bw-1, h);
    }
}