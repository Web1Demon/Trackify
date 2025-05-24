import { useState, useEffect } from "react";

export const useCurrentLocation = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => {
        console.error("Failed to get location:", err);
        switch (err.code) {
          case 1:
            setError("Permission denied. Please allow location access.");
            break;
          case 2:
            setError("Position unavailable.");
            break;
          case 3:
            setError("Location request timed out.");
            break;
          default:
            setError("An unknown error occurred.");
        }
      },
      { timeout: 10000 }
    );
  }, []);

  return { location, error };
};
