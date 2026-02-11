let l2_nodes = {};

function startL2() {
    const ctx = getAudioContext();
    l2_nodes.osc = ctx.createOscillator(); 
    l2_nodes.osc.type = 'sawtooth'; 
    l2_nodes.osc.frequency.value = 150;
    
    l2_nodes.inAna = ctx.createAnalyser(); 
    l2_nodes.inAna.fftSize = 2048;
    
    l2_nodes.filter = ctx.createBiquadFilter(); 
    l2_nodes.filter.type = document.getElementById('l2-filterType').value;
    l2_nodes.filter.frequency.value = document.getElementById('l2-cutoff').value;
    l2_nodes.filter.Q.value = document.getElementById('l2-resonance').value;
    
    l2_nodes.shaper = ctx.createWaveShaper(); 
    l2_nodes.shaper.curve = makeDistortionCurve(parseFloat(document.getElementById('l2-drive').value));
    
    l2_nodes.comp = ctx.createDynamicsCompressor(); 
    l2_nodes.comp.threshold.value = document.getElementById('l2-threshold').value;
    l2_nodes.comp.ratio.value = document.getElementById('l2-ratio').value;
    
    l2_nodes.outAna = ctx.createAnalyser(); 
    l2_nodes.outAna.fftSize = 2048;
    
    l2_nodes.gain = ctx.createGain(); 
    l2_nodes.gain.value = 0.2;
    
    l2_nodes.osc.connect(l2_nodes.inAna); 
    l2_nodes.inAna.connect(l2_nodes.filter);
    l2_nodes.filter.connect(l2_nodes.shaper); 
    l2_nodes.shaper.connect(l2_nodes.comp);
    l2_nodes.comp.connect(l2_nodes.outAna); 
    l2_nodes.outAna.connect(l2_nodes.gain);
    l2_nodes.gain.connect(ctx.destination);
    
    l2_nodes.osc.start(); 
    drawL2();
}

function stopL2() { 
    if(l2_nodes.osc){ 
        l2_nodes.osc.stop(); 
        l2_nodes.osc.disconnect(); 
        l2_nodes.gain.disconnect(); 
    } 
}

// Listeners
document.getElementById('l2-filterType').onchange = (e) => { if(lessonStates[2]) l2_nodes.filter.type = e.target.value; };
document.getElementById('l2-cutoff').oninput = (e) => { if(lessonStates[2]) l2_nodes.filter.frequency.setTargetAtTime(e.target.value, audioCtx.currentTime, 0.05); };
document.getElementById('l2-resonance').oninput = (e) => { if(lessonStates[2]) l2_nodes.filter.Q.value = e.target.value; };
document.getElementById('l2-drive').oninput = (e) => { if(lessonStates[2]) l2_nodes.shaper.curve = makeDistortionCurve(parseFloat(e.target.value)); };
document.getElementById('l2-threshold').oninput = (e) => { if(lessonStates[2]) l2_nodes.comp.threshold.value = e.target.value; };
document.getElementById('l2-ratio').oninput = (e) => { if(lessonStates[2]) l2_nodes.comp.ratio.value = e.target.value; };

function drawL2() {
    if(!lessonStates[2]) return;
    requestAnimationFrame(drawL2);
    if(activeLesson !== 2) return;
    
    const cIn = document.getElementById('l2-canvasInput');
    const cOut = document.getElementById('l2-canvasOutput');
    
    drawWave(l2_nodes.inAna, cIn, '#2196f3');
    drawWave(l2_nodes.outAna, cOut, '#4caf50');
}