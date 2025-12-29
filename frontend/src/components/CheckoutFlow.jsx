import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks';
import { useCheckout } from '../hooks/useCheckout';
import api from '../lib/api';
import { validateCheckoutData, formatCheckoutRequest, validateCartItems } from '../utils/checkoutValidation';

export default function CheckoutFlow({ cartItems, onComplete, onCancel }) {
  const { user, getUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(() => {
    const saved = sessionStorage.getItem('checkoutStep');
    return saved ? parseInt(saved) : 1;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState(() => {
    const saved = sessionStorage.getItem('checkoutFormData');
    return saved ? JSON.parse(saved) : {
      customer: {
        first_name: '',
        last_name: '',
        email: '',
        phone: ''
      },
      payment: {
        method: 'flutterwave'
      }
    };
  });

  // Autofill user details only once when component mounts
  useEffect(() => {
    const currentUser = getUser();
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        customer: {
          ...prev.customer,
          first_name: currentUser.first_name || prev.customer.first_name,
          last_name: currentUser.last_name || prev.customer.last_name,
          email: currentUser.email || prev.customer.email,
          phone: currentUser.phone || prev.customer.phone
        }
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Analyze cart for totals
  const analyzeCart = useCallback(() => {
    if (!cartItems || cartItems.length === 0) return null;
    
    const subtotal = cartItems.reduce((sum, item) => 
      sum + (parseFloat(item.book?.price || 0) * parseInt(item.quantity || 0)), 0
    );
    
    const tax = Math.round(subtotal * 0.075);
    const total = subtotal + tax;

    return { subtotal, tax, total, totalItems: cartItems.reduce((sum, item) => sum + item.quantity, 0) };
  }, [cartItems]);

  const analytics = analyzeCart();
  
  const { paymentGateways, isLoading: isLoadingCheckoutData, error: checkoutDataError } = useCheckout();
  
  // Handle checkout data loading errors
  useEffect(() => {
    if (checkoutDataError) {
      setError(`Failed to load checkout data: ${checkoutDataError}`);
    }
  }, [checkoutDataError]);

  const generateSteps = useCallback(() => {
    if (!analytics) return [];
    return [
      { id: 1, title: 'Customer Information', description: 'Contact details', icon: 'ri-user-line' },
      { id: 2, title: 'Payment', description: 'Complete purchase', icon: 'ri-bank-card-line' }
    ];
  }, [analytics]);



  const updateFormData = (section, data) => {
    setFormData(prev => {
      const updated = {
        ...prev,
        [section]: { ...prev[section], ...data }
      };
      sessionStorage.setItem('checkoutFormData', JSON.stringify(updated));
      return updated;
    });
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        return !!(formData.customer.first_name && formData.customer.last_name && formData.customer.email);
      default:
        return true;
    }
  };

  const nextStep = () => {
    const steps = generateSteps();
    if (validateStep(currentStep) && currentStep < steps.length) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      sessionStorage.setItem('checkoutStep', newStep.toString());
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
      sessionStorage.setItem('checkoutStep', newStep.toString());
    }
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Validate cart items
      const cartErrors = validateCartItems(cartItems);
      if (cartErrors.length > 0) {
        throw new Error(cartErrors.join(', '));
      }

      // Validate checkout data
      const validationErrors = validateCheckoutData(formData, analytics);
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }

      const checkoutData = formatCheckoutRequest(formData, analytics);
      
      const response = await api.post('/checkout', checkoutData);

      if (response.data.success) {
        sessionStorage.removeItem('checkoutStep');
        sessionStorage.removeItem('checkoutFormData');
        onComplete(response.data);
      } else {
        throw new Error(response.data.error || 'Checkout failed');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.response?.data?.detail || err.message || 'Checkout failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (!analytics) {
    return (
      <div className="flex items-center justify-center p-8">
        <i className="ri-loader-4-line animate-spin text-blue-600 text-2xl mr-2"></i>
        <span>Loading checkout...</span>
      </div>
    );
  }

  const steps = generateSteps();

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">Checkout</h1>
        <p className="text-muted-foreground">
          {analytics.isEbookOnly ? 'Complete your digital purchase' : 'Complete your order'}
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
              currentStep === step.id ? 'border-primary bg-blue-600 text-white' :
              currentStep > step.id ? 'border-green-600 bg-green-600 text-white' :
              'border-gray-300 bg-gray-100 text-muted-foreground'
            }`}>
              {currentStep > step.id ? (
                <i className="ri-check-line"></i>
              ) : (
                <i className={step.icon}></i>
              )}
            </div>
            <div className="ml-3 flex-1">
              <p className={`text-sm font-medium ${
                currentStep >= step.id ? 'text-foreground' : 'text-muted-foreground'
              }`}>
                {step.title}
              </p>
              <p className="text-xs text-muted-foreground">{step.description}</p>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-16 h-0.5 mx-4 ${
                currentStep > step.id ? 'bg-green-600' : 'bg-muted'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <i className="ri-alert-line text-red-600 mr-2"></i>
            <span className="text-red-800">{error}</span>
          </div>
        </div>
      )}

      {/* Digital Purchase Indicator */}
      <div className="border-2 rounded-lg p-4 mb-6 bg-green-50 border-green-200">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full">
            <i className="ri-download-cloud-line text-green-600 text-xl"></i>
          </div>
          <div>
            <span className="text-green-900 font-semibold block">Digital Purchase</span>
            <span className="text-green-700 text-sm">Instant delivery • No shipping fees</span>
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {currentStep === 1 && (
          <CustomerInformationStep formData={formData} updateFormData={updateFormData} />
        )}
        
        {currentStep === 2 && (
          <PaymentStep 
            formData={formData}
            updateFormData={updateFormData}
            paymentGateways={paymentGateways}
            analytics={analytics}
          />
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={currentStep === 1 ? onCancel : prevStep}
          className="flex items-center px-4 py-2 text-muted-foreground hover:text-foreground"
        >
          <i className="ri-arrow-left-line mr-2"></i>
          {currentStep === 1 ? 'Back to Cart' : 'Previous'}
        </button>

        {currentStep < steps.length ? (
          <button
            onClick={nextStep}
            disabled={!validateStep(currentStep)}
            className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
            <i className="ri-arrow-right-line ml-2"></i>
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isLoading || !validateStep(currentStep)}
            className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <i className="ri-loader-4-line animate-spin mr-2"></i>
                Processing...
              </>
            ) : (
              <>
                Complete Order
                <i className="ri-arrow-right-line ml-2"></i>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

function CustomerInformationStep({ formData, updateFormData }) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Customer Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">First Name *</label>
          <input
            type="text"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-primary"
            value={formData.shipping.first_name}
            onChange={(e) => updateFormData('shipping', { first_name: e.target.value })}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Last Name *</label>
          <input
            type="text"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-primary"
            value={formData.shipping.last_name}
            onChange={(e) => updateFormData('shipping', { last_name: e.target.value })}
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Email Address *</label>
        <div className="relative">
          <i className="ri-mail-line absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none"></i>
          <input
            type="email"
            inputMode="email"
            required
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-primary"
            value={formData.shipping.email}
            onChange={(e) => updateFormData('shipping', { email: e.target.value })}
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Phone Number</label>
        <div className="relative">
          <i className="ri-phone-line absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none"></i>
          <input
            type="text"
            inputMode="tel"
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-primary"
            value={formData.shipping.phone}
            onChange={(e) => updateFormData('shipping', { phone: e.target.value })}
            placeholder="+234 801 234 5678"
          />
        </div>
      </div>
    </div>
  );
}

function ShippingAddressStep({ formData, updateFormData }) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Shipping Address</h3>
      
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Street Address *</label>
        <div className="relative">
          <i className="ri-home-line absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none"></i>
          <input
            type="text"
            required
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-primary"
            value={formData.shipping.address}
            onChange={(e) => updateFormData('shipping', { address: e.target.value })}
            placeholder="123 Main Street, Apartment 4B"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">City *</label>
          <div className="relative">
            <i className="ri-building-line absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none"></i>
            <input
              type="text"
              required
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-primary"
              value={formData.shipping.city}
              onChange={(e) => updateFormData('shipping', { city: e.target.value })}
              placeholder="Lagos"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">State *</label>
          <input
            type="text"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-primary"
            value={formData.shipping.state}
            onChange={(e) => updateFormData('shipping', { state: e.target.value })}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">ZIP/Postal Code</label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-primary"
            value={formData.shipping.zip_code}
            onChange={(e) => updateFormData('shipping', { zip_code: e.target.value })}
            placeholder="Optional"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Country *</label>
          <input
            type="text"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-primary"
            value={formData.shipping.country}
            onChange={(e) => updateFormData('shipping', { country: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}

function ShippingMethodStep({ formData, updateFormData, shippingMethods, analytics, isLoading }) {
  const activeShippingMethods = shippingMethods?.filter(method => method.is_active !== false) || [];
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Choose Shipping Method</h3>
        <div className="flex items-center justify-center p-8">
          <i className="ri-loader-4-line animate-spin text-blue-600 text-2xl mr-2"></i>
          <span className="text-muted-foreground">Loading shipping methods...</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Choose Shipping Method</h3>
      
      {!formData.shipping_method && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
          <div className="flex items-center">
            <i className="ri-information-line text-yellow-600 mr-2"></i>
            <span className="text-sm text-yellow-800">Please select a shipping method to continue</span>
          </div>
        </div>
      )}
      
      {activeShippingMethods.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <i className="ri-truck-line text-muted-foreground text-4xl mb-2"></i>
          <p className="text-muted-foreground">No shipping methods available at the moment.</p>
          <p className="text-sm text-muted-foreground mt-1">Please contact support for assistance.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {activeShippingMethods.map((method) => (
            <div
              key={method.id}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                formData.shipping_method?.id === method.id 
                  ? 'border-primary bg-blue-50 shadow-md' 
                  : 'border-gray-200 hover:border-primary/50 hover:shadow-sm'
              }`}
              onClick={() => updateFormData('shipping_method', method)}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-start space-x-3">
                  <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    formData.shipping_method?.id === method.id
                      ? 'border-primary bg-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {formData.shipping_method?.id === method.id && (
                      <i className="ri-check-line text-white text-xs"></i>
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{method.name}</h4>
                    <p className="text-sm text-muted-foreground">{method.description || 'Standard delivery service'}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      <i className="ri-time-line mr-1"></i>
                      Delivery: {method.estimated_days_min}-{method.estimated_days_max} business days
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-lg text-foreground">₦{method.base_cost.toLocaleString()}</p>
                  {method.free_shipping_threshold && (
                    <p className="text-xs text-green-600 mt-1">
                      Free over ₦{method.free_shipping_threshold.toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PaymentStep({ formData, updateFormData, paymentGateways, analytics }) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Payment Method</h3>
      
      {/* Order Summary */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h4 className="font-medium text-foreground mb-3">Order Summary</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal ({analytics.totalItems} items)</span>
            <span>₦{analytics.subtotal.toLocaleString()}</span>
          </div>
          {!analytics.isEbookOnly && (
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>₦{analytics.shipping.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Tax (7.5%)</span>
            <span>₦{analytics.tax.toLocaleString()}</span>
          </div>
          <div className="flex justify-between font-semibold text-lg border-t pt-2">
            <span>Total</span>
            <span>₦{analytics.total.toLocaleString()}</span>
          </div>
        </div>
        
        {/* Format Breakdown */}
        <div className="mt-4 pt-3 border-t border-gray-200">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Order Type:</span>
            <div className="flex items-center space-x-2">
              {analytics.isEbookOnly ? (
                <>
                  <i className="ri-download-line text-green-600"></i>
                  <span className="text-green-700 font-medium">Digital Only</span>
                </>
              ) : (
                <>
                  <i className="ri-truck-line text-blue-600"></i>
                  <span className="text-blue-700 font-medium">Physical Delivery</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Payment Gateways */}
      <div className="space-y-3">
        {paymentGateways.filter(gateway => gateway.enabled).map((gateway) => (
          <div
            key={gateway.id}
            className={`border rounded-lg p-4 cursor-pointer transition-all ${
              formData.payment.method === gateway.id 
                ? 'border-primary bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => updateFormData('payment', { method: gateway.id })}
          >
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium text-foreground">{gateway.name}</h4>
                <p className="text-sm text-muted-foreground">{gateway.description}</p>
              </div>
              <i className={`${gateway.id === 'flutterwave' ? 'ri-bank-card-line' : 'ri-bank-line'} text-2xl ${
                formData.payment.method === gateway.id ? 'text-blue-600' : 'text-muted-foreground'
              }`}></i>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
