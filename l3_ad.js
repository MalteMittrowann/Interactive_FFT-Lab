let l3_nodes = {};

function startL3() {
    const ctx = getAudioContext();
    l3_nodes.osc = ctx.createOscillator(); 
    l3_nodes.osc.frequency.value = document.getElementById('l3-pitch').value;
    l3_nodes.ana = ctx.createAnalyser();
    l3_nodes.proc = ctx.createScriptProcessor(4096, 1, 1);
    
    l3_nodes.proc.onaudioprocess = (e) => {
        const inp = e.inputBuffer.getChannelData(0); 
        const out = e.outputBuffer.getChannelData(0);
        const sr = ctx.sampleRate; 
        const targetSr = parseFloat(document.getElementById('l3-samplerate').value);
        const bd = parseFloat(document.getElementById('l3-bits').value);
        
        const step = 1/Math.pow(2,bd); 
        const sStep = sr/targetSr;
        
        for(let i=0; i<inp.length; i++) {
            const idx = Math.floor(i/sStep)*sStep;
            let v = inp[Math.min(Math.floor(idx), inp.length-1)];
            out[i] = Math.round(v/step)*step;
        }
    };
    
    l3_nodes.dig = ctx.createAnalyser();
    l3_nodes.gain = ctx.createGain(); 
    l3_nodes.gain.value = 0.2;
    
    l3_nodes.osc.connect(l3_nodes.ana); 
    l3_nodes.ana.connect(l3_nodes.proc);
    l3_nodes.proc.connect(l3_nodes.dig); 
    l3_nodes.dig.connect(l3_nodes.gain);
    l3_nodes.gain.connect(ctx.destination); 
    
    l3_nodes.osc.start(); 
    drawL3();
}

function stopL3() { 
    if(l3_nodes.osc){ 
        l3_nodes.osc.stop(); 
        l3_nodes.osc.disconnect(); 
        l3_nodes.proc.disconnect(); 
        l3_nodes.gain.disconnect(); 
    } 
}

document.getElementById('l3-pitch').oninput = (e) => { 
    if(lessonStates[3]) l3_nodes.osc.frequency.setTargetAtTime(e.target.value, audioCtx.currentTime, 0.05); 
};

function drawL3() {
    if(!lessonStates[3]) return;
    requestAnimationFrame(drawL3);
    if(activeLesson !== 3) return;
    drawWave(l3_nodes.ana, document.getElementById('l3-canvasAnalog'), '#aaa');
    drawWave(l3_nodes.dig, document.getElementById('l3-canvasDigital'), '#ff9800');
}