import React from 'react';
import { motion } from 'framer-motion';

const WhyChooseUs = () => {
  const features = [
    {
      icon: '✅',
      title: 'Bersih & Higienis',
      description: 'Menggunakan deterjen premium dan proses sterilisasi untuk hasil maksimal',
    },
    {
      icon: '⚡',
      title: 'Express 3 Jam',
      description: 'Layanan cepat selesai dalam 3 jam untuk kebutuhan mendesak Anda',
    },
    {
      icon: '🚗',
      title: 'Antar Jemput Gratis',
      description: 'Nikmati layanan antar-jemput gratis tanpa biaya tambahan',
    },
    {
      icon: '💳',
      title: 'Pembayaran Mudah',
      description: 'Berbagai metode pembayaran: transfer, e-wallet, atau cash',
    },
    {
      icon: '👨‍💼',
      title: 'Tim Profesional',
      description: 'Tim berpengalaman yang terlatih untuk menangani berbagai jenis pakaian',
    },
    {
      icon: '⭐',
      title: 'Sudah Dipercaya 1000+ Pelanggan',
      description: 'Telah melayani ribuan pelanggan dengan tingkat kepuasan tinggi',
    },
  ];

  return (
    <section className="py-20 bg-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">Mengapa Harus CleanKu?</h2>
          <p className="section-subtitle">
            Keunggulan yang membuat kami menjadi pilihan terbaik untuk kebutuhan laundry Anda
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="card text-center"
            >
              <motion.div
                whileHover={{ scale: 1.2, rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.5 }}
                className="text-5xl mb-4"
              >
                {feature.icon}
              </motion.div>
              <h3 className="text-xl font-bold mb-3 text-dark">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
