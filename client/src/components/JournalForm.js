import React, { useState } from 'react';

// This component is responsible for rendering the form where users can write and submit new journal entries.
function JournalForm() {
  // 'entryText' is the state variable that will hold the text from the textarea.
  // 'setEntryText' is the function we use to update it.
  // We initialize it with an empty string.
  const [entryText, setEntryText] = useState('');

  // This function will be called when the form is submitted.
  const handleSubmit = (event) => {
    // Prevent the default form submission behavior which causes a page reload.
    event.preventDefault();
    
    // For now, we'll just log the entry text to the console.
    // In Day 4, we will send this data to our backend server.
    console.log('New Entry Submitted:', entryText);

    // Clear the textarea after submission
    setEntryText('');
  };

  return (
    <div className="journal-form-container">
      <h2>New Journal Entry</h2>
      {/* The onSubmit handler is attached to the form element itself. */}
      <form onSubmit={handleSubmit}>
        <textarea
          rows="5"
          placeholder="What's on your mind?"
          // The value of the textarea is tied directly to our state variable.
          value={entryText}
          // The onChange event fires every time the user types in the textarea.
          // e.target.value contains the current text, which we use to update our state.
          onChange={(e) => setEntryText(e.target.value)}
        />
        <button type="submit">Add Entry</button>
      </form>
    </div>
  );
}

export default JournalForm;
