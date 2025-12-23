import React, { useState } from 'react';
import Insight from './Insight.js';

// This component is responsible for rendering the form where users can write and submit new journal entries.
function JournalForm() {
  
  cconst [entryText, setEntryText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [aiResult, setAiResult] = useState(null);

  // This function will be called when the form is submitted.
  const handleSubmit = async (event) => {
    // Prevent the default form submission behavior which causes a page reload.
    event.preventDefault();
    
    if (!entryText.trim() || isSubmitting) return;
    
    console.log("📝 Submit started");
    setIsSubmitting(true);
    try {
      console.log("🚀 Calling onAddEntry...");
      const result = await onAddEntry(entryText);
      console.log("🤖 AI Response Received in JournalForm:", result);
      console.log("🔍 Type check:", typeof result, "Keys:", Object.keys(result || {}));
      
      // Set the AI result
      setAiResult(result);
      console.log("✅ aiResult state updated");
      
      // Clear form after a small delay
      setTimeout(() => {
        console.log("🧹 Clearing form");
        setEntryText('');
        setCharCount(0);
      }, 100);

    } catch (error) {
      console.error('❌ Error in handleSubmit:', error);
      setAiResult({
        mood: 'Neutral',
        empathy_message: 'Entry saved, but analysis failed.',
        suggestion: 'Try again later.',
        score: 0
      });
    } finally {
      setIsSubmitting(false);
      console.log("🏁 Submit complete");
    }
  };
    
  const handleTextChange = (e) => {
    setEntryText(e.target.value);
    setCharCount(e.target.value.length);
  };
  console.log("🔄 JournalForm render - aiResult:", aiResult);

  return (
    <div className="journal-form-container">
      <div className="form-header">
        <h2>✨ New Journal Entry</h2>
        <p>How are you feeling today?</p>
      </div>
      <div className="journal-form">
        <div className="textarea-container">
          <textarea
            rows="6"
            placeholder="Share your thoughts, feelings, or what happened today..."
            value={entryText}
            onChange={handleTextChange}
            className="journal-textarea"
            disabled={isSubmitting}
          />
          <div className="char-counter">
            <span className={charCount > 500 ? 'char-limit' : ''}>{charCount}</span>
            <span className="char-max">/1000</span>
          </div>
        </div>

        <button 
          className="submit-btn" 
          onClick={handleSubmit} 
          disabled={!entryText.trim() || isSubmitting}
        >
          {isSubmitting ? "Sentio is reflecting..." : "Save Entry"}
        </button>

        {/* Debug output */}
        {console.log("🎯 Rendering Insight component, aiResult exists?", !!aiResult)}
        
        {/* Render Insight card when aiResult is available */}
        {aiResult && <Insight analysis={aiResult} />}
        
        {/* Fallback debug UI - remove this after fixing */}
        {aiResult && (
          <div style={{
            marginTop: '10px', 
            padding: '10px', 
            background: '#fef3c7', 
            borderRadius: '8px',
            fontSize: '0.85rem'
          }}>
            <strong>Debug:</strong> aiResult received: {JSON.stringify(aiResult)}
          </div>
        )}
      </div>
    </div>
  );
}

export default JournalForm;
