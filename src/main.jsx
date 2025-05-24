import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import HomeScreen from './components/HomeScreen';
import AddOrder from './components/AddOrder';
import TrackOrder from './components/TrackOrder';
import CartPage from './components/CartPage';
import MapView from './components/MapView.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/track" element={<MapView />} />
        <Route path="/cart" element={<CartPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
