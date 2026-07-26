import { useEffect, useState } from "react";
import axios from "axios";

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Card from "../components/Card";
import Footer from "../components/Footer";
import { Loader, showToast } from "../components/ui";

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tone, setTone] = useState("");

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);

    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/api/products"
      );

      setProducts(res.data);
    } catch (error) {
      showToast("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setTone("");
    setEditingId(null);
  };

  const saveProduct = async () => {
    if (!name.trim() || !description.trim() || !tone.trim()) {
      showToast("Please fill all fields");
      return;
    }

    setSaving(true);

    const wasEditing = !!editingId;

    try {
      if (wasEditing) {
        await axios.put(
          `http://127.0.0.1:8000/api/products/${editingId}`,
          {
            name,
            description,
            tone,
          }
        );
      } else {
        await axios.post(
          "http://127.0.0.1:8000/api/products",
          {
            name,
            description,
            tone,
          }
        );
      }

      resetForm();

      await fetchProducts();

      showToast(
        wasEditing
          ? "Product updated successfully!"
          : "Product created successfully!"
      );
    } catch (error) {
      showToast("Operation failed!");
    } finally {
      setSaving(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/products/${id}`
      );

      await fetchProducts();

      showToast("Product deleted successfully!");
    } catch (error) {
      showToast("Delete failed!");
    }
  };

  const editProduct = (product) => {
    setEditingId(product.id);
    setName(product.name);
    setDescription(product.description);
    setTone(product.tone);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-black dark:bg-gray-950 dark:text-white transition-colors duration-300">

      <Navbar />

      <Hero />

      <main className="flex-grow">

        <section className="max-w-6xl mx-auto px-6 py-12">

          <h2 className="text-3xl font-bold text-center mb-10">
            Products from Backend
          </h2>

          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 mb-8">

            <h3 className="text-xl font-bold mb-4">
              Product Management
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              <input
                type="text"
                placeholder="Product Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border rounded p-2 text-black"
              />

              <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border rounded p-2 text-black"
              />

              <input
                type="text"
                placeholder="Tone"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="border rounded p-2 text-black"
              />

            </div>

            <button
              disabled={saving}
              onClick={saveProduct}
              className={`mt-4 px-6 py-2 rounded text-white ${
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

          </div>

          {loading ? (
            <Loader />
          ) : products.length === 0 ? (

            <div className="text-center py-10">

              <h2 className="text-2xl font-bold">
                No products yet
              </h2>

              <p className="text-gray-500 mt-2">
                Create your first product.
              </p>

            </div>

          ) : (

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

              {products.map((product) => (

                <div key={product.id}>

                  <Card
                    title={product.name}
                    description={product.description}
                  />

                  <div className="flex gap-2 mt-3">

                    <button
                      onClick={() => editProduct(product)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                    >
                      Update
                    </button>

                    <button
                      onClick={() => deleteProduct(product.id)}
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

      </main>

      <Footer />

    </div>
  );
}

export default Home;