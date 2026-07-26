import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function About() {
  return (
    <div className="min-h-screen flex flex-col">

      <Navbar />

      <main className="flex-grow max-w-4xl mx-auto px-6 py-12">

        <h1 className="text-4xl font-bold mb-6">

          About HimShakti ListCraft

        </h1>

        <p className="text-gray-600">

          HimShakti ListCraft helps Himalayan MSMEs create compelling,
          AI-powered product descriptions optimized for e-commerce platforms.

        </p>

      </main>

      <Footer />

    </div>
  );
}

export default About;