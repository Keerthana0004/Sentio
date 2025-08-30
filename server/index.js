// index.js
const express = require('express');
const cors = require('cors');
const { initializeApp } = require("firebase/app");
const { getFirestore, collection, addDoc, getDocs } = require("firebase/firestore");
const Sentiment = require('sentiment'); // <-- Import the sentiment library

// ... (your existing app setup and firebaseConfig)
const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

const firebaseConfig = {
  apiKey: "AIzaSyBtMmGAfRgRXOT1EmXCvIYXO2xyuJ4xkT8",
  authDomain: "sentio-111f9.firebaseapp.com",
  projectId: "sentio-111f9",
  storageBucket: "sentio-111f9.firebasestorage.app",
  messagingSenderId: "377301961137",
  appId: "1:377301961137:web:7dec086723d7cc7cb3d590",
  measurementId: "G-P418F1GY7S"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);


// This is our endpoint for adding a new journal entry
app.post('/add-entry', async (req, res) => {
  try {
    // Step 1: Get the text from the request that the user submitted.
    // The frontend will send this as { "text": "Some journal entry" }
    const { text, userId } = req.body;
    if (!text || !userId) {
      return res.status(400).json({ error: 'Text and userId are required.' });
    }

    // Step 2: Create a new instance of the sentiment analyzer.
    const sentiment = new Sentiment();

    // Step 3: Run the analysis on the received text.
    const result = sentiment.analyze(text);
    // The 'result' object will look something like this:
    // { score: 2, comparative: 0.5, words: ['good', 'day'], ... }
    // We only need the 'score'.

    // Step 4: Create a complete data object to save in the database.
    const newEntry = {
      text: text,                // The original journal entry
      score: result.score,       // The calculated sentiment score
      timestamp: new Date()      // The current date and time
    };

    // Step 5: Save the new document to our 'entries' collection in Firestore.
    const userEntriesCollection = collection(db, 'users', userId, 'entries');
const docRef = await addDoc(userEntriesCollection, newEntry);
    // Step 6: Send a success response back to the frontend.
    res.status(201).json({ message: 'Entry added successfully!', id: docRef.id });

  } catch (error) {
    // If anything goes wrong, log the error and send a server error response.
    console.error("Error adding document: ", error);
    res.status(500).json({ error: 'Failed to add entry' });
  }
});


// 📖 GET /entries
app.get('/entries/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
        return res.status(400).json({ error: 'User ID is required.' });
    }
    const userEntriesCollection = collection(db, 'users', userId, 'entries');
    const q = query(userEntriesCollection);
    const querySnapshot = await getDocs(q);
    
    const entries = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    res.json(entries);
  } catch (error)
  {
    console.error("Error fetching documents: ", error);
    res.status(500).send('Error fetching entries');
  }
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});