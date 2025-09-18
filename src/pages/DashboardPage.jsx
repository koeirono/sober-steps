import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMoon,
  faSun,
  faHome,
  faChartBar,
  faGear,
  faRightFromBracket,
  faWineBottle,
  faSmoking,
  faCannabis,
  faPlus,
  faTrash,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import Chatbot from "../components/Chatbot";
import "./Dashboard.css";

export default function DashboardPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [userName, setUserName] = useState("");
  const [streak, setStreak] = useState(0);
  const [notes, setNotes] = useState("");
  const [allNotes, setAllNotes] = useState([]);
  const [addictions, setAddictions] = useState({});
  const [customAddictions, setCustomAddictions] = useState([]);
  const [newCustom, setNewCustom] = useState("");
  const [logDates, setLogDates] = useState([]);

  const location = useLocation();

 useEffect(() => {
  const fetchUserName = async () => {
    const user = auth.currentUser;
    if (!user) return;

    if (user.displayName) {
      setUserName(user.displayName);
    } else {
      const docSnap = await getDoc(doc(db, "users", user.uid));
      if (docSnap.exists()) {
        setUserName(docSnap.data().username || "");
      }
    }
  };

  fetchUserName();
}, []);


  const calculateStreak = (dates) => {
    if (!dates || dates.length === 0) return 0;
    const sorted = [...dates].sort((a, b) => new Date(b) - new Date(a));
    let streak = 1;
    for (let i = 1; i < sorted.length; i++) {
      const diff =
        (new Date(sorted[i - 1]) - new Date(sorted[i])) /
        (1000 * 60 * 60 * 24);
      if (diff === 1) streak++;
      else break;
    }
    return streak;
  };

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) return;
      try {
        const notesSnap = await getDocs(
          collection(db, "users", user.uid, "notes")
        );
        setAllNotes(notesSnap.docs.map((d) => ({ id: d.id, ...d.data() })));

        const addSnap = await getDoc(
          doc(db, "users", user.uid, "dashboard", "addictions")
        );
        if (addSnap.exists()) {
          const data = addSnap.data();
          setAddictions(data);
          if (data.customList) setCustomAddictions(data.customList);
        }

        const logsSnap = await getDoc(
          doc(db, "users", user.uid, "dashboard", "logs")
        );
        if (logsSnap.exists()) {
          const dates = logsSnap.data().dates || [];
          setLogDates(dates);
          setStreak(calculateStreak(dates));
        }
      } catch (err) {
        console.error("Fetch error:", err);
        toast.error("Failed to fetch data");
      }
    };
    fetchData();
  }, []);

  const saveNote = async () => {
    if (!notes.trim()) return;
    const user = auth.currentUser;
    if (!user) return;
    try {
      const newNote = {
        text: notes,
        date: new Date().toISOString().slice(0, 10),
      };
      const docRef = await addDoc(
        collection(db, "users", user.uid, "notes"),
        newNote
      );
      setAllNotes((prev) => [{ id: docRef.id, ...newNote }, ...prev]);
      setNotes("");
      toast.success("Note saved!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save note");
    }
  };

  const deleteNote = async (id) => {
    const user = auth.currentUser;
    if (!user) return;
    try {
      await deleteDoc(doc(db, "users", user.uid, "notes", id));
      setAllNotes((prev) => prev.filter((n) => n.id !== id));
      toast.info("Note deleted!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete note");
    }
  };

  const toggleAddiction = async (add) => {
    const user = auth.currentUser;
    if (!user) return;
    const updated = { ...addictions, [add]: !addictions[add] };
    setAddictions(updated);
    await setDoc(
      doc(db, "users", user.uid, "dashboard", "addictions"),
      updated
    );
  };

  const addCustomAddiction = async () => {
    if (!newCustom.trim()) return;
    const user = auth.currentUser;
    if (!user) return;
    const updatedCustom = [...customAddictions, newCustom];
    setCustomAddictions(updatedCustom);
    setNewCustom("");
    const updatedAdd = {
      ...addictions,
      Other: true,
      customList: updatedCustom,
    };
    setAddictions(updatedAdd);
    await setDoc(
      doc(db, "users", user.uid, "dashboard", "addictions"),
      updatedAdd
    );
    toast.success("Custom addiction added!");
  };

  const deleteCustomAddiction = async (index) => {
    const user = auth.currentUser;
    if (!user) return;
    const updatedCustom = [...customAddictions];
    updatedCustom.splice(index, 1);
    setCustomAddictions(updatedCustom);
    const updatedAdd = { ...addictions, customList: updatedCustom };
    setAddictions(updatedAdd);
    await setDoc(
      doc(db, "users", user.uid, "dashboard", "addictions"),
      updatedAdd
    );
    toast.info("Custom addiction deleted!");
  };

  const resetAddictions = async () => {
    const user = auth.currentUser;
    if (!user) return;
    setAddictions({});
    setCustomAddictions([]);
    await setDoc(doc(db, "users", user.uid, "dashboard", "addictions"), {});
    toast.info("Addictions reset!");
  };

  const getLocalDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const logToday = async () => {
    const user = auth.currentUser;
    if (!user) return;
    const today = getLocalDate();
    if (logDates.includes(today)) return toast.info("Already logged today");
    const updated = [...logDates, today];
    setLogDates(updated);
    setStreak(calculateStreak(updated));
    await setDoc(doc(db, "users", user.uid, "dashboard", "logs"), {
      dates: updated,
    });
    toast.success("Logged today!");
  };

  const resetLogs = async () => {
    const user = auth.currentUser;
    if (!user) return;
    setLogDates([]);
    setStreak(0);
    await setDoc(doc(db, "users", user.uid, "dashboard", "logs"), {
      dates: [],
    });
    toast.info("Logs reset!");
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

      {/* Sidebar */}
      <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        <div className="sidebar-top">
          {!collapsed && <h2 className="logo">SoberSteps</h2>}
          <button
            className="collapse-btn"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? "▶" : "◀"}
          </button>
        </div>

        <div className="sidebar-content">
          <ul>
            <li
              className={location.pathname === "/dashboard" ? "active" : ""}
            >
              <Link to="/dashboard">
                <FontAwesomeIcon icon={faHome} />
                {!collapsed && <span>Dashboard</span>}
              </Link>
            </li>
            <li
              className={location.pathname === "/progress" ? "active" : ""}
            >
              <Link to="/progress">
                <FontAwesomeIcon icon={faChartBar} />
                {!collapsed && <span>Progress</span>}
              </Link>
            </li>
            <li
              className={location.pathname === "/settings" ? "active" : ""}
            >
              <Link to="/settings">
                <FontAwesomeIcon icon={faGear} />
                {!collapsed && <span>Settings</span>}
              </Link>
            </li>
          </ul>
        </div>

        <div className="sidebar-bottom">
          <button onClick={() => setDarkMode(!darkMode)}>
            <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
            {!collapsed && (darkMode ? " Light" : " Dark")}
          </button>
          <button onClick={handleLogout}>
            <FontAwesomeIcon icon={faRightFromBracket} />
            {!collapsed && " Logout"}
          </button>
        </div>
      </div>

      <div className="main">
        <h1>Welcome, {userName}!</h1>

        <section className="card">
          <h2>Streak</h2>
          <p>{streak} days</p>
          <button onClick={logToday}>Log Today</button>
          <button className="delete" onClick={resetLogs}>
            Reset Logs
          </button>
          <Calendar
            tileClassName={({ date }) => {
              const iso = date.toISOString().slice(0, 10);

              if (logDates.includes(iso)) return "logged-day";

              if (logDates.length > 0) {
                const sorted = [...logDates].sort(
                  (a, b) => new Date(a) - new Date(b)
                );
                const lastLog = new Date(sorted[sorted.length - 1]);
                const nextDate = new Date(lastLog);
                nextDate.setDate(lastLog.getDate() + 1);
                if (iso === nextDate.toISOString().slice(0, 10)) {
                  return "next-day";
                }
              }

              return "";
            }}
          />
        </section>

        <section className="card">
          <h2>Notes</h2>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Write about your journey"
          />
          <button onClick={saveNote}>Save</button>
          <div className="previous-notes">
            {allNotes.length === 0 ? (
              <p>No notes</p>
            ) : (
              allNotes.map((note) => (
                <div key={note.id} className="note-card">
                  <small>{note.date}</small>
                  <p>{note.text}</p>
                  <button
                    className="delete"
                    onClick={() => deleteNote(note.id)}
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="card">
          <h2>
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              className="icon"
            />{" "}
            Addictions
          </h2>

          <button onClick={() => toggleAddiction("Other")}>
            <FontAwesomeIcon icon={faPlus} />{" "}
            {!collapsed && " Add Addiction"}
          </button>

          <div className="addiction-list">
            {[
              { name: "Alcohol", icon: faWineBottle },
              { name: "Nicotine", icon: faSmoking },
              { name: "Marijuana", icon: faCannabis },
            ].map((item) => (
              <label key={item.name} className="addiction-item">
                <input
                  type="checkbox"
                  checked={addictions[item.name] || false}
                  onChange={() => toggleAddiction(item.name)}
                />
                <FontAwesomeIcon icon={item.icon} className="icon" />
                <span>{item.name}</span>
              </label>
            ))}
          </div>

          {addictions.Other && (
            <div className="custom-addiction">
              <input
                type="text"
                placeholder="Enter custom addiction"
                value={newCustom}
                onChange={(e) => setNewCustom(e.target.value)}
              />
              <button
                onClick={addCustomAddiction}
                disabled={!newCustom.trim()}
              >
                <FontAwesomeIcon icon={faPlus} /> Add
              </button>
              <div className="addiction-list">
                {customAddictions.map((a, i) => (
                  <label key={i} className="addiction-item">
                    <input
                      type="checkbox"
                      checked={addictions[a] || true}
                      onChange={() => toggleAddiction(a)}
                    />
                    <span>{a}</span>
                    <button
                      className="delete"
                      onClick={() => deleteCustomAddiction(i)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </label>
                ))}
              </div>
            </div>
          )}

          <h4>Tracking</h4>
          <ul className="tracking-list">
            {Object.keys(addictions)
              .filter(
                (k) => addictions[k] && k !== "Other" && k !== "customList"
              )
              .map((a, i) => (
                <li key={i}>{a}</li>
              ))}
          </ul>

          <button className="delete" onClick={resetAddictions}>
            <FontAwesomeIcon icon={faTrash} /> Reset Addictions
          </button>
        </section>
      </div>

      <Chatbot />
    </div>
  );
}
