import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import API_BASE_URL from '../api/config';

const CekStatus = () => {
  const [searchParams] = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(searchParams.get('order') || '');
  const { checkStatus, statusResult, isLoading, error, clearMessages } = useApp();

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearMessages();
    
    if (!orderNumber.trim()) {
      return;
    }

    await checkStatus(orderNumber.trim());
  };

  const getStatusProgress = (status) => {
    const statusOrder = ['Diterima', 'Dijemput', 'Dicuci', 'Disetrika', 'Siap Antar', 'Selesai'];
    const currentIndex = statusOrder.indexOf(status);
    return currentIndex >= 0 ? currentIndex + 1 : 0;
  };

  const getStatusColor = (status) => {
    const colors = {
      'Diterima': 'bg-blue-500',
      'Dijemput': 'bg-yellow-500',
      'Dicuci': 'bg-purple-500',
      'Disetrika': 'bg-pink-500',
      'Siap Antar': 'bg-orange-500',
      'Selesai': 'bg-green-500',
    };
    return colors[status] || 'bg-gray-500';
  };

  const statusSteps = ['Diterima', 'Dijemput', 'Dicuci', 'Disetrika', 'Siap Antar', 'Selesai'];

  return (
    <main className="pt-20 min-h-screen bg-light py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4 text-dark">Cek Status Cucian</h1>
          <p className="text-gray-600">Masukkan nomor order untuk melihat status cucian Anda</p>
        </motion.div>

        {/* Search Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="card mb-8"
        >
          <form onSubmit={handleSubmit} className="flex gap-4">
            <input
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="Contoh: CLK-20250419-0001"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all uppercase"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={isLoading || !orderNumber.trim()}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Mencari...' : 'Cek Status'}
            </motion.button>
          </form>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card bg-red-50 border-red-200 mb-8"
          >
            <div className="text-center">
              <svg className="w-12 h-12 mx-auto mb-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Status Result */}
        {statusResult && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="card"
          >
            {/* Order Info */}
            <div className="text-center mb-8 pb-8 border-b border-gray-200">
              <div className="inline-block bg-primary/10 px-4 py-2 rounded-full mb-4">
                <span className="text-primary font-semibold">{statusResult.id}</span>
              </div>
              <h2 className="text-2xl font-bold text-dark mb-2">{statusResult.name}</h2>
              <p className="text-gray-600">
                {statusResult.services.join(', ')}
              </p>
              {statusResult.weight > 0 && (
                <p className="text-gray-600 mt-1">
                  Estimasi Berat: {statusResult.weight} kg
                </p>
              )}
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-6 text-center text-dark">Progress Order</h3>
              <div className="relative">
                {/* Progress Lines */}
                <div className="absolute top-5 left-0 right-0 h-1 flex">
                  {statusSteps.map((_, index) => {
                    if (index === statusSteps.length - 1) return null;
                    const currentIndex = statusSteps.indexOf(statusResult.status);
                    const isLineFilled = index < currentIndex;
                    return (
                      <div
                        key={index}
                        className={`flex-1 h-1 ${isLineFilled ? 'bg-blue-500' : 'bg-gray-300'}`}
                      />
                    );
                  })}
                </div>

                {/* Steps */}
                <div className="relative flex justify-between">
                  {statusSteps.map((step, index) => {
                    const currentIndex = statusSteps.indexOf(statusResult.status);
                    const isCompleted = index < currentIndex;
                    const isCurrent = index === currentIndex;
                    const isPending = index > currentIndex;

                    return (
                      <div key={step} className="flex flex-col items-center">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-lg z-10 transition-all ${
                            isCompleted ? 'bg-blue-500' : isCurrent ? 'bg-blue-500 animate-pulse' : 'bg-gray-300'
                          }`}
                        >
                          {isCompleted ? '✓' : isCurrent ? '●' : '○'}
                        </motion.div>
                        <span className={`text-xs mt-2 font-medium ${
                          isCompleted || isCurrent ? 'text-blue-600' : 'text-gray-400'
                        }`}>
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Current Status */}
            <div className="bg-light p-6 rounded-lg text-center">
              <p className="text-sm text-gray-600 mb-2">Status Saat Ini</p>
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring' }}
                className={`inline-block px-6 py-3 rounded-full text-white font-bold text-lg ${getStatusColor(statusResult.status)}`}
              >
                {statusResult.status}
              </motion.div>
            </div>

            {/* Pickup Info */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-light p-4 rounded-lg">
                <p className="text-sm text-gray-600">Tanggal Penjemputan</p>
                <p className="font-semibold">{statusResult.pickupDate}</p>
              </div>
              <div className="bg-light p-4 rounded-lg">
                <p className="text-sm text-gray-600">Jam Penjemputan</p>
                <p className="font-semibold">{statusResult.pickupTime}</p>
              </div>
            </div>

            {/* Payment Information */}
            {statusResult.paymentMethod && (
              <div className="mt-6 bg-light p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 text-dark">Informasi Pembayaran</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Metode Pembayaran</p>
                    <p className="font-semibold">
                      {statusResult.paymentMethod === 'cash' ? 'Tunai (Cash)' : 'Non-Tunai'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Detail</p>
                    <p className="font-semibold">
                      {statusResult.paymentType === 'pickup' && 'Bayar saat Pickup'}
                      {statusResult.paymentType === 'delivery' && 'Bayar saat Pengantaran'}
                      {statusResult.paymentType === 'bca' && 'Transfer BCA'}
                      {statusResult.paymentType === 'mandiri' && 'Transfer Mandiri'}
                      {statusResult.paymentType === 'bri' && 'Transfer BRI'}
                      {statusResult.paymentType === 'qris' && 'QRIS / E-Wallet'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status Pembayaran</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      statusResult.paymentStatus === 'paid' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {statusResult.paymentStatus === 'paid' ? 'Lunas' : 'Belum Lunas'}
                    </span>
                  </div>
                  {statusResult.paymentProof && (
                    <div>
                      <p className="text-sm text-gray-600">Bukti Pembayaran</p>
                      <img
                        src={`${API_BASE_URL}/uploads/${statusResult.paymentProof}`}
                        alt="Payment proof"
                        className="max-w-xs max-h-48 rounded-lg border border-gray-300 mt-2"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Congratulations Message */}
            {statusResult.status === 'Selesai' && statusResult.paymentStatus === 'paid' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 bg-green-50 p-6 rounded-lg text-center"
              >
                <div className="text-5xl mb-3">🎉</div>
                <h3 className="text-xl font-bold text-green-800 mb-2">Selamat!</h3>
                <p className="text-green-700">
                  Cucian Anda sudah selesai dan pembayaran telah lunas. Terima kasih telah menggunakan CleanKu Laundry!
                </p>
              </motion.div>
            )}

            {statusResult.notes && (
              <div className="mt-4 bg-light p-4 rounded-lg">
                <p className="text-sm text-gray-600">Catatan</p>
                <p className="font-semibold">{statusResult.notes}</p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </main>
  );
};

export default CekStatus;
