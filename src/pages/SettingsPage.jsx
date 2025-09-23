import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { updateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMoon,
  faSun,
  faHome,
  faChartBar,
  faGear,
  faRightFromBracket,
  faAngleLeft,
  faAngleRight,
} from "@fortawesome/free-solid-svg-icons";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Dashboard.css";

export default function SettingsPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [showProfileForm, setShowProfileForm] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const location = useLocation();

  useEffect(() => {
    if (auth.currentUser) {
      setDisplayName(auth.currentUser.displayName || "");
    }
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!displayName) return toast.error("Name cannot be empty");

    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName });
        await setDoc(doc(db, "users", auth.currentUser.uid), { displayName }, { merge: true });
        toast.success("Profile updated!");
        setShowProfileForm(false);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile. Check permissions.");
    }
  };

  const handleChangePassword = async () => {
    const user = auth.currentUser;
    if (!user) return toast.error("No user logged in");
    if (!currentPassword || !newPassword || !confirmPassword)
      return toast.error("All fields are required");
    if (newPassword !== confirmPassword) return toast.error("Passwords do not match");

    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      toast.success("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      toast.success("Logged out!");
      window.location.href = "/login";
    } catch (e) {
      console.error(e);
      toast.error("Logout error");
    }
  };

  return (
    <div className={`dashboard ${darkMode ? "dark" : "light"}`}>
      <ToastContainer position="top-right" autoClose={3000} />

      <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        <div className="sidebar-top">
                {!collapsed && <img
            src="/1.png"
            alt="SoberSteps Logo"
            className="logo-img"
          />}
          <button
            className="collapse-btn"
            onClick={() => setCollapsed(!collapsed)}
          >
            <FontAwesomeIcon icon={collapsed ? faAngleRight : faAngleLeft} />
          </button>
        </div>

        <div className="sidebar-content">
          <ul>
            <li className={location.pathname === "/dashboard" ? "active" : ""}>
              <Link to="/dashboard">
                <FontAwesomeIcon icon={faHome} />
                {!collapsed && <span>Dashboard</span>}
              </Link>
            </li>
            <li className={location.pathname === "/progress" ? "active" : ""}>
              <Link to="/progress">
                <FontAwesomeIcon icon={faChartBar} />
                {!collapsed && <span>Progress</span>}
              </Link>
            </li>
            <li className={location.pathname === "/settings" ? "active" : ""}>
              <Link to="/settings">
                <FontAwesomeIcon icon={faGear} />
                {!collapsed && <span>Settings</span>}
              </Link>
            </li>
          </ul>
        </div>

        <div className="sidebar-bottom">
          <button onClick={() => setDarkMode(!darkMode)}>
            {collapsed ? (
              <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
            ) : (
              darkMode ? <> <FontAwesomeIcon icon={faSun} /> Light</> : <> <FontAwesomeIcon icon={faMoon} /> Dark</>
            )}
          </button>
          <button onClick={handleLogout}>
            <FontAwesomeIcon icon={faRightFromBracket} /> {!collapsed && "Logout"}
          </button>
        </div>
      </div>

      <div className="main">
        <h1>Settings</h1>

        <section className="card">
          <h2>Profile</h2>
          <p>Update your account information.</p>
          {!showProfileForm ? (
            <>
              <p><strong>Name:</strong> {displayName || "Not set"}</p>
              <button onClick={() => setShowProfileForm(true)}>Edit Profile</button>
            </>
          ) : (
            <form onSubmit={handleProfileUpdate}>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter your name"
                required
              />
              <button type="submit">Save</button>
              <button type="button" onClick={() => setShowProfileForm(false)}>Cancel</button>
            </form>
          )}
        </section>

        <section className="card">
          <h2>Password</h2>
          <p>Change your account password.</p>
          <input
            type="password"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button onClick={handleChangePassword}>Change Password</button>
        </section>

        <section className="card">
          <h2>Preferences</h2>
          <p>Dark mode: {darkMode ? "Enabled" : "Disabled"}</p>
          <button onClick={() => setDarkMode(!darkMode)}>Toggle Dark Mode</button>
        </section>
      </div>
    </div>
  );
}
