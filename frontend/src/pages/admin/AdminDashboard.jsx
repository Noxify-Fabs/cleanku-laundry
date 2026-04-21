import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../../api/config';

const API_URL = `${API_BASE_URL}/api`;

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin is logged in
    if (localStorage.getItem('adminAuth') !== 'true') {
      navigate('/admin/login');
      return;
    }
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, [navigate]);

  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/orders`);
      if (response.data.success) {
        setOrders(response.data.orders);
      }
    } catch (err) {
      setError('Gagal mengambil data orders');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    navigate('/admin/login');
  };

  const getPaymentBadgeColor = (status) => {
    return status === 'paid' ? '#d1fae5' : '#fee2e2';
  };

  const getPaymentTextColor = (status) => {
    return status === 'paid' ? '#065f46' : '#991b1b';
  };

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '48px', height: '48px', border: '4px solid #2563eb', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }}></div>
          <p style={{ marginTop: '16px', color: '#4b5563' }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      <div style={{ backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>Admin Dashboard</h1>
            <p style={{ fontSize: '14px', color: '#6b7280' }}>Kelola order dan status pembayaran</p>
          </div>
          <button
            onClick={handleLogout}
            style={{ backgroundColor: '#ef4444', color: 'white', padding: '8px 16px', borderRadius: '8px', fontWeight: '500', cursor: 'pointer' }}
          >
            Logout
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 16px' }}>
        {error && (
          <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#fee2e2', color: '#b91c1c', borderRadius: '8px' }}>
            {error}
          </div>
        )}

        <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 10px 15px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%' }}>
              <thead style={{ backgroundColor: '#f9fafb' }}>
                <tr>
                  <th style={{ textAlign: 'left', padding: '16px', fontWeight: '600', color: '#374151' }}>Order ID</th>
                  <th style={{ textAlign: 'left', padding: '16px', fontWeight: '600', color: '#374151' }}>Nama</th>
                  <th style={{ textAlign: 'left', padding: '16px', fontWeight: '600', color: '#374151' }}>Layanan</th>
                  <th style={{ textAlign: 'left', padding: '16px', fontWeight: '600', color: '#374151' }}>Status</th>
                  <th style={{ textAlign: 'left', padding: '16px', fontWeight: '600', color: '#374151' }}>Pembayaran</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '16px' }}>
                      <span style={{ fontWeight: '500', color: '#2563eb' }}>{order.id}</span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ fontWeight: '500' }}>{order.name}</div>
                      <div style={{ fontSize: '14px', color: '#6b7280' }}>{order.phone}</div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ fontSize: '14px' }}>
                        {Array.isArray(order.services) ? order.services.join(', ') : order.services}
                      </div>
                      <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                        {order.pickupDate} {order.pickupTime}
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ padding: '8px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: '500', backgroundColor: getPaymentBadgeColor(order.paymentStatus), color: getPaymentTextColor(order.paymentStatus) }}>
                        {order.paymentStatus === 'paid' ? 'Lunas' : 'Belum Lunas'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {orders.length === 0 && (
              <div style={{ textAlign: 'center', padding: '48px' }}>
                <p style={{ color: '#6b7280' }}>Belum ada order</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
