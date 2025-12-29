import { useState, useEffect } from 'react';
import api from '../../../lib/api';

export default function RedisManagement() {
  const [redisStatus, setRedisStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [flushing, setFlushing] = useState(false);
  const [toggling, setToggling] = useState(false);

  const fetchRedisStatus = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/redis/status');
      setRedisStatus(response.data);
    } catch (error) {
      console.error('Error fetching Redis status:', error);
      setRedisStatus({ enabled: false, connected: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const refreshRedisSettings = async () => {
    try {
      setRefreshing(true);
      await api.post('/admin/redis/refresh-setting');
      await fetchRedisStatus();
    } catch (error) {
      console.error('Error refreshing Redis settings:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const toggleRedis = async (enabled) => {
    try {
      setToggling(true);
      await api.put('/admin/system-settings/redis_enabled', { value: enabled });
      await refreshRedisSettings();
      alert(`Redis ${enabled ? 'enabled' : 'disabled'} successfully`);
    } catch (error) {
      console.error('Error toggling Redis:', error);
      alert(`Error toggling Redis: ${error.message}`);
    } finally {
      setToggling(false);
    }
  };

  const flushRedis = async () => {
    if (!confirm('Are you sure you want to flush all Redis data? This action cannot be undone.')) {
      return;
    }

    try {
      setFlushing(true);
      const response = await api.delete('/admin/redis/flush?confirm=true');
      if (response.data.success) {
        alert('Redis data flushed successfully');
        await fetchRedisStatus();
      } else {
        alert(`Error: ${response.data.error}`);
      }
    } catch (error) {
      console.error('Error flushing Redis:', error);
      alert(`Error flushing Redis: ${error.message}`);
    } finally {
      setFlushing(false);
    }
  };

  useEffect(() => {
    fetchRedisStatus();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Redis Enable/Disable Toggle */}
      <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-4 border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-foreground mb-1">Redis Caching</h4>
            <p className="text-sm text-muted-foreground">Enable or disable Redis for caching and rate limiting</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={redisStatus?.enabled || false}
              onChange={(e) => toggleRedis(e.target.checked)}
              disabled={toggling}
              className="sr-only peer"
            />
            <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-card after:border-input after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary peer-disabled:opacity-50"></div>
          </label>
        </div>
      </div>

      {/* Redis Status */}
      <div className="bg-muted rounded-lg p-4">
        <h4 className="font-medium text-foreground mb-3">Redis Status</h4>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Enabled:</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              redisStatus?.enabled 
                ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' 
                : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
            }`}>
              {redisStatus?.enabled ? 'Yes' : 'No'}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Connected:</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              redisStatus?.connected 
                ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' 
                : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
            }`}>
              {redisStatus?.connected ? 'Yes' : 'No'}
            </span>
          </div>
          
          {redisStatus?.version && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Version:</span>
              <span className="text-sm text-foreground">{redisStatus.version}</span>
            </div>
          )}
          
          {redisStatus?.used_memory && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Memory Used:</span>
              <span className="text-sm text-foreground">{redisStatus.used_memory}</span>
            </div>
          )}
          
          {redisStatus?.connected_clients && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Connected Clients:</span>
              <span className="text-sm text-foreground">{redisStatus.connected_clients}</span>
            </div>
          )}
          
          {redisStatus?.uptime_days && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Uptime (days):</span>
              <span className="text-sm text-foreground">{redisStatus.uptime_days}</span>
            </div>
          )}
          
          {redisStatus?.error && (
            <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded">
              Error: {redisStatus.error}
            </div>
          )}
          
          {redisStatus?.message && (
            <div className="text-sm text-primary bg-primary/10 p-2 rounded">
              {redisStatus.message}
            </div>
          )}
        </div>
      </div>

      {/* Redis Actions */}
      <div className="space-y-3">
        <button
          onClick={fetchRedisStatus}
          disabled={loading}
          className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Checking...' : 'Refresh Status'}
        </button>
        
        <button
          onClick={refreshRedisSettings}
          disabled={refreshing}
          className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          {refreshing ? 'Refreshing...' : 'Refresh Settings Cache'}
        </button>
        
        {redisStatus?.enabled && redisStatus?.connected && (
          <button
            onClick={flushRedis}
            disabled={flushing}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            {flushing ? 'Flushing...' : 'Flush All Redis Data'}
          </button>
        )}
      </div>

      {/* Information */}
      <div className="bg-primary/10 border border-blue-200 rounded-lg p-4">
        <h5 className="font-medium text-blue-800 mb-2">About Redis</h5>
        <div className="text-sm text-blue-700 space-y-1">
          <p>• Redis is used for caching and rate limiting</p>
          <p>• The application works fully without Redis</p>
          <p>• Disabling Redis will use in-memory fallbacks</p>
          <p>• Changes to the Redis setting take effect immediately</p>
        </div>
      </div>
    </div>
  );
}