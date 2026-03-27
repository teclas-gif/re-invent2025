const video = document.getElementById('webcam');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const statusDiv = document.getElementById('status');
const overlay = document.getElementById('overlay');
const container = document.getElementById('monitor-container');
const fpsDisplay = document.getElementById('fps');
const faceCountDisplay = document.getElementById('faceCount');
const stressLevelDisplay = document.getElementById('stressLevel');

let stream = null;
let isMonitoring = false;
let stressCounter = 0;
let normalCounter = 0;
const STRESS_THRESHOLD_FRAMES = 30;
const NORMAL_THRESHOLD_FRAMES = 60;

// FPS tracking
let lastFrameTime = Date.now();
let frameCount = 0;
let fps = 0;

// Debug Canvas
let canvas;

// Music intervention state
let isMusicPlaying = false;

// Load models
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(() => {
    console.log("Models loaded successfully");
    overlay.textContent = "SYSTEM: MODELS LOADED. READY.";
}).catch(err => {
    console.error("Failed to load models:", err);
    overlay.textContent = "SYSTEM: MODEL ERROR - CHECK CONSOLE";
});

async function startMonitoring() {
    try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        video.srcObject = stream;

        // Wait for video to be ready
        video.onloadedmetadata = () => {
            startBtn.disabled = true;
            stopBtn.disabled = false;
            statusDiv.textContent = "STATUS: MONITORING ACTIVE";
            statusDiv.className = "stress-normal";

            isMonitoring = true;

            // Setup canvas for drawing
            if (!canvas) {
                canvas = faceapi.createCanvasFromMedia(video);
                canvas.style.position = 'absolute';
                canvas.style.top = '0';
                canvas.style.left = '0';
                container.append(canvas);
            }

            // Match dimensions
            const displaySize = { width: video.videoWidth, height: video.videoHeight };
            faceapi.matchDimensions(canvas, displaySize);

            detectEmotions(displaySize);
        };

    } catch (err) {
        console.error("Error accessing media devices:", err);
        statusDiv.textContent = `ERROR: SENSOR FAILURE (${err.name}: ${err.message})`;
        statusDiv.style.color = "red";
        overlay.textContent = "SYSTEM: CAMERA ACCESS DENIED OR UNAVAILABLE";
    }
}

function stopMonitoring() {
    isMonitoring = false;
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        video.srcObject = null;
    }

    if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // Stop music if playing
    if (isPlayerReady && player.getPlayerState() === 1) {
        player.pauseVideo();
    }

    startBtn.disabled = false;
    stopBtn.disabled = true;
    statusDiv.textContent = "STATUS: TERMINATED";
    statusDiv.className = "";
    stressCounter = 0;
}

async function detectEmotions(displaySize) {
    if (!isMonitoring) return;

    // Ensure video is playing and has dimensions
    if (video.paused || video.ended || !video.videoWidth) {
        requestAnimationFrame(() => detectEmotions(displaySize));
        return;
    }

    // Calculate FPS
    frameCount++;
    const now = Date.now();
    if (now - lastFrameTime >= 1000) {
        fps = frameCount;
        fpsDisplay.textContent = fps;
        frameCount = 0;
        lastFrameTime = now;
    }

    // Detect faces
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

    // Update face count
    faceCountDisplay.textContent = detections.length;

    // Resize for drawing
    const resizedDetections = faceapi.resizeResults(detections, displaySize);

    // Draw
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    faceapi.draw.drawDetections(canvas, resizedDetections);
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections);

    if (detections.length > 0) {
        const expressions = detections[0].expressions;

        // Log occasionally
        if (Math.random() < 0.05) console.log("Expressions:", expressions);

        // Check for negative emotions
        const stressScore = expressions.angry + expressions.sad + expressions.fearful + expressions.disgusted;
        
        // Update stress level display
        stressLevelDisplay.textContent = (stressScore * 100).toFixed(0) + '%';
        stressLevelDisplay.style.color = stressScore > 0.5 ? 'var(--danger-color)' : 'var(--accent-color)';

        if (stressScore > 0.5) {
            statusDiv.textContent = "STATUS: HIGH STRESS DETECTED (" + stressScore.toFixed(2) + ")";
            statusDiv.className = "stress-high";
            stressCounter++;
            normalCounter = 0;
        } else {
            statusDiv.textContent = "STATUS: NORMAL (" + stressScore.toFixed(2) + ")";
            statusDiv.className = "stress-normal";
            stressCounter = Math.max(0, stressCounter - 1);
            normalCounter++;
        }

        // Trigger server action if stress persists
        if (stressCounter > STRESS_THRESHOLD_FRAMES) {
            triggerCalmingIntervention();
            stressCounter = 0;
        }

        // Stop music if normal state persists
        if (normalCounter > NORMAL_THRESHOLD_FRAMES) {
            stopCalmingIntervention();
            normalCounter = 0;
        }
    } else {
        statusDiv.textContent = "STATUS: SEARCHING FOR SUBJECT...";
        statusDiv.className = "";
        stressLevelDisplay.textContent = "--";
    }

    // Loop using requestAnimationFrame for best performance
    requestAnimationFrame(() => detectEmotions(displaySize));
}

