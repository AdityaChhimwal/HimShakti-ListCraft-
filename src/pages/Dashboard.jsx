
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Loader, showToast } from "../components/ui";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [tone, setTone] = useState("Friendly");

  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


useEffect(() => {
  const token = localStorage.getItem("token");

  if (!token) {
    navigate("/login");
    return;
  }

  axios
    .get(`${import.meta.env.VITE_API_URL}/api/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
.then((res) => {
  setUser(res.data);
})
    .catch(() => {
      localStorage.removeItem("token");
      navigate("/login");
    });
}, [navigate]);


  const generateDescription = async () => {
    try {
      setLoading(true);
      setResult("");

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/ai/generate`,
        {
          product_name: productName,
          description: description,
          tone: tone,
        }
      );

      setResult(response.data.generated_text);
    } catch (err) {
    console.log(err.response?.data);
   showToast(
  err.response?.data?.detail || "Failed to generate description."
);
} finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-4xl mx-auto px-6 py-12">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 mb-8">

  <h2 className="text-2xl font-bold">
    Welcome Back!
  </h2>

  {user && (
    <>
      <p className="mt-2">
        <strong>Email:</strong> {user?.user?.sub || "User"}
      </p>

      <p>
        <strong>Status:</strong> Authenticated ✅
      </p>
    </>
  )}

</div>

        <h1 className="text-4xl font-bold mb-8">
          AI Description Generator
        </h1>

        <input
          className="border p-3 w-full mb-4"
          placeholder="Product Name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />

        <textarea
          className="border p-3 w-full mb-4"
          rows="5"
          placeholder="Product Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <select
          className="border p-3 w-full mb-4"
          value={tone}
          onChange={(e) => setTone(e.target.value)}
        >
          <option>Friendly</option>
          <option>Professional</option>
          <option>Luxury</option>
          <option>Traditional</option>
        </select>

        <button
          onClick={generateDescription}
          className="bg-blue-600 text-white px-6 py-3 rounded"
        >
          Generate with AI
        </button>

      {loading && <Loader />}

        {result && (
          <div className="mt-8 border rounded p-4">
            <h2 className="font-bold mb-2">
              AI Output
            </h2>

            <textarea
  className="border p-3 w-full mt-4"
  rows="8"
  value={result}
  readOnly
/>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}

export default Dashboard;