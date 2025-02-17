const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();

exports.fixedFunction = functions.https.onCall(async (data, context) => {
  const userId = context.auth.uid; // Get user ID for security rules
  const docRef = db.collection('users').doc(userId);
  const doc = await docRef.get();
  if (!doc.exists) {
    throw new functions.https.HttpsError('not-found', 'User not found');
  }
  const userData = doc.data();
  // Now, userData is guaranteed to be defined before further processing
  const updatedData = { ...userData, lastUpdated: admin.firestore.FieldValue.serverTimestamp() };
  await docRef.update(updatedData);
  return { message: 'User data updated successfully' };
});