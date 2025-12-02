const video = document.getElementById('webcam');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const statusDiv = document.getElementById('status');
const overlay = document.getElementById('overlay');
const container = document.getElementById('monitor-container'); // Need container to append canvas

let stream = null;
let isMonitoring = false;
let stressCounter = 0;
let normalCounter = 0;
const STRESS_THRESHOLD_FRAMES = 30; // Approx 1-2 seconds depending on FPS
const NORMAL_THRESHOLD_FRAMES = 60; // Approx 2-3 seconds to ensure calm

// Debug Canvas
let canvas;

// YouTube Player
let player;
let isPlayerReady = false;

// Load YouTube IFrame API
const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '0',
        width: '0',
        videoId: 'qYnA9wWFHLI', // Weightless by Marconi Union
        events: {
            'onReady': onPlayerReady
        }
    });
}

function onPlayerReady(event) {
    console.log("YouTube Player Ready");
    isPlayerReady = true;
}

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

    // Detect faces
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

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
        // "angry", "sad", "fearful", "disgusted"
        const stressScore = expressions.angry + expressions.sad + expressions.fearful + expressions.disgusted;

        // "neutral", "happy", "surprised" are considered non-stress

        if (stressScore > 0.5) { // Threshold
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
            stressCounter = 0; // Reset to avoid spamming
        }

        // Stop music if normal state persists
        if (normalCounter > NORMAL_THRESHOLD_FRAMES) {
            stopCalmingIntervention();
            normalCounter = 0;
        }
    } else {
        statusDiv.textContent = "STATUS: SEARCHING FOR SUBJECT...";
        statusDiv.className = "";
    }

    // Loop using requestAnimationFrame for best performance
    requestAnimationFrame(() => detectEmotions(displaySize));
}

function triggerCalmingIntervention() {
    console.log("Triggering intervention...");
    overlay.textContent = "SYSTEM: INITIATING CALMING PROTOCOL...";

    if (isPlayerReady) {
        player.playVideo();
        overlay.textContent = "SYSTEM: CALMING PROTOCOL ACTIVE (PLAYING AUDIO)";
        setTimeout(() => { overlay.textContent = "SYSTEM: ONLINE"; }, 5000);
    } else {
        console.error("Player not ready");
        overlay.textContent = "SYSTEM: AUDIO ERROR - PLAYER NOT READY";
    }
}

function stopCalmingIntervention() {
    if (isPlayerReady && player.getPlayerState() === 1) { // 1 = Playing
        console.log("Stopping intervention...");
        player.pauseVideo();
        overlay.textContent = "SYSTEM: STRESS LEVELS NORMALIZED. AUDIO STOPPED.";
        setTimeout(() => { overlay.textContent = "SYSTEM: ONLINE"; }, 3000);
    }
}

startBtn.addEventListener('click', startMonitoring);
stopBtn.addEventListener('click', stopMonitoring);
document.getElementById('testBtn').addEventListener('click', triggerCalmingIntervention);
