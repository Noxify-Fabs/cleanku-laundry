import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { services } from '../data/services';
import { Link } from 'react-router-dom';

const MiniOrderForm = () => {
  const { submitOrder, isLoading, success, error, clearMessages } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    services: [],
    pickupDate: '',
    pickupTime: '09:00',
    notes: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleServiceChange = (serviceName) => {
    setFormData((prev) => {
      const newServices = prev.services.includes(serviceName)
        ? prev.services.filter((s) => s !== serviceName)
        : [...prev.services, serviceName];
      return { ...prev, services: newServices };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearMessages();

    const result = await submitOrder({
      ...formData,
      weight: 0,
    });

    if (result.success) {
      setFormData({
        name: '',
        phone: '',
        address: '',
        services: [],
        pickupDate: '',
        pickupTime: '09:00',
        notes: '',
      });
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <section className="py-20 bg-gradient-to-br from-primary via-secondary to-accent">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="section-title text-white">Reservasi Cepat</h2>
          <p className="text-white/90 text-lg">
            Jadwalkan pickup cucian Anda sekarang dengan mudah
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="card"
        >
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg"
            >
              <p className="font-semibold">{success}</p>
              <p className="text-sm mt-1">
                Simpan nomor order Anda untuk mengecek status cucian.
              </p>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Nama Lengkap *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                placeholder="Masukkan nama lengkap"
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                No. WhatsApp *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                pattern="[0-9]{10,13}"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                placeholder="08xxxxxxxxxx"
              />
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                Alamat Penjemputan *
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                rows="2"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                placeholder="Masukkan alamat lengkap"
              />
            </div>

            {/* Services */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pilih Layanan *
              </label>
              <div className="grid grid-cols-2 gap-3">
                {services.slice(0, 6).map((service) => (
                  <label
                    key={service.id}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
                      formData.services.includes(service.name)
                        ? 'border-primary bg-blue-50'
                        : 'border-gray-300 hover:border-primary'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.services.includes(service.name)}
                      onChange={() => handleServiceChange(service.name)}
                      className="mr-3 w-4 h-4 text-primary focus:ring-primary"
                    />
                    <span className="text-sm">{service.icon} {service.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Pickup Date & Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="pickupDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal Penjemputan *
                </label>
                <input
                  type="date"
                  id="pickupDate"
                  name="pickupDate"
                  value={formData.pickupDate}
                  onChange={handleChange}
                  min={getMinDate()}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label htmlFor="pickupTime" className="block text-sm font-medium text-gray-700 mb-2">
                  Jam Penjemputan *
                </label>
                <input
                  type="time"
                  id="pickupTime"
                  name="pickupTime"
                  value={formData.pickupTime}
                  onChange={handleChange}
                  min="08:00"
                  max="20:00"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                Catatan Tambahan
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="2"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                placeholder="Catatan khusus (opsional)"
              />
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Memproses...' : 'Jadwalkan Pickup'}
            </motion.button>

            <p className="text-center text-sm text-gray-600">
              Atau <Link to="/order" className="text-primary font-semibold hover:underline">isi form lengkap</Link> untuk detail lebih
            </p>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default MiniOrderForm;
