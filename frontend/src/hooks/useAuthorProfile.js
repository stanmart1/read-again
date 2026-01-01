import { useState } from 'react';
import api from '../lib/api';
import { uploadProfile } from '../lib/fileService';

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
      // Upload to upload service
      const result = await uploadProfile(file);
      
      // Send path to backend
      const response = await api.post('/author/profile/photo', {
        photo: result.path
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
