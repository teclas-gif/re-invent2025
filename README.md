# 🧟 Frankenstein Monitor - Kiroween 2024

An AI-powered stress detection system that monitors your emotional state in real-time and intervenes with calming music when stress levels rise. Built for the Kiroween Hackathon.

## 🎃 The Concept

Like Dr. Frankenstein monitoring his creation, this system watches over you through your webcam, analyzing facial expressions to detect stress, anxiety, and frustration. When stress levels exceed safe thresholds, it automatically triggers a calming intervention by playing soothing music through Spotify.

## 🧠 How It Works

- **The Brain**: Claude AI (Anthropic) analyzes webcam snapshots to detect stress indicators
- **The Eyes**: Face-api.js performs real-time facial expression recognition in the browser
- **The Hands**: Spotify MCP (Model Context Protocol) plays calming music ("Weightless" by Marconi Union) when intervention is needed

## 🚀 Setup

### Prerequisites

- Node.js (v14 or higher)
- Python with `uv` package manager (for MCP server)
- Modern web browser with webcam access
- Spotify Premium account (required for playback control)
- Anthropic API key (optional - falls back to client-side detection)
- Spotify Developer credentials

### Installation

1. Clone the repository:
```bash
git clone https://github.com/teclas-gif/re-invent2025.git
cd re-invent2025
```

2. Install dependencies:
```bash
npm install
```

3. Install Python `uv` for MCP server:
```bash
# macOS/Linux
curl -LsSf https://astral.sh/uv/install.sh | sh

# Or with Homebrew
brew install uv
```

4. Create a `.env` file with your credentials:
```env
ANTHROPIC_API_KEY=your_anthropic_api_key_here
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
USE_MCP=true
PORT=3000
```

5. Get your API keys:
   - **Anthropic API**: https://console.anthropic.com/
   - **Spotify Developer**: https://developer.spotify.com/dashboard
   - Set Spotify redirect URI to: `http://127.0.0.1:3000/callback`

### Running the Application

1. Start the server:
```bash
npm start
```

2. Open your browser to `http://localhost:3000`

3. Click "CONNECT SPOTIFY" and authorize the app

4. Ensure Spotify is open on at least one device (desktop, mobile, web player)

5. Click "INITIALIZE MONITORING" to start stress detection

6. Allow webcam access when prompted

7. The system will automatically play calming music via Spotify MCP when stress is detected

## 🎮 Usage

- **INITIALIZE MONITORING**: Starts webcam and facial analysis
- **TERMINATE**: Stops monitoring
- **TEST AUDIO**: Manually triggers the calming music intervention

The system will automatically:
- Detect faces in real-time
- Analyze emotional expressions
- Calculate stress levels
- Play calming music when stress persists for ~1-2 seconds
- Stop music when stress levels normalize

## 🛠️ Tech Stack

- **Frontend**: Vanilla JavaScript, Face-api.js, HTML5/CSS3
- **Backend**: Node.js, Express
- **AI**: Claude 3.5 Sonnet (Anthropic)
- **MCP**: Spotify MCP Server (Model Context Protocol)
- **Computer Vision**: face-api.js with TinyFaceDetector
- **Music**: Spotify Web API via MCP for calming music playback

## 🎨 Features

- Real-time facial expression analysis
- Stress level monitoring with visual feedback
- **Spotify MCP integration** for music control
- Automatic calming music intervention
- Industrial/cyberpunk UI with Matrix-style aesthetics
- FPS counter and live statistics
- Responsive design

## 🔌 MCP Integration

This project uses **Model Context Protocol (MCP)** - Anthropic's protocol for connecting AI to external tools. The Spotify MCP server handles music playback control.

See [MCP_SETUP.md](MCP_SETUP.md) for detailed setup instructions.

## 📝 License

ISC

## 🏆 Kiroween Hackathon

Built for the Kiroween 2024 Hackathon - combining AI, creativity, and a spooky theme to create a practical stress management tool.
