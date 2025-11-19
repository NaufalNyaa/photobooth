import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import AnimatedBackground from './components/AnimatedBackground';
import Home from './pages/Home';
import PhotoBooth from './pages/PhotoBooth';
import Gallery from './pages/Gallery';
import FAQ from './pages/FAQ';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Contact from './pages/Contact';
import { Toaster } from './components/ui/sonner';

function App() {
  return (
    <div className="App min-h-screen relative">
      <AnimatedBackground />
      <div className="relative z-10">
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/photobooth" element={<PhotoBooth />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
