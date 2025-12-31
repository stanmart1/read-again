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
    fetchTopBooks
  };
};
