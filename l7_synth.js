let l7_nodes = {}; 
let l7_granInt = null; 
let l7_granBuf = null;

function updateL7UI() {
    const t = document.getElementById('l7-synthType').value;
    document.querySelectorAll('.synth-controls').forEach(el=>el.classList.remove('active-synth'));
    document.getElementById(`ctrl-${t}`).classList.add('active-synth');
    if(lessonStates[7]) { stopL7(); startL7(); }
}

function createGranBuf(ctx) {
    const b = ctx.createBuffer(1, ctx.sampleRate*2, ctx.sampleRate); 
    const d = b.getChannelData(0);
    for(let i=0;i<d.length;i++){ 
        const t=i/ctx.sampleRate; 
        d[i]=0.5*Math.sin(2*Math.PI*(220+400*Math.sin(t*2))*t)+0.2*(Math.random()-0.5); 
    }
    return b;
}

function startL7() {
    const ctx = getAudioContext();
    const type = document.getElementById('l7-synthType').value;
    
    l7_nodes.ana = ctx.createAnalyser(); 
    l7_nodes.gain = ctx.createGain(); 
    l7_nodes.gain.value = 0.3;
    
    l7_nodes.gain.connect(l7_nodes.ana); 
    l7_nodes.ana.connect(ctx.destination);
    
    if(type==='subtractive') {
        const o = ctx.createOscillator(); o.type='sawtooth'; o.frequency.value=110;
        const f = ctx.createBiquadFilter(); f.type='lowpass';
        f.frequency.value = document.getElementById('l7-sub-cutoff').value;
        f.Q.value = document.getElementById('l7-sub-res').value;
        o.connect(f); f.connect(l7_nodes.gain); o.start();
        l7_nodes.osc=o; l7_nodes.filt=f;
        
        document.getElementById('l7-sub-cutoff').oninput=(e)=>f.frequency.setTargetAtTime(e.target.value,ctx.currentTime,0.05);
        document.getElementById('l7-sub-res').oninput=(e)=>f.Q.value=e.target.value;
    }
    else if(type==='fm') {
        const car = ctx.createOscillator(); const mod = ctx.createOscillator(); const mg = ctx.createGain();
        const cf = parseFloat(document.getElementById('l7-fm-carrier').value);
        car.frequency.value = cf; mod.frequency.value = cf * parseFloat(document.getElementById('l7-fm-modfreq').value);
        mg.gain.value = document.getElementById('l7-fm-depth').value;
        mod.connect(mg); mg.connect(car.frequency); car.connect(l7_nodes.gain);
        car.start(); mod.start(); l7_nodes.car=car; l7_nodes.mod=mod; l7_nodes.mg=mg;
        
        document.getElementById('l7-fm-carrier').oninput=(e)=>{const f=parseFloat(e.target.value); car.frequency.setTargetAtTime(f,ctx.currentTime,0.05); mod.frequency.setTargetAtTime(f*parseFloat(document.getElementById('l7-fm-modfreq').value),ctx.currentTime,0.05);};
        document.getElementById('l7-fm-modfreq').oninput=(e)=>mod.frequency.setTargetAtTime(car.frequency.value*parseFloat(e.target.value),ctx.currentTime,0.05);
        document.getElementById('l7-fm-depth').oninput=(e)=>mg.gain.setTargetAtTime(e.target.value,ctx.currentTime,0.05);
    }
    else if(type==='granular') {
        if(!l7_granBuf) l7_granBuf = createGranBuf(ctx);
        const loop = () => {
            const sz = parseFloat(document.getElementById('l7-gran-size').value);
            const den = 210 - document.getElementById('l7-gran-density').value;
            l7_granInt = setTimeout(() => {
                spawnGrainL7(ctx, sz); loop();
            }, Math.max(10, den));
        };
        loop();
        document.getElementById('l7-gran-density').onchange=()=> { clearTimeout(l7_granInt); loop(); };
    }
    else if(type==='additive') {
        l7_nodes.oscs=[]; const gL=ctx.createGain(), gM=ctx.createGain(), gH=ctx.createGain();
        gL.connect(l7_nodes.gain); gM.connect(l7_nodes.gain); gH.connect(l7_nodes.gain);
        gL.gain.value = document.getElementById('l7-add-low').value;
        gM.gain.value = document.getElementById('l7-add-mid').value;
        gH.gain.value = document.getElementById('l7-add-high').value;
        
        const freqs=[220,440,660,880,1100,1320,1540,1760];
        freqs.forEach((f,i)=>{
            const o=ctx.createOscillator(); o.frequency.value=f;
            o.connect(i<2?gL : i<4?gM : gH); o.start(); l7_nodes.oscs.push(o);
        });
        l7_nodes.gL=gL; l7_nodes.gM=gM; l7_nodes.gH=gH;
        
        document.getElementById('l7-add-low').oninput=(e)=>gL.gain.setTargetAtTime(e.target.value,ctx.currentTime,0.05);
        document.getElementById('l7-add-mid').oninput=(e)=>gM.gain.setTargetAtTime(e.target.value,ctx.currentTime,0.05);
        document.getElementById('l7-add-high').oninput=(e)=>gH.gain.setTargetAtTime(e.target.value,ctx.currentTime,0.05);
    }
    drawL7();
}

function spawnGrainL7(ctx, size) {
    if(!lessonStates[7]) return;
    const s = ctx.createBufferSource(); s.buffer = l7_granBuf;
    const g = ctx.createGain();
    const pos = parseFloat(document.getElementById('l7-gran-pos').value);
    const jit = parseFloat(document.getElementById('l7-gran-jitter').value);
    const start = Math.max(0, Math.min(pos*2 + (Math.random()-0.5)*jit, 2-size));
    
    g.gain.setValueAtTime(0, ctx.currentTime);
    g.gain.linearRampToValueAtTime(0.4, ctx.currentTime+size*0.2);
    g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime+size);
    s.connect(g); g.connect(l7_nodes.gain); s.start(ctx.currentTime, start, size);
}

function stopL7() {
    clearTimeout(l7_granInt);
    if(l7_nodes.osc) l7_nodes.osc.stop();
    if(l7_nodes.car) l7_nodes.car.stop(); if(l7_nodes.mod) l7_nodes.mod.stop();
    if(l7_nodes.oscs) l7_nodes.oscs.forEach(o=>o.stop());
    if(l7_nodes.gain) l7_nodes.gain.disconnect();
}

function drawL7() {
    if(!lessonStates[7]) return;
    requestAnimationFrame(drawL7);
    if(activeLesson !== 7) return;
    drawWave(l7_nodes.ana, document.getElementById('l7-canvas'), '#e91e63');
}