"use client";
import { useState } from 'react';

const mockTransactions = [
  {
    id: 1,
    type: 'payment',
    service: 'Window Cleaning',
    technician: 'John Smith',
    amount: 120,
    date: '2024-01-15',
    status: 'completed',
    description: 'Payment for window cleaning service',
    transactionId: 'TXN-001',
  },
  {
    id: 2,
    type: 'refund',
    service: 'Gutter Cleaning',
    technician: 'Mike Johnson',
    amount: -150,
    date: '2024-01-12',
    status: 'completed',
    description: 'Refund for cancelled service',
    transactionId: 'TXN-002',
  },
  {
    id: 3,
    type: 'payment',
    service: 'Pressure Washing',
    technician: 'Sarah Wilson',
    amount: 200,
    date: '2024-01-10',
    status: 'completed',
    description: 'Payment for pressure washing service',
    transactionId: 'TXN-003',
  },
  {
    id: 4,
    type: 'payment',
    service: 'Window Cleaning',
    technician: 'John Smith',
    amount: 120,
    date: '2024-01-08',
    status: 'pending',
    description: 'Payment for window cleaning service',
    transactionId: 'TXN-004',
  },
  {
    id: 5,
    type: 'refund',
    service: 'Gutter Cleaning',
    technician: 'Mike Johnson',
    amount: -75,
    date: '2024-01-05',
    status: 'completed',
    description: 'Partial refund for incomplete service',
    transactionId: 'TXN-005',
  },
  {
    id: 6,
    type: 'payment',
    service: 'Pressure Washing',
    technician: 'Sarah Wilson',
    amount: 200,
    date: '2024-01-03',
    status: 'completed',
    description: 'Payment for pressure washing service',
    transactionId: 'TXN-006',
  },
];

export default function TransactionHistoryPage() {
  const [transactions, setTransactions] = useState(mockTransactions);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTransactions = transactions.filter(transaction => {
    const matchesFilter = filter === 'all' || transaction.status === filter;
    const matchesSearch = transaction.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.technician.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.transactionId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalAmount = filteredTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type: string) => {
    return type === 'payment' ? '💰' : '↩️';
  };

  return (
    <section className="py-20 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-extrabold text-blue-600 mb-2">Transaction History</h1>
              <p className="text-gray-600">View all your payment and refund transactions</p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Balance</p>
                <p className="text-2xl font-bold text-gray-900">${totalAmount.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by service, technician, or transaction ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="all">All Transactions</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          {/* Transactions List */}
          <div className="space-y-4">
            {filteredTransactions.map(transaction => (
              <div key={transaction.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-2xl">{getTypeIcon(transaction.type)}</div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{transaction.service}</h3>
                      <p className="text-gray-600">Technician: {transaction.technician}</p>
                      <p className="text-sm text-gray-500">Transaction ID: {transaction.transactionId}</p>
                      <p className="text-sm text-gray-500">{transaction.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.amount >= 0 ? '+' : ''}${transaction.amount.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">{transaction.date}</p>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No transactions found matching your criteria.</p>
            </div>
          )}

          {/* Export Options */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition">
                Export to CSV
              </button>
              <button className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition">
                Download Invoice
              </button>
              <button className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition">
                Request Statement
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 