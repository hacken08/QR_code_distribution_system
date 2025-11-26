
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { addDoc, collection, Firestore, getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyD-_W2HDcOjy4KsOdcQt5o8f0bEU5Hpfk4",
  authDomain: "qr-dsitribuation-system.firebaseapp.com",
  projectId: "qr-dsitribuation-system",
  storageBucket: "qr-dsitribuation-system.firebasestorage.app",
  messagingSenderId: "880847960184",
  appId: "1:880847960184:web:f1858da4963207691a958d",
  measurementId: "G-M3BBQ6T39J"
};


async function getDbInstance(): Promise<Firestore> {
  // Initialize Firebase / Firestore
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app)
  return db
}

export { getDbInstance }
