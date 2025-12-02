const Anthropic = require('@anthropic-ai/sdk');

class Brain {
    constructor(apiKey) {
        this.apiKey = apiKey;
        if (apiKey && apiKey.startsWith('sk-ant')) {
            this.anthropic = new Anthropic({ apiKey: apiKey });
        } else {
            console.warn('Brain: Invalid or missing Anthropic API Key');
        }
    }

    async analyze(videoBuffer, audioBuffer) {
        if (!this.anthropic) {
            console.log('Brain: Using mock analysis (No valid API Key)');
            return this.mockAnalyze();
        }

        try {
            console.log('Brain: Sending snapshot to Claude for analysis...');

            // Convert buffer to base64
            const imageBase64 = videoBuffer.toString('base64');

            const message = await this.anthropic.messages.create({
                model: "claude-3-5-sonnet-20241022",
                max_tokens: 1024,
                messages: [
                    {
                        role: "user",
                        content: [
                            {
                                type: "image",
                                source: {
                                    type: "base64",
                                    media_type: "image/jpeg",
                                    data: imageBase64,
                                },
                            },
                            {
                                type: "text",
                                text: "Analyze this webcam snapshot of a user. Look for signs of stress, anxiety, or frustration (frowning, leaning forward, tense posture). \n\nOutput ONLY a JSON object with this format: \n{ \"verdict\": \"High Stress\" | \"Normal\", \"stressLevel\": 0.0 to 1.0, \"reasoning\": \"short explanation\" }"
                            }
                        ],
                    }
                ],
            });

            const content = message.content[0].text;
            console.log('Brain: Claude response:', content);

            // Parse JSON from response (handle potential markdown wrapping)
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            } else {
                throw new Error('Failed to parse JSON from Claude response');
            }

        } catch (error) {
            console.error('Brain: Analysis failed', error);
            return this.mockAnalyze(); // Fallback to mock on error
        }
    }

    mockAnalyze() {
        const stressLevel = Math.random();
        return {
            verdict: stressLevel > 0.7 ? 'High Stress' : 'Normal',
            stressLevel: stressLevel,
            reasoning: 'Mock analysis (Fallback)'
        };
    }
}

module.exports = Brain;
