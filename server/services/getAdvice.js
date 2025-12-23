
async function getAdvice(userText)
{
    const apiKey = process.env.GEMINI_API_KEY;
    const url= `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
    
    const systemInstruction = `
        You are Sentio, a supportive wellness assistant.
        Respond ONLY in JSON format:
        {
        "mood": "Happy" | "Sad" | "Anxious" | "Frustrated" | "Neutral",
        "empathy_message": "string",
        "suggestion": "string",
        "score": number
        }
    `;

    const payload = {
        contents: [{ parts: [{ text: userText }] }],
        systemInstruction: { parts: [{ text: systemInstruction }] },
        generationConfig: { responseMimeType: "application/json" }
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    const result = await response.json();
    if (result.error) {
        console.error("Google API Error:", result.error.message);
        throw new Error(`Gemini Error: ${result.error.message}`);
    }
    if (!result.candidates || result.candidates.length === 0) {
        console.error("No AI candidates returned. Full Response:", JSON.stringify(result));
        throw new Error("AI failed to generate a response (possibly safety filtered).");
    }

    const rawText = result.candidates[0].content.parts[0].text;
    const cleanJson = rawText.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanJson);
}

// Export the function so the "Waiter" (index.js) can use it
module.exports = { getAdvice };