"use client";
import { useState } from 'react';

const mockPaymentMethods = [
  {
    id: 1,
    type: 'card',
    name: 'Visa ending in 4242',
    last4: '4242',
    brand: 'visa',
    expiry: '12/25',
    isDefault: true,
    isVerified: true,
  },
  {
    id: 2,
    type: 'card',
    name: 'Mastercard ending in 5555',
    last4: '5555',
    brand: 'mastercard',
    expiry: '08/26',
    isDefault: false,
    isVerified: true,
  },
  {
    id: 3,
    type: 'paypal',
    name: 'PayPal',
    email: 'user@example.com',
    isDefault: false,
    isVerified: true,
  },
  {
    id: 4,
    type: 'bank',
    name: 'Bank Account ending in 1234',
    last4: '1234',
    bankName: 'Chase Bank',
    isDefault: false,
    isVerified: false,
  },
];

export default function PaymentMethodsPage() {
  const [paymentMethods, setPaymentMethods] = useState(mockPaymentMethods);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState<number | null>(null);
  const [newPaymentMethod, setNewPaymentMethod] = useState({
    type: 'card',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardholderName: '',
    billingAddress: {
      line1: '',
      line2: '',
      city: '',
      state: '',
      zipCode: '',
    },
  });

  const handleAddPaymentMethod = () => {
    if (!newPaymentMethod.cardNumber || !newPaymentMethod.cardholderName) {
      alert('Please fill in all required fields');
      return;
    }

    const last4 = newPaymentMethod.cardNumber?.slice(-4) || '';
    const method = {
      id: Date.now(),
      type: 'card',
      name: `${getCardBrand(newPaymentMethod.cardNumber || '')} ending in ${last4}`,
      last4,
      brand: getCardBrand(newPaymentMethod.cardNumber || '').toLowerCase(),
      expiry: `${newPaymentMethod.expiryMonth}/${newPaymentMethod.expiryYear}`,
      isDefault: paymentMethods.length === 0,
      isVerified: true,
    };

    setPaymentMethods([...paymentMethods, method]);
    setNewPaymentMethod({
      type: 'card',
      cardNumber: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: '',
      cardholderName: '',
      billingAddress: {
        line1: '',
        line2: '',
        city: '',
        state: '',
        zipCode: '',
      },
    });
    setShowAddModal(false);
  };

  const handleSetDefault = (id: number) => {
    setPaymentMethods(paymentMethods.map(method => ({
      ...method,
      isDefault: method.id === id,
    })));
  };

  const handleDelete = (id: number) => {
    setPaymentMethods(paymentMethods.filter(method => method.id !== id));
    setShowDeleteModal(null);
  };

  const getCardBrand = (cardNumber: string) => {
    if (cardNumber.startsWith('4')) return 'Visa';
    if (cardNumber.startsWith('5')) return 'Mastercard';
    if (cardNumber.startsWith('3')) return 'American Express';
    if (cardNumber.startsWith('6')) return 'Discover';
    return 'Card';
  };

  const getCardIcon = (brand: string | undefined | null) => {
    switch ((brand || '').toLowerCase()) {
      case 'visa':
        return '💳';
      case 'mastercard':
        return '💳';
      case 'amex':
        return '💳';
      case 'discover':
        return '💳';
      case 'paypal':
        return '🔗';
      case 'bank':
        return '🏦';
      default:
        return '💳';
    }
  };

  const formatCardNumber = (number: string) => {
    return number.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
  };

  return (
    <section className="py-20 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-extrabold text-blue-600 mb-2">Payment Methods</h1>
              <p className="text-gray-600">Manage your payment methods and billing information</p>
            </div>
            <div className="mt-4 md:mt-0">
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
              >
                Add Payment Method
              </button>
            </div>
          </div>

          {/* Security Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <div className="flex items-start gap-3">
              <span className="text-blue-600 text-xl">🔒</span>
              <div>
                <h3 className="text-blue-900 font-semibold mb-1">Secure Payment Processing</h3>
                <p className="text-blue-800 text-sm">
                  All payment information is encrypted and securely stored. We use industry-standard security measures to protect your data.
                </p>
              </div>
            </div>
          </div>

          {/* Payment Methods List */}
          <div className="space-y-4">
            {paymentMethods.map(method => (
              <div key={method.id} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-2xl">{getCardIcon(method.brand)}</div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">{method.name}</h3>
                        {method.isDefault && (
                          <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                            Default
                          </span>
                        )}
                        {method.isVerified ? (
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                            ✓ Verified
                          </span>
                        ) : (
                          <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">
                            Pending Verification
                          </span>
                        )}
                      </div>
                      {method.type === 'card' && (
                        <p className="text-gray-600 text-sm">
                          Expires {method.expiry}
                        </p>
                      )}
                      {method.type === 'paypal' && (
                        <p className="text-gray-600 text-sm">
                          {method.email}
                        </p>
                      )}
                      {method.type === 'bank' && (
                        <p className="text-gray-600 text-sm">
                          {method.bankName}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!method.isDefault && (
                      <button
                        onClick={() => handleSetDefault(method.id)}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        Set as Default
                      </button>
                    )}
                    <button
                      onClick={() => setShowDeleteModal(method.id)}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {paymentMethods.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-4">No payment methods added yet.</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
              >
                Add Your First Payment Method
              </button>
            </div>
          )}

          {/* Billing Information */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Billing Information</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Window Cleaning</p>
                      <p className="text-sm text-gray-600">Jan 15, 2024</p>
                    </div>
                    <span className="font-semibold text-gray-900">$120.00</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Gutter Cleaning</p>
                      <p className="text-sm text-gray-600">Jan 12, 2024</p>
                    </div>
                    <span className="font-semibold text-gray-900">$150.00</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Preferences</h3>
                <div className="space-y-4">
                  <label className="flex items-center">
                    <input type="checkbox" className="accent-blue-600" defaultChecked />
                    <span className="ml-2 text-gray-700">Save payment methods for future use</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="accent-blue-600" defaultChecked />
                    <span className="ml-2 text-gray-700">Receive payment receipts via email</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="accent-blue-600" />
                    <span className="ml-2 text-gray-700">Enable automatic payments for recurring services</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Payment Method Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">Add Payment Method</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                <input
                  type="text"
                  value={formatCardNumber(newPaymentMethod.cardNumber)}
                  onChange={(e) => setNewPaymentMethod({
                    ...newPaymentMethod,
                    cardNumber: e.target.value.replace(/\s/g, ''),
                  })}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Month</label>
                  <select
                    value={newPaymentMethod.expiryMonth}
                    onChange={(e) => setNewPaymentMethod({
                      ...newPaymentMethod,
                      expiryMonth: e.target.value,
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">Month</option>
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                        {String(i + 1).padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Year</label>
                  <select
                    value={newPaymentMethod.expiryYear}
                    onChange={(e) => setNewPaymentMethod({
                      ...newPaymentMethod,
                      expiryYear: e.target.value,
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">Year</option>
                    {Array.from({ length: 10 }, (_, i) => {
                      const year = new Date().getFullYear() + i;
                      return (
                        <option key={year} value={String(year).slice(-2)}>
                          {year}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                  <input
                    type="text"
                    value={newPaymentMethod.cvv}
                    onChange={(e) => setNewPaymentMethod({
                      ...newPaymentMethod,
                      cvv: e.target.value,
                    })}
                    placeholder="123"
                    maxLength={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
                <input
                  type="text"
                  value={newPaymentMethod.cardholderName}
                  onChange={(e) => setNewPaymentMethod({
                    ...newPaymentMethod,
                    cardholderName: e.target.value,
                  })}
                  placeholder="John Doe"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={handleAddPaymentMethod}
                className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
              >
                Add Payment Method
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-4">Remove Payment Method</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to remove this payment method? This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => handleDelete(showDeleteModal)}
                className="flex-1 bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition"
              >
                Remove
              </button>
              <button
                onClick={() => setShowDeleteModal(null)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
} 