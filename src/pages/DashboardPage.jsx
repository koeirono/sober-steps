import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

export default function DashboardPage() {
  const { user, role } = useAuth();

  return (
    <div>
      <h1>User Dashboard</h1>
      <p>Welcome, {user?.email}</p>
      <p>Your role: {role}</p>
      <button onClick={() => signOut(auth)}>Logout</button>
    </div>
  );
}
