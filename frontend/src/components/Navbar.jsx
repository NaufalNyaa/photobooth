import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Camera } from 'lucide-react';
import { Button } from './ui/button';

const Navbar = () => {
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/faq', label: 'FAQ' },
    { path: '/privacy', label: 'Privacy Policy' },
    { path: '/contact', label: 'Contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-gray-900 hover:text-pink-600 transition-colors">
            <Camera size={28} className="text-pink-500" />
            FunSnap
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'text-pink-600'
                    : 'text-gray-700 hover:text-pink-600'
                }`}
              >
                {link.label}
              </Link>
            ))}

            <Button
              size="sm"
              className="bg-blue-900 hover:bg-blue-800 text-white px-6"
              onClick={() => window.open('https://www.paypal.com', '_blank')}
            >
              Support
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                // Mobile menu toggle would go here
                alert('Mobile menu - to be implemented');
              }}
            >
              Menu
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
