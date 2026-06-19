// firebaseConfig.js

import { initializeApp } from "firebase/app";

import { initializeFirestore, persistentLocalCache } from "firebase/firestore";

import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

export const db = initializeFirestore(app, {
  localCache: persistentLocalCache(),
});

export const auth = getAuth(app);

// Only sign in anonymously if no user is already persisted
const unsubscribe = onAuthStateChanged(auth, (user) => {
  unsubscribe();
  if (!user) {
    signInAnonymously(auth).catch((error) => {
      console.error("❌ Error en login anónimo:", error);
    });
  }
});
