import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useCurrentLocation } from "../hooks/useCurrentLocation";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import 'leaflet/dist/leaflet.css';

// Helper to get simulated coords by progress
// const getCoordsByProgress = (progress) => {
//   if (progress < 30) return [40.7128, -74.006]; // Warehouse NYC
//   if (progress < 70) return [39.0997, -94.5786]; // On the road Kansas City
//   if (progress < 100) return [41.8781, -87.6298]; // Near your city Chicago
//   return [41.881832, -87.623177]; // Delivered location Chicago downtown
// };

const MapView = () => {
  const [searchParams] = useSearchParams();
  const trackingId = searchParams.get("trackingId");
  const [order, setOrder] = useState(null);
  const [progress, setProgress] = useState(0);

  

  useEffect(() => {
    const localCart = JSON.parse(localStorage.getItem("cart")) || [];
    const foundOrder = localCart.find(item => item.trackingId === trackingId);

    if (foundOrder) {
      setOrder(foundOrder);
      setProgress(foundOrder.progress || 0);
    }
  }, [trackingId]);

  // Simulate delivery progress increasing over time
  useEffect(() => {
    if (!order) return;
    if (progress >= 100) return;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.floor(Math.random() * 10) + 5;
        if (next >= 100) {
          clearInterval(timer);
          return 100;
        }
        return next;
      });
    }, 4000);

    return () => clearInterval(timer);
  }, [order, progress]);

  // Copy tracking id to clipboard
  const copyTrackingId = () => {
    navigator.clipboard.writeText(trackingId);
  };

const { location: userLocation, error: locationError } = useCurrentLocation();
const fallbackLocation = { lat: 5.4833, lng: 7.0333 }; // Imo State

const mapCenter = userLocation || fallbackLocation;

if (locationError) {
  console.warn(locationError);
}



  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      <Link to="/" className="text-indigo-600 hover:underline mb-6">← Back to Home</Link>

      <motion.h2 
        className="text-3xl font-bold mb-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        📍 Track Your Product
      </motion.h2>

      {order ? (
        <motion.div 
          className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="flex items-center mb-4">
            <img src={order.image} alt={order.title} className="w-24 h-24 object-contain rounded mr-4"/>
            <div className="flex flex-col">
              <h3 className="text-xl font-semibold mb-1">{order.title}</h3>
              <p className="text-gray-500 text-sm flex items-center gap-2">
                Tracking ID: <span className="font-medium">{trackingId}</span>
                <button 
                  onClick={copyTrackingId} 
                  className="text-indigo-600 underline text-xs hover:text-indigo-800"
                >
                  Copy
                </button>
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <p className="text-gray-600 mb-1">Delivery Progress:</p>
            <div className="h-4 bg-gray-200 rounded overflow-hidden">
              <div
                className={`h-4 rounded transition-all duration-700 ease-in-out ${
                  progress < 100 ? 'bg-yellow-500 animate-pulse' : 'bg-green-600'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm mt-1 font-semibold">
              {progress}% {progress < 100 ? "In Transit" : "Delivered 🎉"}
            </p>
          </div>

          {/* Simulated Location */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 mb-1">Current Location:</p>
            <p className="text-lg font-medium select-none">
              {progress < 30 && "Warehouse 📦"}
              {progress >= 30 && progress < 70 && "On the road 🚚"}
              {progress >= 70 && progress < 100 && "Near your city 🏙️"}
              {progress === 100 && "Delivered 📬"}
            </p>
          </div>

          {/* Map */}
          <div className="mt-6 h-64 rounded overflow-hidden">
            <MapContainer
                center={mapCenter}
                zoom={13}
                style={{ height: "400px", width: "100%" }}
                >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={mapCenter}>
                    <Popup>
                    {userLocation ? "You are here!" : "Default: Imo State 🇳🇬"}
                    </Popup>
                </Marker>
            </MapContainer>

          </div>
        </motion.div>
      ) : (
        <motion.div 
          className="bg-white p-6 rounded-lg shadow-lg text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h3 className="text-xl font-semibold mb-3">Tracking ID Not Found 😞</h3>
          <p className="text-gray-500 mb-4">Double-check your tracking ID or make sure your order is in the cart.</p>
          <Link to="/" className="text-indigo-600 hover:underline">Back to Home</Link>
        </motion.div>
      )}
    </div>
  );
};

export default MapView;
