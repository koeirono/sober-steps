import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, getIdTokenResult } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

const AuthContext = createContext({ user: null, role: "guest", loading: true });

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("guest");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (!u) {
        setRole("guest");
        setLoading(false);
        return;
      }

      try {
        const idTokenResult = await getIdTokenResult(u);
        if (idTokenResult.claims?.admin === true) {
          setRole("admin");
        } else {
          const userDoc = await getDoc(doc(db, "users", u.uid));
          const r = userDoc.exists() ? (userDoc.data().role || "user") : "user";
          setRole(r);
        }
      } catch (err) {
        console.error("Auth role error:", err);
        setRole("user");
      } finally {
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);