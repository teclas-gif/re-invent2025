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

// ... (rest of code)

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
    console.log("Received Spotify Callback. Code:", code ? "Present" : "Missing");

    try {
        const params = new URLSearchParams();
        params.append('code', code);
        params.append('redirect_uri', SPOTIFY_REDIRECT_URI);
        params.append('grant_type', 'authorization_code');

        console.log("Exchanging code for token...");
        const response = await axios.post('https://accounts.spotify.com/api/token', params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + (new Buffer.from(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET).toString('base64'))
            }
        });

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
        res.redirect('/?connected=false&error=' + encodeURIComponent(error.message));
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
