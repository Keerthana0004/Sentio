import React, { useState, useEffect } from 'react';

// COMPONENT: JournalForm
// Renders the textarea and button to add a new journal entry.
function JournalForm() {
  const [entryText, setEntryText] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('New Entry Submitted:', entryText);
    // In the next step, we will send this data to the backend.
    setEntryText('');
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

  return (
    <div className="entry-list-container">
      <h2>My Journal</h2>
      <div className="entries">
        {/* We now map over the 'entries' prop passed down from App */}
        {entries.map((entry) => (
          <div key={entry.id} className="entry-item">
            <p className="entry-text">{entry.text}</p>
            <small className="entry-date">{formatDate(entry.timestamp)}</small>
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

  // useEffect hook to fetch data when the component loads.
  // The empty array [] as the second argument means this effect runs only once.
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        // Make a GET request to our backend's /entries endpoint.
        const response = await fetch('http://localhost:3001/entries');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setEntries(data); // Update the state with the fetched entries.
      } catch (error) {
        console.error('Failed to fetch entries:', error);
      }
    };

    fetchEntries(); // Call the function to execute the fetch operation.
  }, []);

  // Inline styles to avoid import issues with the build environment.
  const styles = `
  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #f4f7f6;
    color: #333;
  }
  
  .App {
    max-width: 700px;
    margin: 40px auto;
    padding: 20px 30px;
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  }
  
  .App-header {
    text-align: center;
    border-bottom: 1px solid #eee;
    padding-bottom: 20px;
    margin-bottom: 30px;
  }
  
  .App-header h1 {
    margin: 0;
    color: #2c3e50;
  }
  
  .App-header p {
    color: #7f8c8d;
    font-size: 0.9rem;
  }
  
  .journal-form-container h2, .entry-list-container h2 {
    font-size: 1.2rem;
    color: #34495e;
  }
  
  .journal-form-container textarea {
    width: 100%;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
    font-size: 1rem;
    margin-bottom: 10px;
    box-sizing: border-box;
    resize: vertical;
  }
  
  .journal-form-container button {
    display: block;
    width: 100%;
    padding: 10px;
    border: none;
    background-color: #3498db;
    color: white;
    border-radius: 5px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .journal-form-container button:hover {
    background-color: #2980b9;
  }
  
  .entry-list-container {
    margin-top: 40px;
  }
  
  .entry-list-container h2 {
    margin-top: 0;
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
  }
  
  .entry-item {
    background-color: #fdfdfd;
    border: 1px solid #eee;
    border-radius: 5px;
    padding: 15px;
    margin-bottom: 10px;
  }
  
  .entry-text {
    margin: 0 0 10px 0;
  }
  
  .entry-date {
    font-size: 0.8rem;
    color: #95a5a6;
  }
  `;

  return (
    <div className="App">
      <style>{styles}</style>
      
      <header className="App-header">
        <h1>My Sentiment Journal</h1>
        <p>A simple place to track your thoughts and feelings.</p>
      </header>
      <main>
        <JournalForm />
        {/* Pass the entries from our state down to the EntryList component */}
        <EntryList entries={entries} />
      </main>
    </div>
  );
}

export default App;