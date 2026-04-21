import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { services } from '../data/services';

const Order = () => {
  const { submitOrder, isLoading, success, error, clearMessages, lastOrderNumber } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    services: [],
    weight: '',
    pickupDate: '',
    pickupTime: '09:00',
    notes: '',
    paymentMethod: '',
    paymentType: '',
    paymentProof: null,
  });
  const [showPreview, setShowPreview] = useState(false);
  const [paymentProofPreview, setPaymentProofPreview] = useState(null);

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

  const handlePaymentMethodChange = (method) => {
    setFormData((prev) => ({
      ...prev,
      paymentMethod: method,
      paymentType: '',
      paymentProof: null,
    }));
    setPaymentProofPreview(null);
  };

  const handlePaymentTypeChange = (type) => {
    setFormData((prev) => ({
      ...prev,
      paymentType: type,
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('File size must be less than 2MB');
        return;
      }
      if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
        alert('Only JPG, JPEG, and PNG files are allowed');
        return;
      }
      setFormData((prev) => ({
        ...prev,
        paymentProof: file,
      }));
      setPaymentProofPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearMessages();

    const result = await submitOrder({
      ...formData,
      weight: parseFloat(formData.weight) || 0,
    });

    if (result.success) {
      setShowPreview(false);
    }
  };

  const handlePreview = (e) => {
    e.preventDefault();
    setShowPreview(true);
  };

  const handleEdit = () => {
    setShowPreview(false);
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const calculateEstimatedPrice = () => {
    if (!formData.weight) return 0;
    let totalPrice = 0;
    formData.services.forEach((serviceName) => {
      const service = services.find((s) => s.name === serviceName);
      if (service) {
        totalPrice += service.price * parseFloat(formData.weight);
      }
    });
    return totalPrice;
  };

  const isFormValid = () => {
    const baseValid = (
      formData.name &&
      formData.phone &&
      formData.address &&
      formData.services.length > 0 &&
      formData.pickupDate &&
      formData.pickupTime &&
      formData.paymentMethod &&
      formData.paymentType
    );

    if (formData.paymentType === 'non-cash') {
      return baseValid && formData.paymentProof;
    }

    return baseValid;
  };

  if (success && lastOrderNumber) {
    return (
      <main className="pt-20 min-h-screen flex items-center justify-center bg-light">
        <div className="max-w-md mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="card text-center p-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center"
            >
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
            <h2 className="text-2xl font-bold mb-4 text-dark">Order Berhasil!</h2>
            <p className="text-gray-600 mb-6">
              Order Anda telah berhasil dibuat. Simpan nomor order ini untuk mengecek status cucian Anda.
            </p>
            <div className="bg-light p-4 rounded-lg mb-6">
              <p className="text-sm text-gray-600 mb-1">Nomor Order Anda:</p>
              <p className="text-2xl font-bold text-primary">{lastOrderNumber}</p>
            </div>
            <div className="space-y-3">
              <a
                href={`/cek-status?order=${lastOrderNumber}`}
                className="block btn-primary text-center"
              >
                Cek Status Order
              </a>
              <button
                onClick={() => {
                  clearMessages();
                  setFormData({
                    name: '',
                    phone: '',
                    address: '',
                    services: [],
                    weight: '',
                    pickupDate: '',
                    pickupTime: '09:00',
                    notes: '',
                    paymentMethod: '',
                    paymentType: '',
                    paymentProof: null,
                  });
                  setPaymentProofPreview(null);
                }}
                className="block btn-secondary w-full"
              >
                Buat Order Baru
              </button>
            </div>
          </motion.div>
        </div>
      </main>
    );
  }

  if (showPreview) {
    return (
      <main className="pt-20 min-h-screen bg-light py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
          >
            <h2 className="text-2xl font-bold mb-6 text-dark">Preview Order</h2>

            <div className="space-y-4 mb-6">
              <div>
                <p className="text-sm text-gray-600">Nama Lengkap</p>
                <p className="font-semibold">{formData.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">No. WhatsApp</p>
                <p className="font-semibold">{formData.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Alamat</p>
                <p className="font-semibold">{formData.address}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Layanan</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {formData.services.map((service) => (
                    <span key={service} className="bg-light px-3 py-1 rounded-full text-sm">
                      {service}
                    </span>
                  ))}
                </div>
              </div>
              {formData.weight && (
                <div>
                  <p className="text-sm text-gray-600">Estimasi Berat</p>
                  <p className="font-semibold">{formData.weight} kg</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-600">Tanggal Penjemputan</p>
                <p className="font-semibold">
                  {formData.pickupDate} pukul {formData.pickupTime}
                </p>
              </div>
              {formData.notes && (
                <div>
                  <p className="text-sm text-gray-600">Catatan</p>
                  <p className="font-semibold">{formData.notes}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-600">Metode Pembayaran</p>
                <p className="font-semibold">
                  {formData.paymentMethod === 'cash' ? 'Tunai (Cash)' : 'Non-Tunai'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Detail Pembayaran</p>
                <p className="font-semibold">
                  {formData.paymentType === 'pickup' && 'Bayar saat Pickup'}
                  {formData.paymentType === 'delivery' && 'Bayar saat Pengantaran'}
                  {formData.paymentType === 'bca' && 'Transfer BCA: 1234567890 a/n CleanKu Laundry'}
                  {formData.paymentType === 'mandiri' && 'Transfer Mandiri: 0987654321 a/n CleanKu Laundry'}
                  {formData.paymentType === 'bri' && 'Transfer BRI: 1234567890 a/n CleanKu Laundry'}
                  {formData.paymentType === 'qris' && 'QRIS / E-Wallet (GoPay, OVO, Dana)'}
                </p>
              </div>
              {paymentProofPreview && (
                <div>
                  <p className="text-sm text-gray-600">Bukti Pembayaran</p>
                  <img
                    src={paymentProofPreview}
                    alt="Payment proof"
                    className="max-w-xs max-h-48 rounded-lg border border-gray-300 mt-2"
                  />
                </div>
              )}
              {formData.weight && formData.services.length > 0 && (
                <div className="bg-light p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Estimasi Total</p>
                  <p className="text-2xl font-bold text-primary">
                    Rp {calculateEstimatedPrice().toLocaleString('id-ID')}
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <button onClick={handleEdit} className="btn-secondary flex-1">
                Edit
              </button>
              <button onClick={handleSubmit} disabled={isLoading} className="btn-primary flex-1 disabled:opacity-50">
                {isLoading ? 'Memproses...' : 'Konfirmasi Order'}
              </button>
            </div>
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-20 min-h-screen bg-light py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4 text-dark">Form Pemesanan</h1>
          <p className="text-gray-600">Isi formulir di bawah ini untuk membuat order laundry</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="card"
        >
          {error && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handlePreview} className="space-y-6">
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
                placeholder="08xxxxxxxxxx (10-13 digit)"
              />
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                Alamat Lengkap *
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                placeholder="Masukkan alamat lengkap untuk penjemputan"
              />
            </div>

            {/* Services */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pilih Layanan *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {services.map((service) => (
                  <label
                    key={service.id}
                    className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
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
                    <div className="flex-1">
                      <span className="font-medium">{service.icon} {service.name}</span>
                      <p className="text-sm text-gray-600">
                        Rp {service.price.toLocaleString('id-ID')}/{service.unit}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Weight */}
            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-2">
                Estimasi Berat (kg)
              </label>
              <input
                type="number"
                id="weight"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                min="0"
                step="0.1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                placeholder="Masukkan estimasi berat (opsional)"
              />
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
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                placeholder="Catatan khusus (opsional)"
              />
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Metode Pembayaran *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => handlePaymentMethodChange('cash')}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    formData.paymentMethod === 'cash'
                      ? 'border-primary bg-blue-50'
                      : 'border-gray-300 hover:border-primary'
                  }`}
                >
                  <div className="text-3xl mb-2">💵</div>
                  <div className="font-semibold">Tunai (Cash)</div>
                  <div className="text-sm text-gray-600">Bayar saat pickup/delivery</div>
                </button>
                <button
                  type="button"
                  onClick={() => handlePaymentMethodChange('non-cash')}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    formData.paymentMethod === 'non-cash'
                      ? 'border-primary bg-blue-50'
                      : 'border-gray-300 hover:border-primary'
                  }`}
                >
                  <div className="text-3xl mb-2">📱</div>
                  <div className="font-semibold">Non-Tunai</div>
                  <div className="text-sm text-gray-600">Transfer / QRIS / E-Wallet</div>
                </button>
              </div>
            </div>

            {/* Payment Type - Cash */}
            {formData.paymentMethod === 'cash' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kapan Anda ingin membayar? *
                </label>
                <div className="space-y-3">
                  <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                    formData.paymentType === 'pickup'
                      ? 'border-primary bg-blue-50'
                      : 'border-gray-300 hover:border-primary'
                  }`}>
                    <input
                      type="radio"
                      name="paymentType"
                      value="pickup"
                      checked={formData.paymentType === 'pickup'}
                      onChange={handlePaymentTypeChange}
                      className="mr-3 w-4 h-4 text-primary focus:ring-primary"
                    />
                    <div>
                      <div className="font-medium">Bayar saat Pickup</div>
                      <div className="text-sm text-gray-600">Siapkan uang tunai saat kurir menjemput cucian</div>
                    </div>
                  </label>
                  <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                    formData.paymentType === 'delivery'
                      ? 'border-primary bg-blue-50'
                      : 'border-gray-300 hover:border-primary'
                  }`}>
                    <input
                      type="radio"
                      name="paymentType"
                      value="delivery"
                      checked={formData.paymentType === 'delivery'}
                      onChange={handlePaymentTypeChange}
                      className="mr-3 w-4 h-4 text-primary focus:ring-primary"
                    />
                    <div>
                      <div className="font-medium">Bayar saat Pengantaran</div>
                      <div className="text-sm text-gray-600">Siapkan uang tunai saat kurir mengantar cucian bersih</div>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* Payment Type - Non-Cash */}
            {formData.paymentMethod === 'non-cash' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pilih Metode Pembayaran *
                </label>
                <div className="space-y-3">
                  <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                    formData.paymentType === 'bca'
                      ? 'border-primary bg-blue-50'
                      : 'border-gray-300 hover:border-primary'
                  }`}>
                    <input
                      type="radio"
                      name="paymentType"
                      value="bca"
                      checked={formData.paymentType === 'bca'}
                      onChange={handlePaymentTypeChange}
                      className="mr-3 w-4 h-4 text-primary focus:ring-primary"
                    />
                    <div>
                      <div className="font-medium">Transfer BCA</div>
                      <div className="text-sm text-gray-600">1234567890 a/n CleanKu Laundry</div>
                    </div>
                  </label>
                  <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                    formData.paymentType === 'mandiri'
                      ? 'border-primary bg-blue-50'
                      : 'border-gray-300 hover:border-primary'
                  }`}>
                    <input
                      type="radio"
                      name="paymentType"
                      value="mandiri"
                      checked={formData.paymentType === 'mandiri'}
                      onChange={handlePaymentTypeChange}
                      className="mr-3 w-4 h-4 text-primary focus:ring-primary"
                    />
                    <div>
                      <div className="font-medium">Transfer Mandiri</div>
                      <div className="text-sm text-gray-600">0987654321 a/n CleanKu Laundry</div>
                    </div>
                  </label>
                  <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                    formData.paymentType === 'bri'
                      ? 'border-primary bg-blue-50'
                      : 'border-gray-300 hover:border-primary'
                  }`}>
                    <input
                      type="radio"
                      name="paymentType"
                      value="bri"
                      checked={formData.paymentType === 'bri'}
                      onChange={handlePaymentTypeChange}
                      className="mr-3 w-4 h-4 text-primary focus:ring-primary"
                    />
                    <div>
                      <div className="font-medium">Transfer BRI</div>
                      <div className="text-sm text-gray-600">1234567890 a/n CleanKu Laundry</div>
                    </div>
                  </label>
                  <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                    formData.paymentType === 'qris'
                      ? 'border-primary bg-blue-50'
                      : 'border-gray-300 hover:border-primary'
                  }`}>
                    <input
                      type="radio"
                      name="paymentType"
                      value="qris"
                      checked={formData.paymentType === 'qris'}
                      onChange={handlePaymentTypeChange}
                      className="mr-3 w-4 h-4 text-primary focus:ring-primary"
                    />
                    <div>
                      <div className="font-medium">QRIS / E-Wallet</div>
                      <div className="text-sm text-gray-600">GoPay, OVO, Dana, dll</div>
                    </div>
                  </label>
                </div>

                {/* Payment Proof Upload */}
                <div className="mt-4">
                  <label htmlFor="paymentProof" className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Bukti Pembayaran * (Max 2MB, JPG/PNG)
                  </label>
                  <input
                    type="file"
                    id="paymentProof"
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={handleFileUpload}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  />
                  {paymentProofPreview && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 mb-2">Preview:</p>
                      <img
                        src={paymentProofPreview}
                        alt="Payment proof preview"
                        className="max-w-xs max-h-64 rounded-lg border border-gray-300"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={!isFormValid()}
              className="w-full btn-primary text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Preview Order
            </motion.button>
          </form>
        </motion.div>
      </div>
    </main>
  );
};

export default Order;
