import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Mail, MessageSquare } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { useToast } from '../hooks/use-toast';

const Contact = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Mock form submission
    toast({
      title: 'Pesan Terkirim!',
      description: 'Terima kasih telah menghubungi kami. Kami akan segera merespons.'
    });

    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

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

        <h1 className="text-4xl font-bold text-gray-900 mb-3">Hubungi Kami</h1>
        <p className="text-gray-600 mb-8">Ada pertanyaan atau saran? Kami senang mendengar dari Anda!</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="text-pink-600" size={24} />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
            <p className="text-sm text-gray-600">support@FunSnapbooth.com</p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="text-blue-600" size={24} />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Live Chat</h3>
            <p className="text-sm text-gray-600">Tersedia Senin-Jumat</p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="text-green-600" size={24} />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Respon Cepat</h3>
            <p className="text-sm text-gray-600">Dalam 24 jam</p>
          </Card>
        </div>

        <Card className="p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Kirim Pesan</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  required
                  className="mt-2"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="subject">Subjek</Label>
              <Input
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Bagaimana saya bisa membantu?"
                required
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="message">Pesan</Label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tuliskan pesan Anda di sini..."
                required
                rows={6}
                className="mt-2"
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full bg-pink-500 hover:bg-pink-600 text-white"
            >
              <Send className="mr-2" size={18} />
              Kirim Pesan
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Contact;
