import React from 'react';
import HeroSection from '../components/HeroSection';
import HowItWorks from '../components/HowItWorks';
import ServiceCard from '../components/ServiceCard';
import WhyChooseUs from '../components/WhyChooseUs';
import Testimonials from '../components/Testimonials';
import FAQSection from '../components/FAQSection';
import MiniOrderForm from '../components/MiniOrderForm';
import { services } from '../data/services';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <main>
      <HeroSection />
      <HowItWorks />
      
      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="section-title">Layanan Kami</h2>
            <p className="section-subtitle">
              Berbagai layanan laundry profesional untuk memenuhi kebutuhan Anda
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>

          <div className="text-center">
            <Link to="/layanan" className="btn-secondary inline-block">
              Lihat Semua Layanan
            </Link>
          </div>
        </div>
      </section>

      <WhyChooseUs />
      <MiniOrderForm />
      <Testimonials />
      <FAQSection />
    </main>
  );
};

export default Home;
