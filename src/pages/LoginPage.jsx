import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (error) {
      setErr(error.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <img
          src="public/1.png" 
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
          Don’t have an account? <a href="/signup">Sign up</a>
        </p>
        <ThemeToggle />
      </div>
    </div>
  );
}
