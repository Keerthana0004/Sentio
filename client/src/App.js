import React, { useState, useEffect } from 'react';
import "./App.css";
// COMPONENT: JournalForm
// Renders the textarea and button to add a new journal entry.
function JournalForm({ onAddEntry }) {
  const [entryText, setEntryText] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!entryText.trim()) return; // Don't submit empty entries
    
    // Call the function passed down from the App component
    onAddEntry(entryText); 
    
    setEntryText(''); // Clear the textarea after submission
  };

  return (
    <div className="journal-form-container">
      <h2>New Journal Entry</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          rows="5"
          placeholder="What's on your mind?"
          value={entryText}
          onChange={(e) => setEntryText(e.target.value)}
        />
        <button type="submit">Add Entry</button>
      </form>
    </div>
  );
}

// COMPONENT: EntryList
// Renders the list of past journal entries.
// It now receives the list of entries as a prop.
function EntryList({ entries }) {
  // Helper function to format the timestamp from Firestore
  const formatDate = (timestamp) => {
    if (timestamp && timestamp.seconds) {
      // Convert Firestore timestamp (seconds) to a JavaScript Date object
      return new Date(timestamp.seconds * 1000).toDateString();
    }
    return 'No date';
  };

  const getSentimentEmoji = (score) => {
    if (score > 0) return '😊'; // Positive
    if (score < 0) return '😠'; // Negative
    return '😐'; // Neutral
  };

  const sortedEntries = [...entries].sort((a, b) => {
    const dateA = a.timestamp ? a.timestamp.seconds : 0;
    const dateB = b.timestamp ? b.timestamp.seconds : 0;
    return dateB - dateA;
  });


  return (
    <div className="entry-list-container">
      <h2>My Journal</h2>
      <div className="entries">
        {/* We now map over the 'entries' prop passed down from App */}
        {entries.map((entry) => (
          <div key={entry.id} className="entry-item">
            <p className="entry-text">{entry.text}</p>
            <small className="entry-date">{formatDate(entry.timestamp)}</small>
            <div className="sentiment-display">
                    <span className="sentiment-emoji">{getSentimentEmoji(entry.score)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


// MAIN APP COMPONENT
function App() {
  // State to hold the list of journal entries fetched from the server.
  const [entries, setEntries] = useState([]);

  const fetchEntries = async () => {
    try {
      const response = await fetch('http://localhost:3001/entries');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setEntries(data);
    } catch (error) {
      console.error('Failed to fetch entries:', error);
    }
  };
  // useEffect hook to fetch data when the component loads.
  // The empty array [] as the second argument means this effect runs only once.
  useEffect(() => {
    fetchEntries(); // Call the function to execute the fetch operation.
  }, []);

  const handleAddEntry = async (entryText) => {
    try {
      // Make a POST request to our backend's /add-entry endpoint
      const response = await fetch('http://localhost:3001/add-entry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Tell the server we're sending JSON
        },
        body: JSON.stringify({ text: entryText }), // Convert our data to a JSON string
      });

      if (!response.ok) {
        throw new Error('Failed to add entry');
      }

      // After successfully adding the entry, re-fetch all entries to update the list
      fetchEntries();

    } catch (error) {
      console.error('Error adding entry:', error);
    }
  };
  
  return (
    <div className="App">
      
      <header className="App-header">
        <h1>My Sentiment Journal</h1>
        <p>A simple place to track your thoughts and feelings.</p>
      </header>
      <main>
        <JournalForm onAddEntry={handleAddEntry} />
        {/* Pass the entries from our state down to the EntryList component */}
        <EntryList entries={entries} />
      </main>
    </div>
  );
}

export default App;