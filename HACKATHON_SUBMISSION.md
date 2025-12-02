# Frankenstein Monitor - Kiroween 2024 Submission

## 🎃 Project Overview

An AI-powered stress detection system that monitors emotional state in real-time and automatically intervenes with calming music when stress levels rise. Built with Claude AI and Spotify MCP.

## 🏆 Why This Project Stands Out

### 1. Uses Anthropic Technologies
- ✅ **Claude 3.5 Sonnet** for AI-powered stress analysis
- ✅ **Model Context Protocol (MCP)** for Spotify integration
- ✅ Demonstrates both Claude API and MCP capabilities

### 2. Perfect Halloween Theme
- 🧟 **"Frankenstein Monitor"** - watching over the "subject"
- 🎨 Industrial/cyberpunk aesthetic with Matrix green
- 👁️ Surveillance-style monitoring interface
- ⚡ Dark, dystopian design language

### 3. Practical & Functional
- 📹 Real-time webcam facial analysis
- 🧠 Dual AI detection (face-api.js + Claude)
- 🎵 Automatic music intervention via Spotify MCP
- 📊 Live statistics and monitoring

## 🛠️ Technical Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (Browser)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Webcam     │→ │  face-api.js │→ │  Stress      │  │
│  │   Stream     │  │  Detection   │  │  Analysis    │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│                           ↓                              │
│                    Stress Detected?                      │
│                           ↓                              │
└───────────────────────────┼──────────────────────────────┘
                            ↓
┌───────────────────────────┼──────────────────────────────┐
│                    BACKEND (Node.js)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Express    │→ │    Brain     │→ │   Claude AI  │  │
│  │   Server     │  │   Module     │  │  (Optional)  │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│         ↓                                                │
│  ┌──────────────┐                                        │
│  │    Hands     │                                        │
│  │   Module     │                                        │
│  └──────┬───────┘                                        │
└─────────┼────────────────────────────────────────────────┘
          ↓
┌─────────┼────────────────────────────────────────────────┐
│         ↓              MCP LAYER                         │
│  ┌──────────────┐                                        │
│  │   Spotify    │                                        │
│  │ MCP Server   │                                        │
│  └──────┬───────┘                                        │
└─────────┼────────────────────────────────────────────────┘
          ↓
    🎵 Spotify Playback
```

## 🎯 Key Features

### AI-Powered Detection
- **face-api.js**: Client-side facial expression recognition
- **Claude 3.5 Sonnet**: Backend stress analysis (optional)
- **Dual-layer detection**: Fast client-side + deep AI analysis

### MCP Integration
- **Spotify MCP Server**: Controls music playback
- **Auto-approved tools**: Search, play, pause, get playback state
- **Seamless integration**: Backend calls MCP, MCP calls Spotify

### User Experience
- **Real-time monitoring**: Live FPS, face count, stress level
- **Automatic intervention**: Plays "Weightless" by Marconi Union
- **Visual feedback**: Color-coded stress indicators
- **Cyberpunk aesthetic**: Matrix-style green on black

## 📋 Compliance Checklist

- [x] Uses Claude AI (Anthropic) ✅
- [x] Uses MCP (Model Context Protocol) ✅
- [x] Halloween/spooky theme ✅
- [x] Fully functional application ✅
- [x] Complete documentation ✅
- [x] Setup instructions ✅
- [x] No syntax errors ✅
- [x] Tested and working ✅

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Install uv for MCP
brew install uv

# 3. Configure environment
cp .env.example .env
# Edit .env with your API keys

# 4. Start server
npm start

# 5. Open browser
open http://localhost:3000
```

## 📚 Documentation

- **README.md** - Main documentation
- **MCP_SETUP.md** - Detailed MCP setup guide
- **KIROWEEN_COMPLIANCE.md** - Hackathon compliance verification
- **.env.example** - Environment variable template

## 🎬 Demo Flow

1. User opens app → Sees "Frankenstein Monitor" interface
2. Clicks "CONNECT SPOTIFY" → OAuth2 flow
3. Clicks "INITIALIZE MONITORING" → Webcam activates
4. System detects face → Real-time expression analysis
5. Stress detected → Counter increments
6. Stress persists → Backend calls `/intervene`
7. Backend uses MCP → Spotify MCP server activated
8. MCP searches track → Finds "Weightless"
9. MCP plays music → Calming intervention active
10. Stress normalizes → Music stops automatically

## 💡 Innovation Points

### Technical Excellence
- Modern tech stack (Node.js, Express, face-api.js)
- MCP integration (cutting-edge protocol)
- Dual AI detection (client + server)
- OAuth2 authentication
- Real-time processing

### User Experience
- No manual intervention needed
- Privacy-focused (client-side detection)
- Graceful fallbacks (works without API keys)
- Responsive design
- Clear visual feedback

### Theme Integration
- "Frankenstein" concept perfectly executed
- Industrial/surveillance aesthetic
- Dark, dystopian UI design
- "Subject monitoring" terminology
- Psychological horror element (being watched)

## 🎃 Why "Frankenstein Monitor"?

Like Dr. Frankenstein monitoring his creation, this system watches over you, analyzing your emotional state and intervening when necessary. The dark, industrial aesthetic and surveillance-style interface create an unsettling yet practical tool for stress management.

## 🔗 Links

- **GitHub**: https://github.com/teclas-gif/re-invent2025
- **Demo Video**: [Add your demo video link]
- **Live Demo**: [Add your deployed link if available]

## 👥 Team

Built for Kiroween 2024 Hackathon

## 📄 License

ISC

---

**Ready for submission!** This project demonstrates:
- ✅ Claude AI integration
- ✅ MCP (Model Context Protocol) usage
- ✅ Creative Halloween theme
- ✅ Practical functionality
- ✅ Technical excellence
