import { useState } from 'react';
import api from '../lib/api';

export const useAuthorOrders = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrderStats = async () => {
    try {
      const response = await api.get('/author/orders/stats');
      return response.data.stats;
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Failed to fetch order stats');
    }
  };

  const fetchOrders = async (page = 1, limit = 20, status = '', search = '') => {
    try {
      const response = await api.get('/author/orders', {
        params: { page, limit, status, search }
      });
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Failed to fetch orders');
    }
  };

  const fetchOrder = async (orderId) => {
    try {
      const response = await api.get(`/author/orders/${orderId}`);
      return response.data.order;
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Failed to fetch order');
    }
  };

  return {
    fetchOrderStats,
    fetchOrders,
    fetchOrder,
    isLoading,
    error
  };
};
