import { Link } from "react-router-dom";

export default function Homepage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-center p-6">
      <h1 className="text-4xl font-bold mb-4 dark:text-white">Welcome to SoberSteps</h1>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 max-w-xl">
        Track your recovery journey, build healthier habits, and celebrate your progress.
      </p>
      <div className="flex gap-4">
        <Link
          to="/signup"
          className="px-6 py-3 rounded-lg bg-black text-white dark:bg-white dark:text-black font-medium"
        >
          Get Started
        </Link>
        <Link
          to="/login"
          className="px-6 py-3 rounded-lg bg-gray-200 dark:bg-gray-700 dark:text-white font-medium"
        >
          Log In
        </Link>
      </div>
    </div>
  );
}
