import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAW1YwlcNOiznK7xfh1sq4k2jZq_7yfHEE",
  authDomain: "llmstxt-2.firebaseapp.com",
  projectId: "llmstxt-2",
  storageBucket: "llmstxt-2.firebasestorage.app",
  messagingSenderId: "890894878940",
  appId: "1:890894878940:web:605cd97a73bc4a6a3ecc19"
};

import { getAuth } from 'firebase/auth';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
