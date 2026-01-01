import { useState } from 'react';
import api from '../lib/api';

export const useAuthorEarnings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEarningsSummary = async () => {
    try {
      const response = await api.get('/author/earnings/summary');
      return response.data.summary;
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Failed to fetch earnings summary');
    }
  };

  const fetchEarnings = async (page = 1, limit = 20, status = '') => {
    try {
      const response = await api.get('/author/earnings', {
        params: { page, limit, status }
      });
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Failed to fetch earnings');
    }
  };

  const fetchPayouts = async (page = 1, limit = 20) => {
    try {
      const response = await api.get('/author/payouts', {
        params: { page, limit }
      });
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Failed to fetch payouts');
    }
  };

  const requestPayout = async (amount, method, accountDetails) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post('/author/payouts/request', {
        amount,
        method,
        account_details: accountDetails
      });
      return response.data.payout;
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to request payout';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPayout = async (payoutId) => {
    try {
      const response = await api.get(`/author/payouts/${payoutId}`);
      return response.data.payout;
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Failed to fetch payout');
    }
  };

  return {
    fetchEarningsSummary,
    fetchEarnings,
    fetchPayouts,
    requestPayout,
    fetchPayout,
    isLoading,
    error
  };
};
