import { useState, useEffect } from 'react';
import api from '../lib/api';

export function useAuthorBooks() {
  const [books, setBooks] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBooks = async (page = 1, limit = 20, search = '', status = '') => {
    try {
      setIsLoading(true);
      setError(null);
      const params = new URLSearchParams({ page, limit });
      if (search) params.append('search', search);
      if (status) params.append('status', status);
      
      const response = await api.get(`/author/books?${params}`);
      setBooks(response.data.books || []);
      setPagination(response.data.pagination);
    } catch (err) {
      console.error('Failed to fetch books:', err);
      setError(err.response?.data?.error || 'Failed to load books');
    } finally {
      setIsLoading(false);
    }
  };

  const getBook = async (bookId) => {
    try {
      const response = await api.get(`/author/books/${bookId}`);
      return { success: true, book: response.data.book };
    } catch (err) {
      console.error('Failed to fetch book:', err);
      return { success: false, error: err.response?.data?.error || 'Failed to load book' };
    }
  };

  const createBook = async (bookData) => {
    try {
      const response = await api.post('/author/books', bookData);
      await fetchBooks(); // Refresh list
      return { success: true, book: response.data.book };
    } catch (err) {
      console.error('Failed to create book:', err);
      return { success: false, error: err.response?.data?.error || 'Failed to create book' };
    }
  };

  const updateBook = async (bookId, updates) => {
    try {
      const response = await api.put(`/author/books/${bookId}`, updates);
      await fetchBooks(); // Refresh list
      return { success: true, book: response.data.book };
    } catch (err) {
      console.error('Failed to update book:', err);
      return { success: false, error: err.response?.data?.error || 'Failed to update book' };
    }
  };

  const deleteBook = async (bookId) => {
    try {
      await api.delete(`/author/books/${bookId}`);
      await fetchBooks(); // Refresh list
      return { success: true };
    } catch (err) {
      console.error('Failed to delete book:', err);
      return { success: false, error: err.response?.data?.error || 'Failed to delete book' };
    }
  };

  const publishBook = async (bookId) => {
    try {
      const response = await api.post(`/author/books/${bookId}/publish`);
      await fetchBooks(); // Refresh list
      return { success: true, book: response.data.book };
    } catch (err) {
      console.error('Failed to publish book:', err);
      return { success: false, error: err.response?.data?.error || 'Failed to publish book' };
    }
  };

  const unpublishBook = async (bookId) => {
    try {
      const response = await api.post(`/author/books/${bookId}/unpublish`);
      await fetchBooks(); // Refresh list
      return { success: true, book: response.data.book };
    } catch (err) {
      console.error('Failed to unpublish book:', err);
      return { success: false, error: err.response?.data?.error || 'Failed to unpublish book' };
    }
  };

  const getBookStats = async (bookId) => {
    try {
      const response = await api.get(`/author/books/${bookId}/stats`);
      return { success: true, stats: response.data.stats };
    } catch (err) {
      console.error('Failed to fetch book stats:', err);
      return { success: false, error: err.response?.data?.error || 'Failed to load stats' };
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return {
    books,
    pagination,
    isLoading,
    error,
    fetchBooks,
    getBook,
    createBook,
    updateBook,
    deleteBook,
    publishBook,
    unpublishBook,
    getBookStats,
  };
}
