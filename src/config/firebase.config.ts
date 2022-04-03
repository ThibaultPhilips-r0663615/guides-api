module.exports = {
    firebaseConfig: {
        apiKey: `${process.env.FIREBASE_CONFIG_APIKEY}`,
        authDomain: `${process.env.FIREBASE_CONFIG_AUTH_DOMAIN}`,
        projectId: `${process.env.FIREBASE_CONFIG_PROJECT_ID}`,
        storageBucket: `${process.env.FIREBASE_CONFIG_STORAGE_BUCKET}`,
        messagingSenderId: `${process.env.FIREBASE_CONFIG_MESSAGING_SENDER_ID}`,
        appId: `${process.env.FIREBASE_CONFIG_APP_ID}`,
        measurementId: `${process.env.FIREBASE_CONFIG_MEASUREMENT_ID}`
    }
};