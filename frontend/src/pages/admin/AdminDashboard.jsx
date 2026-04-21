import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../../api/config';

const API_URL = `${API_BASE_URL}/api`;

const AdminDashboard = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [toast, setToast] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [paymentFilter, setPaymentFilter] = useState('Semua');
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('adminAuth') !== 'true') {
      navigate('/admin/login');
      return;
    }
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [navigate]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [ordersRes, statsRes] = await Promise.all([
        axios.get(`${API_URL}/orders`),
        axios.get(`${API_URL}/orders/stats`)
      ]);
      console.log('Orders response:', ordersRes.data);
      console.log('Stats response:', statsRes.data);
      if (ordersRes.data.success) {
        setOrders(ordersRes.data.orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      }
      if (statsRes.data.success) {
        setStats(statsRes.data.stats);
      }
    } catch (err) {
      console.error('Fetch data error:', err.message);
      console.error('API URL being used:', API_BASE_URL);
      setError('Gagal mengambil data. Cek koneksi backend.');
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const updateOrderStatus = async (orderNumber, status) => {
    try {
      await axios.put(`${API_URL}/orders/${orderNumber}`, { status });
      showToast('Status berhasil diupdate!');
      fetchData();
    } catch (err) {
      showToast('Gagal mengupdate status', 'error');
    }
  };

  const nextStatus = (currentStatus) => {
    const statusOrder = ['Diterima', 'Dijemput', 'Dicuci', 'Disetrika', 'Siap Antar', 'Selesai'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    if (currentIndex < statusOrder.length - 1) {
      return statusOrder[currentIndex + 1];
    }
    return currentStatus;
  };

  const getNextStatusLabel = (currentStatus) => {
    const labels = {
      'Diterima': '✓ Proses Penjemputan',
      'Dijemput': '✓ Mulai Cuci',
      'Dicuci': '✓ Mulai Setrika',
      'Disetrika': '✓ Siap Diantar',
      'Siap Antar': '✓ Selesai',
    };
    return labels[currentStatus] || '';
  };

  const togglePaymentStatus = async (orderNumber, currentStatus) => {
    const newStatus = currentStatus === 'paid' ? 'unpaid' : 'paid';
    try {
      await axios.put(`${API_URL}/orders/${orderNumber}/payment-status`, { paymentStatus: newStatus });
      showToast(newStatus === 'paid' ? 'Pembayaran dikonfirmasi!' : 'Pembayaran dibatalkan');
      fetchData();
    } catch (err) {
      showToast('Gagal mengupdate pembayaran', 'error');
    }
  };

  const deleteOrder = async (orderNumber) => {
    try {
      await axios.delete(`${API_URL}/orders/${orderNumber}`);
      showToast('Order berhasil dihapus!');
      setShowDeleteConfirm(false);
      fetchData();
    } catch (err) {
      showToast('Gagal menghapus order', 'error');
    }
  };

  const sendWhatsApp = (order) => {
    let message = '';
    if (order.status === 'Selesai' && order.paymentStatus === 'paid') {
      message = `Halo ${order.name}, cucian kamu dengan nomor *${order.id}* sudah *selesai* dan siap diantar! 🧺✨ Terima kasih sudah menggunakan CleanKu Laundry!`;
    } else if (order.status === 'Selesai' && order.paymentStatus === 'unpaid') {
      message = `Halo ${order.name}, cucian kamu sudah selesai! Mohon siapkan pembayaran ya. 💳`;
    } else {
      message = `Halo ${order.name}, pesanan laundry kamu dengan nomor *${order.id}* sedang kami proses ya! 😊`;
    }
    const phone = order.phone.startsWith('0') ? '62' + order.phone.slice(1) : order.phone;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const getStatusColor = (status) => {
    const colors = {
      'Diterima': 'bg-blue-500',
      'Dijemput': 'bg-orange-500',
      'Dicuci': 'bg-purple-500',
      'Disetrika': 'bg-indigo-500',
      'Siap Antar': 'bg-yellow-500',
      'Selesai': 'bg-green-500',
    };
    return colors[status] || 'bg-gray-500';
  };

  const getPaymentBadgeColor = (status) => {
    return status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const isNewOrder = (createdAt) => {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    return new Date(createdAt) > oneHourAgo;
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'Semua' || order.status === statusFilter;
    const matchesPayment = paymentFilter === 'Semua' || order.paymentStatus === paymentFilter;
    return matchesSearch && matchesStatus && matchesPayment;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {toast && (
        <div className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
          {toast.message}
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-bold mb-4">Hapus Order?</h3>
            <p className="text-gray-600 mb-6">Yakin ingin menghapus order ini? Tindakan ini tidak dapat dibatalkan.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Batal</button>
              <button onClick={() => deleteOrder(orderToDelete)} className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">Hapus</button>
            </div>
          </div>
        </div>
      )}

      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Detail Order</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Nomor Order</p>
                  <p className="font-semibold">{selectedOrder.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span className={`px-3 py-1 rounded-full text-white text-sm ${getStatusColor(selectedOrder.status)}`}>{selectedOrder.status}</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Nama Pelanggan</p>
                <p className="font-semibold">{selectedOrder.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">No. WhatsApp</p>
                <p className="font-semibold">{selectedOrder.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Alamat</p>
                <p className="font-semibold">{selectedOrder.address}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Layanan</p>
                <p className="font-semibold">{Array.isArray(selectedOrder.services) ? selectedOrder.services.join(', ') : selectedOrder.services}</p>
              </div>
              {selectedOrder.weight > 0 && (
                <div>
                  <p className="text-sm text-gray-600">Estimasi Berat</p>
                  <p className="font-semibold">{selectedOrder.weight} kg</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Tanggal Pickup</p>
                  <p className="font-semibold">{selectedOrder.pickupDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Jam Pickup</p>
                  <p className="font-semibold">{selectedOrder.pickupTime}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Metode Pembayaran</p>
                <p className="font-semibold">{selectedOrder.paymentMethod === 'cash' ? 'Tunai' : 'Non-Tunai'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status Pembayaran</p>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentBadgeColor(selectedOrder.paymentStatus)}`}>
                  {selectedOrder.paymentStatus === 'paid' ? 'Lunas' : 'Belum Lunas'}
                </span>
              </div>
              {selectedOrder.paymentProof && (
                <div>
                  <p className="text-sm text-gray-600">Bukti Pembayaran</p>
                  <img src={`${API_BASE_URL}/uploads/${selectedOrder.paymentProof}`} alt="Payment proof" className="max-w-xs max-h-48 rounded-lg border border-gray-300 mt-2" />
                </div>
              )}
              {selectedOrder.notes && (
                <div>
                  <p className="text-sm text-gray-600">Catatan</p>
                  <p className="font-semibold">{selectedOrder.notes}</p>
                </div>
              )}
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={() => { setShowModal(false); updateOrderStatus(selectedOrder.id, nextStatus(selectedOrder.status)); }} className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Next Status</button>
              <button onClick={() => { setShowModal(false); togglePaymentStatus(selectedOrder.id, selectedOrder.paymentStatus); }} className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">Toggle Lunas</button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg fixed h-full">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-blue-600">CleanKu Admin</h1>
        </div>
        <nav className="p-4">
          <button
            onClick={() => setCurrentPage('dashboard')}
            className={`w-full text-left px-4 py-3 rounded-lg mb-2 ${currentPage === 'dashboard' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
          >
            📊 Dashboard
          </button>
          <button
            onClick={() => setCurrentPage('pesanan')}
            className={`w-full text-left px-4 py-3 rounded-lg mb-2 ${currentPage === 'pesanan' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
          >
            📦 Pesanan {orders.length > 0 && <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">{orders.length}</span>}
          </button>
          <button
            onClick={() => setCurrentPage('pengaturan')}
            className={`w-full text-left px-4 py-3 rounded-lg mb-2 ${currentPage === 'pengaturan' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
          >
            ⚙️ Pengaturan
          </button>
        </nav>
        <div className="absolute bottom-0 w-full p-4 border-t">
          <button
            onClick={() => { localStorage.removeItem('adminAuth'); navigate('/admin/login'); }}
            className="w-full text-left px-4 py-3 rounded-lg text-red-600 hover:bg-red-50"
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{currentPage === 'dashboard' ? 'Dashboard' : currentPage === 'pesanan' ? 'Pesanan' : 'Pengaturan'}</h2>
            <p className="text-gray-600">{new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <button onClick={fetchData} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Refresh</button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>
        )}

        {currentPage === 'dashboard' && (
          <div>
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
                <div className="bg-white p-6 rounded-lg shadow">
                  <p className="text-sm text-gray-600">Total Pesanan</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <p className="text-sm text-gray-600">Pesanan Baru</p>
                  <p className="text-3xl font-bold text-blue-500">{stats.new}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <p className="text-sm text-gray-600">Sedang Proses</p>
                  <p className="text-3xl font-bold text-orange-500">{stats.inProgress}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <p className="text-sm text-gray-600">Selesai Hari Ini</p>
                  <p className="text-3xl font-bold text-green-500">{stats.completedToday}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <p className="text-sm text-gray-600">Belum Bayar</p>
                  <p className="text-3xl font-bold text-red-500">{stats.unpaid}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <p className="text-sm text-gray-600">Sudah Bayar</p>
                  <p className="text-3xl font-bold text-green-600">{stats.paid}</p>
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold mb-4">5 Pesanan Terbaru</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">No. Order</th>
                      <th className="text-left py-3 px-4">Nama</th>
                      <th className="text-left py-3 px-4">Layanan</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Pembayaran</th>
                      <th className="text-left py-3 px-4">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map((order) => (
                      <tr key={order.id} className={`border-b ${isNewOrder(order.createdAt) ? 'bg-yellow-50' : ''}`}>
                        <td className="py-3 px-4 font-semibold">{order.id}</td>
                        <td className="py-3 px-4">{order.name}</td>
                        <td className="py-3 px-4">{Array.isArray(order.services) ? order.services.join(', ') : order.services}</td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-white text-sm ${getStatusColor(order.status)}`}>{order.status}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentBadgeColor(order.paymentStatus)}`}>
                            {order.paymentStatus === 'paid' ? 'Lunas' : 'Belum Lunas'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2 flex-wrap">
                            {order.status === 'Selesai' ? (
                              <span className="px-3 py-1 bg-green-500 text-white rounded text-sm">Selesai ✓</span>
                            ) : (
                              <button
                                onClick={() => updateOrderStatus(order.id, nextStatus(order.status))}
                                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                              >
                                {getNextStatusLabel(order.status)}
                              </button>
                            )}
                            <button
                              onClick={() => togglePaymentStatus(order.id, order.paymentStatus)}
                              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                            >
                              {order.paymentStatus === 'paid' ? 'Batal Lunas' : 'Tandai Lunas'}
                            </button>
                            <button
                              onClick={() => sendWhatsApp(order)}
                              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                            >
                              📱 WA
                            </button>
                            <button
                              onClick={() => { setSelectedOrder(order); setShowModal(true); }}
                              className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
                            >
                              Detail
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {currentPage === 'pesanan' && (
          <div>
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="flex flex-wrap gap-4">
                <input
                  type="text"
                  placeholder="Cari nama atau nomor order..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 min-w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Semua">Semua Status</option>
                  <option value="Diterima">Diterima</option>
                  <option value="Dijemput">Dijemput</option>
                  <option value="Dicuci">Dicuci</option>
                  <option value="Disetrika">Disetrika</option>
                  <option value="Siap Antar">Siap Antar</option>
                  <option value="Selesai">Selesai</option>
                </select>
                <select
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Semua">Semua Pembayaran</option>
                  <option value="paid">Sudah Bayar</option>
                  <option value="unpaid">Belum Bayar</option>
                </select>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">No. Order</th>
                      <th className="text-left py-3 px-4">Nama</th>
                      <th className="text-left py-3 px-4">WhatsApp</th>
                      <th className="text-left py-3 px-4">Layanan</th>
                      <th className="text-left py-3 px-4">Berat</th>
                      <th className="text-left py-3 px-4">Tanggal Pickup</th>
                      <th className="text-left py-3 px-4">Metode Bayar</th>
                      <th className="text-left py-3 px-4">Status Bayar</th>
                      <th className="text-left py-3 px-4">Status Order</th>
                      <th className="text-left py-3 px-4">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan="10" className="py-12 text-center text-gray-500">
                          Belum ada pesanan masuk 📭
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((order) => (
                        <tr key={order.id} className={`border-b ${isNewOrder(order.createdAt) ? 'bg-yellow-50' : ''}`}>
                          <td className="py-3 px-4 font-semibold">{order.id}</td>
                          <td className="py-3 px-4">{order.name}</td>
                          <td className="py-3 px-4">{order.phone}</td>
                          <td className="py-3 px-4 text-sm">{Array.isArray(order.services) ? order.services.join(', ') : order.services}</td>
                          <td className="py-3 px-4">{order.weight > 0 ? `${order.weight} kg` : '-'}</td>
                          <td className="py-3 px-4">{order.pickupDate} {order.pickupTime}</td>
                          <td className="py-3 px-4">{order.paymentMethod === 'cash' ? 'Tunai' : 'Non-Tunai'}</td>
                          <td className="py-3 px-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentBadgeColor(order.paymentStatus)}`}>
                              {order.paymentStatus === 'paid' ? 'Lunas' : 'Belum Lunas'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-3 py-1 rounded-full text-white text-sm ${getStatusColor(order.status)}`}>{order.status}</span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2 flex-wrap">
                              {order.status === 'Selesai' ? (
                                <span className="px-3 py-1 bg-green-500 text-white rounded text-sm">Selesai ✓</span>
                              ) : (
                                <button
                                  onClick={() => updateOrderStatus(order.id, nextStatus(order.status))}
                                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                                >
                                  {getNextStatusLabel(order.status)}
                                </button>
                              )}
                              <button
                                onClick={() => togglePaymentStatus(order.id, order.paymentStatus)}
                                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                              >
                                {order.paymentStatus === 'paid' ? 'Batal Lunas' : 'Tandai Lunas'}
                              </button>
                              <button
                                onClick={() => sendWhatsApp(order)}
                                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                              >
                                📱 WA
                              </button>
                              <button
                                onClick={() => { setSelectedOrder(order); setShowModal(true); }}
                                className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
                              >
                                👁️ Detail
                              </button>
                              <button
                                onClick={() => { setOrderToDelete(order.id); setShowDeleteConfirm(true); }}
                                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                              >
                                🗑️ Hapus
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {currentPage === 'pengaturan' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold mb-4">Pengaturan</h3>
            <p className="text-gray-600">Fitur pengaturan akan segera tersedia.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
