import { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faNoteSticky,
  faMoon,
  faSun,
  faRightFromBracket,
  faAngleLeft,
  faAngleRight,
} from "@fortawesome/free-solid-svg-icons";

import "./Admin.css";

export default function AdminDashboardPage({ handleLogout }) {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const isBaseAdminRoute = location.pathname === "/admin";

  return (
    <div className={`admin-dashboard ${darkMode ? "dark" : ""}`}>
      <div className={`admin-sidebar ${collapsed ? "collapsed" : ""}`}>
        <div className="admin-sidebar-top">
          {!collapsed && (
            <img src="/sober.png" alt="SoberSteps Logo" className="admin-logo-img" />
          )}
          <button className="admin-collapse-btn" onClick={() => setCollapsed(!collapsed)}>
            <FontAwesomeIcon icon={collapsed ? faAngleRight : faAngleLeft} />
          </button>
        </div>

        <ul className="admin-sidebar-links">
          <li className={location.pathname === "/admin/users" ? "active" : ""}>
            <Link to="/admin/users">
              <FontAwesomeIcon icon={faUsers} />
              {!collapsed && <span>Users</span>}
            </Link>
          </li>
          <li className={location.pathname === "/admin/notes" ? "active" : ""}>
            <Link to="/admin/notes">
              <FontAwesomeIcon icon={faNoteSticky} />
              {!collapsed && <span>Notes</span>}
            </Link>
          </li>
        </ul>

        <div className="admin-sidebar-bottom">
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

      <main className="admin-main">
        {isBaseAdminRoute ? (
          <>
            <h1>Welcome, Admin</h1>
            <p>Select an option from the sidebar to manage users or notes.</p>
          </>
        ) : (
          <Outlet /> 
        )}
      </main>
    </div>
  );
}
