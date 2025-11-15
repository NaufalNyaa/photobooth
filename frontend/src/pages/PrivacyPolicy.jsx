import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Button
          onClick={() => navigate('/')}
          variant="ghost"
          className="mb-6 text-gray-700"
        >
          <ArrowLeft className="mr-2" /> Kembali
        </Button>

        <h1 className="text-4xl font-bold text-gray-900 mb-3">Privacy Policy</h1>
        <p className="text-gray-600 mb-8">Terakhir diperbarui: {new Date().toLocaleDateString('id-ID')}</p>

        <Card className="p-8">
          <div className="prose prose-gray max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Informasi yang Kami Kumpulkan</h2>
              <p className="text-gray-700 mb-4">
                Picapica Photo Booth berkomitmen untuk melindungi privasi Anda. Kami hanya mengakses kamera perangkat Anda
                untuk membuat photo strips. Semua foto diproses secara lokal di browser Anda.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Penggunaan Kamera</h2>
              <p className="text-gray-700 mb-4">
                Kami memerlukan akses ke kamera perangkat Anda untuk mengambil foto. Anda dapat mencabut izin ini
                kapan saja melalui pengaturan browser Anda.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Penyimpanan Data</h2>
              <p className="text-gray-700 mb-4">
                Foto-foto Anda disimpan secara lokal di perangkat Anda. Kami tidak mengunggah atau menyimpan
                foto Anda di server kami. Anda memiliki kontrol penuh atas foto-foto Anda.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Cookies</h2>
              <p className="text-gray-700 mb-4">
                Kami menggunakan cookies minimal untuk meningkatkan pengalaman pengguna Anda. Cookies ini tidak
                mengumpulkan informasi pribadi yang dapat diidentifikasi.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Keamanan</h2>
              <p className="text-gray-700 mb-4">
                Kami menggunakan teknologi enkripsi standar industri untuk melindungi data Anda. Karena semua
                pemrosesan terjadi di browser Anda, data Anda tetap aman dan pribadi.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Hak Anda</h2>
              <p className="text-gray-700 mb-4">
                Anda memiliki hak untuk mengakses, menghapus, atau mengubah data pribadi Anda kapan saja.
                Karena kami tidak menyimpan data Anda di server, Anda memiliki kontrol penuh.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Perubahan Kebijakan</h2>
              <p className="text-gray-700 mb-4">
                Kami dapat memperbarui kebijakan privasi ini dari waktu ke waktu. Kami akan memberi tahu Anda
                tentang perubahan signifikan dengan memposting pemberitahuan di situs kami.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Hubungi Kami</h2>
              <p className="text-gray-700 mb-4">
                Jika Anda memiliki pertanyaan tentang kebijakan privasi kami, silakan hubungi kami melalui
                halaman kontak.
              </p>
              <Button
                onClick={() => navigate('/contact')}
                className="bg-pink-500 hover:bg-pink-600 text-white"
              >
                Hubungi Kami
              </Button>
            </section>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
