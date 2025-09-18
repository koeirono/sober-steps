import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErr("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        setErr("User data not found");
        return;
      }

      const userData = userDocSnap.data();

      if (userData.isAdmin) {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }

    } catch (error) {
      setErr(error.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <img
          src="/1.png"
          alt="Logo"
          style={{ width: "150px", height: "150px", marginBottom: "10px" }}
        />
        <h2>Welcome Back</h2>
        <p className="subtitle">Log in to continue your journey</p>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {err && <p className="error">{err}</p>}
          <button type="submit">Login</button>
        </form>

        <p className="switch-auth">
          Don’t have an account? <a href="/signup">Sign up</a><br/>
          Learn more about us <a href="/">Home</a>
        </p>
        <ThemeToggle />
      </div>
    </div>
  );
}
