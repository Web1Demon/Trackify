import { useState } from "react";
import { fetchOrder } from "../services/api";
import MapView from "./MapView";

const TrackOrder = () => {
  const [trackingId, setTrackingId] = useState("");
  const [order, setOrder] = useState(null);

  const handleTrack = async () => {
    const res = await fetchOrder(trackingId);
    if (!res) {
      alert("Order not found!");
      return;
    }
    setOrder(res);
  };

  return (
    <div>
      <input
        className="border p-3 rounded w-full mb-2"
        placeholder="Enter Tracking ID"
        value={trackingId}
        onChange={(e) => setTrackingId(e.target.value)}
      />
      <button
        onClick={handleTrack}
        className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-500"
      >
        Track
      </button>

      {order && (
        <div className="mt-4">
          <h2 className="text-lg font-bold">Product: {order.product}</h2>
          <p className="text-sm mb-2">Status: {order.status}</p>
          <MapView />
        </div>
      )}
    </div>
  );
};

export default TrackOrder;
