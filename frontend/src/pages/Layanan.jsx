import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ServiceCard from '../components/ServiceCard';
import { services, categories } from '../data/services';

const Layanan = () => {
  const [activeCategory, setActiveCategory] = useState('Semua');

  const filteredServices = activeCategory === 'Semua'
    ? services
    : services.filter(service => service.category === activeCategory);

  return (
    <main className="pt-20">
      <section className="py-20 bg-gradient-to-br from-primary via-secondary to-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Layanan Kami
            </h1>
            <p className="text-white/90 text-lg max-w-2xl mx-auto">
              Pilih layanan yang sesuai dengan kebutuhan Anda
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  activeCategory === category
                    ? 'bg-primary text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>

          {filteredServices.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-gray-500 text-lg">Tidak ada layanan di kategori ini</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-light">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-4 text-dark">
              Siap untuk Membuat Pakaian Anda Bersih?
            </h2>
            <p className="text-gray-600 mb-8">
              Pesan layanan laundry sekarang dan nikmati kemudahan antar-jemput gratis
            </p>
            <Link to="/order" className="btn-primary inline-block text-lg px-8 py-4">
              Order Sekarang
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default Layanan;
