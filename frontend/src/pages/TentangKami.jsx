import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const TentangKami = () => {
  const stats = [
    { number: '1000+', label: 'Pelanggan Puas' },
    { number: '5+', label: 'Tahun Pengalaman' },
    { number: '10+', label: 'Cabang' },
    { number: '99%', label: 'Tingkat Kepuasan' },
  ];

  const values = [
    {
      icon: '💎',
      title: 'Kualitas Premium',
      description: 'Kami berkomitmen memberikan hasil laundry terbaik dengan standar kualitas tinggi',
    },
    {
      icon: '⏰',
      title: 'Tepat Waktu',
      description: 'Menghargai waktu pelanggan dengan layanan yang cepat dan tepat waktu',
    },
    {
      icon: '🤝',
      title: 'Kepercayaan',
      description: 'Membangun kepercayaan melalui layanan yang konsisten dan dapat diandalkan',
    },
    {
      icon: '🌱',
      title: 'Ramah Lingkungan',
      description: 'Menggunakan produk ramah lingkungan yang aman untuk pakaian dan bumi',
    },
  ];

  const team = [
    { name: 'Andi Pratama', role: 'Founder & CEO', avatar: 'AP' },
    { name: 'Sari Dewi', role: 'Operations Manager', avatar: 'SD' },
    { name: 'Budi Santoso', role: 'Quality Control', avatar: 'BS' },
    { name: 'Rina Wijaya', role: 'Customer Service', avatar: 'RW' },
  ];

  return (
    <main className="pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary via-secondary to-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Tentang CleanKu Laundry
            </h1>
            <p className="text-white/90 text-lg max-w-3xl mx-auto">
              Mitra terpercaya untuk kebutuhan laundry Anda sejak 2020
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="section-title">Cerita Kami</h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="prose prose-lg max-w-none"
          >
            <p className="text-gray-700 leading-relaxed mb-6">
              CleanKu Laundry didirikan pada tahun 2020 dengan visi sederhana: memberikan layanan laundry 
              berkualitas tinggi yang terjangkau bagi masyarakat Purwokerto dan sekitarnya. Berawal dari 
              sebuah usaha kecil di garasi rumah, kami telah berkembang menjadi salah satu layanan laundry 
              terpercaya dengan lebih dari 10 cabang.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              Kami percaya bahwa pakaian yang bersih dan rapi bukan hanya tentang kebersihan, tetapi juga 
              tentang kenyamanan dan kepercayaan diri. Oleh karena itu, kami selalu berkomitmen untuk 
              memberikan hasil terbaik dengan menggunakan deterjen premium dan teknologi modern.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Dengan tim profesional yang berpengalaman dan layanan antar-jemput gratis, CleanKu Laundry 
              siap membantu Anda menghemat waktu dan tenaga. Kami berterima kasih kepada lebih dari 1000 
              pelanggan yang telah mempercayakan kebutuhan laundry mereka kepada kami.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="section-title">Nilai-Nilai Kami</h2>
            <p className="section-subtitle">
              Prinsip yang memandu setiap langkah kami
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="card text-center"
              >
                <div className="text-5xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-dark">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="section-title">Tim Kami</h2>
            <p className="section-subtitle">
              Orang-orang di balik kesuksesan CleanKu Laundry
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="card text-center"
              >
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-2xl font-bold">
                  {member.avatar}
                </div>
                <h3 className="text-lg font-bold text-dark">{member.name}</h3>
                <p className="text-primary font-medium">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary via-secondary to-accent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Siap Mencoba Layanan Kami?
            </h2>
            <p className="text-white/90 text-lg mb-8">
              Bergabunglah dengan ribuan pelanggan puas yang telah mempercayakan laundry mereka kepada CleanKu
            </p>
            <Link to="/order" className="inline-block bg-white text-primary font-bold py-4 px-8 rounded-lg hover:bg-gray-100 transition-colors text-lg">
              Order Sekarang
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default TentangKami;
