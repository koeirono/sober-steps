import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import Homepage from "./pages/Homepage";
import ProgressPage from "./pages/ProgressPage";
import SettingsPage from "./pages/SettingsPage";

import AdminDashboardPage from "./pages/AdminDashboardPage";
import UsersPage from "./pages/UsersPage";
import NotesPage from "./pages/NotesPage";

import Navbar from "./components/Navbar";
import { auth } from "./firebase";

export default function App() {
  const handleLogout = async () => {
    try {
      await auth.signOut();
      window.location.href = "/login"; 
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/progress"
            element={
              <ProtectedRoute>
                <ProgressPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/*"
            element={
              <ProtectedRoute roleRequired="admin">
                <AdminDashboardPage handleLogout={handleLogout} />
              </ProtectedRoute>
            }
          >
            <Route path="users" element={<UsersPage />} />
            <Route path="notes" element={<NotesPage />} />
          </Route>

          <Route path="*" element={<Homepage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
