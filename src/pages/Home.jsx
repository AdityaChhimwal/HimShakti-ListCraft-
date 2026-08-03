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
  `${import.meta.env.VITE_API_URL}/api/products`
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
  `${import.meta.env.VITE_API_URL}/api/products/${editingId}`,
          {
            name,
            description,
            tone,
          }
        );
      } else {
         await axios.post(
  `${import.meta.env.VITE_API_URL}/api/products`,
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
  `${import.meta.env.VITE_API_URL}/api/products/${id}`
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
           Featured Products
          </h2>

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