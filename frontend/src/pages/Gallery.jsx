import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Trash2, Search } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { mockGalleryPhotos } from '../data/mock';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';

const Gallery = () => {
  const navigate = useNavigate();
  const [photos, setPhotos] = useState(mockGalleryPhotos);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const filteredPhotos = photos.filter(photo =>
    photo.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id) => {
    setPhotos(photos.filter(photo => photo.id !== id));
    setSelectedPhoto(null);
  };

  const handleDownload = (photo) => {
    const link = document.createElement('a');
    link.href = photo.photoStripUrl;
    link.download = `${photo.title.replace(/\s+/g, '-')}.jpg`;
    link.click();
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate('/')}
              variant="ghost"
              className="text-gray-700"
            >
              <ArrowLeft className="mr-2" /> Kembali
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Galeri Photo Strips</h1>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Cari photo strips..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              onClick={() => navigate('/photobooth')}
              className="bg-pink-500 hover:bg-pink-600 text-white whitespace-nowrap"
            >
              Buat Baru
            </Button>
          </div>
        </div>

        {/* Gallery Grid */}
        {filteredPhotos.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-gray-500 mb-4">Tidak ada photo strips ditemukan.</p>
            <Button onClick={() => navigate('/photobooth')}>
              Buat Photo Strip Pertama Anda
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPhotos.map(photo => (
              <Card
                key={photo.id}
                className="overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer group"
                onClick={() => setSelectedPhoto(photo)}
              >
                <div className="relative aspect-[3/4] bg-gray-100">
                  <img
                    src={photo.photoStripUrl}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">{photo.title}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(photo.date).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Photo Detail Dialog */}
      <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent className="max-w-2xl">
          {selectedPhoto && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedPhoto.title}</DialogTitle>
                <DialogDescription>
                  {new Date(selectedPhoto.date).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </DialogDescription>
              </DialogHeader>

              <div className="mt-4">
                <img
                  src={selectedPhoto.photoStripUrl}
                  alt={selectedPhoto.title}
                  className="w-full rounded-lg"
                />
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  onClick={() => handleDownload(selectedPhoto)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Download className="mr-2" size={18} />
                  Download
                </Button>
                <Button
                  onClick={() => handleDelete(selectedPhoto.id)}
                  variant="destructive"
                  className="flex-1"
                >
                  <Trash2 className="mr-2" size={18} />
                  Hapus
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Gallery;
