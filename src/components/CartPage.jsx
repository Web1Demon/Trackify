import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Toast from "../components/Toast";

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [toast, setToast] = useState(null);
  const [showTrackModal, setShowTrackModal] = useState(false);
  const [trackingIdInput, setTrackingIdInput] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const localCart = JSON.parse(localStorage.getItem("cart")) || [];
    const updatedCart = localCart.map((item) => ({
      ...item,
      trackingId: item.trackingId || `TRK-${Math.floor(Math.random() * 999999)}`,
      quantity: item.quantity || 1,
    }));
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const removeItem = (id) => {
    const updatedCart = cart.filter(item => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    showToast("Product removed from cart ❌", "error");
  };

  // Total amount calc
  const totalAmount = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  ).toFixed(2);

  // Modal handlers
  const openTrackModal = () => setShowTrackModal(true);
  const closeTrackModal = () => {
    setShowTrackModal(false);
    setTrackingIdInput("");
  };

const handleTrackSubmit = () => {
    if (!trackingIdInput.trim()) {
      showToast("Please enter a valid tracking ID", "error");
      return;
    }
    closeTrackModal();
    navigate(`/track?trackingId=${trackingIdInput.trim()}`);  // this triggers redirect
  };
  
  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">🛒 Your Cart</h2>
        <Link to="/" className="text-indigo-600 hover:underline">← Back to Shop</Link>
      </div>

      {/* Cart Items */}
      {cart.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
          {cart.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              whileHover={{ scale: 1.03, boxShadow: "0 8px 20px rgba(0,0,0,0.12)" }}
              className="bg-white p-3 rounded-lg shadow-md flex items-center space-x-4 max-h-28"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-20 h-20 object-contain rounded"
              />

              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold truncate">{item.title}</h3>
                <p className="text-gray-600 text-sm mt-0.5">Price: ${item.price}</p>

                <p className="text-gray-600 text-sm mt-1 flex items-center gap-1">
                  Quantity:
                  <button
                    onClick={() => {
                      if (item.quantity > 1) {
                        const updatedCart = cart.map(i =>
                          i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i
                        );
                        setCart(updatedCart);
                        localStorage.setItem("cart", JSON.stringify(updatedCart));
                      }
                    }}
                    className="px-2 bg-gray-200 rounded hover:bg-gray-300 transition"
                    aria-label={`Decrease quantity of ${item.title}`}
                  >-</button>
                  <span className="font-semibold w-5 text-center">{item.quantity}</span>
                  <button
                    onClick={() => {
                      const updatedCart = cart.map(i =>
                        i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                      );
                      setCart(updatedCart);
                      localStorage.setItem("cart", JSON.stringify(updatedCart));
                    }}
                    className="px-2 bg-gray-200 rounded hover:bg-gray-300 transition"
                    aria-label={`Increase quantity of ${item.title}`}
                  >+</button>
                </p>

                <p className="text-xs text-gray-500 truncate mt-1">
                  Tracking ID: <span className="font-medium">{item.trackingId}</span>
                </p>

                <span
                  className={`text-xs font-semibold ${
                    Math.random() > 0.5 ? "text-green-600" : "text-yellow-500 animate-pulse"
                  }`}
                >
                  {Math.random() > 0.5 ? "In Transit" : "Pending Dispatch"}
                </span>
              </div>

              <button
                onClick={() => removeItem(item.id)}
                className="bg-red-500 text-white rounded px-3 py-1 hover:bg-red-600 transition"
                aria-label={`Remove ${item.title} from cart`}
              >
                Remove
              </button>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 flex-grow">
          <h3 className="text-2xl font-semibold mb-4">🛒 Your cart is empty</h3>
          <Link to="/" className="text-indigo-600 hover:underline">Browse products →</Link>
        </div>
      )}

      {/* Footer with Total + Track Product */}
      {cart.length > 0 && (
        <div className="mt-6 bg-white p-4 rounded shadow flex justify-between items-center">
          <h3 className="text-xl font-semibold">Total: ${totalAmount}</h3>
          <button
            onClick={openTrackModal}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded transition"
          >
            Track a Product
          </button>
        </div>
      )}

      {/* Tracking ID Modal */}
      <AnimatePresence>
        {showTrackModal && (
          <motion.div
            key="modal-backdrop"
            className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              key="modal"
              className="bg-white p-6 rounded-lg shadow-lg w-80"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              <h2 className="text-xl font-bold mb-4">Enter Tracking ID</h2>
              <input
                type="text"
                value={trackingIdInput}
                onChange={(e) => setTrackingIdInput(e.target.value)}
                placeholder="Tracking ID e.g TRK-123456"
                className="w-full border rounded p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                autoFocus
              />
              <div className="flex justify-end gap-3">
                <button
                  onClick={handleTrackSubmit}
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
                >
                  Track
                </button>
                <button
                  onClick={closeTrackModal}
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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

export default CartPage;
