import { useState, useEffect } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDark, setIsDark] = useState(document.body.classList.contains("dark"));
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErr("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", cred.user.uid), {
        fullName,
        username,
        email,
        role: "user",
        createdAt: new Date(),
      });
      navigate("/dashboard");
    } catch (error) {
      setErr(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="auth-container flex items-center justify-center min-h-screen px-4">
      <div className="auth-card bg-white p-6 rounded-lg shadow-lg flex flex-col gap-4 w-full max-w-md">
        <img
          src="public/1.png"
          alt="Logo"
          style={{ width: "130px", height: "130px", margin: "0"}}
        />

        <h2 className="text-2xl font-semibold text-center">Create Account</h2>
        <p className="text-center text-gray-600 mb-4">Fill the form to sign up</p>

        <form onSubmit={handleSignup} className="flex flex-col gap-3 w-full">
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          {err && <p className="text-red-500 text-sm">{err}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`bg-blue-500 text-white p-2 rounded w-full ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
              }`}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="switch-auth">
          Already have an account?{" "}
          <a href="/login" className="text-black hover:underline">
            Login
          </a>
        </p>

        <ThemeToggle />
      </div>
    </div>
  );
}
