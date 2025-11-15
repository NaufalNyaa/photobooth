import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { mockFAQs } from '../data/mock';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/ui/accordion';

const FAQ = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <Button
          onClick={() => navigate('/')}
          variant="ghost"
          className="mb-6 text-gray-700"
        >
          <ArrowLeft className="mr-2" /> Kembali
        </Button>

        <h1 className="text-4xl font-bold text-gray-900 mb-3">Frequently Asked Questions</h1>
        <p className="text-gray-600 mb-8">Temukan jawaban untuk pertanyaan umum tentang Picapica Photo Booth</p>

        <Accordion type="single" collapsible className="w-full">
          {mockFAQs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent>
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-12 p-6 bg-pink-50 rounded-lg border border-pink-200">
          <h3 className="font-semibold text-gray-900 mb-2">Masih punya pertanyaan?</h3>
          <p className="text-gray-600 mb-4">Hubungi kami dan kami akan dengan senang hati membantu Anda!</p>
          <Button
            onClick={() => navigate('/contact')}
            className="bg-pink-500 hover:bg-pink-600 text-white"
          >
            Hubungi Kami
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
