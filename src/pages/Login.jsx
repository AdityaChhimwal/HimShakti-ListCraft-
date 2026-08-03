import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {

    try {

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          email,
          password
        }
      );

      localStorage.setItem(
        "token",
        res.data.access_token
      );

      navigate("/dashboard");

    } catch {

      alert("Invalid credentials");

    }

  };

  return (

    <div className="min-h-screen flex flex-col">

      <Navbar />

      <main className="flex-grow max-w-md mx-auto p-6">

        <h1 className="text-3xl font-bold mb-6">

          Login

        </h1>

        <input
          className="border p-3 w-full mb-4"
          placeholder="Email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />

        <input
          type="password"
          className="border p-3 w-full mb-4"
          placeholder="Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        />

        <button
          onClick={login}
          className="bg-green-700 text-white px-6 py-3 rounded w-full"
        >

          Login

        </button>
        <p className="mt-6 text-center">
  Don't have an account?{" "}
  <Link
    to="/register"
    className="text-blue-600 font-semibold hover:underline"
  >
    Create Account
  </Link>
</p>

      </main>

      <Footer />

    </div>

  );

}

export default Login;