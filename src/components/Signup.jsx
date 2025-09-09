import React, { useState } from "react";
import { signUp } from "../services/authService";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signUp(email, password);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Sign Up</h2>
      <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="email" />
      <input value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="password" type="password" />
      <button type="submit">Create account</button>
    </form>
  );
}