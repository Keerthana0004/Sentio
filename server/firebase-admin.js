const admin = require('firebase-admin');

// IMPORTANT: Make sure 'serviceAccountKey.json' is in your 'server' folder
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;