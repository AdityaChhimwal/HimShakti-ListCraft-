import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );
  const navigate = useNavigate();

const token = localStorage.getItem("token");

const logout = () => {
  localStorage.removeItem("token");
  navigate("/login");
};

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <nav className="bg-green-700 dark:bg-gray-900 text-white shadow-md transition-colors duration-300">

      <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col md:flex-row md:justify-between md:items-center gap-4">

        <h1 className="text-2xl font-bold">
          HimShakti ListCraft
        </h1>

        <div className="flex flex-wrap gap-6 items-center">

          <Link to="/" className="hover:text-orange-200">
            Home
          </Link>

          <Link to="/about" className="hover:text-orange-200">
            About
          </Link>

          <Link to="/dashboard" className="hover:text-orange-200">
            Dashboard
          </Link>

         {token ? (
  <button
    onClick={logout}
    className="hover:text-orange-200"
  >
    Logout
  </button>
) : (
  <Link
    to="/login"
    className="hover:text-orange-200"
  >
    Login
  </Link>
)}

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="border rounded px-3 py-1 hover:bg-white hover:text-black transition"
          >
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>

        </div>

      </div>

    </nav>
  );
}

export default Navbar;