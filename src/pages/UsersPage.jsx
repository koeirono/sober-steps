import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userSnap = await getDocs(collection(db, "users"));
        const usersData = userSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersData);
      } catch (err) {
        toast.error("Failed to fetch users");
        console.error(err);
      }
    };
    fetchUsers();
  }, []);

  const handleSaveUser = async (id) => {
    try {
      await updateDoc(doc(db, "users", id), { username: editValue });
      setUsers(
        users.map(u => u.id === id ? { ...u, username: editValue } : u)
      );
      setEditingUser(null);
      setEditValue("");
      toast.success("User updated");
    } catch (err) {
      toast.error("Failed to update user");
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <ToastContainer position="top-right" autoClose={3000} />
      <h1>All Users</h1>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", padding: "0.5rem" }}>Username</th>
            <th style={{ textAlign: "left", padding: "0.5rem" }}>Email</th>
            <th style={{ textAlign: "left", padding: "0.5rem" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} style={{ borderBottom: "1px solid #ccc" }}>
              <td style={{ padding: "0.5rem" }}>
                {editingUser === user.id
                  ? <input 
                      value={editValue} 
                      onChange={e => setEditValue(e.target.value)} 
                      style={{ padding: "0.4rem", width: "90%" }}
                    />
                  : (user.username || "N/A")}
              </td>
              <td style={{ padding: "0.5rem" }}>{user.email}</td>
              <td style={{ padding: "0.5rem" }}>
                {editingUser === user.id
                  ? <button onClick={() => handleSaveUser(user.id)}>💾 Save</button>
                  : <button onClick={() => { 
                      setEditingUser(user.id); 
                      setEditValue(user.username || ""); 
                    }}>Edit</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
