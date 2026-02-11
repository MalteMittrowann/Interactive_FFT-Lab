let l4_animTime = 0;

function startL4() {
    l4_animTime = 0;
    drawL4(); // Start loop
}

function stopL4() { 
    // Pure animation, handled by draw loop check
}

function drawL4() {
    if(!lessonStates[4]) return;
    requestAnimationFrame(drawL4);
    if(activeLesson !== 4) return;

    const speed = parseFloat(document.getElementById('l4-speed').value);
    const radiusScale = parseFloat(document.getElementById('l4-radius').value);
    l4_animTime += 0.02 * speed;

    const cCir = document.getElementById('l4-circleCanvas'); 
    const ctx1 = cCir.getContext('2d');
    const cWav = document.getElementById('l4-waveCanvas'); 
    const ctx2 = cWav.getContext('2d');
    
    ctx1.fillStyle='#080808'; ctx1.fillRect(0,0,cCir.width,cCir.height);
    ctx2.fillStyle='#080808'; ctx2.fillRect(0,0,cWav.width,cWav.height);

    const cx = cCir.width/2; const cy = cCir.height/2;
    const r = (Math.min(cx, cy) - 10) * radiusScale;
    
    const cosVal = Math.cos(l4_animTime);
    const sinVal = Math.sin(l4_animTime); 
    const px = cx + cosVal * r; const py = cy - sinVal * r;

    ctx1.strokeStyle='#333'; ctx1.beginPath(); ctx1.arc(cx, cy, r, 0, 2*Math.PI); ctx1.stroke();
    ctx1.strokeStyle='#444'; ctx1.beginPath(); ctx1.moveTo(cx,0); ctx1.lineTo(cx,cCir.height); ctx1.moveTo(0,cy); ctx1.lineTo(cCir.width,cy); ctx1.stroke();
    ctx1.strokeStyle='#fff'; ctx1.lineWidth=2; ctx1.beginPath(); ctx1.moveTo(cx,cy); ctx1.lineTo(px,py); ctx1.stroke();
    ctx1.fillStyle='#fff'; ctx1.beginPath(); ctx1.arc(px,py,4,0,2*Math.PI); ctx1.fill();

    ctx1.strokeStyle='#2196f3'; ctx1.setLineDash([5,3]); ctx1.beginPath(); ctx1.moveTo(px, py); ctx1.lineTo(px, cy); ctx1.stroke();
    ctx1.beginPath(); ctx1.moveTo(cx, cy); ctx1.lineTo(px, cy); ctx1.lineWidth=3; ctx1.stroke();
    ctx1.strokeStyle='#4caf50'; ctx1.beginPath(); ctx1.moveTo(px, py); ctx1.lineTo(cx, py); ctx1.lineWidth=1; ctx1.stroke();
    ctx1.beginPath(); ctx1.moveTo(cx, cy); ctx1.lineTo(cx, py); ctx1.lineWidth=3; ctx1.stroke();
    ctx1.setLineDash([]);

    const w = cWav.width; const h = cWav.height; const midY = h/2;
    ctx2.strokeStyle='#444'; ctx2.lineWidth=1; ctx2.beginPath(); ctx2.moveTo(0,midY); ctx2.lineTo(w,midY); ctx2.stroke();
    
    ctx2.beginPath(); ctx2.strokeStyle='#2196f3'; ctx2.lineWidth=2;
    for(let i=0; i<w; i++) {
        const val = Math.cos(l4_animTime - (i*0.05)) * r * (h/cCir.height);
        if(i===0) ctx2.moveTo(w-i, midY-val); else ctx2.lineTo(w-i, midY-val);
    }
    ctx2.stroke();
    
    ctx2.beginPath(); ctx2.strokeStyle='#4caf50'; ctx2.lineWidth=2;
    for(let i=0; i<w; i++) {
        const val = Math.sin(l4_animTime - (i*0.05)) * r * (h/cCir.height);
        if(i===0) ctx2.moveTo(w-i, midY-val); else ctx2.lineTo(w-i, midY-val);
    }
    ctx2.stroke();
}