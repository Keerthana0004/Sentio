import React, { useState, useEffect, useCallback } from 'react';
import LoginPage from './components/LoginPage';
import "./App.css";
import { auth } from  "./components/firebase";
import { onAuthStateChanged, signOut } from 'firebase/auth';
import Insight from './components/Insight';


const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
// COMPONENT: JournalForm
function JournalForm({ onAddEntry , aiResult}) {
  const [entryText, setEntryText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [charCount, setCharCount] = useState(0);
  

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!entryText.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    

    try {
      // 2. Wait for the server (which waits for the AI)
      await onAddEntry(entryText);
      console.log("🤖 Entry submitted"); 
     
      setEntryText('');
      setCharCount(0);
      

      } catch (error) {
      console.error('Error:', error);
      
    } finally {
      setIsSubmitting(false);
    }
  };

   
  const handleTextChange = (e) => {
    setEntryText(e.target.value);
    setCharCount(e.target.value.length);
  };
  console.log("🔄 JournalForm render - aiResult from props:", aiResult);



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

        <button className= "submit-btn" onClick={handleSubmit} disabled={!entryText.trim() || isSubmitting}>
          {isSubmitting ? "Sentio is reflecting..." : "Save Entry"}
        </button>
        {console.log("🎯 About to render Insight, aiResult:", aiResult)}
        {aiResult ? (
            <Insight analysis={aiResult} />
        ) : (
          <div style={{
            marginTop: '10px', 
            padding: '10px', 
            background: '#fee', 
            borderRadius: '8px',
            fontSize: '0.85rem'
          }}>
            ⚠️ No aiResult yet write an entry to see AI analysis
          </div>
        )}
      </div>
    </div>
  );
}

