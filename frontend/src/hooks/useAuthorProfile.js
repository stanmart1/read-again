import { useState } from 'react';
import api from '../utils/api';

export const useAuthorProfile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/author/profile');
      return response.data.profile;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch profile');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put('/author/profile', data);
      return response.data.profile;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePhoto = async (file) => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('photo', file);
      const response = await api.post('/author/profile/photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data.photo;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to upload photo');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { fetchProfile, updateProfile, updatePhoto, loading, error };
};
