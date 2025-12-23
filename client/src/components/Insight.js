import React from 'react';
import "./Insight.css";
import { useEffect } from 'react';

const Insight = ({ analysis }) =>{

    useEffect(() => {
        console.log("🎨 Insight component rendered with analysis:", analysis);
    }, [analysis]);

     if (!analysis) {
        console.log("⚠️ Insight: No analysis data, returning null");
        return null;
    }

    console.log("✅ Insight: Rendering card with data:", {
        mood: analysis.mood,
        empathy: analysis.empathy_message,
        suggestion: analysis.suggestion
    });
  // Use a neutral theme if specific mood data is missing

    const currentMood = (analysis.mood || "").toLowerCase();

    const moodColor = analysis.mood === 'Happy' ? '#10b981' : 
                     analysis.mood === 'Sad' ? '#3b82f6' : 
                     analysis.mood === 'Anxious' ? '#f59e0b' : '#6b7280';
    const empathy = analysis.empathy_message || "Entry saved successfully.";
    const suggestion = analysis.suggestion || "Take a deep breath.";                
    return (
        <div className="insight-card" style={{ borderLeftColor: moodColor }}>
            <div className="insight-header">
                <span className="insight-sparkle">✨</span>
                <h4>Sentio AI Insight</h4>
            </div>
            <p className="insight-empathy">{empathy}</p>
            <div className="insight-suggestion">
                <strong>Wellness Task:</strong> {suggestion}
            </div>
            </div>
    );
}
export default Insight;