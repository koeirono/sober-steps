import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyD_d1AIctNDbKf9_ZjyE0VIHR7sukupaiE",
  authDomain: "sober-steps-d81ef.firebaseapp.com",
  projectId: "sober-steps-d81ef",
  storageBucket: "sober-steps-d81ef.firebasestorage.app",
  messagingSenderId: "1000053424202",
  appId: "1:1000053424202:web:0ebd838b2883ffae0e66b3",
  measurementId: "G-RF2T7PRXHC"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app); 