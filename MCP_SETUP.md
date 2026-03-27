# Spotify MCP Setup Guide

This project uses **Model Context Protocol (MCP)** to integrate Spotify music control with Claude AI.

## What is MCP?

MCP (Model Context Protocol) is Anthropic's open protocol that allows AI assistants to securely connect to external tools and data sources. In this project, we use the Spotify MCP server to control music playback.

## Setup Steps

### 1. Install Python `uv` Package Manager

MCP servers run via `uvx`, which requires `uv`:

```bash
# macOS/Linux
curl -LsSf https://astral.sh/uv/install.sh | sh

# Or with Homebrew
brew install uv

# Verify installation
uv --version
```

### 2. Configure Spotify Developer App

1. Go to https://developer.spotify.com/dashboard
2. Create a new app
3. Add redirect URI: `http://127.0.0.1:3000/callback`
4. Copy your Client ID and Client Secret

### 3. Set Environment Variables

Create a `.env` file:

```env
ANTHROPIC_API_KEY=your_anthropic_key
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
USE_MCP=true
PORT=3000
```

### 4. MCP Configuration

The MCP server is configured in `.kiro/settings/mcp.json`:

```json
{
  "mcpServers": {
    "spotify": {
      "command": "uvx",
      "args": ["mcp-server-spotify"],
      "env": {
        "SPOTIFY_CLIENT_ID": "${SPOTIFY_CLIENT_ID}",
        "SPOTIFY_CLIENT_SECRET": "${SPOTIFY_CLIENT_SECRET}"
      },
      "disabled": false,
      "autoApprove": [
        "spotify_search_tracks",
        "spotify_play_track",
        "spotify_pause",
        "spotify_get_current_playback"
      ]
    }
  }
}
```

### 5. How It Works

1. **Server starts** → Loads MCP configuration
2. **User clicks "CONNECT SPOTIFY"** → OAuth2 flow
3. **Stress detected** → Frontend calls `/intervene` endpoint
4. **Backend uses MCP** → Calls Spotify MCP server
5. **MCP server** → Searches for "Weightless" and plays it
6. **Music plays** → Calming intervention active

## MCP vs Direct API

This project supports both modes:

### MCP Mode (USE_MCP=true)
- Uses Spotify MCP server
- Demonstrates Model Context Protocol
- More impressive for hackathon
- Requires `uv` installation

### Direct API Mode (USE_MCP=false)
- Uses Spotify Web API directly
- Simpler setup
- No MCP required
- Still requires Spotify credentials

## Troubleshooting

### MCP Server Not Starting
```bash
# Test uvx installation
uvx --version

# Manually test MCP server
uvx mcp-server-spotify
```

### Spotify Not Playing
- Ensure Spotify is open on at least one device
- Check that you have Spotify Premium
- Verify credentials in `.env`
- Check browser console for errors

### Connection Issues
```bash
# Check server logs
npm start

# Test status endpoint
curl http://localhost:3000/status
```

## Testing MCP Integration

1. Start the server: `npm start`
2. Open browser: `http://localhost:3000`
3. Click "CONNECT SPOTIFY"
4. Click "TEST AUDIO" to manually trigger music
5. Check console logs for MCP calls

## Benefits of Using MCP

✅ **Demonstrates cutting-edge tech** - MCP is Anthropic's latest protocol  
✅ **Cleaner architecture** - Separates concerns between AI and tools  
✅ **Extensible** - Easy to add more MCP servers (weather, calendar, etc.)  
✅ **Secure** - OAuth handled by MCP server  
✅ **Impressive for hackathon** - Shows understanding of modern AI tooling  

## Resources

- MCP Documentation: https://modelcontextprotocol.io/
- Spotify MCP Server: https://github.com/modelcontextprotocol/servers
- Anthropic MCP Guide: https://docs.anthropic.com/claude/docs/mcp
