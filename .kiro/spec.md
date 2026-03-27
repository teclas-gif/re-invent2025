# Frankenstein App Specification

## Overview
The Frankenstein App is a multimodal emotion detection system that monitors user stress levels via webcam and automatically plays calming music when high stress is detected.

## Core Features
1.  **Real-time Emotion Detection**: Uses `face-api.js` to analyze facial expressions in the browser.
2.  **Stress Calculation**: Aggregates negative emotions (anger, sadness, fear, disgust) to calculate a stress score.
3.  **Calming Intervention**: Automatically triggers playback of "Weightless" by Marconi Union via a hidden YouTube player when stress exceeds a threshold.
4.  **Visual Feedback**: Draws bounding boxes and emotion labels on the video feed.

## Tech Stack
-   **Frontend**: HTML5, CSS (Matrix theme), Vanilla JavaScript
-   **AI/ML**: `face-api.js` (Client-side)
-   **Backend**: Node.js, Express (for serving static files and potential future expansion)
-   **Integrations**: YouTube IFrame API
