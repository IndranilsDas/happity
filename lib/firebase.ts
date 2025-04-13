// Import the functions you need from the SDKs you need
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { getAuth } from "firebase/auth"
import { initializeApp } from "firebase/app";
import { getAnalytics , isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAtl-T1cQoAumLDgZ7icqLPW-JpLL9wDBY",
  authDomain: "happity-techverden.firebaseapp.com",
  projectId: "happity-techverden",
  storageBucket: "happity-techverden.firebasestorage.app",
  messagingSenderId: "631726209126",
  appId: "1:631726209126:web:f6c7d530b687ffd6e015a7",
  measurementId: "G-4JVB3TH0YL"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export let analytics: ReturnType<typeof getAnalytics> | null = null
export const auth = getAuth(app)

if (typeof window !== "undefined") {
  isSupported().then((yes) => {
    if (yes) {
      analytics = getAnalytics(app)
    }
  })
}
export const db = getFirestore(app)
export const storage = getStorage(app)
