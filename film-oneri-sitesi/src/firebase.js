import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAe49PNtqxMwUXKpR2gujFb69xghRjzaBY",
  authDomain: "film-oneri-sistemi.firebaseapp.com",
  projectId: "film-oneri-sistemi",
  storageBucket: "film-oneri-sistemi.firebasestorage.app",
  messagingSenderId: "706211640825",
  appId: "1:706211640825:web:17c7ccffa3242a616b3928",
  measurementId: "G-LMXJJ49M3C"
};

// Firebase'i başlat
const app = initializeApp(firebaseConfig);

// Auth ve Firestore servislerini al
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;