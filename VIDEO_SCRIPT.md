# 🎬 Frankenstein Monitor - Demo Video Script

## Video Specs
- **Length**: 2-3 minutes (DevPost recommended)
- **Format**: MP4, 1080p
- **Tools**: QuickTime (Mac), OBS Studio, or Loom
- **Audio**: Clear voiceover or text overlays

---

## 🎥 Shot List & Script

### SCENE 1: Title Card (5 seconds)
**Visual**: 
- Black screen with green text
- Title: "FRANKENSTEIN MONITOR"
- Subtitle: "AI-Powered Stress Detection"
- Built for Kiroween 2024

**Voiceover/Text**:
> "Frankenstein Monitor - An AI-powered stress detection system built for Kiroween 2024"

---

### SCENE 2: The Problem (10 seconds)
**Visual**:
- Show someone looking stressed at computer
- Or use stock footage of stressed person

**Voiceover/Text**:
> "Stress affects millions of people daily. What if your computer could detect when you're stressed and help you calm down automatically?"

---

### SCENE 3: The Solution (10 seconds)
**Visual**:
- Show the Frankenstein Monitor interface
- Highlight the dark, cyberpunk aesthetic
- Show the "Subject Monitoring" title

**Voiceover/Text**:
> "Like Dr. Frankenstein monitoring his creation, this system watches over you, analyzing your emotional state in real-time."

---

### SCENE 4: Tech Stack (15 seconds)
**Visual**:
- Show code editor with key files
- Highlight: brain.js, hands.js, server.js
- Show package.json with dependencies

**Voiceover/Text**:
> "Built with Claude AI from Anthropic for intelligent stress analysis, face-api.js for real-time facial detection, and Spotify API for calming interventions."

**Text Overlay**:
- Claude 3.5 Sonnet (Anthropic)
- face-api.js
- Spotify API
- Node.js + Express

---

### SCENE 5: Demo - Connection (20 seconds)
**Visual**:
1. Open browser to http://127.0.0.1:3000
2. Show the interface loading
3. Click "CONNECT SPOTIFY"
4. Show Spotify authorization page
5. Return to app with "✓ Spotify Connected"

**Voiceover/Text**:
> "First, we connect to Spotify for music playback control. The app uses OAuth2 for secure authentication."

---

### SCENE 6: Demo - Starting Monitoring (20 seconds)
**Visual**:
1. Click "INITIALIZE MONITORING"
2. Browser asks for webcam permission
3. Click "Allow"
4. Webcam activates
5. Face detection starts
6. Show stats panel updating (FPS, Face Count, Stress Level)

**Voiceover/Text**:
> "We initialize monitoring, grant webcam access, and the system begins real-time facial expression analysis."

**Highlight**:
- Green detection box around face
- Live FPS counter
- Stress level percentage

---

### SCENE 7: Demo - Normal State (15 seconds)
**Visual**:
- Show calm, neutral expression
- Status shows: "STATUS: NORMAL"
- Stress level: low (green)
- Face expressions overlay showing emotions

**Voiceover/Text**:
> "When you're calm, the system shows normal status. It analyzes seven facial expressions to calculate stress levels."

---

### SCENE 8: Demo - Stress Detection (30 seconds)
**Visual**:
1. Make stressed/angry expression (frown, tense)
2. Watch stress counter increase
3. Status changes to "STATUS: HIGH STRESS DETECTED"
4. Red pulsing animation
5. Overlay shows: "SYSTEM: INITIATING CALMING PROTOCOL"
6. Spotify starts playing music
7. Show Spotify app with "Weightless" playing

**Voiceover/Text**:
> "When stress is detected and persists, the system automatically triggers a calming intervention. It searches for and plays 'Weightless' by Marconi Union - scientifically proven to reduce anxiety."

**Key Moments**:
- Stress level turns red
- Pulsing animation
- Music starts playing
- Show Spotify confirmation

---

### SCENE 9: Demo - Stress Normalization (20 seconds)
**Visual**:
1. Return to calm expression
2. Stress level decreases
3. Status: "STATUS: NORMAL"
4. Overlay: "SYSTEM: STRESS LEVELS NORMALIZED. MUSIC STOPPED."
5. Spotify pauses

**Voiceover/Text**:
> "Once stress levels normalize, the system automatically stops the music. No manual intervention needed."

---

### SCENE 10: Claude AI Integration (15 seconds)
**Visual**:
- Show terminal with server logs
- Highlight: "Brain: Sending snapshot to Claude for analysis"
- Show Claude API response
- Show brain.js code

**Voiceover/Text**:
> "Behind the scenes, Claude AI analyzes webcam snapshots for deeper stress indicators, providing intelligent analysis beyond facial expressions."

**Code Highlight**:
```javascript
const message = await this.anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    // Analyzes stress indicators
});
```

---

### SCENE 11: The Theme (15 seconds)
**Visual**:
- Pan across the UI showing:
  - Dark dystopian design
  - Matrix green accents
  - Scanline effects
  - "Subject Monitoring" title
  - Industrial panels
  - Glowing borders

