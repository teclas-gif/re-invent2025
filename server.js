const express = require('express');
const multer = require('multer');
const path = require('path');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Configure multer for memory storage (we'll process files in memory)
const upload = multer({ storage: multer.memoryStorage() });

// Spotify Config
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const SPOTIFY_REDIRECT_URI = 'http://127.0.0.1:3000/callback';

if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
    console.error("ERROR: Missing Spotify Credentials in .env");
}

app.use(express.static('public'));
app.use(express.json());

const Brain = require('./brain');
const Hands = require('./hands');

const brain = new Brain(process.env.ANTHROPIC_API_KEY);
const hands = new Hands(process.env.SPOTIFY_MCP_URL);

// API Endpoints
app.post('/analyze', upload.single('snapshot'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No snapshot provided' });
        }

        console.log('Received snapshot for analysis');
        const result = await brain.analyze(req.file.buffer, null);
        
        res.json(result);
    } catch (error) {
        console.error('Analysis error:', error);
        res.status(500).json({ error: 'Analysis failed', message: error.message });
    }
});

app.post('/intervene', async (req, res) => {
    try {
        console.log('=== Intervention requested ===');
        console.log('Hands connected:', hands.isConnected());
        console.log('USE_MCP:', process.env.USE_MCP);
        
        const result = await hands.playCalmingMusic();
        
        console.log('Intervention result:', result);
        res.json(result);
    } catch (error) {
        console.error('Intervention error:', error);
        res.status(500).json({ 
            status: 'error',
            error: 'Intervention failed', 
            message: error.message 
        });
    }
});

app.post('/stop-music', async (req, res) => {
    try {
        console.log('=== Stop music requested ===');
        const result = await hands.stopMusic();
        console.log('Stop music result:', result);
        res.json(result);
    } catch (error) {
        console.error('Stop music error:', error);
        res.status(500).json({ 
            status: 'error',
            error: 'Stop failed', 
            message: error.message 
        });
    }
});

app.get('/status', (req, res) => {
    res.json({
        brain: !!brain.anthropic,
        hands: hands.isConnected(),
        spotify: {
            clientIdSet: !!SPOTIFY_CLIENT_ID,
            clientSecretSet: !!SPOTIFY_CLIENT_SECRET,
            redirectUri: SPOTIFY_REDIRECT_URI
        },
        timestamp: new Date().toISOString()
    });
});

// Spotify Auth Endpoints
app.get('/login', (req, res) => {
    console.log("Initiating Spotify Login...");
    const scopes = 'user-read-playback-state user-modify-playback-state';
    res.redirect('https://accounts.spotify.com/authorize' +
        '?response_type=code' +
        '&client_id=' + SPOTIFY_CLIENT_ID +
        (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
        '&redirect_uri=' + encodeURIComponent(SPOTIFY_REDIRECT_URI));
});

app.get('/callback', async (req, res) => {
    const code = req.query.code || null;
    const error = req.query.error || null;
    
    console.log("Received Spotify Callback. Code:", code ? "Present" : "Missing");
    
    if (error) {
        console.error("Spotify authorization error:", error);
        return res.redirect('/?connected=false&error=' + encodeURIComponent(error));
    }
    
    if (!code) {
        console.error("No authorization code received");
        return res.redirect('/?connected=false&error=no_code');
    }

    try {
        const authString = Buffer.from(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET).toString('base64');
        
        console.log("Exchanging code for token...");
        console.log("Client ID:", SPOTIFY_CLIENT_ID);
        console.log("Redirect URI:", SPOTIFY_REDIRECT_URI);
        
        const response = await axios.post('https://accounts.spotify.com/api/token', 
            new URLSearchParams({
                code: code,
                redirect_uri: SPOTIFY_REDIRECT_URI,
                grant_type: 'authorization_code'
            }).toString(),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + authString
                }
            }
        );

        const accessToken = response.data.access_token;
        const refreshToken = response.data.refresh_token;

        console.log("Token received:", accessToken.substring(0, 10) + "...");

        // Pass token to Hands module
        hands.setAccessToken(accessToken);

        // Verify it was set
        if (hands.isConnected()) {
            console.log("Hands module confirmed connected.");
        } else {
            console.error("Hands module FAILED to set token.");
        }

        console.log('Spotify Connected! Redirecting to home...');
        res.redirect('/?connected=true');

    } catch (error) {
        console.error('Spotify Auth Error:', error.response ? error.response.data : error.message);
        const errorMsg = error.response?.data?.error_description || error.response?.data?.error || error.message;
        res.redirect('/?connected=false&error=' + encodeURIComponent(errorMsg));
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
