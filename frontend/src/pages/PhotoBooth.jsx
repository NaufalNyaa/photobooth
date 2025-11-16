import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Download, Share2, RotateCcw, X, FlipHorizontal, Sticker, Upload, Save, Image as ImageIcon } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { mockFilters, mockFrames, mockStickerTemplates, mockEmojiStickers } from '../data/mock';
import { useToast } from '../hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../components/ui/dialog';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const PhotoBooth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [countdown, setCountdown] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('none');
  const [selectedFrame, setSelectedFrame] = useState('classic-white');
  const [isCapturing, setIsCapturing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // New states for features
  const [isMirrored, setIsMirrored] = useState(false);
  const [layoutCount, setLayoutCount] = useState(2); // Default to 2 (available layouts)
  const [emojiStickers, setEmojiStickers] = useState([]); // For draggable emoji
  const [selectedEmojiSticker, setSelectedEmojiSticker] = useState(null);
  const [draggingSticker, setDraggingSticker] = useState(null);

  // Template sticker state
  const [selectedTemplate, setSelectedTemplate] = useState(null); // null or template id

  // Save dialog state
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [photoTitle, setPhotoTitle] = useState('');

  // Only show layouts that have templates
  const availableLayouts = Object.keys(mockStickerTemplates).map(count => ({
    count: parseInt(count),
    label: `${count} Photos`
  }));

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

      if (isMirrored) {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }

      ctx.drawImage(video, 0, 0);

      if (isMirrored) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
      }

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

    const captureSequence = () => {
      const countInterval = setInterval(() => {
        if (countNum > 0) {
          setCountdown(countNum);
          countNum--;
        } else {
          setCountdown(null);
          clearInterval(countInterval);

          const photo = capturePhoto();
          if (photo) {
            setPhotos(prev => [...prev, photo]);
            photoCount++;

            if (photoCount < layoutCount) {
              countNum = 3;
              setTimeout(captureSequence, 500);
            } else {
              setIsCapturing(false);
              setShowPreview(true);
              const timestamp = new Date().toLocaleString('id-ID');
              setPhotoTitle(`Photo Strip - ${timestamp}`);
            }
          }
        }
      }, 1000);
    };

    captureSequence();
  };

  const resetPhotos = () => {
    setPhotos([]);
    setShowPreview(false);
    setEmojiStickers([]);
    setSelectedTemplate(null);
    setPhotoTitle('');
  };

  // Emoji sticker functions (draggable)
  const addEmojiSticker = (sticker) => {
    const newSticker = {
      id: Date.now(),
      emoji: sticker.icon,
      x: 50,
      y: 50,
      scale: 1,
      rotation: 0
    };
    setEmojiStickers([...emojiStickers, newSticker]);
    setSelectedEmojiSticker(newSticker.id);
  };

  const updateEmojiSticker = (id, updates) => {
    setEmojiStickers(emojiStickers.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const deleteEmojiSticker = (id) => {
    setEmojiStickers(emojiStickers.filter(s => s.id !== id));
    setSelectedEmojiSticker(null);
  };

  const handleStickerMouseDown = (e, sticker) => {
    e.preventDefault();
    setSelectedEmojiSticker(sticker.id);
    setDraggingSticker(sticker.id);
  };

  const handleMouseMove = (e) => {
    if (draggingSticker && previewCanvasRef.current) {
      const rect = previewCanvasRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      updateEmojiSticker(draggingSticker, { x, y });
    }
  };

  const handleMouseUp = () => {
    setDraggingSticker(null);
  };

  // Template sticker selection
  const handleTemplateSelect = (templateId) => {
    setSelectedTemplate(templateId);
    toast({
      title: 'Template Applied!',
      description: 'Sticker template telah diterapkan pada photo strip Anda.'
    });
  };

  const generatePhotoStrip = () => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const frameData = mockFrames.find(f => f.id === selectedFrame);

      const photoHeight = 360;
      const photoWidth = 320;
      const padding = 40;
      const borderWidth = 8;

      let cols, rows;
      if (layoutCount === 2) {
        cols = 1; rows = 2;
      } else if (layoutCount === 3) {
        cols = 1; rows = 3;
      } else if (layoutCount === 4) {
        cols = 1; rows = 4;
      } else if (layoutCount === 6) {
        cols = 2; rows = 3;
      }

      canvas.width = cols * photoWidth + (cols + 1) * padding;
      canvas.height = rows * photoHeight + (rows + 1) * padding + 60;

      // Background frame
      ctx.fillStyle = frameData.color;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Border
      ctx.strokeStyle = frameData.borderColor;
      ctx.lineWidth = borderWidth;
      ctx.strokeRect(borderWidth / 2, borderWidth / 2, canvas.width - borderWidth, canvas.height - borderWidth);

      // Draw photos
      const loadPromises = photos.map((photo, index) => {
        return new Promise((resolveImg) => {
          const img = new Image();
          img.src = photo;
          img.onload = () => {
            const col = index % cols;
            const row = Math.floor(index / cols);
            const x = padding + col * (photoWidth + padding);
            const y = padding + row * (photoHeight + padding);

            ctx.drawImage(img, x, y, photoWidth, photoHeight);
            resolveImg();
          };
        });
      });

      Promise.all(loadPromises).then(() => {
        // Draw template sticker overlay (if selected)
        if (selectedTemplate) {
          const template = mockStickerTemplates[layoutCount]?.find(t => t.id === selectedTemplate);
          if (template) {
            const overlayImg = new Image();
            overlayImg.src = template.overlayPath;
            overlayImg.onload = () => {
              // Draw overlay covering entire canvas
              ctx.drawImage(overlayImg, 0, 0, canvas.width, canvas.height);

              // Then draw emoji stickers on top
              drawEmojiStickers(ctx, canvas);

              // Add watermark
              addWatermark(ctx, canvas);

              resolve(canvas.toDataURL('image/png'));
            };
            overlayImg.onerror = () => {
              console.error('Failed to load template overlay');
              drawEmojiStickers(ctx, canvas);
              addWatermark(ctx, canvas);
              resolve(canvas.toDataURL('image/png'));
            };
          } else {
            drawEmojiStickers(ctx, canvas);
            addWatermark(ctx, canvas);
            resolve(canvas.toDataURL('image/png'));
          }
        } else {
          drawEmojiStickers(ctx, canvas);
          addWatermark(ctx, canvas);
          resolve(canvas.toDataURL('image/png'));
        }
      });
    });
  };

  const drawEmojiStickers = (ctx, canvas) => {
    emojiStickers.forEach(sticker => {
      ctx.save();
      const stickerX = (sticker.x / 100) * canvas.width;
      const stickerY = (sticker.y / 100) * canvas.height;

      ctx.translate(stickerX, stickerY);
      ctx.rotate((sticker.rotation * Math.PI) / 180);
      ctx.font = `${60 * sticker.scale}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(sticker.emoji, 0, 0);
      ctx.restore();
    });
  };

  const addWatermark = (ctx, canvas) => {
    ctx.fillStyle = '#000';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Picapica Booth - ${new Date().toLocaleDateString()}`, canvas.width / 2, canvas.height - 25);
  };

  const downloadPhotoStrip = async () => {
    const dataUrl = await generatePhotoStrip();

    const link = document.createElement('a');
    link.download = `picapica-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();

    toast({
      title: 'Success!',
      description: 'Photo strip berhasil diunduh!'
    });
  };

  const handleSaveToGallery = () => {
    if (!photoTitle.trim()) {
      toast({
        title: 'Error',
        description: 'Silakan masukkan judul foto.',
        variant: 'destructive'
      });
      return;
    }
    setShowSaveDialog(true);
  };

  const uploadToBackend = async () => {
    setIsUploading(true);

    try {
      const imageData = await generatePhotoStrip();

      const photoData = {
        title: photoTitle,
        image_data: imageData,
        layout_count: layoutCount,
        filter_applied: selectedFilter,
        frame_applied: selectedFrame,
        has_stickers: emojiStickers.length > 0 || selectedTemplate !== null,
        stickers_count: emojiStickers.length
      };

      const response = await fetch(`${API_URL}/photos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(photoData)
      });

      if (!response.ok) {
        throw new Error('Failed to upload photo');
      }

      toast({
        title: 'Berhasil!',
        description: 'Photo strip berhasil disimpan ke galeri!'
      });

      setShowSaveDialog(false);

      setTimeout(() => {
        if (window.confirm('Photo berhasil disimpan! Ingin melihat galeri?')) {
          navigate('/gallery');
        } else {
          resetPhotos();
        }
      }, 500);

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Error',
        description: 'Gagal menyimpan foto. Pastikan backend berjalan.',
        variant: 'destructive'
      });
    } finally {
      setIsUploading(false);
    }
  };

  const filterStyle = mockFilters.find(f => f.id === selectedFilter)?.filter || 'none';
  const videoStyle = {
    filter: filterStyle,
    transform: isMirrored ? 'scaleX(-1)' : 'none'
  };

  // Get available templates for current layout
  const availableTemplates = mockStickerTemplates[layoutCount] || [];

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
                  style={videoStyle}
                />
                <canvas ref={canvasRef} className="hidden" />

                {countdown && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
                    <span className="text-9xl font-bold text-white animate-pulse">
                      {countdown}
                    </span>
                  </div>
                )}

                {isCapturing && !countdown && (
                  <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white px-4 py-2 rounded-full">
                    📸 {photos.length}/{layoutCount}
                  </div>
                )}
              </div>

              <div className="mt-6 flex gap-4 justify-center flex-wrap">
                <Button
                  onClick={startCountdown}
                  disabled={isCapturing || photos.length >= layoutCount}
                  size="lg"
                  className="bg-pink-500 hover:bg-pink-600 text-white"
                >
                  <Camera className="mr-2" />
                  {photos.length === 0 ? `Ambil ${layoutCount} Foto` : `${photos.length}/${layoutCount} Foto`}
                </Button>

                <Button
                  onClick={() => setIsMirrored(!isMirrored)}
                  variant="outline"
                  size="lg"
                >
                  <FlipHorizontal className="mr-2" />
                  {isMirrored ? 'Normal' : 'Mirror'}
                </Button>

                {photos.length > 0 && !isCapturing && (
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
            {/* Layout Options */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4 text-gray-900">Pilih Layout</h3>
              <div className="grid grid-cols-2 gap-2">
                {availableLayouts.map(option => (
                  <Button
                    key={option.count}
                    onClick={() => {
                      setLayoutCount(option.count);
                      resetPhotos();
                    }}
                    variant={layoutCount === option.count ? 'default' : 'outline'}
                    size="sm"
                    className="w-full"
                    disabled={isCapturing || showPreview}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Layout tersedia: 2 & 3 (dengan template sticker)
              </p>
            </Card>

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

            {/* Stickers - Template & Emoji */}
            {showPreview && (
              <Card className="p-6">
                <h3 className="font-semibold mb-4 text-gray-900">
                  <Sticker className="inline mr-2" size={18} />
                  Tambah Sticker
                </h3>

                <Tabs defaultValue="templates" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="templates">Templates</TabsTrigger>
                    <TabsTrigger value="emoji">Emoji</TabsTrigger>
                  </TabsList>

                  {/* Template Stickers Tab */}
                  <TabsContent value="templates" className="space-y-3">
                    {availableTemplates.length > 0 ? (
                      <>
                        <p className="text-sm text-gray-600">
                          Pilih template untuk layout {layoutCount} foto:
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                          {availableTemplates.map(template => (
                            <button
                              key={template.id}
                              onClick={() => handleTemplateSelect(template.id)}
                              className={`relative border-2 rounded-lg overflow-hidden transition-all ${
                                selectedTemplate === template.id
                                  ? 'ring-4 ring-pink-500 border-pink-500'
                                  : 'border-gray-200 hover:border-pink-300'
                              }`}
                            >
                              <img
                                src={template.preview}
                                alt={template.name}
                                className="w-full h-32 object-cover"
                                onError={(e) => {
                                  e.target.src = 'https://via.placeholder.com/200x300?text=' + template.name;
                                }}
                              />
                              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs py-1 px-2">
                                {template.name}
                              </div>
                            </button>
                          ))}
                        </div>
                        {selectedTemplate && (
                          <Button
                            onClick={() => setSelectedTemplate(null)}
                            variant="outline"
                            size="sm"
                            className="w-full"
                          >
                            Hapus Template
                          </Button>
                        )}
                      </>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <ImageIcon className="mx-auto mb-2" size={48} />
                        <p className="text-sm">
                          Belum ada template untuk layout {layoutCount}
                        </p>
                      </div>
                    )}
                  </TabsContent>

                  {/* Emoji Stickers Tab */}
                  <TabsContent value="emoji" className="space-y-3">
                    <p className="text-sm text-gray-600">
                      Tap emoji untuk menambahkan (bisa drag & resize):
                    </p>
                    <div className="grid grid-cols-6 gap-2">
                      {mockEmojiStickers.map(sticker => (
                        <button
                          key={sticker.id}
                          onClick={() => addEmojiSticker(sticker)}
                          className="text-3xl hover:scale-125 transition-transform p-2 bg-gray-100 rounded"
                          title={sticker.name}
                        >
                          {sticker.icon}
                        </button>
                      ))}
                    </div>

                    {selectedEmojiSticker && (
                      <div className="mt-4 space-y-2 pt-3 border-t">
                        <p className="text-xs font-semibold text-gray-700">Edit Emoji:</p>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => {
                              const sticker = emojiStickers.find(s => s.id === selectedEmojiSticker);
                              if (sticker) {
                                updateEmojiSticker(selectedEmojiSticker, { scale: sticker.scale + 0.2 });
                              }
                            }}
                            variant="outline"
                            size="sm"
                            className="flex-1"
                          >
                            Bigger
                          </Button>
                          <Button
                            onClick={() => {
                              const sticker = emojiStickers.find(s => s.id === selectedEmojiSticker);
                              if (sticker && sticker.scale > 0.4) {
                                updateEmojiSticker(selectedEmojiSticker, { scale: sticker.scale - 0.2 });
                              }
                            }}
                            variant="outline"
                            size="sm"
                            className="flex-1"
                          >
                            Smaller
                          </Button>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => {
                              const sticker = emojiStickers.find(s => s.id === selectedEmojiSticker);
                              if (sticker) {
                                updateEmojiSticker(selectedEmojiSticker, { rotation: sticker.rotation + 15 });
                              }
                            }}
                            variant="outline"
                            size="sm"
                            className="flex-1"
                          >
                            Rotate
                          </Button>
                          <Button
                            onClick={() => deleteEmojiSticker(selectedEmojiSticker)}
                            variant="destructive"
                            size="sm"
                            className="flex-1"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </Card>
            )}

            {/* Photo Preview */}
            {showPreview && photos.length === layoutCount && (
              <Card className="p-6">
                <h3 className="font-semibold mb-4 text-gray-900">Photo Strip Preview</h3>
                <div
                  ref={previewCanvasRef}
                  className="relative space-y-2 mb-4"
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                >
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

                  {/* Template overlay preview */}
                  {selectedTemplate && (
                    <div className="absolute inset-0 pointer-events-none">
                      <img
                        src={mockStickerTemplates[layoutCount]?.find(t => t.id === selectedTemplate)?.preview}
                        alt="Template overlay"
                        className="w-full h-full object-cover opacity-80"
                      />
                    </div>
                  )}

                  {/* Emoji stickers overlay */}
                  {emojiStickers.map(sticker => (
                    <div
                      key={sticker.id}
                      onMouseDown={(e) => handleStickerMouseDown(e, sticker)}
                      className={`absolute cursor-move select-none ${
                        selectedEmojiSticker === sticker.id ? 'ring-2 ring-blue-500 rounded-full' : ''
                      }`}
                      style={{
                        left: `${sticker.x}%`,
                        top: `${sticker.y}%`,
                        transform: `translate(-50%, -50%) rotate(${sticker.rotation}deg) scale(${sticker.scale})`,
                        fontSize: '2rem',
                        zIndex: selectedEmojiSticker === sticker.id ? 10 : 1
                      }}
                    >
                      {sticker.emoji}
                    </div>
                  ))}
                </div>

                <div className="mb-4">
                  <Label htmlFor="photoTitle">Judul Photo Strip</Label>
                  <Input
                    id="photoTitle"
                    value={photoTitle}
                    onChange={(e) => setPhotoTitle(e.target.value)}
                    placeholder="Masukkan judul..."
                    className="mt-2"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={downloadPhotoStrip}
                    variant="outline"
                    className="flex-1"
                  >
                    <Download className="mr-2" size={16} /> Download
                  </Button>
                  <Button
                    onClick={handleSaveToGallery}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    disabled={!photoTitle.trim()}
                  >
                    <Save className="mr-2" size={16} /> Save to Gallery
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Save Confirmation Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Simpan ke Galeri?</DialogTitle>
            <DialogDescription>
              Photo strip akan disimpan ke backend server dan dapat dilihat di galeri.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <p className="text-sm text-gray-600 mb-2">
              <strong>Judul:</strong> {photoTitle}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Layout:</strong> {layoutCount} photos
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Template:</strong> {selectedTemplate ? 'Yes' : 'None'}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Emoji Stickers:</strong> {emojiStickers.length}
            </p>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowSaveDialog(false)}
              disabled={isUploading}
            >
              Batal
            </Button>
            <Button
              onClick={uploadToBackend}
              disabled={isUploading}
              className="bg-green-600 hover:bg-green-700"
            >
              {isUploading ? (
                <>
                  <Upload className="mr-2 animate-spin" size={16} />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2" size={16} />
                  Ya, Simpan
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PhotoBooth;
