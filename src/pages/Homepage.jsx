import { useState } from "react";
import "./Homepage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPerson,
  faShieldHalved,
  faClock,
  faBarsProgress,
  faBell,
  faMedal,
  faHandsHelping,
  faChartLine,
} from "@fortawesome/free-solid-svg-icons";

export default function Homepage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div>
      <nav className="navbar">
        <div className="logo">
          <img
            src="/1.png"
            alt="Logo"
            style={{ width: "100px", height: "80px", margin: "0" }}
          />
        </div>

        <div className="hamburger">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {!menuOpen ? (
              <img
                src="https://img.icons8.com/fluent-systems-regular/2x/menu-squared-2.png"
                width="40"
                height="40"
                alt="menu"
              />
            ) : (
              <img
                src="https://img.icons8.com/fluent-systems-regular/2x/close-window.png"
                width="40"
                height="40"
                alt="close"
              />
            )}
          </button>
        </div>

        <div className={`menu ${menuOpen ? "open" : ""}`}>
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#aboutus">About</a>
          <a href="#whyus">Why Us</a>
          <a href="#gallery">Testimonials</a>
          <div className="auth-buttons">
            <a href="/login" className="login-btn">Login</a>
            <a href="/signup" className="signup-btn">Sign Up</a>
          </div>
        </div>
      </nav>

      <section className="hero" id="home">
        <div className="hero-overlay">
          <img src="buddha.jpg" alt="Background" />
        </div>
        <div className="hero-content">
          <h1>Sober Steps</h1>
          <p>
            Every small step counts <br />
            Whether it’s overcoming addiction or building new habits, Sober Steps is here to guide, support, and celebrate every victory with you.
            <br /> Begin your journey now.
          </p>
          <a href="/signup" className="contact-btn">Sign Up</a>
        </div>
      </section>

      <section className="features" id="features">
        <h2>Our Features</h2>
        <div className="features-grid">
          <div className="features-card">
            <FontAwesomeIcon icon={faBell} size="3x" />
            <h3>Daily Reminders</h3>
            <p>Stay consistent with gentle reminders to log progress and keep moving forward.</p>
          </div>

          <div className="features-card">
            <FontAwesomeIcon icon={faChartLine} size="3x" />
            <h3>Progress Dashboard</h3>
            <p>Visualize your journey with clear charts that track milestones and victories.</p>
          </div>

          <div className="features-card">
            <FontAwesomeIcon icon={faBarsProgress} size="3x" />
            <h3>Goal Setting</h3>
            <p>Set and track personal goals to stay motivated on your recovery journey.</p>
          </div>

          <div className="features-card">
            <FontAwesomeIcon icon={faShieldHalved} size="3x" />
            <h3>Safe & Private</h3>
            <p>Your progress and personal information are securely protected.</p>
          </div>
        </div>
      </section>

      <section className="aboutus" id="aboutus">
        <h2>About</h2>
        <div className="about-content">
          <p>
            SoberSteps is a comprehensive recovery tracking app designed to
            support individuals overcoming addictions and building healthier
            habits. Whether someone is recovering from alcohol, nicotine, or
            other behavioral addictions, SoberSteps provides tools to track
            progress, stay motivated, and celebrate milestones.
          </p>
          <img src="recovery.jpg" alt="About Us" />
        </div>
      </section>

      <section className="whyus" id="whyus">
        <h2>Why Us?</h2>
        <div className="whyus-grid">
          <div className="why-card">
            <FontAwesomeIcon icon={faPerson} size="4x" />
            <h3>Personalized Tracking</h3>
            <p>Tailor your recovery journey to your specific needs and goals.</p>
          </div>
          <div className="why-card">
            <FontAwesomeIcon icon={faShieldHalved} size="4x" />
            <h3>Safe & Private</h3>
            <p>Your progress and personal information are securely protected.</p>
          </div>
          <div className="why-card">
            <FontAwesomeIcon icon={faClock} size="4x" />
            <h3>Time-Efficient</h3>
            <p>Quick and easy-to-use features ensure you focus more on recovery.</p>
          </div>
          <div className="why-card">
            <FontAwesomeIcon icon={faBarsProgress} size="4x" />
            <h3>Track Your Progress</h3>
            <p>Visualize milestones with intuitive daily tracking tools.</p>
          </div>
        </div>
      </section>

<section className="gallery" id="gallery">
  <h2>Testimonials</h2>
  <div className="gallery-grid">
    <div className="testimonial-card">
      <img
        src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080"
        alt="James"
      />
      <p>"SoberSteps kept me motivated each day. I'm proud of how far I’ve come."</p>
      <strong>- James</strong>
    </div>
    <div className="testimonial-card">
      <img
        src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080"
        alt="Maria"
      />
      <p>"The reminders are gentle but powerful. They help me stay on track."</p>
      <strong>- Maria</strong>
    </div>
    <div className="testimonial-card">
      <img
        src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080"
        alt="Daniel"
      />
      <p>"Tracking my progress visually gave me the confidence to keep going."</p>
      <strong>- Daniel</strong>
    </div>
  </div>
</section>



      <footer className="footer">
        <p>Copyright 2025 &copy; All Rights Reserved</p>
        <ul>
        </ul>
      </footer>
    </div>
  );
}
