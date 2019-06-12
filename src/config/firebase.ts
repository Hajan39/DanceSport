import {
    APP_ID, FIREBASE_API_KEY, FIREBASE_AUTH_DOMAIN, FIREBASE_DATABASE_URL, FIREBASE_STORAGE_BUCKET,
    MESSAGING_SENDER_ID, PROJECT_ID
} from 'react-native-dotenv';

const firebaseConfig = Object.freeze({
    apiKey: FIREBASE_API_KEY as string || '',
    authDomain: FIREBASE_AUTH_DOMAIN as string || '',
    databaseURL: FIREBASE_DATABASE_URL as string || '',
    storageBucket: FIREBASE_STORAGE_BUCKET as string || '',
    projectId: PROJECT_ID as string || '',
    messagingSenderId: MESSAGING_SENDER_ID as string || '',
    appId: APP_ID as string || '',
})

export default firebaseConfig;