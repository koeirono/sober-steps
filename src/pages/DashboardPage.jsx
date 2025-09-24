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
  faBell,
  faCalendarCheck,
  faAngleLeft,
  faAngleRight,
  faPen,
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
  const [editingNoteId, setEditingNoteId] = useState(null);
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
        (new Date(sorted[i - 1]) - new Date(sorted[i])) / (1000 * 60 * 60 * 24);
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
      if (editingNoteId) {
        const updatedNote = {
          text: notes,
          date: new Date().toISOString().slice(0, 10),
        };
        await setDoc(
          doc(db, "users", user.uid, "notes", editingNoteId),
          updatedNote
        );
        setAllNotes((prev) =>
          prev.map((n) =>
            n.id === editingNoteId ? { id: editingNoteId, ...updatedNote } : n
          )
        );
        toast.success("Note updated!");
        setEditingNoteId(null);
      } else {
        const newNote = {
          text: notes,
          date: new Date().toISOString().slice(0, 10),
        };
        const docRef = await addDoc(
          collection(db, "users", user.uid, "notes"),
          newNote
        );
        setAllNotes((prev) => [{ id: docRef.id, ...newNote }, ...prev]);
        toast.success("Note saved!");
      }
      setNotes("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save note");
    }
  };

  const deleteNote = async (id) => {
    const user = auth.currentUser;
    if (!user) return;

    toast.warn(
      ({ closeToast }) => (
        <div>
          <p>Are you sure you want to delete this note?</p>
          <div className="flex gap-2 mt-2">
            <button
              className="bg-red-500 text-white px-2 py-1 rounded"
              onClick={async () => {
                await deleteDoc(doc(db, "users", user.uid, "notes", id));
                setAllNotes((prev) => prev.filter((note) => note.id !== id));
                toast.success("Note deleted!");
                closeToast();
              }}
            >
              Yes
            </button>
            <button
              className="bg-gray-300 px-2 py-1 rounded"
              onClick={closeToast}
            >
              No
            </button>
          </div>
        </div>
      ),
      { autoClose: false }
    );
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

    const addictionName = newCustom.trim();
    const updatedCustom = [...customAddictions, addictionName];
    setCustomAddictions(updatedCustom);

    const updatedAdd = {
      ...addictions,
      [addictionName]: true,
      customList: updatedCustom,
    };

    setAddictions(updatedAdd);
    setNewCustom("");

    await setDoc(
      doc(db, "users", user.uid, "dashboard", "addictions"),
      updatedAdd
    );
    toast.success("Custom addiction added!");
  };

  const deleteCustomAddiction = async (index) => {
    const user = auth.currentUser;
    if (!user) return;

    const addictionName = customAddictions[index];

    toast.warn(
      ({ closeToast }) => (
        <div>
          <p>
            Delete <b>{addictionName}</b>? This cannot be undone.
          </p>
          <div className="flex gap-2 mt-2">
            <button
              className="bg-red-500 text-white px-2 py-1 rounded"
              onClick={async () => {
                const updatedCustom = [...customAddictions];
                updatedCustom.splice(index, 1);

                const updatedAdd = { ...addictions };
                delete updatedAdd[addictionName];
                updatedAdd.customList = updatedCustom;

                setCustomAddictions(updatedCustom);
                setAddictions(updatedAdd);

                await setDoc(
                  doc(db, "users", user.uid, "dashboard", "addictions"),
                  updatedAdd
                );

                toast.success(`${addictionName} deleted!`);
                closeToast();
              }}
            >
              Yes
            </button>
            <button
              className="bg-gray-300 px-2 py-1 rounded"
              onClick={closeToast}
            >
              No
            </button>
          </div>
        </div>
      ),
      { autoClose: false }
    );
  };

  const resetAddictions = async () => {
    const user = auth.currentUser;
    if (!user) return;

    toast.warn(
      ({ closeToast }) => (
        <div>
          <p>
            Are you sure you want to reset all addictions? <br />
            This cannot be undone.
          </p>
          <div className="flex gap-2 mt-2">
            <button
              className="bg-red-500 text-white px-2 py-1 rounded"
              onClick={async () => {
                setAddictions({});
                setCustomAddictions([]);
                await setDoc(
                  doc(db, "users", user.uid, "dashboard", "addictions"),
                  {}
                );
                toast.success("All addictions have been reset!");
                closeToast();
              }}
            >
              Yes
            </button>
            <button
              className="bg-gray-300 px-2 py-1 rounded"
              onClick={closeToast}
            >
              No
            </button>
          </div>
        </div>
      ),
      { autoClose: false }
    );
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

    const selected = Object.keys(addictions).filter(
      (k) => addictions[k] && k !== "customList"
    );
    if (selected.length === 0) {
      return toast.warning(
        "Please select at least one addiction before logging."
      );
    }

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

    toast.warn(
      ({ closeToast }) => (
        <div>
          <p>
            Are you sure you want to reset all logs? <br />
            There is no shame in starting over. Keep coming back!
          </p>
          <div className="flex gap-2 mt-2">
            <button
              className="bg-red-500 text-white px-2 py-1 rounded"
              onClick={async () => {
                setLogDates([]);
                setStreak(0);
                await setDoc(doc(db, "users", user.uid, "dashboard", "logs"), {
                  dates: [],
                });
                toast.success("All logs have been reset!");
                closeToast();
              }}
            >
              Yes
            </button>
            <button
              className="bg-gray-300 px-2 py-1 rounded"
              onClick={closeToast}
            >
              No
            </button>
          </div>
        </div>
      ),
      { autoClose: false }
    );
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

  useEffect(() => {
    const checkReminder = () => {
      const now = new Date();
      const today = getLocalDate();
      const hoursEAT = (now.getUTCHours() + 3) % 24;

      if ((hoursEAT === 8 || hoursEAT === 20) && !logDates.includes(today)) {
        toast.info(
          <div>
            <FontAwesomeIcon icon={faBell} /> Don’t forget to log your progress
            today!
          </div>
        );
      }
    };

    const today = getLocalDate();
    if (!logDates.includes(today)) {
      toast.info(
        <div>
          <FontAwesomeIcon icon={faCalendarCheck} /> Welcome back! Don’t forget
          to log your progress today.
        </div>
      );
    }

    const interval = setInterval(checkReminder, 1000 * 60);
    return () => clearInterval(interval);
  }, [logDates]);

  return (
    <div className={`dashboard ${darkMode ? "dark" : "light"}`}>
      <ToastContainer position="top-right" autoClose={3000} />

      <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        <div className="sidebar-top">
          {!collapsed && (
            <img src="/1.png" alt="SoberSteps Logo" className="logo-img" />
          )}
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
          <h2>
            <FontAwesomeIcon icon={faExclamationTriangle} className="icon" />{" "}
            Select an addiction
          </h2>

          <button onClick={() => toggleAddiction("Other")}>
            <FontAwesomeIcon icon={faPlus} /> {!collapsed && " Add Addiction"}
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

            {customAddictions.map((a, i) => (
              <label key={i} className="addiction-item">
                <input
                  type="checkbox"
                  checked={addictions[a] || false}
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

          {addictions.Other && (
            <div className="custom-addiction">
              <input
                type="text"
                placeholder="Enter custom addiction"
                value={newCustom}
                onChange={(e) => setNewCustom(e.target.value)}
              />
              <button onClick={addCustomAddiction} disabled={!newCustom.trim()}>
                <FontAwesomeIcon icon={faPlus} /> Add
              </button>
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

        <section className="card">
          <h2>Streak</h2>
          <p>{streak} days</p>
          <button onClick={logToday}>Log Today</button>
          <button className="delete" onClick={resetLogs}>
            Reset Logs
          </button>
          <Calendar
            tileClassName={({ date }) => {
              const localDate = date.toLocaleDateString("en-CA");
              return logDates.includes(localDate) ? "logged-day" : "";
            }}
          />
        </section>

        <section className="card">
          <h2>Journal</h2>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Write your thoughts..."
          />
          <div className="note-actions">
            <button onClick={saveNote}>
              {editingNoteId ? "Update Note" : "Save Note"}
            </button>
            {editingNoteId && (
              <button
                className="cancel-btn"
                onClick={() => {
                  setEditingNoteId(null);
                  setNotes("");
                }}
              >
                Cancel
              </button>
            )}
          </div>

          <div className="notes-container">
            {allNotes.length === 0 ? (
              <p className="no-notes">
                No notes yet. Start journaling your journey 
              </p>
            ) : (
              allNotes.map((n) => (
                <div key={n.id} className="note-card">
                  <div className="note-header">
                    <small className="note-date">{n.date}</small>
                    <div className="note-buttons">
                      <button
                        className="edit-btn"
                        onClick={() => {
                          setNotes(n.text);
                          setEditingNoteId(n.id);
                        }}
                      >
                        <FontAwesomeIcon icon={faPen} /> Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => deleteNote(n.id)}
                      >
                        <FontAwesomeIcon icon={faTrash} /> Delete
                      </button>
                    </div>
                  </div>
                  <p className="note-text">{n.text}</p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      <Chatbot />
    </div>
  );
}
