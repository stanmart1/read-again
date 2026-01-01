import { useState, useEffect } from 'react';
import api from '../lib/api';

export const useAuthorAnalytics = () => {
  const [overview, setOverview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOverview = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get('/author/analytics/overview');
      setOverview(response.data.stats);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch analytics');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSalesData = async (startDate, endDate) => {
    try {
      const response = await api.get('/author/analytics/sales', {
        params: { start_date: startDate, end_date: endDate }
      });
      return response.data.sales;
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Failed to fetch sales data');
    }
  };

  const fetchRevenueData = async (startDate, endDate, groupBy = 'day') => {
    try {
      const response = await api.get('/author/analytics/revenue', {
        params: { start_date: startDate, end_date: endDate, group_by: groupBy }
      });
      return response.data.revenue;
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Failed to fetch revenue data');
    }
  };

  const fetchTopBooks = async (limit = 5) => {
    try {
      const response = await api.get('/author/analytics/top-books', {
        params: { limit }
      });
      return response.data.books;
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Failed to fetch top books');
    }
  };

  const fetchBookBuyers = async (bookId, page = 1, limit = 10) => {
    try {
      const response = await api.get(`/author/analytics/books/${bookId}/buyers`, {
        params: { page, limit }
      });
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Failed to fetch book buyers');
    }
  };

  const fetchDownloadStats = async () => {
    try {
      const response = await api.get('/author/analytics/downloads');
      return response.data.downloads;
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Failed to fetch downloads');
    }
  };

  const fetchRecentOrders = async (limit = 10) => {
    try {
      const response = await api.get('/author/analytics/recent-orders', {
        params: { limit }
      });
      return response.data.orders;
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Failed to fetch recent orders');
    }
  };

  const fetchRecentReviews = async (limit = 10) => {
    try {
      const response = await api.get('/author/analytics/recent-reviews', {
        params: { limit }
      });
      return response.data.reviews;
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Failed to fetch recent reviews');
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  return {
    overview,
    isLoading,
    error,
    fetchOverview,
    fetchSalesData,
    fetchRevenueData,
    fetchTopBooks,
    fetchBookBuyers,
    fetchDownloadStats,
    fetchRecentOrders,
    fetchRecentReviews
  };
};
