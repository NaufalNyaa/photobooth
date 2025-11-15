import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Download, Share2, RotateCcw, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { mockFilters, mockFrames } from '../data/mock';
import { useToast } from '../hooks/use-toast';

const PhotoBooth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [countdown, setCountdown] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('none');
  const [selectedFrame, setSelectedFrame] = useState('classic-white');
  const [isCapturing, setIsCapturing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      toast({
        title: 'Camera Error',
        description: 'Tidak dapat mengakses kamera. Pastikan Anda memberikan izin kamera.',
        variant: 'destructive'
      });
    }
  };

  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (canvas && video) {
      const ctx = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0);
      return canvas.toDataURL('image/png');
    }
    return null;
  };

  const startCountdown = () => {
    if (isCapturing) return;
    setIsCapturing(true);
    setPhotos([]);
    let photoCount = 0;
    let countNum = 3;

    const countInterval = setInterval(() => {
      if (countNum > 0) {
        setCountdown(countNum);
        countNum--;
      } else {
        setCountdown(null);
        clearInterval(countInterval);

        // Ambil 4 foto berturut-turut
        const photoInterval = setInterval(() => {
          if (photoCount < 4) {
            const photo = capturePhoto();
            if (photo) {
              setPhotos(prev => [...prev, photo]);
              photoCount++;
            }
          } else {
            clearInterval(photoInterval);
            setIsCapturing(false);
            setShowPreview(true);
          }
        }, 1000);
      }
    }, 1000);
  };

  const resetPhotos = () => {
    setPhotos([]);
    setShowPreview(false);
  };

  const downloadPhotoStrip = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const frameData = mockFrames.find(f => f.id === selectedFrame);

    canvas.width = 400;
    canvas.height = 1800;

    // Background frame
    ctx.fillStyle = frameData.color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Border
    ctx.strokeStyle = frameData.borderColor;
    ctx.lineWidth = 8;
    ctx.strokeRect(4, 4, canvas.width - 8, canvas.height - 8);

    // Draw photos
    photos.forEach((photo, index) => {
      const img = new Image();
      img.src = photo;
      img.onload = () => {
        const y = 40 + (index * 420);
        ctx.drawImage(img, 40, y, 320, 360);

        if (index === photos.length - 1) {
          // Add date
          ctx.fillStyle = '#000';
          ctx.font = '16px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(`Picapica - ${new Date().toLocaleDateString()}`, canvas.width / 2, canvas.height - 20);

          // Download
          const link = document.createElement('a');
          link.download = `picapica-${Date.now()}.png`;
          link.href = canvas.toDataURL();
          link.click();

          toast({
            title: 'Success!',
            description: 'Photo strip berhasil diunduh!'
          });
        }
      };
    });
  };

  const filterStyle = mockFilters.find(f => f.id === selectedFilter)?.filter || 'none';

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Button
            onClick={() => navigate('/')}
            variant="ghost"
            className="text-gray-700"
          >
            <X className="mr-2" /> Back to Home
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Photo Booth</h1>
          <Button
            onClick={() => navigate('/gallery')}
            variant="ghost"
            className="text-gray-700"
          >
            View Gallery
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Camera View */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                  style={{ filter: filterStyle }}
                />
                <canvas ref={canvasRef} className="hidden" />

                {countdown && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <span className="text-9xl font-bold text-white animate-pulse">
                      {countdown}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-6 flex gap-4 justify-center">
                <Button
                  onClick={startCountdown}
                  disabled={isCapturing || photos.length >= 4}
                  size="lg"
                  className="bg-pink-500 hover:bg-pink-600 text-white"
                >
                  <Camera className="mr-2" />
                  {photos.length === 0 ? 'Ambil 4 Foto' : `${photos.length}/4 Foto Diambil`}
                </Button>

                {photos.length > 0 && (
                  <Button
                    onClick={resetPhotos}
                    variant="outline"
                    size="lg"
                  >
                    <RotateCcw className="mr-2" /> Ulangi
                  </Button>
                )}
              </div>
            </Card>
          </div>

          {/* Controls & Preview */}
          <div className="space-y-6">
            {/* Filters */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4 text-gray-900">Pilih Filter</h3>
              <div className="grid grid-cols-2 gap-2">
                {mockFilters.map(filter => (
                  <Button
                    key={filter.id}
                    onClick={() => setSelectedFilter(filter.id)}
                    variant={selectedFilter === filter.id ? 'default' : 'outline'}
                    size="sm"
                    className="w-full"
                  >
                    {filter.name}
                  </Button>
                ))}
              </div>
            </Card>

            {/* Frames */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4 text-gray-900">Pilih Frame</h3>
              <div className="grid grid-cols-3 gap-2">
                {mockFrames.map(frame => (
                  <button
                    key={frame.id}
                    onClick={() => setSelectedFrame(frame.id)}
                    className={`h-12 rounded border-2 transition-all ${
                      selectedFrame === frame.id ? 'ring-2 ring-gray-900' : 'hover:scale-105'
                    }`}
                    style={{
                      backgroundColor: frame.color,
                      borderColor: frame.borderColor
                    }}
                  />
                ))}
              </div>
            </Card>

            {/* Photo Preview */}
            {showPreview && photos.length === 4 && (
              <Card className="p-6">
                <h3 className="font-semibold mb-4 text-gray-900">Photo Strip Preview</h3>
                <div className="space-y-2 mb-4">
                  {photos.map((photo, index) => (
                    <div key={index} className="w-full h-24 rounded overflow-hidden">
                      <img
                        src={photo}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-full object-cover"
                        style={{ filter: filterStyle }}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={downloadPhotoStrip}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Download className="mr-2" size={16} /> Download
                  </Button>
                  <Button
                    onClick={() => {
                      toast({
                        title: 'Share',
                        description: 'Fitur share akan segera tersedia!'
                      });
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    <Share2 className="mr-2" size={16} /> Share
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoBooth;
