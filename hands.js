const fs = require('fs');
const path = require('path');
const axios = require('axios');

class Hands {
    constructor(mcpUrl) {
        this.mcpUrl = mcpUrl || 'http://localhost:3000';
        this.accessToken = null;
        this.tokenPath = path.join(__dirname, '.spotify_token');
        this.useMCP = process.env.USE_MCP === 'true';
        this.loadToken();
        
        if (this.useMCP) {
            console.log('Hands: MCP mode enabled');
        } else {
            console.log('Hands: Direct Spotify API mode');
        }
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
        return !!this.accessToken || this.useMCP;
    }

    async callMCP(tool, args) {
        try {
            const response = await axios.post(`${this.mcpUrl}/mcp/call`, {
                server: 'spotify',
                tool: tool,
                arguments: args
            }, {
                timeout: 10000
            });
            return response.data;
        } catch (error) {
            console.error(`Hands: MCP call failed for ${tool}:`, error.message);
            throw error;
        }
    }

    async playCalmingMusic() {
        console.log('Hands: Initiating calming sequence...');

        if (this.useMCP) {
            return await this.playCalmingMusicMCP();
        } else {
            return await this.playCalmingMusicDirect();
        }
    }

    async playCalmingMusicMCP() {
        try {
            console.log('Hands: Using MCP to search for calming music...');
            
            // 1. Search for track using MCP
            const searchResult = await this.callMCP('spotify_search_tracks', {
                query: 'Weightless Marconi Union',
                limit: 1
            });

            if (!searchResult.tracks || searchResult.tracks.length === 0) {
                console.log('Hands: Track not found via MCP.');
                return { status: 'error', error: 'Track not found' };
            }

            const trackUri = searchResult.tracks[0].uri;
            console.log(`Hands: Found track ${trackUri} via MCP. Playing...`);

            // 2. Play track using MCP
            await this.callMCP('spotify_play_track', {
                uri: trackUri
            });

            console.log('Hands: MCP playback command sent successfully.');
            return { status: 'success', action: 'Playing Weightless by Marconi Union via MCP' };

        } catch (error) {
            console.error('Hands: MCP music control failed:', error.message);
            return { status: 'error', error: `MCP Error: ${error.message}` };
        }
    }

    async playCalmingMusicDirect() {
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
                throw playError;
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

    async stopMusic() {
        console.log('Hands: Stopping music...');

        if (this.useMCP) {
            return await this.stopMusicMCP();
        } else {
            return await this.stopMusicDirect();
        }
    }

    async stopMusicMCP() {
        try {
            await this.callMCP('spotify_pause', {});
            console.log('Hands: Music paused via MCP.');
            return { status: 'success', action: 'Music paused via MCP' };
        } catch (error) {
            console.error('Hands: MCP pause failed:', error.message);
            return { status: 'error', error: `MCP Error: ${error.message}` };
        }
    }

    async stopMusicDirect() {
        if (!this.accessToken) {
            console.log('Hands: No access token available.');
            return { status: 'error', error: 'No access token' };
        }

        try {
            await axios.put('https://api.spotify.com/v1/me/player/pause', {}, {
                headers: { 'Authorization': `Bearer ${this.accessToken}` },
                timeout: 5000
            });
            console.log('Hands: Music paused successfully.');
            return { status: 'success', action: 'Music paused' };
        } catch (error) {
            console.error('Hands: Failed to pause music', error.response ? error.response.data : error.message);
            
            if (error.response && error.response.status === 404) {
                return { status: 'error', error: 'No active device found' };
            }
            
            return { status: 'error', error: error.message };
        }
    }
}

module.exports = Hands;
