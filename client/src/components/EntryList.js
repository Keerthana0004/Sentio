import React from 'react';

// This component is responsible for displaying the list of journal entries.
// It will eventually receive the list of entries as a prop from its parent component (App.js).
function EntryList() {

  // For Day 2, we use a hardcoded list of entries to build the layout.
  // This allows us to work on the UI without needing the backend to be fully connected.
  const sampleEntries = [
    { id: 1, text: 'Had a fantastic day today, learned so much about React!', date: '2025-08-30' },
    { id: 2, text: 'Felt a bit tired, the server setup was challenging but I pushed through.', date: '2025-08-29' },
    { id: 3, text: 'Just a regular day, nothing special to report.', date: '2025-08-28' },
  ];

  return (
    <div className="entry-list-container">
      <h2>My Journal</h2>
      <div className="entries">
        {/* We use the .map() method to iterate over the sample entries and create a JSX element for each one. */}
        {sampleEntries.map((entry) => (
          // The 'key' prop is crucial for React to efficiently update the list.
          <div key={entry.id} className="entry-item">
            <p className="entry-text">{entry.text}</p>
            <small className="entry-date">{new Date(entry.date).toDateString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EntryList;
