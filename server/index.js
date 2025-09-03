const express = require('express');
const cors = require('cors');
const admin = require('./firebase-admin'); // Import our admin setup
const Sentiment = require('sentiment'); // Re-importing sentiment
const app = express();
app.use(cors());
app.use(express.json());

const db = admin.firestore();

// Middleware to verify Firebase ID token from the frontend
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).send('Unauthorized: No token provided');
  }

  const idToken = authHeader.split('Bearer ')[1];
  try {
    // This securely decodes the token sent from the frontend
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken; // Add user info (like user.uid) to the request object
    next(); // If the token is valid, proceed to the actual endpoint logic
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(403).send('Unauthorized: Invalid token');
  }
};

// GET endpoint to fetch entries for the logged-in user
// We add 'verifyToken' to protect this route. The code inside only runs
// if the token is successfully verified by the middleware above.
app.get('/entries', verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid; // Get user ID from the verified token
    const entriesRef = db.collection('users').doc(userId).collection('entries');
    const snapshot = await entriesRef.get();
    
    const entries = [];
    snapshot.forEach(doc => {
      entries.push({ id: doc.id, ...doc.data() });
    });
    
    res.status(200).json(entries);
  } catch (error) {
    console.error("Error fetching entries:", error);
    res.status(500).send('Error fetching entries');
  }
});

// POST endpoint to add a new entry
// We also protect this route with our verifyToken middleware
app.post('/add-entry', verifyToken, async (req, res) => {
    try {
        const userId = req.user.uid;
        const { text } = req.body;

        if (!text) {
            return res.status(400).send('Entry text is required.');
        }

        // Run sentiment analysis on the server
        const sentiment = new Sentiment();
        const result = sentiment.analyze(text);

        const newEntry = {
            text: text,
            score: result.score, // Save the calculated score
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        };

        const docRef = await db.collection('users').doc(userId).collection('entries').add(newEntry);
        res.status(201).json({ message: 'Entry added successfully!', id: docRef.id });
    } catch (error) {
        console.error("Error adding entry:", error);
        res.status(500).send('Error adding entry');
    }
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});