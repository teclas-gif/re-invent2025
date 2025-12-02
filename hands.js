const fs = require('fs');
const path = require('path');
const axios = require('axios');

class Hands {
    constructor(mcpUrl) {
        this.mcpUrl = mcpUrl;
        this.accessToken = null;
        this.tokenPath = path.join(__dirname, '.spotify_token');
        this.loadToken();
    }

    setAccessToken(token) {
        this.accessToken = token;
        console.log('Hands: Access token set.');
        this.saveToken(token);
    }

    saveToken(token) {
        try {
            fs.writeFileSync(this.tokenPath, token, 'utf8');
            console.log('Hands: Token saved to disk.');
        } catch (err) {
            console.error('Hands: Failed to save token:', err);
        }
    }

    loadToken() {
        try {
            if (fs.existsSync(this.tokenPath)) {
                this.accessToken = fs.readFileSync(this.tokenPath, 'utf8');
                console.log('Hands: Token loaded from disk.');
            }
        } catch (err) {
            console.error('Hands: Failed to load token:', err);
        }
    }

    isConnected() {
        return !!this.accessToken;
    }

    async playCalmingMusic() {
        console.log('Hands: Initiating calming sequence...');

        if (!this.accessToken) {
            console.log('Hands: No access token available. Cannot play music.');
            return { status: 'error', error: 'No access token' };
        }

        try {
            // 1. Search for "Weightless" by Marconi Union
            const searchResponse = await axios.get('https://api.spotify.com/v1/search', {
                params: { q: 'Weightless Marconi Union', type: 'track', limit: 1 },
                headers: { 'Authorization': `Bearer ${this.accessToken}` },
                timeout: 5000
            });

            const trackUri = searchResponse.data.tracks.items[0]?.uri;

            if (!trackUri) {
                console.log('Hands: Track not found.');
                return { status: 'error', error: 'Track not found' };
            }

            console.log(`Hands: Found track ${trackUri}. Playing...`);

            // 2. Start Playback
            try {
                await axios.put('https://api.spotify.com/v1/me/player/play', {
                    uris: [trackUri]
                }, {
                    headers: { 'Authorization': `Bearer ${this.accessToken}` },
                    timeout: 5000
                });
                console.log('Hands: Playback command sent successfully.');
            } catch (playError) {
                console.error('Hands: Playback command failed:', playError.response ? playError.response.data : playError.message);
                throw playError; // Re-throw to be caught by outer block
            }

            return { status: 'success', action: 'Playing Weightless by Marconi Union' };

        } catch (error) {
            console.error('Hands: Failed to control Spotify', error.response ? error.response.data : error.message);

            // Handle "No active device" error specifically
            if (error.response && error.response.status === 404) {
                const reason = error.response.data.error ? error.response.data.error.reason : 'Unknown';
                return { status: 'error', error: `No active Spotify device found (${reason}). Please open Spotify on a device.` };
            }

            if (error.response && error.response.status === 403) {
                return { status: 'error', error: `Spotify Premium required or restricted (${error.response.data.error.message})` };
            }

            return { status: 'error', error: error.message };
        }
    }
}

module.exports = Hands;
