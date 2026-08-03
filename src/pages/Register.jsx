import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Register() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const register = async () => {
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        {
          email,
          password,
        }
      );

      alert("Registration successful! Please login.");

      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.detail || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">

      <Navbar />

      <main className="flex-grow max-w-xl mx-auto w-full px-6 py-12">

        <h1 className="text-4xl font-bold mb-8">
          Register
        </h1>

        <input
          className="border p-3 w-full mb-4"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="border p-3 w-full mb-4"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={register}
          disabled={loading}
          className="bg-green-700 text-white px-6 py-3 rounded w-full"
        >
          {loading ? "Creating Account..." : "Register"}
        </button>

        <p className="mt-6 text-center">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-semibold"
          >
            Login
          </Link>
        </p>

      </main>

      <Footer />

    </div>
  );
}

export default Register;