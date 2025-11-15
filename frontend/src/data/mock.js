// Mock data untuk photo booth

export const mockFilters = [
  { id: 'none', name: 'Original', filter: 'none' },
  { id: 'grayscale', name: 'Black & White', filter: 'grayscale(100%)' },
  { id: 'sepia', name: 'Sepia', filter: 'sepia(100%)' },
  { id: 'vintage', name: 'Vintage', filter: 'sepia(50%) contrast(110%)' },
  { id: 'soft', name: 'Soft Focus', filter: 'blur(1px) brightness(110%)' },
  { id: 'contrast', name: 'High Contrast', filter: 'contrast(150%)' },
];

export const mockFrames = [
  { id: 'classic-white', name: 'Classic White', color: '#ffffff', borderColor: '#000000' },
  { id: 'pink', name: 'Pink', color: '#FFB6C9', borderColor: '#FF69B4' },
  { id: 'blue', name: 'Blue', color: '#B6D9FF', borderColor: '#4A90E2' },
  { id: 'yellow', name: 'Yellow', color: '#FFF4B6', borderColor: '#FFD700' },
  { id: 'green', name: 'Green', color: '#B6FFD9', borderColor: '#50C878' },
  { id: 'black', name: 'Black', color: '#2C2C2C', borderColor: '#000000' },
];

export const mockStickers = [
  { id: 'heart', icon: '❤️', name: 'Heart' },
  { id: 'star', icon: '⭐', name: 'Star' },
  { id: 'smile', icon: '😊', name: 'Smile' },
  { id: 'cool', icon: '😎', name: 'Cool' },
  { id: 'party', icon: '🎉', name: 'Party' },
  { id: 'camera', icon: '📷', name: 'Camera' },
];

export const mockGalleryPhotos = [
  {
    id: '1',
    title: 'Fun Friends',
    date: '2025-01-15',
    photoStripUrl: 'https://images.unsplash.com/photo-1759209816487-0677a49f01b8?w=400',
    filter: 'none',
    frame: 'classic-white'
  },
  {
    id: '2',
    title: 'Vintage Vibes',
    date: '2025-01-14',
    photoStripUrl: 'https://images.unsplash.com/photo-1632405477987-d61372bdc9ea?w=400',
    filter: 'sepia',
    frame: 'pink'
  },
  {
    id: '3',
    title: 'Group Photo',
    date: '2025-01-13',
    photoStripUrl: 'https://images.unsplash.com/photo-1613192763535-1a3e00ae3ea2?w=400',
    filter: 'grayscale',
    frame: 'black'
  },
  {
    id: '4',
    title: 'Best Friends',
    date: '2025-01-12',
    photoStripUrl: 'https://images.unsplash.com/photo-1714056624725-5a34bd62f8b4?w=400',
    filter: 'vintage',
    frame: 'yellow'
  },
  {
    id: '5',
    title: 'Photo Session',
    date: '2025-01-11',
    photoStripUrl: 'https://images.unsplash.com/photo-1760898131571-6dc38bef7354?w=400',
    filter: 'contrast',
    frame: 'blue'
  },
  {
    id: '6',
    title: 'Memories',
    date: '2025-01-10',
    photoStripUrl: 'https://images.pexels.com/photos/4858872/pexels-photo-4858872.jpeg?w=400',
    filter: 'soft',
    frame: 'green'
  }
];

export const mockFAQs = [
  {
    question: 'Apa itu Picapica Photo Booth?',
    answer: 'Picapica adalah photo booth online gratis yang memungkinkan Anda membuat photo strips vintage dengan filter dan frame yang dapat disesuaikan. Tidak perlu download aplikasi atau registrasi!'
  },
  {
    question: 'Bagaimana cara menggunakannya?',
    answer: 'Sangat mudah! Klik tombol START, izinkan akses kamera, lalu ambil 4 foto berturut-turut dengan countdown timer. Setelah itu, tambahkan filter dan frame sesuai keinginan Anda.'
  },
  {
    question: 'Apakah gratis?',
    answer: 'Ya, Picapica 100% gratis untuk digunakan. Tidak ada biaya tersembunyi atau langganan.'
  },
  {
    question: 'Bisakah saya menyimpan foto saya?',
    answer: 'Tentu! Anda dapat mengunduh photo strip Anda dalam format gambar berkualitas tinggi dan membagikannya melalui link atau QR code.'
  },
  {
    question: 'Apakah berfungsi di perangkat mobile?',
    answer: 'Absolutely! Picapica berfungsi sempurna di smartphone, tablet, dan komputer. Cukup buka browser Anda dan mulai membuat photo strips.'
  }
];
