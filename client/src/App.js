import React, { useState } from 'react';
import './App.css';
// STYLES: Normally in App.css, but included here to resolve the import error.

// COMPONENT: JournalForm
// This was in components/JournalForm.js
function JournalForm() {
  const [entryText, setEntryText] = useState('');
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('New Entry Submitted:', entryText);
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
// This was in components/EntryList.js
function EntryList() {
  const sampleEntries = [
    { id: 1, text: 'Had a fantastic day today, learned so much about React!', date: '2025-08-30' },
    { id: 2, text: 'Felt a bit tired, the server setup was challenging but I pushed through.', date: '2025-08-29' },
    { id: 3, text: 'Just a regular day, nothing special to report.', date: '2025-08-28' },
  ];

  return (
    <div className="entry-list-container">
      <h2>My Journal</h2>
      <div className="entries">
        {sampleEntries.map((entry) => (
          <div key={entry.id} className="entry-item">
            <p className="entry-text">{entry.text}</p>
            <small className="entry-date">{new Date(entry.date).toDateString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
}


// MAIN APP COMPONENT
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>My Sentiment Journal</h1>
        <p>A simple place to track your thoughts and feelings.</p>
      </header>
      <main>
        <JournalForm />
        <EntryList />
      </main>
    </div>
  );
}

export default App;

