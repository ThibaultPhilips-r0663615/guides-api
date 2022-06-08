import admin from 'firebase-admin'
import firebaseAdminCredentials from '../../firebaseServiceAccountKey.json'

admin.initializeApp({
    credential: admin.credential.cert(firebaseAdminCredentials)
});

const db = admin.firestore();

export { admin, db };