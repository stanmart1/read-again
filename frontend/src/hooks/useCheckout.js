import { useState, useEffect } from 'react';
import api from '../lib/api';

export function useCheckout() {
  const [paymentGateways, setPaymentGateways] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch payment gateways
        try {
          const paymentRes = await api.get('/payment-gateways');
          setPaymentGateways(paymentRes.data.gateways || paymentRes.data || []);
        } catch (paymentErr) {
          console.error('Failed to load payment gateways:', paymentErr);
          // Provide fallback payment options
          setPaymentGateways([
            { id: 'flutterwave', name: 'Flutterwave', description: 'Pay with card or bank transfer', enabled: true },
            { id: 'bank_transfer', name: 'Bank Transfer', description: 'Direct bank transfer', enabled: true }
          ]);
        }
      } catch (err) {
        console.error('Checkout data loading error:', err);
        setError(err.response?.data?.detail || err.message || 'Failed to load checkout data');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  return { paymentGateways, isLoading, error };
}
