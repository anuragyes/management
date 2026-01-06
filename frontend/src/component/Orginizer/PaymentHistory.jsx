// pages/PaymentHistory.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { 
  CreditCard, 
  Calendar, 
  DollarSign, 
  CheckCircle, 
  XCircle, 
  Clock,
  Download,
  Filter,
  Search,
  RefreshCw,
  AlertCircle,
  Receipt,
  TrendingUp,
  Shield,
  Copy,
  ExternalLink
} from 'lucide-react';
import { useTheme } from '../../Context/TheamContext';
import { RazorpayApiInstanceHistory } from '../../ApiInstance/Allapis';

const PaymentHistory = () => {
  const { user, theme, token } = useTheme();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, success, pending, failed
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    successful: 0,
    pending: 0,
    failed: 0,
    totalAmount: 0
  });

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount / 100); // Convert paise to rupees
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const statusConfig = {
      success: {
        color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
        icon: <CheckCircle size={14} />,
        text: 'Success'
      },
      pending: {
        color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
        icon: <Clock size={14} />,
        text: 'Pending'
      },
      failed: {
        color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
        icon: <XCircle size={14} />,
        text: 'Failed'
      },
      created: {
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
        icon: <Clock size={14} />,
        text: 'Created'
      }
    };

    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.icon}
        {config.text}
      </span>
    );
  };

  // Fetch payment history
  const fetchPaymentHistory = async () => {
    if (!user?._id) {
      setError('User not found. Please login again.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(
        RazorpayApiInstanceHistory,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

        //  console.log("--------------------////////////////////////////--",response)
      if (response.data.success) {
        setPayments(response.data.transactions || []);
        calculateStats(response.data.transactions || []);
      } else {
        setError('Failed to fetch payment history');
      }
    } catch (err) {
      console.error('Error fetching payment history:', err);
      setError(err.response?.data?.message || 'Failed to load payment history. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const calculateStats = (transactions) => {
    const statsData = {
      total: transactions.length,
      successful: transactions.filter(t => t.status === 'success').length,
      pending: transactions.filter(t => t.status === 'pending' || t.status === 'created').length,
      failed: transactions.filter(t => t.status === 'failed').length,
      totalAmount: transactions
        .filter(t => t.status === 'success')
        .reduce((sum, t) => sum + (t.amount || 0), 0)
    };
    setStats(statsData);
  };

  // Filter payments
  const filteredPayments = payments.filter(payment => {
    // Status filter
    if (filter !== 'all' && payment.status !== filter) {
      return false;
    }
    
    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        payment.orderId?.toLowerCase().includes(term) ||
        payment.paymentId?.toLowerCase().includes(term) ||
        formatCurrency(payment.amount).toLowerCase().includes(term) ||
        payment.status?.toLowerCase().includes(term)
      );
    }
    
    return true;
  });

  // Copy to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      // Show success message (you can add a toast notification here)
      alert('Copied to clipboard!');
    });
  };



  // Initialize
  useEffect(() => {
    fetchPaymentHistory();
  }, [user?._id]);

  // Refresh handler
  const handleRefresh = () => {
    fetchPaymentHistory();
  };

  return (
    <div className={`min-h-screen p-4 md:p-6 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white' 
        : 'bg-gradient-to-br from-gray-50 via-white to-blue-50 text-gray-900'
    }`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <CreditCard className="text-blue-600 dark:text-blue-400" size={32} />
                Payment History
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                View and manage all your payment transactions
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleRefresh}
                disabled={loading}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                  theme === 'dark'
                    ? 'bg-gray-800 hover:bg-gray-700 text-white'
                    : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-300'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                Refresh
              </button>
              
             
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <div className={`p-4 rounded-xl ${
              theme === 'dark' 
                ? 'bg-gray-800/50 border border-gray-700' 
                : 'bg-white border border-gray-200'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Transactions</p>
                  <p className="text-2xl font-bold mt-1">{stats.total}</p>
                </div>
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <CreditCard className="text-blue-600 dark:text-blue-400" size={20} />
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                All time payments
              </div>
            </div>

            <div className={`p-4 rounded-xl ${
              theme === 'dark' 
                ? 'bg-gray-800/50 border border-gray-700' 
                : 'bg-white border border-gray-200'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Successful</p>
                  <p className="text-2xl font-bold mt-1 text-green-600 dark:text-green-400">{stats.successful}</p>
                </div>
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                  <CheckCircle className="text-green-600 dark:text-green-400" size={20} />
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Completed payments
              </div>
            </div>

            <div className={`p-4 rounded-xl ${
              theme === 'dark' 
                ? 'bg-gray-800/50 border border-gray-700' 
                : 'bg-white border border-gray-200'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Pending</p>
                  <p className="text-2xl font-bold mt-1 text-yellow-600 dark:text-yellow-400">{stats.pending}</p>
                </div>
                <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
                  <Clock className="text-yellow-600 dark:text-yellow-400" size={20} />
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Awaiting completion
              </div>
            </div>

            <div className={`p-4 rounded-xl ${
              theme === 'dark' 
                ? 'bg-gray-800/50 border border-gray-700' 
                : 'bg-white border border-gray-200'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Failed</p>
                  <p className="text-2xl font-bold mt-1 text-red-600 dark:text-red-400">{stats.failed}</p>
                </div>
                <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
                  <XCircle className="text-red-600 dark:text-red-400" size={20} />
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Unsuccessful attempts
              </div>
            </div>

            <div className={`p-4 rounded-xl ${
              theme === 'dark' 
                ? 'bg-gray-800/50 border border-gray-700' 
                : 'bg-white border border-gray-200'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Amount</p>
                  <p className="text-2xl font-bold mt-1">{formatCurrency(stats.totalAmount)}</p>
                </div>
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                  <DollarSign className="text-purple-600 dark:text-purple-400" size={20} />
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Successful payments total
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className={`p-4 rounded-xl mb-6 ${
          theme === 'dark' 
            ? 'bg-gray-800/50 border border-gray-700' 
            : 'bg-white border border-gray-200'
        }`}>
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by Order ID, Payment ID, or Amount..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-lg ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                  } border focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
              </div>
            </div>

            {/* Filter */}
            <div className="flex gap-2">
              <div className={`flex items-center gap-2 px-3 py-2.5 rounded-lg ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <Filter size={18} className="text-gray-500" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className={`bg-transparent outline-none ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  <option value="all">All Status</option>
                  <option value="success">Successful</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                  <option value="created">Created</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && !loading && (
          <div className={`p-4 rounded-xl mb-6 ${
            theme === 'dark' 
              ? 'bg-red-900/20 border border-red-800' 
              : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-center gap-3">
              <AlertCircle className="text-red-600 dark:text-red-400" size={24} />
              <div>
                <p className="font-medium text-red-700 dark:text-red-300">Error Loading Payments</p>
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">{error}</p>
                <button
                  onClick={handleRefresh}
                  className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Loading payment history...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredPayments.length === 0 && (
          <div className={`p-8 rounded-xl text-center ${
            theme === 'dark' 
              ? 'bg-gray-800/50 border border-gray-700' 
              : 'bg-white border border-gray-200'
          }`}>
            <CreditCard className="mx-auto text-gray-400 dark:text-gray-500" size={48} />
            <h3 className="text-xl font-semibold mt-4">No Payments Found</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              {searchTerm || filter !== 'all' 
                ? 'No payments match your search criteria.' 
                : 'You haven\'t made any payments yet.'}
            </p>
            {(searchTerm || filter !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilter('all');
                }}
                className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* Payment List */}
        {!loading && !error && filteredPayments.length > 0 && (
          <div className={`rounded-xl overflow-hidden ${
            theme === 'dark' 
              ? 'bg-gray-800/50 border border-gray-700' 
              : 'bg-white border border-gray-200'
          }`}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}>
                  <tr>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Transaction
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredPayments.map((payment) => (
                    <tr 
                      key={payment._id} 
                      className={`hover:${
                        theme === 'dark' ? 'bg-gray-800/70' : 'bg-gray-50'
                      } transition-colors`}
                    >
                      <td className="py-4 px-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <Receipt size={16} className="text-gray-400" />
                            <span className="font-medium">{payment.orderId}</span>
                          </div>
                          {payment.paymentId && (
                            <div className="flex items-center gap-2 mt-1">
                              <Shield size={14} className="text-gray-400" />
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {payment.paymentId}
                              </span>
                              <button
                                onClick={() => copyToClipboard(payment.paymentId)}
                                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                                title="Copy Payment ID"
                              >
                                <Copy size={12} />
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <DollarSign size={16} className="text-green-500" />
                          <span className="font-bold">{formatCurrency(payment.amount)}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        {getStatusBadge(payment.status)}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-gray-400" />
                          <span className="text-sm">{formatDate(payment.createdAt)}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => copyToClipboard(payment.orderId)}
                            className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 ${
                              theme === 'dark'
                                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                            } transition-colors`}
                            title="Copy Order ID"
                          >
                            <Copy size={14} />
                            Copy
                          </button>
                          {payment.status === 'success' && (
                            <a
                              href={`/receipt/${payment._id}`}
                              className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 ${
                                theme === 'dark'
                                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                  : 'bg-blue-600 hover:bg-blue-700 text-white'
                              } transition-colors`}
                            >
                              <ExternalLink size={14} />
                              Receipt
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination (if needed) */}
            <div className={`p-4 border-t ${
              theme === 'dark' 
                ? 'border-gray-700' 
                : 'border-gray-200'
            }`}>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Showing {filteredPayments.length} of {payments.length} transactions
                </div>
                <div className="flex gap-2">
                  <button
                    className={`px-3 py-1.5 rounded-lg ${
                      theme === 'dark'
                        ? 'bg-gray-700 hover:bg-gray-600 disabled:opacity-50'
                        : 'bg-gray-100 hover:bg-gray-200 disabled:opacity-50'
                    } transition-colors`}
                    disabled
                  >
                    Previous
                  </button>
                  <button
                    className={`px-3 py-1.5 rounded-lg ${
                      theme === 'dark'
                        ? 'bg-gray-700 hover:bg-gray-600 disabled:opacity-50'
                        : 'bg-gray-100 hover:bg-gray-200 disabled:opacity-50'
                    } transition-colors`}
                    disabled
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      
        

        {/* Help Section */}
        <div className={`mt-6 p-4 rounded-xl ${
          theme === 'dark' 
            ? 'bg-gray-800/50 border border-gray-700' 
            : 'bg-white border border-gray-200'
        }`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                <CheckCircle className="text-green-600 dark:text-green-400" size={20} />
              </div>
              <div>
                <h5 className="font-medium">Payment Issues?</h5>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  If a payment shows as pending for more than 24 hours, contact support.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <Receipt className="text-purple-600 dark:text-purple-400" size={20} />
              </div>
              <div>
                <h5 className="font-medium">Need Receipt?</h5>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Download payment receipts for accounting and reimbursement purposes.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                <AlertCircle className="text-orange-600 dark:text-orange-400" size={20} />
              </div>
              <div>
                <h5 className="font-medium">Report Problem</h5>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Found incorrect transaction? Report within 7 days for investigation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;