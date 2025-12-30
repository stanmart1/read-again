import { useState, useEffect } from 'react';
import api from '../lib/api';

export function useAuthorDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get('/author/dashboard');
      setDashboard(response.data.data);
    } catch (err) {
      console.error('Failed to fetch author dashboard:', err);
      setError(err.response?.data?.error || 'Failed to load dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return { dashboard, isLoading, error, refetch: fetchDashboard };
}

export function useAuthorProfile() {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get('/author/profile');
      setProfile(response.data.author);
    } catch (err) {
      console.error('Failed to fetch author profile:', err);
      setError(err.response?.data?.error || 'Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates) => {
    try {
      setError(null);
      const response = await api.put('/author/profile', updates);
      setProfile(response.data.author);
      return { success: true, author: response.data.author };
    } catch (err) {
      console.error('Failed to update author profile:', err);
      const errorMsg = err.response?.data?.error || 'Failed to update profile';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return { profile, isLoading, error, updateProfile, refetch: fetchProfile };
}
