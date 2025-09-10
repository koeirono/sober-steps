import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          SoberSteps
        </h1>
        <div className="space-x-4">
          <Link to="/login" className="text-gray-700 dark:text-gray-200">
            Login
          </Link>
          <Link
            to="/signup"
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="text-center py-20 px-6">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 dark:text-white">
          Your Journey to Sobriety, One Step at a Time
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Track your progress, build healthy habits, and stay accountable.
          Whether you’re on day 1 or day 1000, SoberSteps is here for you.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/signup"
            className="px-6 py-3 bg-black text-white rounded-lg text-lg"
          >
            Get Started
          </Link>
          <a
            href="#features"
            className="px-6 py-3 bg-gray-200 dark:bg-gray-700 rounded-lg text-lg dark:text-gray-200"
          >
            Learn More
          </a>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-white dark:bg-gray-900">
        <h3 className="text-3xl font-semibold text-center mb-12 dark:text-white">
          Why Choose SoberSteps?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto px-6">
          {[
            {
              title: "Daily Tracking",
              desc: "Log moods, cravings, and triggers with ease.",
            },
            {
              title: "Stay Motivated",
              desc: "Keep your streaks and celebrate milestones.",
            },
            {
              title: "Habit Builder",
              desc: "Develop positive routines that support recovery.",
            },
          ].map((f, i) => (
            <div
              key={i}
              className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-md text-center"
            >
              <h4 className="text-xl font-semibold mb-3 dark:text-white">
                {f.title}
              </h4>
              <p className="text-gray-600 dark:text-gray-300">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="text-center py-20 px-6 bg-gray-100 dark:bg-gray-800">
        <h3 className="text-3xl font-bold mb-6 dark:text-white">
          Start your first streak today!
        </h3>
        <Link
          to="/signup"
          className="px-6 py-3 bg-black text-white rounded-lg text-lg"
        >
          Get Started
        </Link>
      </section>
    </div>
  );
}
