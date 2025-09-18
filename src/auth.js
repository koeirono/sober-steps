import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./firebase"; // Make sure firebase is set up

// Sign up a new user
export async function signUp(email, password, displayName = "") {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await setDoc(doc(db, "users", cred.user.uid), {
    email,
    displayName,
    role: "user",
    createdAt: serverTimestamp(),
  });
  return cred.user;
}

// Sign in existing user
export async function signIn(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

// Logout user
export async function logOut() {
  return signOut(auth);
}
