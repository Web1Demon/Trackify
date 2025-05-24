import { useState, useEffect } from "react";
import { saveOrder, fetchOrders, updateOrderStatus } from "../services/api";
import { v4 as uuidv4 } from "uuid";
import Toast from "./Toast";

const AddOrder = () => {
  const [product, setProduct] = useState("");
  const [image, setImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [orders, setOrders] = useState([]);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const loadOrders = async () => {
      const data = await fetchOrders();
      setOrders(data);
    };
    loadOrders();
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const handleAddOrder = async () => {
    if (!product) return showToast("Please enter a product name", "error");

    const existingOrder = orders.find((o) => o.product === product);

    if (existingOrder) {
      const newQuantity = existingOrder.quantity + quantity;
      await updateOrderStatus(existingOrder.id, { quantity: newQuantity });
      showToast(`Increased ${product} quantity to ${newQuantity}`);
    } else {
      const newOrder = {
        id: uuidv4().slice(0, 8),
        product,
        quantity,
        image,
        status: "Pending"
      };

      await saveOrder(newOrder);
      showToast(`Order placed for ${product}! 🚚`);
    }

    setProduct("");
    setImage("");
    setQuantity(1);
    const data = await fetchOrders();
    setOrders(data);
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">📦 Place an Order</h2>

      <input
        value={product}
        onChange={(e) => setProduct(e.target.value)}
        placeholder="Product Name"
        className="border rounded p-2 mb-4 w-full"
      />

      <input
        value={image}
        onChange={(e) => setImage(e.target.value)}
        placeholder="Image URL (optional)"
        className="border rounded p-2 mb-4 w-full"
      />

      <div className="flex items-center mb-4">
        <label className="mr-2">Quantity:</label>
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
          className="border rounded p-2 w-20"
        />
      </div>

      <button
        onClick={handleAddOrder}
        className="bg-indigo-600 text-white px-4 py-3 rounded hover:bg-indigo-700"
      >
        Add to Cart
      </button>

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

export default AddOrder;
