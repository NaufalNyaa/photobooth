import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Trash2, Search, RefreshCw, Image as ImageIcon } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { useToast } from '../hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const Gallery = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [photos, setPhotos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Fetch photos from backend
  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/photos`);
      if (!response.ok) {
        throw new Error('Failed to fetch photos');
      }
      const data = await response.json();
      setPhotos(data);
    } catch (error) {
      console.error('Error fetching photos:', error);
      toast({
        title: 'Error',
        description: 'Gagal memuat galeri. Pastikan backend berjalan.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPhotos = photos.filter(photo =>
    photo.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/photos/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete photo');
      }

      setPhotos(photos.filter(photo => photo.id !== id));
      setSelectedPhoto(null);
      setDeleteConfirmId(null);

      toast({
        title: 'Berhasil!',
        description: 'Photo strip berhasil dihapus.'
      });
    } catch (error) {
      console.error('Error deleting photo:', error);
      toast({
        title: 'Error',
        description: 'Gagal menghapus foto.',
        variant: 'destructive'
      });
    }
  };

  const handleDownload = (photo) => {
    const link = document.createElement('a');
    link.href = `${API_URL}/photos/${photo.id}/image`;
    link.download = `${photo.title.replace(/\s+/g, '-')}.png`;
    link.click();

    toast({
      title: 'Download dimulai!',
      description: 'File sedang diunduh...'
    });
  };

  const getPhotoUrl = (photoId) => {
    return `${API_URL}/photos/${photoId}/image`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getLayoutBadge = (count) => {
    const colors = {
      2: 'bg-blue-100 text-blue-700',
      3: 'bg-green-100 text-green-700',
      4: 'bg-purple-100 text-purple-700',
      6: 'bg-pink-100 text-pink-700'
    };
    return colors[count] || 'bg-gray-100 text-gray-700';
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
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Galeri Photo Strips</h1>
              <p className="text-sm text-gray-500 mt-1">{photos.length} foto tersimpan</p>
            </div>
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
              onClick={fetchPhotos}
              variant="outline"
              size="icon"
              title="Refresh"
            >
              <RefreshCw size={18} />
            </Button>
            <Button
              onClick={() => navigate('/photobooth')}
              className="bg-pink-500 hover:bg-pink-600 text-white whitespace-nowrap"
            >
              Buat Baru
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <RefreshCw className="animate-spin text-gray-400 mb-4" size={48} />
            <p className="text-gray-500">Memuat galeri...</p>
          </div>
        ) : filteredPhotos.length === 0 ? (
          <Card className="p-12 text-center">
            <ImageIcon className="mx-auto text-gray-300 mb-4" size={64} />
            <p className="text-gray-500 mb-4">
              {searchTerm ? 'Tidak ada photo strips ditemukan.' : 'Belum ada photo strips.'}
            </p>
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
                    src={getPhotoUrl(photo.id)}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x600?text=Image+Not+Found';
                    }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />

                  {/* Layout Badge */}
                  <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold ${getLayoutBadge(photo.layout_count)}`}>
                    {photo.layout_count} Photos
                  </div>

                  {/* Stickers Badge */}
                  {photo.has_stickers && (
                    <div className="absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                      🎨 {photo.stickers_count}
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1 truncate">{photo.title}</h3>
                  <p className="text-xs text-gray-500">
                    {formatDate(photo.created_at)}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                      {photo.filter_applied}
                    </span>
                    {photo.file_size && (
                      <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                        {(photo.file_size / 1024).toFixed(0)} KB
                      </span>
                    )}
                  </div>
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
                  {formatDate(selectedPhoto.created_at)}
                </DialogDescription>
              </DialogHeader>

              <div className="mt-4">
                <img
                  src={getPhotoUrl(selectedPhoto.id)}
                  alt={selectedPhoto.title}
                  className="w-full rounded-lg"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x600?text=Image+Not+Found';
                  }}
                />

                {/* Photo Details */}
                <div className="grid grid-cols-2 gap-4 mt-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-xs text-gray-500">Layout</p>
                    <p className="font-semibold">{selectedPhoto.layout_count} Photos</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Filter</p>
                    <p className="font-semibold">{selectedPhoto.filter_applied}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Frame</p>
                    <p className="font-semibold">{selectedPhoto.frame_applied}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Stickers</p>
                    <p className="font-semibold">
                      {selectedPhoto.has_stickers ? `${selectedPhoto.stickers_count} stickers` : 'None'}
                    </p>
                  </div>
                </div>
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
                  onClick={() => setDeleteConfirmId(selectedPhoto.id)}
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Photo Strip?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Photo strip akan dihapus secara permanen dari server.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDelete(deleteConfirmId)}
              className="bg-red-600 hover:bg-red-700"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Gallery;
