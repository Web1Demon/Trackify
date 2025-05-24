import React, { useState } from "react";

const AddPackage = ({ onAdd }) => {
  const [trackingNumber, setTrackingNumber] = useState("");

  const handleAdd = () => {
    if (!trackingNumber) return alert("Enter a tracking number");
    const newPackage = {
      id: Date.now(),
      trackingNumber,
      status: "Pending",
    };
    onAdd(newPackage);
    setTrackingNumber("");
  };

  return (
    <div className="flex gap-2 mb-6">
      <input
        className="border p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-pink-500"
        placeholder="Enter Tracking Number"
        value={trackingNumber}
        onChange={(e) => setTrackingNumber(e.target.value)}
      />
      <button
        onClick={handleAdd}
        className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-5 py-3 rounded-lg hover:opacity-80 transition"
      >
        Add
      </button>
    </div>
  );
};

export default AddPackage;
