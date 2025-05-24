import React, { useEffect } from "react";
import AddOrder from "./components/AddOrder";
import TrackOrder from "./components/TrackOrder";

function App() {
  useEffect(() => {
    const interval = setInterval(async () => {
      const orders = await fetchOrders();
      orders.forEach(order => {
        if (order.status !== 'Delivered') {
          const newStatus = order.status === 'Pending' ? 'In Transit' : 'Delivered';
          updateOrderStatus(order.id, newStatus);
        }
      });
    }, 10000); // every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const handleOrderCreated = (order) => {
    console.log("New Order Created:", order);
    // or update a state variable
  };
  return (
    <div className="min-h-screen bg-gray-100 p-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">📦 Logistics PWA</h1>
      <AddOrder onOrderCreated={handleOrderCreated} />
      <TrackOrder />
    </div>
  );
}

export default App;