async function triggerCalmingIntervention() {
    if (isMusicPlaying) return; // Already playing
    
    console.log("Triggering intervention...");
    overlay.textContent = "SYSTEM: INITIATING CALMING PROTOCOL...";

    try {
        console.log("Sending POST to /intervene...");
        const response = await fetch('/intervene', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        
        console.log("Response status:", response.status);
        const result = await response.json();
        console.log("Response data:", result);
        
        if (result.status === 'success') {
            isMusicPlaying = true;
            overlay.textContent = "SYSTEM: CALMING PROTOCOL ACTIVE (SPOTIFY)";
            console.log("Intervention successful:", result.action);
            setTimeout(() => { overlay.textContent = "SYSTEM: ONLINE"; }, 5000);
        } else {
            console.error("Intervention failed:", result.error);
            overlay.textContent = `SYSTEM: ERROR - ${result.error.substring(0, 50)}`;
            setTimeout(() => { overlay.textContent = "SYSTEM: ONLINE"; }, 5000);
        }
    } catch (error) {
        console.error("Intervention request failed:", error);
        overlay.textContent = "SYSTEM: CONNECTION ERROR - CHECK CONSOLE";
        setTimeout(() => { overlay.textContent = "SYSTEM: ONLINE"; }, 3000);
    }
}

async function stopCalmingIntervention() {
    if (!isMusicPlaying) return;
    
    console.log("Stopping intervention...");
    overlay.textContent = "SYSTEM: STOPPING CALMING PROTOCOL...";
    
    try {
        const response = await fetch('/stop-music', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        
        const result = await response.json();
        console.log("Stop music result:", result);
        
        isMusicPlaying = false;
        overlay.textContent = "SYSTEM: STRESS LEVELS NORMALIZED. MUSIC STOPPED.";
        setTimeout(() => { overlay.textContent = "SYSTEM: ONLINE"; }, 3000);
    } catch (error) {
        console.error("Stop music failed:", error);
        isMusicPlaying = false;
        overlay.textContent = "SYSTEM: STRESS NORMALIZED.";
        setTimeout(() => { overlay.textContent = "SYSTEM: ONLINE"; }, 3000);
    }
}

startBtn.addEventListener('click', startMonitoring);
stopBtn.addEventListener('click', stopMonitoring);
document.getElementById('testBtn').addEventListener('click', triggerCalmingIntervention);

// Check connection status on load
async function checkStatus() {
    try {
        const response = await fetch('/status');
        const status = await response.json();
        const statusDiv = document.getElementById('connection-status');
        
        console.log('Status check:', status);
        
        if (status.hands) {
            statusDiv.textContent = '✓ Spotify Connected - Ready to play music';
            statusDiv.style.color = 'var(--accent-color)';
            document.getElementById('loginBtn').style.display = 'none';
        } else {
            statusDiv.textContent = '⚠ Spotify Not Connected - Click "CONNECT SPOTIFY" first!';
            statusDiv.style.color = 'var(--warning-color)';
            document.getElementById('loginBtn').style.display = 'inline-block';
        }
    } catch (error) {
        console.error('Status check failed:', error);
    }
}

// Check if we just connected
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('connected') === 'true') {
    overlay.textContent = 'SYSTEM: SPOTIFY CONNECTED';
    setTimeout(() => { overlay.textContent = 'SYSTEM: ONLINE'; }, 3000);
}

checkStatus();
