import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera } from 'lucide-react';
import { Button } from '../components/ui/button';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-20">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 text-center mb-6">
          FunSnap - Free Online Photo Booth
        </h1>

        <div className="flex items-center gap-3 mb-8">
          <p className="text-lg md:text-xl text-gray-700 text-center max-w-2xl">
            Welcome to Manggaly' FunSnap, your personal photo booth at home. Create photo strips with fun filters and frames.
          </p>
          <span className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap">
            <Camera size={16} />
            Photo filter app
          </span>
        </div>

        {/* Sample Photo Strip */}
        <div className="mb-12">
          <div className="bg-white border-4 border-gray-900 rounded-lg p-4 shadow-2xl">
            <div className="flex flex-col gap-3">
              <div className="w-48 h-36 bg-gray-200 rounded overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1759209816487-0677a49f01b8?w=400&q=80"
                  alt="Photo 1"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-48 h-36 bg-gray-200 rounded overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1759209816487-0677a49f01b8?w=400&q=80"
                  alt="Photo 2"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-48 h-36 bg-gray-200 rounded overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1759209816487-0677a49f01b8?w=400&q=80"
                  alt="Photo 3"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-48 h-36 bg-gray-200 rounded overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1759209816487-0677a49f01b8?w=400&q=80"
                  alt="Photo 4"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-3 text-center">
              Photobooth - {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>

        <Button
          onClick={() => navigate('/photobooth')}
          size="lg"
          variant="outline"
          className="border-2 border-gray-900 bg-transparent hover:bg-gray-900 hover:text-white text-gray-900 font-semibold px-12 py-6 text-xl rounded-full transition-all duration-300"
        >
          START
        </Button>
      </div>

      {/* Footer */}
      <footer className="py-8 text-center">
        <p className="text-sm text-gray-700 font-medium mb-1">
          FunSnap Booth - The original online photo strip creator
        </p>
        <p className="text-xs text-gray-600">
          made by
        </p>
        <p className="text-xs text-gray-500 mt-2">
          © {new Date().getFullYear()} Putri Dwi Manggaly. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
};

export default Home;
