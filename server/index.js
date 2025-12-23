require('dotenv').config();
const express = require('express');
const cors = require('cors');
const admin = require('./firebase-admin'); // Import our admin setup
const Sentiment = require('sentiment'); // Re-importing sentiment
const { getAdvice } = require('./services/getAdvice');
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
        // 1. Authenticate (Security first)
        const idToken = req.headers.authorization?.split('Bearer ')[1];
        
        const decodedToken = await admin.auth().verifyIdToken(idToken);

        const { text } = req.body;
        
        // 2. Delegate AI task to the Service (Modularity)
        
        let aiAnalysis;
        try {
            console.log("🤖 Calling Gemini AI...");
            aiAnalysis = await getAdvice(text);
            console.log("✅ AI Analysis received");
            } catch (aiError) {
            console.error("⚠️ AI Analysis failed, but will save entry anyway:", aiError.message);
            aiAnalysis = { mood: "Neutral", empathy_message: "Saved successfully.", suggestion: "Continue reflecting.", score: 0 };
            
          }

        // 3. Save to Database
        const entryData = {
            userId: decodedToken.uid,
            text: text,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            mood: aiAnalysis.mood,
            suggestion: aiAnalysis.suggestion,
            empathy_message: aiAnalysis.empathy_message,
            score: aiAnalysis.score
            
        };
       const docRef =  await db.collection('users').doc(decodedToken.uid).collection('entries').add(entryData);
        console.log("✅ Firestore Success! Doc ID:", docRef.id);
        // 4. Send response back to Frontend
        res.status(201).json({ ...aiAnalysis, id: docRef.id });
    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ error: "Processing failed" });
    }
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log("Checking Environment: ", process.env.GEMINI_API_KEY ? "✅ Key Found" : "❌ Key Missing");
});