import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
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

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Dashboard.css";

export default function ProgressPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [logs, setLogs] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const fetchLogs = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const logsSnap = await getDoc(doc(db, "users", user.uid, "dashboard", "logs"));
        if (logsSnap.exists()) {
          const dates = logsSnap.data().dates || [];
          setLogs(dates);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch logs");
      }
    };
    fetchLogs();
  }, []);

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthlyData = monthNames.map((month, idx) => ({
    month,
    Logs: logs.filter(date => new Date(date).getMonth() === idx).length
  }));

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
            {collapsed ? <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
              : darkMode ? <> <FontAwesomeIcon icon={faSun} /> Light</>
                : <> <FontAwesomeIcon icon={faMoon} /> Dark</>}
          </button>
          <button onClick={handleLogout}>
            <FontAwesomeIcon icon={faRightFromBracket} /> {!collapsed && "Logout"}
          </button>
        </div>
      </div>

      <div className="main">
        <h1>Monthly Progress</h1>
        <section className="card" style={{ minHeight: 350 }}>
          <h2>Logs per Month</h2>
          {monthlyData.reduce((sum, d) => sum + d.Logs, 0) === 0 ? (
            <p>No logs yet!</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={monthlyData}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip
                  formatter={(value) => [value, "Logs"]}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Legend verticalAlign="top" height={36} />
                <Bar dataKey="Logs" fill={darkMode ? "#4facfe" : "#007bff"} name="Logs" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </section>
      </div>
    </div>
  );
}
