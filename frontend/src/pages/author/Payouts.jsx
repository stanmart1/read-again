import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AuthorLayout from '../../components/author/AuthorLayout';
import { useAuthorEarnings } from '../../hooks/useAuthorEarnings';

export default function Payouts() {
  const { fetchPayouts } = useAuthorEarnings();
  const [payouts, setPayouts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadPayouts();
  }, [page]);

  const loadPayouts = async () => {
    setIsLoading(true);
    try {
      const data = await fetchPayouts(page, 20);
      setPayouts(data.payouts || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error('Failed to load payouts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && payouts.length === 0) {
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
        <h1 className="text-2xl font-bold text-foreground">Payout History</h1>

        <div className="bg-card rounded-lg border border-border p-6">
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
                  <motion.tr
                    key={payout.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-border"
                  >
                    <td className="py-3 px-4 text-foreground">
                      {new Date(payout.requested_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-foreground">
                      ₦{payout.amount?.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-foreground capitalize">
                      {payout.method?.replace('_', ' ')}
                    </td>
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
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {payouts.length === 0 && (
            <p className="text-center py-12 text-muted-foreground">No payout requests yet</p>
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
    </AuthorLayout>
  );
}
