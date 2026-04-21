import React from 'react';
import { motion } from 'framer-motion';

const HowItWorks = () => {
  const steps = [
    {
      number: 1,
      icon: '📱',
      title: 'Order Online',
      description: 'Pilih layanan dan jadwal pickup melalui website atau WhatsApp',
    },
    {
      number: 2,
      icon: '🚗',
      title: 'Kami Pickup',
      description: 'Tim kami akan menjemput cucian Anda di lokasi yang ditentukan',
    },
    {
      number: 3,
      icon: '🧺',
      title: 'Cuci & Setrika',
      description: 'Pakaian Anda dicuci, disetrika, dan dipacking dengan rapi',
    },
    {
      number: 4,
      icon: '📦',
      title: 'Kami Antar',
      description: 'Cucian bersih dan wangi kami antar kembali ke rumah Anda',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">Cara Kerja Kami</h2>
          <p className="section-subtitle">
            Proses mudah dan cepat untuk membuat pakaian Anda bersih dan wangi
          </p>
        </motion.div>

        <div className="relative">
          {/* Connection Line (Desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent transform -translate-y-1/2 z-0"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="text-center"
              >
                <div className="relative">
                  {/* Step Number Circle */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-3xl font-bold shadow-lg"
                  >
                    {step.number}
                  </motion.div>

                  {/* Icon */}
                  <div className="text-5xl mb-4">{step.icon}</div>

                  {/* Title */}
                  <h3 className="text-xl font-bold mb-2 text-dark">{step.title}</h3>

                  {/* Description */}
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
