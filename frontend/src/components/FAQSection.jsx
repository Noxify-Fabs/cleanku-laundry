import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: 'Berapa lama proses laundry?',
      answer: 'Proses laundry standar kami membutuhkan waktu 1-2 hari. Namun, kami juga menyediakan layanan express 3 jam untuk kebutuhan mendesak Anda.',
    },
    {
      question: 'Apakah ada layanan express?',
      answer: 'Ya, kami menyediakan layanan Express 3 Jam dengan harga Rp 15.000/kg. Layanan ini cocok untuk Anda yang membutuhkan pakaian bersih dalam waktu singkat.',
    },
    {
      question: 'Apakah tersedia layanan antar-jemput?',
      answer: 'Tentu saja! Kami menyediakan layanan antar-jemput gratis untuk area Purwokerto dan sekitarnya. Tim kami akan menjemput dan mengantar cucian Anda sesuai jadwal.',
    },
    {
      question: 'Bagaimana cara cek status cucian?',
      answer: 'Anda dapat mengecek status cucian dengan memasukkan nomor order di halaman "Cek Status" pada website kami. Anda juga bisa menghubungi kami via WhatsApp untuk informasi lebih lanjut.',
    },
    {
      question: 'Metode pembayaran apa saja yang tersedia?',
      answer: 'Kami menerima berbagai metode pembayaran: transfer bank, e-wallet (GoPay, OVO, Dana), atau pembayaran tunai saat cucian diantar.',
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-light">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">Pertanyaan Umum</h2>
          <p className="section-subtitle">
            Temukan jawaban untuk pertanyaan yang sering diajukan
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="card overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
                aria-expanded={openIndex === index}
              >
                <span className="font-semibold text-dark">{faq.question}</span>
                <motion.span
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-primary"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </motion.span>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-4 text-gray-600">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
