import { useState, useEffect } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div className="toggler-wrapper" onClick={toggleTheme}>
      <span className="toggler-text">{theme === "light" ? "Light Mode" : "Dark Mode"}</span>
      <div className="toggler-container">
        <div className={`toggler-circle ${theme === "dark" ? "dark" : ""}`} />
      </div>
    </div>
  );
}
