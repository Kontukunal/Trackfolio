// src/firebase.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCxmpjJnBWDLDIsekqEOgFotkelh0pGQJI",
  authDomain: "trackfolio-3d06c.firebaseapp.com",
  projectId: "trackfolio-3d06c",
  storageBucket: "trackfolio-3d06c.firebasestorage.app",
  messagingSenderId: "31579905207",
  appId: "1:31579905207:web:c2889e891ea169467ac132",
  measurementId: "G-FJ5DT1DKQF",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export {
  auth,
  db,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
};
