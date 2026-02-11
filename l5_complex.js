let l5_animTime = 0;

function startL5() {
    l5_animTime = 0;
    drawL5();
}

function stopL5() { }

function drawL5() {
    if(!lessonStates[5]) return;
    requestAnimationFrame(drawL5);
    if(activeLesson !== 5) return;

    const speed = parseFloat(document.getElementById('l5-speed').value);
    l5_animTime += 0.02 * speed;

    const cCpx = document.getElementById('l5-complexCanvas'); const ctx1 = cCpx.getContext('2d');
    const cTim = document.getElementById('l5-timeCanvas'); const ctx2 = cTim.getContext('2d');
    
    ctx1.fillStyle='#080808'; ctx1.fillRect(0,0,cCpx.width,cCpx.height);
    ctx2.fillStyle='#080808'; ctx2.fillRect(0,0,cTim.width,cTim.height);

    const cx = cCpx.width/2; const cy = cCpx.height/2;
    const r = (Math.min(cx, cy) - 20) * 0.7;

    const ang1 = l5_animTime;
    const x1 = Math.cos(ang1) * r;
    const y1 = -Math.sin(ang1) * r;

    const ang2 = -l5_animTime;
    const x2 = Math.cos(ang2) * r;
    const y2 = -Math.sin(ang2) * r;

    const sumX = x1 + x2;
    const sumY = y1 + y2;

    ctx1.strokeStyle='#333'; ctx1.beginPath(); ctx1.arc(cx, cy, r, 0, 2*Math.PI); ctx1.stroke();
    ctx1.strokeStyle='#444'; ctx1.beginPath(); ctx1.moveTo(cx,0); ctx1.lineTo(cx,cCpx.height); ctx1.moveTo(0,cy); ctx1.lineTo(cCpx.width,cy); ctx1.stroke();

    ctx1.strokeStyle='#2196f3'; ctx1.lineWidth=2; ctx1.beginPath(); ctx1.moveTo(cx,cy); ctx1.lineTo(cx+x1, cy+y1); ctx1.stroke();
    ctx1.strokeStyle='#4caf50'; ctx1.lineWidth=2; ctx1.beginPath(); ctx1.moveTo(cx,cy); ctx1.lineTo(cx+x2, cy+y2); ctx1.stroke();
    
    ctx1.strokeStyle='#e91e63'; ctx1.lineWidth=4; ctx1.beginPath(); ctx1.moveTo(cx,cy); ctx1.lineTo(cx+sumX, cy+sumY); ctx1.stroke();
    ctx1.fillStyle='#e91e63'; ctx1.beginPath(); ctx1.arc(cx+sumX, cy+sumY, 6, 0, 2*Math.PI); ctx1.fill();

    ctx1.setLineDash([2,2]); ctx1.strokeStyle='#666'; 
    ctx1.beginPath(); ctx1.moveTo(cx+x1, cy+y1); ctx1.lineTo(cx+sumX, cy+sumY); ctx1.stroke();
    ctx1.beginPath(); ctx1.moveTo(cx+x2, cy+y2); ctx1.lineTo(cx+sumX, cy+sumY); ctx1.stroke();
    ctx1.setLineDash([]);

    const w = cTim.width; const h = cTim.height; const midY = h/2;
    ctx2.strokeStyle='#444'; ctx2.lineWidth=1; ctx2.beginPath(); ctx2.moveTo(0,midY); ctx2.lineTo(w,midY); ctx2.stroke();
    
    ctx2.beginPath(); ctx2.strokeStyle='#e91e63'; ctx2.lineWidth=3;
    for(let i=0; i<w; i++) {
        const t = l5_animTime - (i*0.05);
        const val = (Math.cos(t) + Math.cos(-t)) * r * (h/cCpx.height);
        const y = midY - val;
        if(i===0) ctx2.moveTo(w-i, y); else ctx2.lineTo(w-i, y);
    }
    ctx2.stroke();

    ctx2.beginPath(); ctx2.strokeStyle='rgba(33, 150, 243, 0.3)'; ctx2.lineWidth=1;
    for(let i=0; i<w; i++) {
        const val = Math.sin(l5_animTime - (i*0.05)) * r * (h/cCpx.height);
        if(i===0) ctx2.moveTo(w-i, midY-val); else ctx2.lineTo(w-i, midY-val);
    }
    ctx2.stroke();
    
    ctx2.beginPath(); ctx2.strokeStyle='rgba(76, 175, 80, 0.3)'; ctx2.lineWidth=1;
    for(let i=0; i<w; i++) {
        const val = Math.sin(-(l5_animTime - (i*0.05))) * r * (h/cCpx.height);
        if(i===0) ctx2.moveTo(w-i, midY-val); else ctx2.lineTo(w-i, midY-val);
    }
    ctx2.stroke();
}