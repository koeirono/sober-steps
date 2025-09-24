import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const usersSnap = await getDocs(collection(db, "users"));
        let allNotes = [];
        for (let userDoc of usersSnap.docs) {
          const userId = userDoc.id;
          const userName = userDoc.data().displayName || userDoc.data().email;
          const notesSnap = await getDocs(collection(db, "users", userId, "notes"));
          const notesData = notesSnap.docs.map(doc => ({
            id: doc.id,
            userId,
            userName,
            ...doc.data()
          }));
          allNotes = [...allNotes, ...notesData];
        }
        setNotes(allNotes);
      } catch {
        toast.error("Failed to fetch notes");
      }
    };
    fetchNotes();
  }, []);

  const handleSaveNote = async (noteId, userId) => {
    try {
      await updateDoc(doc(db, "users", userId, "notes", noteId), { text: editValue });
      setNotes(notes.map(n => n.id === noteId ? { ...n, text: editValue } : n));
      setEditingNote(null);
      setEditValue("");
      toast.success("Note updated");
    } catch {
      toast.error("Failed to update note");
    }
  };

  const handleDeleteNote = async (noteId, userId) => {
    try {
      await deleteDoc(doc(db, "users", userId, "notes", noteId));
      setNotes(notes.filter(n => n.id !== noteId));
      toast.success("Note deleted");
    } catch {
      toast.error("Failed to delete note");
    }
  };

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />
      <h1>All Notes</h1>
      <table>
        <thead>
          <tr><th>User</th><th>Note</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {notes.map(note => (
            <tr key={note.id}>
              <td>{note.userName}</td>
              <td>
                {editingNote === note.id
                  ? <input value={editValue} onChange={e => setEditValue(e.target.value)} />
                  : note.text}
              </td>
              <td>
                {editingNote === note.id
                  ? <button onClick={() => handleSaveNote(note.id, note.userId)}>Save</button>
                  : <button onClick={() => { setEditingNote(note.id); setEditValue(note.text || ""); }}>Edit</button>}
                  &nbsp;&nbsp;
                <button onClick={() => handleDeleteNote(note.id, note.userId)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
