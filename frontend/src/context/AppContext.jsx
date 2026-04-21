import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';
import API_BASE_URL from '../api/config';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

const API_URL = `${API_BASE_URL}/api`;

export const AppProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [lastOrderNumber, setLastOrderNumber] = useState('');
  const [statusResult, setStatusResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(localStorage.getItem('adminAuth') === 'true');

  const submitOrder = useCallback(async (orderData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const formData = new FormData();
      
      // Add all fields to FormData
      Object.keys(orderData).forEach(key => {
        if (key === 'services') {
          formData.append(key, JSON.stringify(orderData[key]));
        } else if (key === 'paymentProof' && orderData[key] instanceof File) {
          formData.append('paymentProof', orderData[key]);
        } else {
          formData.append(key, orderData[key]);
        }
      });
      
      const response = await axios.post(`${API_URL}/orders`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.data.success) {
        const newOrder = response.data.order;
        setOrders(prev => [...prev, newOrder]);
        setLastOrderNumber(newOrder.id);
        setSuccess('Order berhasil dibuat!');
        return { success: true, order: newOrder };
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Gagal membuat order. Silakan coba lagi.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const checkStatus = useCallback(async (orderNumber) => {
    setIsLoading(true);
    setError(null);
    setStatusResult(null);
    
    try {
      const response = await axios.get(`${API_URL}/orders/${orderNumber}`);
      
      if (response.data.success) {
        setStatusResult(response.data.order);
        return { success: true, order: response.data.order };
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Order tidak ditemukan. Periksa nomor order Anda.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetStatus = useCallback(() => {
    setStatusResult(null);
    setError(null);
    setSuccess(null);
  }, []);

  const clearMessages = useCallback(() => {
    setError(null);
    setSuccess(null);
  }, []);

  const value = {
    orders,
    lastOrderNumber,
    statusResult,
    isLoading,
    error,
    success,
    isAdminLoggedIn,
    setIsAdminLoggedIn,
    submitOrder,
    checkStatus,
    resetStatus,
    clearMessages
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
