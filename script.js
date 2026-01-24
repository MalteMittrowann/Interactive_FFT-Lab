// Audio Context Setup
let audioCtx;
let oscillators = [];
let gainNodes = [];
let masterGain;
let analyser;
let isRunning = false;

const FREQ_FUNDAMENTAL = 220; // A3

// Canvas Elements
const timeCanvas = document.getElementById('timeCanvas');
const freqCanvas = document.getElementById('freqCanvas');
const timeCtx = timeCanvas.getContext('2d');
const freqCtx = freqCanvas.getContext('2d');

// Resize handling
function resizeCanvas() {
    timeCanvas.width = timeCanvas.clientWidth;
    timeCanvas.height = timeCanvas.clientHeight;
    freqCanvas.width = freqCanvas.clientWidth;
    freqCanvas.height = freqCanvas.clientHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Init Audio
async function initAudio() {
    if (audioCtx) return;

    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 2048; // Resolution of the FFT

    masterGain = audioCtx.createGain();
    masterGain.gain.value = 0.5; // Master volume
    masterGain.connect(analyser);
    analyser.connect(audioCtx.destination);

    // Create 4 harmonics
    for (let i = 1; i <= 4; i++) {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        
        osc.type = 'sine';
        osc.frequency.value = FREQ_FUNDAMENTAL * i; // Harmonic series (220, 440, 660, 880)
        
        osc.connect(gain);
        gain.connect(masterGain);
        gain.gain.value = 0; // Start silent
        osc.start();

        oscillators.push(osc);
        gainNodes.push(gain);
        
        // Connect slider
        document.getElementById(`osc${i}`).addEventListener('input', (e) => {
            // Smooth transition
            gain.gain.setTargetAtTime(parseFloat(e.target.value), audioCtx.currentTime, 0.05);
        });
    }
    
    isRunning = true;
    document.getElementById('startBtn').innerText = "Audio läuft...";
    document.getElementById('startBtn').disabled = true;
    
    draw();
}

document.getElementById('startBtn').addEventListener('click', () => {
    initAudio();
    // Default: Set Fundamental to 50% so user hears something immediately
    const osc1Slider = document.getElementById('osc1');
    osc1Slider.value = 0.5;
    osc1Slider.dispatchEvent(new Event('input'));
});


// --- VISUALIZATION LOOP ---

function draw() {
    requestAnimationFrame(draw);

    if (!analyser) return;

    const bufferLength = analyser.frequencyBinCount;
    
    // 1. TIME DOMAIN (Oszilloskop)
    const timeData = new Uint8Array(bufferLength);
    analyser.getByteTimeDomainData(timeData);

    timeCtx.fillStyle = 'rgb(20, 20, 20)';
    timeCtx.fillRect(0, 0, timeCanvas.width, timeCanvas.height);
    timeCtx.lineWidth = 2;
    timeCtx.strokeStyle = '#4caf50'; // Green waveform
    timeCtx.beginPath();

    const sliceWidth = timeCanvas.width * 1.0 / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
        const v = timeData[i] / 128.0; // Normalized 0..2
        const y = v * timeCanvas.height / 2;

        if (i === 0) timeCtx.moveTo(x, y);
        else timeCtx.lineTo(x, y);

        x += sliceWidth;
    }
    timeCtx.lineTo(timeCanvas.width, timeCanvas.height / 2);
    timeCtx.stroke();


    // 2. FREQUENCY DOMAIN (FFT Spectrum)
    const freqData = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(freqData);

    freqCtx.fillStyle = 'rgb(20, 20, 20)';
    freqCtx.fillRect(0, 0, freqCanvas.width, freqCanvas.height);

    // We only draw the lower frequencies where our harmonics are (zoom in)
    const barsToDraw = bufferLength / 10; 
    const barWidth = (freqCanvas.width / barsToDraw) - 1;
    let posX = 0;

    for (let i = 0; i < barsToDraw; i++) {
        const barHeight = (freqData[i] / 255) * freqCanvas.height;

        // Color coding: Fundamental is green, harmonics are varied
        freqCtx.fillStyle = `hsl(${i * 10 + 100}, 70%, 50%)`;
        freqCtx.fillRect(posX, freqCanvas.height - barHeight, barWidth, barHeight);

        posX += barWidth + 1;
    }
    
    // Add Labels (Didactic Layer)
    freqCtx.fillStyle = '#fff';
    freqCtx.font = '10px Arial';
    freqCtx.fillText("220Hz", 30, freqCanvas.height - 5);
    freqCtx.fillText("880Hz", 130, freqCanvas.height - 5);
}