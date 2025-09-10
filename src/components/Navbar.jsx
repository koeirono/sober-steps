import { Link } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="text-2xl font-bold text-blue-500">
            MyApp
          </Link>

          <div className="hidden md:flex space-x-6">
            <Link to="/signup" className="text-gray-700 hover:text-blue-500">Sign Up</Link>
            <Link to="/login" className="text-gray-700 hover:text-blue-500">Login</Link>
            <Link to="/dashboard" className="text-gray-700 hover:text-blue-500">Dashboard</Link>
            <Link to="/admin" className="text-gray-700 hover:text-blue-500">Admin</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
