import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Loader, showToast } from "../components/ui";

function Dashboard() {
  const navigate = useNavigate();

  // Authentication
  const [user, setUser] = useState(null);

  // AI Generator
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [tone, setTone] = useState("Friendly");

  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  // Product Management
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);

  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productTone, setProductTone] = useState("Friendly");

  const API_URL = import.meta.env.VITE_API_URL;

  // --------------------------------
  // Authentication
  // --------------------------------
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get(`${API_URL}/api/profile`, {
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
  }, [navigate, API_URL]);

  // --------------------------------
  // Fetch Products
  // --------------------------------
  const fetchProducts = async () => {
    try {
      setProductsLoading(true);

      const response = await axios.get(
        `${API_URL}/api/products`
      );

      setProducts(response.data);
    } catch (error) {
      console.error(error);
      showToast("Failed to load products");
    } finally {
      setProductsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // --------------------------------
  // Reset Product Form
  // --------------------------------
  const resetProductForm = () => {
    setEditingId(null);
    setName("");
    setProductDescription("");
    setProductTone("Friendly");
  };

  // --------------------------------
  // Create / Update Product
  // --------------------------------
  const saveProduct = async () => {
    if (
      !name.trim() ||
      !productDescription.trim() ||
      !productTone.trim()
    ) {
      showToast("Please fill all product fields");
      return;
    }

    try {
      setSaving(true);

      if (editingId) {
        await axios.put(
          `${API_URL}/api/products/${editingId}`,
          {
            name,
            description: productDescription,
            tone: productTone,
          }
        );

        showToast("Product updated successfully!");
      } else {
        await axios.post(
          `${API_URL}/api/products`,
          {
            name,
            description: productDescription,
            tone: productTone,
          }
        );

        showToast("Product created successfully!");
      }

      resetProductForm();
      await fetchProducts();
    } catch (error) {
      console.error(error);
      showToast(
        error.response?.data?.detail ||
          "Failed to save product"
      );
    } finally {
      setSaving(false);
    }
  };

  // --------------------------------
  // Edit Product
  // --------------------------------
  const editProduct = (product) => {
    setEditingId(product.id);
    setName(product.name);
    setProductDescription(product.description);
    setProductTone(product.tone || "Friendly");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // --------------------------------
  // Delete Product
  // --------------------------------
  const deleteProduct = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      await axios.delete(
        `${API_URL}/api/products/${id}`
      );

      showToast("Product deleted successfully!");
      await fetchProducts();
    } catch (error) {
      console.error(error);
      showToast(
        error.response?.data?.detail ||
          "Failed to delete product"
      );
    }
  };

  // --------------------------------
  // AI Description Generator
  // --------------------------------
  const generateDescription = async () => {
    if (!productName.trim() || !description.trim()) {
      showToast(
        "Please enter a product name and description"
      );
      return;
    }

    try {
      setLoading(true);
      setResult("");

      const response = await axios.post(
        `${API_URL}/api/ai/generate`,
        {
          product_name: productName,
          description,
          tone,
        }
      );

      setResult(response.data.generated_text);

      showToast("AI description generated!");
    } catch (err) {
      console.error(err);

      showToast(
        err.response?.data?.detail ||
          "Failed to generate description."
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------
  // Render
  // --------------------------------
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950 text-black dark:text-white">

      <Navbar />

      <main className="flex-grow max-w-6xl mx-auto w-full px-6 py-10">

        {/* User Information */}
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 mb-8">

          <h2 className="text-2xl font-bold">
            Welcome Back!
          </h2>

          {user && (
            <>
              <p className="mt-2">
                <strong>Email:</strong>{" "}
                {user?.user?.sub || "User"}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                Authenticated ✅
              </p>
            </>
          )}

        </div>

        {/* Product Management */}
        <section className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 mb-10">

          <div className="flex justify-between items-center mb-5">

            <div>
              <h2 className="text-2xl font-bold">
                Product Management
              </h2>

              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Create and manage your product listings.
              </p>
            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <input
              type="text"
              placeholder="Product Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border rounded p-3 text-black"
            />

            <input
              type="text"
              placeholder="Product Description"
              value={productDescription}
              onChange={(e) =>
                setProductDescription(e.target.value)
              }
              className="border rounded p-3 text-black"
            />

            <select
              value={productTone}
              onChange={(e) =>
                setProductTone(e.target.value)
              }
              className="border rounded p-3 text-black"
            >
              <option>Friendly</option>
              <option>Professional</option>
              <option>Luxury</option>
              <option>Traditional</option>
            </select>

          </div>

          <div className="flex flex-wrap gap-3 mt-4">

            <button
              onClick={saveProduct}
              disabled={saving}
              className={`px-6 py-3 rounded text-white ${
                saving
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-green-700 hover:bg-green-800"
              }`}
            >
              {saving
                ? "Saving..."
                : editingId
                ? "Save Changes"
                : "Create Product"}
            </button>

            {editingId && (
              <button
                onClick={resetProductForm}
                className="px-6 py-3 rounded border border-gray-400"
              >
                Cancel
              </button>
            )}

          </div>

        </section>

        {/* Product Listing */}
        <section className="mb-10">

          <h2 className="text-3xl font-bold mb-6">
            My Products
          </h2>

          {productsLoading ? (
            <Loader />
          ) : products.length === 0 ? (

            <div className="border rounded-lg p-8 text-center">
              <h3 className="text-xl font-bold">
                No products yet
              </h3>

              <p className="text-gray-500 mt-2">
                Create your first product above.
              </p>
            </div>

          ) : (

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {products.map((product) => (

                <div
                  key={product.id}
                  className="border rounded-lg p-6 shadow-sm bg-white dark:bg-gray-900"
                >

                  <h3 className="text-xl font-bold">
                    {product.name}
                  </h3>

                  <p className="mt-3 text-gray-600 dark:text-gray-300">
                    {product.description}
                  </p>

                  <p className="mt-3 text-sm">
                    <strong>Tone:</strong>{" "}
                    {product.tone}
                  </p>

                  <div className="flex gap-3 mt-5">

                    <button
                      onClick={() =>
                        editProduct(product)
                      }
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                    >
                      Update
                    </button>

                    <button
                      onClick={() =>
                        deleteProduct(product.id)
                      }
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                    >
                      Delete
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>

        {/* AI Generator */}
        <section className="border-t pt-10">

          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            AI Description Generator
          </h1>

          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Generate compelling marketing descriptions
            using AI.
          </p>

          <input
            className="border p-3 w-full mb-4 rounded text-black"
            placeholder="Product Name"
            value={productName}
            onChange={(e) =>
              setProductName(e.target.value)
            }
          />

          <textarea
            className="border p-3 w-full mb-4 rounded text-black"
            rows="5"
            placeholder="Product Description"
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
          />

          <select
            className="border p-3 w-full mb-4 rounded text-black"
            value={tone}
            onChange={(e) =>
              setTone(e.target.value)
            }
          >
            <option>Friendly</option>
            <option>Professional</option>
            <option>Luxury</option>
            <option>Traditional</option>
          </select>

          <button
            onClick={generateDescription}
            disabled={loading}
            className={`px-6 py-3 rounded text-white ${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading
              ? "Generating..."
              : "Generate with AI"}
          </button>

          {loading && (
            <div className="mt-6">
              <Loader />
            </div>
          )}

          {result && (
            <div className="mt-8 border rounded-lg p-6">

              <h2 className="text-xl font-bold mb-3">
                AI Generated Description
              </h2>

              <textarea
                className="border p-3 w-full rounded text-black"
                rows="8"
                value={result}
                readOnly
              />

              <button
                onClick={() => {
                  setName(productName);
                  setProductDescription(result);
                  setProductTone(tone);
                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  });
                  showToast(
                    "AI description copied to Product Management"
                  );
                }}
                className="mt-4 bg-green-700 hover:bg-green-800 text-white px-5 py-2 rounded"
              >
                Use as Product Description
              </button>

            </div>
          )}

        </section>

      </main>

      <Footer />

    </div>
  );
}

export default Dashboard;