// COMPONENT: EntryList
function EntryList({ entries }) {
  const [selectedEntry, setSelectedEntry] = useState(null);

  const formatDate = (timestamp) => {
    if (timestamp && timestamp.seconds) {
      const date = new Date(timestamp.seconds * 1000);
      return {
        date: date.toLocaleDateString('en-US', { 
          weekday: 'short', 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        }),
        time: date.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })
      };
    }
    return { date: 'No date', time: '' };
  };

  const getSentimentData = (score) => {
    if (score > 1) {
      // 0-100 scale
      if (score > 60) return { emoji: '😊', label: 'Positive', color: '#10b981' };
      if (score < 40) return { emoji: '😔', label: 'Negative', color: '#ef4444' };
      return { emoji: '😐', label: 'Neutral', color: '#6b7280' };
    } else {
      // -1 to 1 scale
      if (score > 0.3) return { emoji: '😊', label: 'Positive', color: '#10b981' };
      if (score < -0.3) return { emoji: '😔', label: 'Negative', color: '#ef4444' };
      if (score > 0.1) return { emoji: '🙂', label: 'Slightly Positive', color: '#06b6d4' };
      if (score < -0.1) return { emoji: '😕', label: 'Slightly Negative', color: '#f59e0b' };
      return { emoji: '😐', label: 'Neutral', color: '#6b7280' };
    }
  };

  const sortedEntries = [...entries].sort((a, b) => {
    const dateA = a.timestamp ? a.timestamp.seconds : 0;
    const dateB = b.timestamp ? b.timestamp.seconds : 0;
    return dateB - dateA;
  });

  if (entries.length === 0) {
    return (
      <div className="entry-list-container">
        <div className="empty-state">
          <div className="empty-icon">📖</div>
          <h3>Your journal is waiting</h3>
          <p>Write your first entry to start tracking your emotional journey!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="entry-list-container">
      <div className="list-header">
        <h2>📚 My Journal</h2>
        <div className="entry-count">{entries.length} entries</div>
      </div>
      
      <div className="entries-grid">
        {sortedEntries.map((entry, index) => {
          const { date, time } = formatDate(entry.timestamp);
          const sentiment = getSentimentData(entry.score || 0);
          
          return (
            <div 
              key={entry.id} 
              className={`entry-card ${selectedEntry === entry.id ? 'selected' : ''}`}
              onClick={() => setSelectedEntry(selectedEntry === entry.id ? null : entry.id)}
              style={{ '--delay': `${index * 0.1}s` }}
            >
              <div className="entry-header">
                <div className="sentiment-badge" style={{ backgroundColor: sentiment.color }}>
                  <span className="sentiment-emoji">{sentiment.emoji}</span>
                  <span className="sentiment-label">{sentiment.label}</span>
                </div>
                <div className="entry-meta">
                  <span className="entry-date">{date}</span>
                  <span className="entry-time">{time}</span>
                </div>
              </div>
              
              <div className="entry-content">
                <p className={`entry-text ${selectedEntry === entry.id ? 'expanded' : ''}`}>
                  {entry.text}
                </p>
                {selectedEntry === entry.id && (
                  <div className="entry-ai-details" style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #f1f5f9' }}>
                    <p style={{ fontStyle: 'italic', color: '#4a5568', fontSize: '0.95rem' }}>
                      <strong>Sentio:</strong> "{entry.empathy_message || 'Entry recorded.'}"
                    </p>
                    <p style={{ color: '#2d3748', fontSize: '0.9rem', marginTop: '8px' }}>
                      <strong>Wellness Task:</strong> {entry.suggestion || 'Take a moment to breathe.'}
                    </p>
                  </div>
                )}
              </div>
              
              <div className="entry-footer">
                <span className="expand-hint">
                  {selectedEntry === entry.id ? 'Click to collapse' : 'Click to expand'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// MAIN APP COMPONENT
function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, positive: 0, negative: 0, neutral: 0 });

  const [aiResult, setAiResult] = useState(null);
  const fetchEntries = useCallback(async () => {
    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) return;

      const idToken = await user.getIdToken();
      const response = await fetch(`${API_URL}/entries`, {
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setEntries(data.sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0)));
      calculateStats(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch entries:', error);
      setLoading(false);
    }
  }, []);


  useEffect(() => {
  
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setAuthLoading(false);
      if (user) {
        // User is signed in, fetch their entries
        fetchEntries();
      } else {
        // User is signed out, reset state
        setEntries([]);
        setStats({ total: 0, positive: 0, negative: 0, neutral: 0 });
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [fetchEntries]);
 

  const calculateStats = (entriesData) => {
    const total = entriesData.length;
    let positive = 0, negative = 0, neutral = 0;
    
    entriesData.forEach(entry => {
      const score = entry.score || 0;
      if (score > 1) {
        // 0-100 scale
        if (score > 60) positive++;
        else if (score < 40) negative++;
        else neutral++;
      } else {
        // -1 to 1 scale
        if (score > 0.1) positive++;
        else if (score < -0.1) negative++;
        else neutral++;
      }
    });
    
    setStats({ total, positive, negative, neutral });
  };

  const handleAddEntry = useCallback(async (entryText) => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const idToken = await user.getIdToken();

      const response = await fetch('http://localhost:3001/add-entry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({ text: entryText }),
      });

      if (!response.ok) {
        throw new Error('Failed to add entry');
      }
      //Extract the AI result from the response
      const aiData = await response.json();
      console.log("✅ AI Data returned to App:", aiData);
      // After successfully adding the entry, re-fetch all entries to update the list
      setAiResult(aiData);
      console.log("🎨 aiResult state set in App component");
      
      fetchEntries();
      
      return aiData;
    } catch (error) {
      console.error('Error adding entry:', error);
      throw error; // Re-throw to be caught by the form component
    }
  }, [fetchEntries]);

   const handleSignOut = () => signOut(auth);

  if (authLoading) {
    return (
      <div className="App loading">
        <div className="loading-spinner">
          <div className="spinner-ring"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }
  if (!user) {
    return <LoginPage />;
  }

  if (loading) {
    return (
      <div className="App loading">
        <div className="loading-spinner">
          <div className="spinner-ring"></div>
          <p>Loading your journal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-content">
           <div className="header-main">
          <h1>🌟 My Sentiment Journal</h1>
          <p>Track your thoughts, understand your emotions</p>
        </div>
        
        <div className="user-info">
          <span style={{ color: '#4a5568', marginRight: '10px' }}>
            Welcome, {user.displayName || user.email}!
          </span>
            <button onClick={handleSignOut} className="sign-out-btn">
              Sign Out
            </button>
        </div>
      </div>
      </header>
        <div className="stats-dashboard">
          <div className="stat-card">
            <div className="stat-number">{stats.total}</div>
            <div className="stat-label">Total Entries</div>
          </div>
          <div className="stat-card positive">
            <div className="stat-number">{stats.positive}</div>
            <div className="stat-label">😊 Positive</div>
          </div>
          <div className="stat-card negative">
            <div className="stat-number">{stats.negative}</div>
            <div className="stat-label">😔 Negative</div>
          </div>
          <div className="stat-card neutral">
            <div className="stat-number">{stats.neutral}</div>
            <div className="stat-label">😐 Neutral</div>
          </div>
        </div>
      
      <main>
        <JournalForm onAddEntry={handleAddEntry} aiResult={aiResult} />
        <EntryList entries={entries} />
      </main>
    </div>
  );
}

export default App;