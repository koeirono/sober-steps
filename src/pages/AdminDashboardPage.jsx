import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMoon,
  faSun,
  faHome,
  faUsers,
  faNoteSticky,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Dashboard.css";

export default function AdminDashboardPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [users, setUsers] = useState([]);
  const [notes, setNotes] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [editingNote, setEditingNote] = useState(null);
  const [editValue, setEditValue] = useState("");

  // Fetch users and notes
  useEffect(() => {
    const fetchUsersAndNotes = async () => {
      try {
        const userSnap = await getDocs(collection(db, "users"));
        const usersData = userSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersData);

        let allNotes = [];
        for (let userDoc of userSnap.docs) {
          const userId = userDoc.id;
          const userName = userDoc.data().displayName || userDoc.data().email;

          const notesSnap = await getDocs(
            collection(db, "users", userId, "notes")
          );
          const notesData = notesSnap.docs.map((doc) => ({
            id: doc.id,
            userId,
            userName,
            ...doc.data(),
          }));

          allNotes = [...allNotes, ...notesData];
        }

        setNotes(allNotes);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch users or notes");
      }
    };

    fetchUsersAndNotes();
  }, []);

  // Delete Note
  const handleDeleteNote = async (noteId, userId) => {
    try {
      await deleteDoc(doc(db, "users", userId, "notes", noteId));
      setNotes(notes.filter((n) => n.id !== noteId));
      toast.success("Note deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete note");
    }
  };

  // Save Edited User
  const handleSaveUser = async (id) => {
    try {
      await updateDoc(doc(db, "users", id), { displayName: editValue });
      setUsers(
        users.map((u) => (u.id === id ? { ...u, displayName: editValue } : u))
      );
      setEditingUser(null);
      setEditValue("");
      toast.success("User updated");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update user");
    }
  };

  // Save Edited Note
  const handleSaveNote = async (noteId, userId) => {
    try {
      await updateDoc(doc(db, "users", userId, "notes", noteId), {
        text: editValue,
      });
      setNotes(
        notes.map((n) => (n.id === noteId ? { ...n, text: editValue } : n))
      );
      setEditingNote(null);
      setEditValue("");
      toast.success("Note updated");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update note");
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      await auth.signOut();
      toast.success("Logged out!");
      window.location.href = "/login";
    } catch (err) {
      console.error(err);
      toast.error("Logout error");
    }
  };

  return (
    <div className={`dashboard ${darkMode ? "dark" : "light"}`}>
      <ToastContainer position="top-right" autoClose={3000} />

      <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        <div className="sidebar-top">
          {!collapsed && <h2 className="logo">Admin</h2>}
          <button onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? "▶" : "◀"}
          </button>
        </div>


        <div className="sidebar-bottom">
          <button onClick={() => setDarkMode(!darkMode)}>
            <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />{" "}
            {!collapsed && (darkMode ? "Light" : "Dark")}
          </button>
          <button onClick={handleLogout}>
            <FontAwesomeIcon icon={faRightFromBracket} /> {!collapsed && "Logout"}
          </button>
        </div>
      </div>

      <div className="main">
        <h1>All Users</h1>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  {editingUser === user.id ? (
                    <input
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                    />
                  ) : (
                    user.displayName || "N/A"
                  )}
                </td>
                <td>{user.email}</td>
                <td>
                  {editingUser === user.id ? (
                    <button onClick={() => handleSaveUser(user.id)}>💾 Save</button>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingUser(user.id);
                        setEditValue(user.displayName || "");
                      }}
                    >
                       Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h1>All Notes</h1>
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Note</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {notes.map((note) => (
              <tr key={note.id}>
                <td>{note.userName}</td>
                <td>
                  {editingNote === note.id ? (
                    <input
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                    />
                  ) : (
                    note.text
                  )}
                </td>
                <td>
                  {editingNote === note.id ? (
                    <button onClick={() => handleSaveNote(note.id, note.userId)}>
                       Save
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingNote(note.id);
                        setEditValue(note.text || "");
                      }}
                    >
                       Edit
                    </button>
                  )}
                   
                  <button onClick={() => handleDeleteNote(note.id, note.userId)}>
                     Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
