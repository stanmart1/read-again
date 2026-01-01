import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AuthorLayout from '../../components/author/AuthorLayout';
import { useAuthorEarnings } from '../../hooks/useAuthorEarnings';
import PayoutRequestModal from '../../components/author/PayoutRequestModal';

export default function Earnings() {
  const { fetchEarningsSummary, fetchEarnings, fetchPayouts } = useAuthorEarnings();
  const [summary, setSummary] = useState(null);
  const [earnings, setEarnings] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [activeTab, setActiveTab] = useState('earnings');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadData();
  }, [page, activeTab]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const summaryData = await fetchEarningsSummary();
      setSummary(summaryData);

      if (activeTab === 'earnings') {
        const earningsData = await fetchEarnings(page, 20);
        setEarnings(earningsData.earnings || []);
        setTotal(earningsData.total || 0);
      } else {
        const payoutsData = await fetchPayouts(page, 20);
        setPayouts(payoutsData.payouts || []);
        setTotal(payoutsData.total || 0);
      }
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !summary) {
    return (
      <AuthorLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AuthorLayout>
    );
  }

  return (
    <AuthorLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-foreground">Earnings & Payouts</h1>
          <button
            onClick={() => setShowPayoutModal(true)}
            disabled={!summary || summary.available_balance < 10}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Request Payout
          </button>
        </div>

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card p-4 rounded-lg border border-border"
            >
              <p className="text-xs sm:text-sm text-muted-foreground mb-1">Available Balance</p>
              <p className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400 break-words">₦{summary.available_balance?.toLocaleString()}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card p-4 rounded-lg border border-border"
            >
              <p className="text-xs sm:text-sm text-muted-foreground mb-1">Pending Balance</p>
              <p className="text-xl sm:text-2xl font-bold text-yellow-600 dark:text-yellow-400 break-words">₦{summary.pending_balance?.toLocaleString()}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card p-4 rounded-lg border border-border"
            >
              <p className="text-xs sm:text-sm text-muted-foreground mb-1">Total Earnings</p>
              <p className="text-xl sm:text-2xl font-bold text-foreground break-words">₦{summary.total_earnings?.toLocaleString()}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-card p-4 rounded-lg border border-border"
            >
              <p className="text-xs sm:text-sm text-muted-foreground mb-1">Total Withdrawn</p>
              <p className="text-xl sm:text-2xl font-bold text-foreground break-words">₦{summary.total_withdrawn?.toLocaleString()}</p>
            </motion.div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-card rounded-lg border border-border">
          <div className="border-b border-border">
            <div className="flex">
              <button
                onClick={() => { setActiveTab('earnings'); setPage(1); }}
                className={`px-6 py-3 font-medium ${
                  activeTab === 'earnings'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Earnings History
              </button>
              <button
                onClick={() => { setActiveTab('payouts'); setPage(1); }}
                className={`px-6 py-3 font-medium ${
                  activeTab === 'payouts'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Payout History
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'earnings' ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-muted-foreground font-medium">Date</th>
                      <th className="text-left py-3 px-4 text-muted-foreground font-medium">Book</th>
                      <th className="text-right py-3 px-4 text-muted-foreground font-medium">Amount</th>
                      <th className="text-right py-3 px-4 text-muted-foreground font-medium">Commission</th>
                      <th className="text-center py-3 px-4 text-muted-foreground font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {earnings.map((earning) => (
                      <tr key={earning.id} className="border-b border-border">
                        <td className="py-3 px-4 text-foreground">{new Date(earning.created_at).toLocaleDateString()}</td>
                        <td className="py-3 px-4 text-foreground">{earning.book?.title || 'N/A'}</td>
                        <td className="py-3 px-4 text-right text-foreground">₦{earning.amount?.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right text-muted-foreground">₦{earning.commission?.toLocaleString()}</td>
                        <td className="py-3 px-4 text-center">
                          <span className={`px-2 py-1 text-xs rounded ${
                            earning.status === 'available' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : earning.status === 'paid'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          }`}>
                            {earning.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {earnings.length === 0 && (
                  <p className="text-center py-8 text-muted-foreground">No earnings yet</p>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-muted-foreground font-medium">Request Date</th>
                      <th className="text-right py-3 px-4 text-muted-foreground font-medium">Amount</th>
                      <th className="text-left py-3 px-4 text-muted-foreground font-medium">Method</th>
                      <th className="text-center py-3 px-4 text-muted-foreground font-medium">Status</th>
                      <th className="text-left py-3 px-4 text-muted-foreground font-medium">Processed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payouts.map((payout) => (
                      <tr key={payout.id} className="border-b border-border">
                        <td className="py-3 px-4 text-foreground">{new Date(payout.requested_at).toLocaleDateString()}</td>
                        <td className="py-3 px-4 text-right font-semibold text-foreground">₦{payout.amount?.toLocaleString()}</td>
                        <td className="py-3 px-4 text-foreground capitalize">{payout.method?.replace('_', ' ')}</td>
                        <td className="py-3 px-4 text-center">
                          <span className={`px-2 py-1 text-xs rounded ${
                            payout.status === 'completed'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : payout.status === 'processing'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                              : payout.status === 'failed'
                              ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          }`}>
                            {payout.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-foreground">
                          {payout.processed_at ? new Date(payout.processed_at).toLocaleDateString() : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {payouts.length === 0 && (
                  <p className="text-center py-8 text-muted-foreground">No payout requests yet</p>
                )}
              </div>
            )}

            {/* Pagination */}
            {total > 20 && (
              <div className="flex justify-center items-center gap-2 mt-4">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 border border-border rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-sm text-muted-foreground">
                  Page {page} of {Math.ceil(total / 20)}
                </span>
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={page >= Math.ceil(total / 20)}
                  className="px-3 py-1 border border-border rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <PayoutRequestModal
        isOpen={showPayoutModal}
        onClose={() => setShowPayoutModal(false)}
        availableBalance={summary?.available_balance || 0}
        onSuccess={loadData}
      />
    </AuthorLayout>
  );
}
