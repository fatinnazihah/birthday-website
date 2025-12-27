import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAJR5Y5gQZBjHPLJAxP-1e8sj-QV_XCmP8",
  authDomain: "birthdaywebsite-d3915.firebaseapp.com",
  projectId: "birthdaywebsite-d3915",
  storageBucket: "birthdaywebsite-d3915.firebasestorage.app",
  messagingSenderId: "822077107222",
  appId: "1:822077107222:web:0b2269e618892a90615937"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
