// src/firebase.js (updated)
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCxmpjJnBWDLDIsekqEOgFotkelh0pGQJI",
  authDomain: "trackfolio-3d06c.firebaseapp.com",
  projectId: "trackfolio-3d06c",
  storageBucket: "trackfolio-3d06c.appspot.com",
  messagingSenderId: "31579905207",
  appId: "1:31579905207:web:c2889e891ea169467ac132",
  measurementId: "G-FJ5DT1DKQF",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Helper function to initialize user data
const initUserData = async (userId) => {
  try {
    // Create user document with default portfolio
    await setDoc(doc(db, "users", userId), {
      createdAt: new Date(),
      lastLogin: new Date(),
      dashboardLayout: {
        widgets: ["portfolio", "performance", "allocation", "watchlist"],
        order: [0, 1, 2, 3],
      },
    });

    // Create assets subcollection
    await setDoc(
      doc(collection(db, "users", userId, "assets"), {
        placeholder: true, // Just to create the collection
      })
    );
  } catch (error) {
    console.error("Error initializing user data:", error);
  }
};

export {
  auth,
  db,
  initUserData,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
};