**Voiceover/Text**:
> "The Frankenstein theme is executed through a dark, industrial aesthetic - like a surveillance system monitoring its subject. Perfect for Halloween."

---

### SCENE 12: Features Summary (15 seconds)
**Visual**:
- Quick cuts showing:
  - Real-time detection
  - Live statistics
  - Automatic intervention
  - Music control
  - Responsive UI

**Text Overlay**:
✓ Real-time facial detection
✓ AI-powered stress analysis
✓ Automatic music intervention
✓ Spotify integration
✓ Spooky Frankenstein theme

**Voiceover/Text**:
> "Frankenstein Monitor combines cutting-edge AI, real-time computer vision, and practical stress management in a hauntingly beautiful interface."

---

### SCENE 13: Call to Action (10 seconds)
**Visual**:
- Show GitHub repository
- Show README
- End card with project info

**Text Overlay**:
- GitHub: github.com/teclas-gif/re-invent2025
- Built with Claude AI (Anthropic)
- Kiroween 2024

**Voiceover/Text**:
> "Check out the code on GitHub. Built for Kiroween 2024 with Claude AI from Anthropic."

---

## 🎬 Recording Tips

### Before Recording:
1. ✅ Close unnecessary browser tabs
2. ✅ Clear browser history/bookmarks bar
3. ✅ Set browser zoom to 100%
4. ✅ Open Spotify desktop app
5. ✅ Test webcam and lighting
6. ✅ Restart server: `npm start`
7. ✅ Have good lighting on your face

### Recording Setup:
**Option 1: QuickTime (Mac)**
```bash
# Open QuickTime Player
# File → New Screen Recording
# Select area or full screen
# Click record
```

**Option 2: OBS Studio (Free, All Platforms)**
- Download: https://obsproject.com/
- Add "Display Capture" source
- Add "Audio Input Capture" for voiceover
- Click "Start Recording"

**Option 3: Loom (Easy, Web-based)**
- Go to: https://www.loom.com/
- Click "Start Recording"
- Select screen + camera + mic

### During Recording:
1. Speak clearly and at moderate pace
2. Pause between scenes (easier to edit)
3. Show mouse cursor for important clicks
4. Keep movements smooth
5. If you mess up, just pause and restart that section

### Recording Order:
1. Record all screen captures first
2. Record voiceover separately (easier)
3. Or use text overlays instead of voiceover

---

## 🎨 Editing Tips

### Free Editing Tools:
- **iMovie** (Mac) - Simple, built-in
- **DaVinci Resolve** (All platforms) - Professional, free
- **Kapwing** (Web) - Easy online editor

### Editing Checklist:
- [ ] Trim dead space at start/end
- [ ] Add title card
- [ ] Add text overlays for key points
- [ ] Add background music (optional, low volume)
- [ ] Add transitions between scenes
- [ ] Export as MP4, 1080p, 30fps

### Music Suggestions (Royalty-Free):
- YouTube Audio Library
- Epidemic Sound (free trial)
- Or use subtle ambient music

---

## 📤 Export Settings

**Recommended Settings:**
- Format: MP4 (H.264)
- Resolution: 1920x1080 (1080p)
- Frame Rate: 30fps
- Bitrate: 8-10 Mbps
- Audio: AAC, 192kbps

**File Size**: Aim for under 100MB for easy upload

---

## 🚀 Quick Recording Script (No Voiceover)

If you want to skip voiceover, use text overlays:

1. **Title Card**: "FRANKENSTEIN MONITOR - AI Stress Detection"
2. **Show UI**: "Monitoring your emotional state like Dr. Frankenstein"
3. **Connect Spotify**: "Secure OAuth2 authentication"
4. **Start Monitoring**: "Real-time facial expression analysis"
5. **Normal State**: "Calm state detected ✓"
6. **Stress Detected**: "High stress detected! 🚨"
7. **Music Plays**: "Automatic calming intervention"
8. **Stress Normalizes**: "Music stops automatically ✓"
9. **Tech Stack**: "Claude AI + face-api.js + Spotify"
10. **End Card**: "github.com/teclas-gif/re-invent2025"

Total time: 2-3 minutes with text overlays

---

## ✅ Final Checklist

Before uploading:
- [ ] Video is 2-3 minutes long
- [ ] Shows all key features
- [ ] Demonstrates stress detection working
- [ ] Shows music playing and stopping
- [ ] Mentions Claude AI / Anthropic
- [ ] Shows Halloween theme
- [ ] Has clear audio or text
- [ ] Exported as MP4
- [ ] Under 100MB file size
- [ ] Looks professional

---

## 🎬 Ready to Record!

**Simplest Approach:**
1. Use Loom or QuickTime to record screen
2. Follow the demo flow (Scenes 5-9)
3. Add text overlays in editing
4. Add title card and end card
5. Export and upload!

**Time needed**: 30-60 minutes total

Good luck! 🎃🎬
