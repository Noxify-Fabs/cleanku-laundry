import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import API_BASE_URL from '../api/config';

const Admin = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/orders`);
      if (response.data.success) {
        setOrders(response.data.orders.reverse());
      }
    } catch (err) {
      setError('Gagal mengambil data orders');
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (orderNumber, status) => {
    try {
      await axios.put(`${API_BASE_URL}/api/orders/${orderNumber}`, { status });
      fetchOrders();
    } catch (err) {
      alert('Gagal mengupdate status order');
    }
  };

  const togglePaymentStatus = async (orderNumber, currentStatus) => {
    try {
      const newStatus = currentStatus === 'paid' ? 'unpaid' : 'paid';
      await axios.put(`${API_BASE_URL}/api/orders/${orderNumber}/payment-status`, {
        paymentStatus: newStatus
      });
      fetchOrders();
    } catch (err) {
      alert('Gagal mengupdate status pembayaran');
    }
  };

  const sendWhatsAppNotification = (order) => {
    const message = `Halo ${order.name} 👋, cucian kamu dengan nomor order *${order.id}* sudah *selesai* dan siap diantar! 🧺✨

Mohon siapkan pembayaran ya.
Terima kasih sudah menggunakan CleanKu Laundry! 😊`;
    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = order.phone.startsWith('0') ? '62' + order.phone.slice(1) : order.phone;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const contactViaWhatsApp = (order) => {
    const phoneNumber = order.phone.startsWith('0') ? '62' + order.phone.slice(1) : order.phone;
    const whatsappUrl = `https://wa.me/${phoneNumber}`;
    window.open(whatsappUrl, '_blank');
  };

  const viewPaymentProof = (filename) => {
    setSelectedImage(`${API_BASE_URL}/uploads/${filename}`);
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

  const getPaymentBadgeColor = (status) => {
    return status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  if (isLoading) {
    return (
      <main className="pt-20 min-h-screen bg-light py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-20 min-h-screen bg-light py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-4 text-dark">Admin Panel</h1>
          <p className="text-gray-600">Kelola order dan status pembayaran</p>
        </motion.div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="card overflow-x-auto"
        >
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-4 font-semibold text-dark">Order ID</th>
                <th className="text-left py-4 px-4 font-semibold text-dark">Nama</th>
                <th className="text-left py-4 px-4 font-semibold text-dark">Layanan</th>
                <th className="text-left py-4 px-4 font-semibold text-dark">Status</th>
                <th className="text-left py-4 px-4 font-semibold text-dark">Pembayaran</th>
                <th className="text-left py-4 px-4 font-semibold text-dark">Bukti</th>
                <th className="text-left py-4 px-4 font-semibold text-dark">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <span className="font-medium text-primary">{order.id}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-medium">{order.name}</div>
                    <div className="text-sm text-gray-600">{order.phone}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm">
                      {Array.isArray(order.services) ? order.services.join(', ') : order.services}
                    </div>
                    <div className="text-xs text-gray-500">
                      {order.pickupDate} {order.pickupTime}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    >
                      <option value="Diterima">Diterima</option>
                      <option value="Dijemput">Dijemput</option>
                      <option value="Dicuci">Dicuci</option>
                      <option value="Disetrika">Disetrika</option>
                      <option value="Siap Antar">Siap Antar</option>
                      <option value="Selesai">Selesai</option>
                    </select>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentBadgeColor(order.paymentStatus)}`}>
                        {order.paymentStatus === 'paid' ? 'Lunas' : 'Belum Lunas'}
                      </span>
                      <button
                        onClick={() => togglePaymentStatus(order.id, order.paymentStatus)}
                        className="text-primary hover:text-blue-700 text-sm font-medium"
                        title="Toggle payment status"
                      >
                        {order.paymentStatus === 'paid' ? '✓' : '○'}
                      </button>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    {order.paymentProof ? (
                      <button
                        onClick={() => viewPaymentProof(order.paymentProof)}
                        className="text-primary hover:text-blue-700 underline text-sm"
                      >
                        Lihat Bukti
                      </button>
                    ) : (
                      <span className="text-gray-400 text-sm">-</span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => contactViaWhatsApp(order)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                        title="Hubungi via WhatsApp"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                      </button>
                      {order.status === 'Selesai' && order.paymentStatus === 'paid' && (
                        <button
                          onClick={() => sendWhatsAppNotification(order)}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                          title="Kirim Notif Selesai"
                        >
                          📱 Notif
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {orders.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Belum ada order</p>
            </div>
          )}
        </motion.div>

        {/* Image Modal */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={() => setSelectedImage(null)}>
            <div className="relative max-w-4xl max-h-screen p-4">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-2 right-2 text-white text-2xl hover:text-gray-300"
              >
                ✕
              </button>
              <img src={selectedImage} alt="Payment proof" className="max-w-full max-h-screen rounded-lg" />
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Admin;
