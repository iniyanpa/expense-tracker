// Firebase Batch Import Script
// This script should be run in Node.js environment with Firebase Admin SDK

// Installation:
// npm install firebase-admin

const admin = require('firebase-admin');
const fs = require('fs');

// Initialize Firebase Admin
// You'll need to download your service account key from Firebase Console
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Read the JSON data
const transactions = JSON.parse(fs.readFileSync('./transactions_import.json', 'utf8'));

// Batch write to Firestore
async function importData() {
  const batch = db.batch();
  const chunkSize = 500; // Firestore batch limit is 500
  
  for (let i = 0; i < transactions.length; i += chunkSize) {
    const chunk = transactions.slice(i, i + chunkSize);
    
    chunk.forEach(transaction => {
      const docRef = db.collection('transactions').doc();
      batch.set(docRef, {
        ...transaction,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
    });
    
    await batch.commit();
    console.log(`Imported ${Math.min(i + chunkSize, transactions.length)} of ${transactions.length} transactions`);
  }
  
  console.log('Import complete!');
}

importData().catch(console.error);
