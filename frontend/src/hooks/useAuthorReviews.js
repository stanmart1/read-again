import { useState } from 'react';
import api from '../lib/api';

export const useAuthorReviews = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReviewStats = async () => {
    try {
      const response = await api.get('/author/reviews/stats');
      return response.data.stats;
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Failed to fetch review stats');
    }
  };

  const fetchReviews = async (page = 1, limit = 20, bookId = 0, rating = 0, responded = '') => {
    try {
      const response = await api.get('/author/reviews', {
        params: { page, limit, book_id: bookId, rating, responded }
      });
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Failed to fetch reviews');
    }
  };

  const respondToReview = async (reviewId, response) => {
    setIsLoading(true);
    setError(null);
    try {
      await api.post(`/author/reviews/${reviewId}/respond`, { response });
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to save response';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteResponse = async (reviewId) => {
    setIsLoading(true);
    setError(null);
    try {
      await api.delete(`/author/reviews/${reviewId}/response`);
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to delete response';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    fetchReviewStats,
    fetchReviews,
    respondToReview,
    deleteResponse,
    isLoading,
    error
  };
};
