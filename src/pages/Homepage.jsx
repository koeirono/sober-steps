import { useState } from "react";
import "./Homepage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPerson,
  faShieldHalved,
  faClock,
  faBarsProgress,
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
            <a href="/login" className="login-btn">
              Login
            </a>
            <a href="/signup" className="signup-btn">
              Sign Up
            </a>
          </div>
        </div>

        <div className="call-btn"></div>
      </nav>

      <section className="hero" id="home">
        <div className="hero-overlay">
          <img src="buddha.jpg" alt="Background" />
        </div>
        <div className="hero-content">
          <h1>Sober Steps</h1>
          <p>Every small step counts <br /> Whether it’s overcoming addiction or building new habits, Sober Steps is here to guide, support, and celebrate every victory with you. <br /> Begin your journey now.</p>
          <a href="/signup" className="contact-btn">
            Sign Up
          </a>
        </div>
      </section>

      <section className="features" id="features">
        <h2>Our Features</h2>
        <div className="features-grid">
          <div className="features-card">
            <img src="" alt="feature" />
            <h3>Feature1</h3>
            <p>
              Fresh, high-quality wheat flour for businesses and individuals.
            </p>
          </div>

          <div className="features-card">
            <img src="" alt="feature" />
            <h3>Feature2</h3>
            <p>Fresh gram flour, perfect for cooking, baking, and snacks.</p>
          </div>

          <div className="features-card">
            <img src="" alt="feature" />
            <h3>feature</h3>
            <p>High-quality jowar flour for roti, bread, and other dishes.</p>
          </div>

          <div className="features-card">
            <img src="" alt="feature" />
            <h3>Chilli Pounding</h3>
            <p>Fresh chili powder using traditional pounding methods.</p>
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
            progress, stay motivated, and celebrate milestones. <br /> The app
            features daily progress tracking, reminders, motivational insights,
            and milestone celebrations, empowering users to visualize their
            journey and see how far they’ve come.
          </p>
          <img src="recovery.jpg" alt="About Us" />
        </div>
      </section>

      <section className="whyus" id="whyus">
        <h2>Why Us?</h2>
        <div className="whyus-grid">
          <div className="why-card">
            <FontAwesomeIcon icon={faPerson} size="4x" />
            <br />
            <br />
            <h3>Personalized Tracking</h3>
            <br />
            <p>
              Tailor your recovery journey to your specific needs and goals.
            </p>
          </div>
          <div className="why-card">
            <FontAwesomeIcon icon={faShieldHalved} size="4x" />
            <br />
            <br />
            <h3>Safe & Private</h3>
            <br />
            <p>
              Your progress and personal information are securely protected.
            </p>
          </div>
          <div className="why-card">
            <FontAwesomeIcon icon={faClock} size="4x" />
            <br />
            <br />
            <h3>Time-Efficient</h3>
            <br />
            <p>
              Quick and easy-to-use features ensure you spend more time focusing
              on recovery and less time navigating the app.
            </p>
          </div>
          <div className="why-card">
            <FontAwesomeIcon icon={faBarsProgress} size="4x" />
            <br />
            <br />
            <h3>Track Your Progress</h3>
            <br />
            <p>
              Visualize your milestones and achievements with intuitive daily
              tracking tools that make your progress tangible.
            </p>
          </div>
        </div>
      </section>

      <section className="gallery" id="gallery">
        <h2>Testimonials</h2>
        <div className="gallery-grid">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <img
              key={i}
              src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080"
              alt={`Gallery ${i}`}
            />
          ))}
        </div>
      </section>

      <footer className="footer">
        <p>Copyright 2024 &copy; All Rights Reserved</p>
        <ul>
          <li>
            <a href="#contactUs">Contact</a>
          </li>
          <li>
            <a href="/privacy">Privacy Policy</a>
          </li>
        </ul>
      </footer>
    </div>
  );
}
