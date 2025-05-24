import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Toast from "../components/Toast";

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [toast, setToast] = useState(null);
  const [trackingId, setTrackingId] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const localCart = JSON.parse(localStorage.getItem("cart")) || [];
    const updatedCart = localCart.map((item) => ({
      ...item,
      trackingId: item.trackingId || `TRK-${Math.floor(Math.random() * 999999)}`,
      progress: Math.floor(Math.random() * 100)
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

  const increaseQty = (id) => {
    const updatedCart = cart.map(item =>
      item.id === id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const decreaseQty = (id) => {
    const updatedCart = cart.map(item =>
      item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const totalAmount = cart.reduce(
    (acc, item) => acc + (item.price * (item.quantity || 1)), 0
  ).toFixed(2);

  const openTrackModal = () => setShowModal(true);
  const closeTrackModal = () => setShowModal(false);

  const handleTrack = () => {
    if (trackingId.trim() !== "") {
      navigate(`/track?trackingId=${trackingId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">🛒 Your Cart</h2>
        <Link to="/" className="text-indigo-600 hover:underline">← Back to Shop</Link>
      </div>

      {/* Cart Items */}
      {cart.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {cart.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white p-4 rounded-lg shadow-lg flex flex-col"
              >
                <div className="flex items-center">
                  <img src={item.image} alt={item.title} className="w-24 h-24 object-contain rounded mr-4" />
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-1">{item.title}</h3>
                    <p className="text-gray-600 mb-2">Price: ${item.price}</p>
                    <p className="text-sm text-gray-500">Tracking ID: <span className="font-medium">{item.trackingId}</span></p>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-4 mt-4">
                  <button
                    onClick={() => decreaseQty(item.id)}
                    className="px-2 py-1 bg-gray-300 rounded"
                  >-</button>
                  <span>{item.quantity || 1}</span>
                  <button
                    onClick={() => increaseQty(item.id)}
                    className="px-2 py-1 bg-gray-300 rounded"
                  >+</button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="ml-auto bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="h-2 bg-gray-200 rounded">
                    <div
                      className={`h-2 rounded ${item.progress < 100 ? 'bg-yellow-500 animate-pulse' : 'bg-green-600'}`}
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                  <p className="text-xs mt-1">{item.progress}% {item.progress < 100 ? 'In Transit' : 'Delivered'}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Total & Track Button */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white p-4 rounded-lg shadow">
            <h3 className="text-xl font-semibold">Total: ${totalAmount}</h3>
            <button
              onClick={openTrackModal}
              className="bg-indigo-600 text-white px-6 py-3 rounded hover:bg-indigo-700"
            >
              Track a Product
            </button>
          </div>
        </>
      ) : (
        <div className="text-center py-20">
          <h3 className="text-2xl font-semibold mb-4">🛒 Your cart is empty</h3>
          <Link to="/" className="text-indigo-600 hover:underline">Browse products →</Link>
        </div>
      )}

      {/* Track Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h3 className="text-xl font-bold mb-4">Enter Tracking ID</h3>
            <input
              type="text"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              placeholder="e.g TRK-123456"
              className="w-full border p-2 rounded mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={handleTrack}
                className="flex-1 bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
              >
                Track
              </button>
              <button
                onClick={closeTrackModal}
                className="flex-1 bg-gray-300 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

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
