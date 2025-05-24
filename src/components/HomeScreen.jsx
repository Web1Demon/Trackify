import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Toast from "./Toast";
import { Moon, Sun } from "lucide-react";

// product pagination
const PRODUCTS_PER_PAGE = 6;

const HomeScreen = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const loadProducts = async () => {
      const res = await fetch("https://fakestoreapi.com/products");
      const data = await res.json();
      setProducts(data);
    };

    const localCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(localCart);
    loadProducts();
  }, []);

  const toggleTheme = () => setDarkMode(!darkMode);

  const filteredProducts = products.filter((product) =>
        product.title.toLowerCase().includes(search.toLowerCase())
    );

    const paginatedProducts = filteredProducts.slice(
        (page - 1) * PRODUCTS_PER_PAGE,
        page * PRODUCTS_PER_PAGE
    );

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddToCart = (product) => {
    let currentCart = [...cart];
    const existing = currentCart.find((item) => item.id === product.id);

    if (existing) {
      currentCart = currentCart.filter((item) => item.id !== product.id);
      showToast(`${product.title} removed from cart ❌`, "error");
    } else {
      currentCart.push({ ...product, quantity: 1 });
      showToast(`${product.title} added to cart ✅`, "success");
    }

    setCart(currentCart);
    localStorage.setItem("cart", JSON.stringify(currentCart));
  };

  const isInCart = (productId) => cart.some((item) => item.id === productId);

  return (
    <div className={`min-h-screen ${darkMode ? "bg-indigo-900 text-white" : "bg-gray-50 text-gray-800"} flex flex-col`}>
      {/* Navbar */}
      <nav className="flex justify-between items-center p-5">
        <h1 className="text-2xl font-bold">📦 Trackify</h1>
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search products..."
            className={`rounded px-3 py-1 text-black border ${darkMode ? "text-white" : "text-black"}`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button onClick={toggleTheme}>
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <Link to="/track">Track</Link>
          <Link to="/cart">Cart ({cart.length})</Link>
        </div>
      </nav>

      {/* Banner */}
      <section className="text-center py-14 bg-indigo-950 text-white md:h-[600px]">
        <h2 className="text-5xl font-extrabold mb-4 mt-[10%]"> Fast, Reliable Deliveries</h2>
        <p className="text-lg text-indigo-300 mb-6">Seamless logistics management for your hustle and side gigs.</p>
        <Link to="/cart" className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition">
          See Your Cart
        </Link>
      </section>

      {/* Or replace with a banner image */}
      {/* <img src="/your-banner-image.jpg" className="w-full object-cover h-72" alt="Banner" /> */}

      {/* Product List */}
      <section className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 bg-indigo-950">
        {paginatedProducts.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`rounded-lg overflow-hidden shadow-md flex flex-col ${darkMode ? "bg-white" : "bg-white"}`}
          >
            <img src={product.image} alt={product.title} className="h-48 object-contain mb-4" />
            <div className="p-4 flex flex-col flex-1">
              <h3 className="text-lg font-semibold mb-1">{product.title}</h3>
              <p className="text-sm text-gray-500 flex-1">{product.description.substring(0, 80)}...</p>
              <div className="mt-4">
                <p className="font-bold text-indigo-600 mb-2">${product.price}</p>
                <button
                  onClick={() => handleAddToCart(product)}
                  className={`w-full py-2 rounded text-white transition ${
                    isInCart(product.id)
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
                >
                  {isInCart(product.id) ? "Remove from Cart" : "Add to Cart"}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Pagination */}
      <div className="flex justify-center gap-2 pb-8">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 rounded ${
              page === i + 1
                ? "bg-indigo-700 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* User Commentary */}
      <section className="bg-indigo-100 py-10 mt-[5%]">
        <h3 className="text-3xl font-bold text-center mb-8">💬 What Our Users Say</h3>
        <div className="flex flex-col md:flex-row gap-6 max-w-5xl mx-auto">
          <div className="bg-white p-5 rounded-lg shadow text-gray-800">
            <p className="mb-3">“Super smooth delivery tracking, and the cart works like a charm! 🔥”</p>
            <span className="font-bold">— Tolu, Lagos</span>
          </div>
          <div className="bg-white p-5 rounded-lg shadow text-gray-800">
            <p className="mb-3">“I love how simple and clean the UI is. Ordering my gadgets just got easier.”</p>
            <span className="font-bold">— Ada, Owerri</span>
          </div>
          <div className="bg-white p-5 rounded-lg shadow text-gray-800">
            <p className="mb-3">“Trackify’s progress updates are 🔥. Definitely a vibe.”</p>
            <span className="font-bold">— Kingsley, Abuja</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className=" text-indigo-300 text-sm text-center py-4">
        &copy; {new Date().getFullYear()} Trackify Logistics. Made with ❤️ for Naija hustlers & worldwide shippers.
      </footer>

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default HomeScreen;
