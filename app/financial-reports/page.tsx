"use client";
import { useState } from 'react';

const mockSummary = {
  totalEarnings: 12850.25,
  totalPayouts: 12000.00,
  totalFees: 850.25,
  totalJobs: 72,
};

const mockMonthly = [
  { month: 'Jan', earnings: 1800, payouts: 1700, fees: 100 },
  { month: 'Feb', earnings: 2000, payouts: 1900, fees: 100 },
  { month: 'Mar', earnings: 2100, payouts: 2000, fees: 100 },
  { month: 'Apr', earnings: 1700, payouts: 1600, fees: 100 },
  { month: 'May', earnings: 2200, payouts: 2100, fees: 100 },
  { month: 'Jun', earnings: 2050, payouts: 1950, fees: 100 },
];

const mockTransactions = [
  { id: 1, date: '2024-07-01', type: 'Payout', amount: 500, status: 'Completed', method: 'Bank Transfer' },
  { id: 2, date: '2024-06-28', type: 'Earning', amount: 150, status: 'Completed', method: 'Credit Card' },
  { id: 3, date: '2024-06-25', type: 'Fee', amount: -10, status: 'Completed', method: 'Service Fee' },
  { id: 4, date: '2024-06-20', type: 'Earning', amount: 200, status: 'Completed', method: 'PayPal' },
  { id: 5, date: '2024-06-15', type: 'Payout', amount: 700, status: 'Completed', method: 'Bank Transfer' },
  { id: 6, date: '2024-06-10', type: 'Fee', amount: -15, status: 'Completed', method: 'Service Fee' },
];

export default function FinancialReportsPage() {
  const [summary] = useState(mockSummary);
  const [monthly] = useState(mockMonthly);
  const [transactions] = useState(mockTransactions);
  const [downloadMsg, setDownloadMsg] = useState('');

  const handleDownload = (type: 'csv' | 'pdf') => {
    setDownloadMsg(`Downloading ${type.toUpperCase()} report...`);
    setTimeout(() => setDownloadMsg(''), 1500);
  };

  return (
    <section className="py-20 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-10">
          <h1 className="text-3xl font-extrabold text-blue-600 mb-8 text-center">Financial Reports</h1>

          {/* Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-blue-50 rounded-lg p-6 text-center">
              <div className="text-2xl mb-2">💰</div>
              <div className="text-2xl font-bold text-blue-700">${summary.totalEarnings.toLocaleString()}</div>
              <div className="text-gray-600 text-sm mt-1">Total Earnings</div>
            </div>
            <div className="bg-green-50 rounded-lg p-6 text-center">
              <div className="text-2xl mb-2">🏦</div>
              <div className="text-2xl font-bold text-green-700">${summary.totalPayouts.toLocaleString()}</div>
              <div className="text-gray-600 text-sm mt-1">Total Payouts</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-6 text-center">
              <div className="text-2xl mb-2">💸</div>
              <div className="text-2xl font-bold text-yellow-600">${summary.totalFees.toLocaleString()}</div>
              <div className="text-gray-600 text-sm mt-1">Total Fees</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-6 text-center">
              <div className="text-2xl mb-2">🧹</div>
              <div className="text-2xl font-bold text-purple-700">{summary.totalJobs}</div>
              <div className="text-gray-600 text-sm mt-1">Jobs Completed</div>
            </div>
          </div>

          {/* Download Buttons */}
          <div className="flex gap-4 justify-center mb-10">
            <button
              onClick={() => handleDownload('csv')}
              className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 transition"
            >
              Download CSV
            </button>
            <button
              onClick={() => handleDownload('pdf')}
              className="bg-gray-600 text-white px-6 py-2 rounded-md font-medium hover:bg-gray-700 transition"
            >
              Download PDF
            </button>
          </div>
          {downloadMsg && (
            <div className="text-center mb-8 text-green-600 font-semibold">{downloadMsg}</div>
          )}

          {/* Monthly Breakdown */}
          <div className="mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Monthly Breakdown</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Month</th>
                    <th className="px-4 py-2 text-right text-sm font-semibold text-gray-700">Earnings</th>
                    <th className="px-4 py-2 text-right text-sm font-semibold text-gray-700">Payouts</th>
                    <th className="px-4 py-2 text-right text-sm font-semibold text-gray-700">Fees</th>
                  </tr>
                </thead>
                <tbody>
                  {monthly.map(row => (
                    <tr key={row.month} className="border-t">
                      <td className="px-4 py-2 text-gray-900">{row.month}</td>
                      <td className="px-4 py-2 text-right text-green-700 font-medium">${row.earnings.toLocaleString()}</td>
                      <td className="px-4 py-2 text-right text-blue-700 font-medium">${row.payouts.toLocaleString()}</td>
                      <td className="px-4 py-2 text-right text-yellow-700 font-medium">${row.fees.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Transactions Table */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Transactions</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Date</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Type</th>
                    <th className="px-4 py-2 text-right text-sm font-semibold text-gray-700">Amount</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Method</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map(tx => (
                    <tr key={tx.id} className="border-t">
                      <td className="px-4 py-2 text-gray-900">{tx.date}</td>
                      <td className="px-4 py-2 text-gray-700">{tx.type}</td>
                      <td className={`px-4 py-2 text-right font-medium ${tx.amount >= 0 ? 'text-green-700' : 'text-red-600'}`}>{tx.amount >= 0 ? '+' : ''}${Math.abs(tx.amount).toLocaleString()}</td>
                      <td className="px-4 py-2 text-gray-700">{tx.status}</td>
                      <td className="px-4 py-2 text-gray-700">{tx.method}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 