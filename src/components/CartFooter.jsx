import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CartFooter = ({ cart }) => {
  const [trackingId, setTrackingId] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const totalAmount = cart.reduce(
    (acc, item) => acc + (item.price * (item.quantity || 1)),
    0
  ).toFixed(2);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const handleTrackSubmit = () => {
    if (!trackingId.trim()) return; // maybe toast an error here?
    navigate(`/track?trackingId=${trackingId.trim()}`);
  };

  return (
    <>
      <div className="flex justify-between items-center p-4 bg-white rounded shadow mt-6">
        <h3 className="text-xl font-semibold">Total: ${totalAmount}</h3>
        <button
          onClick={openModal}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded"
        >
          Track a Product
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-80">
            <h2 className="text-xl font-bold mb-4">Enter Tracking ID</h2>
            <input
              type="text"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              placeholder="Tracking ID e.g TRK-123456"
              className="w-full border rounded p-2 mb-4"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={handleTrackSubmit}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
              >
                Track
              </button>
              <button
                onClick={closeModal}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CartFooter;
