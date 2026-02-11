let l1_nodes = {};

function startL1() {
    const ctx = getAudioContext();
    l1_nodes.osc = ctx.createOscillator();
    l1_nodes.osc.type = 'sine';
    l1_nodes.osc.frequency.value = document.getElementById('l1-freq').value;
    
    l1_nodes.gain = ctx.createGain();
    l1_nodes.gain.gain.value = document.getElementById('l1-amp').value * 0.5;
    
    l1_nodes.osc.connect(l1_nodes.gain);
    l1_nodes.gain.connect(ctx.destination);
    
    l1_nodes.osc.start();
    drawL1();
}

function stopL1() {
    if(l1_nodes.osc) { 
        l1_nodes.osc.stop(); 
        l1_nodes.osc.disconnect(); 
        l1_nodes.gain.disconnect(); 
    }
}

function updateL1Code() {
    const A = document.getElementById('l1-amp').value;
    const f = document.getElementById('l1-freq').value;
    const phi = document.getElementById('l1-phase').value;
    document.getElementById('l1-python-code').textContent = `
import numpy as np
import matplotlib.pyplot as plt

A = ${A}
f = ${f}
phi = ${phi}
fs = 44100
t = np.arange(-0.002, 0.002, 1/fs)
x = A * np.cos(2 * np.pi * f * t + phi)
plt.plot(t, x)`;
}

// Listeners
const l1_amp = document.getElementById('l1-amp');
if(l1_amp) l1_amp.oninput = (e) => {
    document.getElementById('l1-val-amp').innerText = e.target.value;
    if(lessonStates[1]) l1_nodes.gain.gain.setTargetAtTime(e.target.value * 0.5, audioCtx.currentTime, 0.05);
    updateL1Code();
};

const l1_freq = document.getElementById('l1-freq');
if(l1_freq) l1_freq.oninput = (e) => {
    document.getElementById('l1-val-freq').innerText = e.target.value + " Hz";
    if(lessonStates[1]) l1_nodes.osc.frequency.setTargetAtTime(e.target.value, audioCtx.currentTime, 0.05);
    updateL1Code();
};

const l1_phase = document.getElementById('l1-phase');
if(l1_phase) l1_phase.oninput = (e) => {
    document.getElementById('l1-val-phase').innerText = e.target.value + " rad";
    updateL1Code();
};

function drawL1() {
    if(!lessonStates[1]) return;
    requestAnimationFrame(drawL1);
    if(activeLesson !== 1) return;
    
    const canvas = document.getElementById('l1-canvas');
    const ctx = canvas.getContext('2d');
    const w = canvas.width; const h = canvas.height;
    
    ctx.fillStyle = '#080808'; 
    ctx.fillRect(0,0,w,h);
    
    const A = parseFloat(document.getElementById('l1-amp').value);
    const f = parseFloat(document.getElementById('l1-freq').value);
    const phi = parseFloat(document.getElementById('l1-phase').value);
    
    ctx.beginPath(); 
    ctx.strokeStyle = '#00bcd4'; 
    ctx.lineWidth = 3;
    
    const t_range = 0.01; 
    const t_start = -0.005;
    
    for (let x = 0; x < w; x++) {
        const t = t_start + (x/w) * t_range;
        const val = A * Math.cos(2 * Math.PI * f * t + phi);
        const y = (h/2) - (val * (h/2) * 0.9);
        if (x===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    }
    ctx.stroke();
    
    // Axis
    ctx.strokeStyle='#444'; 
    ctx.lineWidth=1; 
    ctx.beginPath();
    ctx.moveTo(w/2,0); ctx.lineTo(w/2,h); 
    ctx.moveTo(0,h/2); ctx.lineTo(w,h/2); 
    ctx.stroke();
}