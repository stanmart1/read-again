import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AuthorLayout from '../../components/author/AuthorLayout';
import { useAuthorReviews } from '../../hooks/useAuthorReviews';

export default function Reviews() {
  const { fetchReviewStats, fetchReviews, respondToReview, deleteResponse } = useAuthorReviews();
  const [stats, setStats] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [ratingFilter, setRatingFilter] = useState(0);
  const [respondedFilter, setRespondedFilter] = useState('');
  const [respondingTo, setRespondingTo] = useState(null);
  const [responseText, setResponseText] = useState('');

  useEffect(() => {
    loadData();
  }, [page, ratingFilter, respondedFilter]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [statsData, reviewsData] = await Promise.all([
        fetchReviewStats(),
        fetchReviews(page, 20, 0, ratingFilter, respondedFilter)
      ]);
      setStats(statsData);
      setReviews(reviewsData.reviews || []);
      setTotal(reviewsData.total || 0);
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRespond = async (reviewId) => {
    if (!responseText.trim()) return;
    try {
      await respondToReview(reviewId, responseText);
      setRespondingTo(null);
      setResponseText('');
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteResponse = async (reviewId) => {
    if (!confirm('Delete your response?')) return;
    try {
      await deleteResponse(reviewId);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  if (isLoading && !stats) {
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
        <h1 className="text-2xl font-bold text-foreground">Reviews</h1>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card p-6 rounded-lg border border-border">
              <p className="text-sm text-muted-foreground mb-1">Total Reviews</p>
              <p className="text-2xl font-bold text-foreground">{stats.total_reviews}</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card p-6 rounded-lg border border-border">
              <p className="text-sm text-muted-foreground mb-1">Average Rating</p>
              <p className="text-2xl font-bold text-foreground">{stats.average_rating?.toFixed(1)} ⭐</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card p-6 rounded-lg border border-border">
              <p className="text-sm text-muted-foreground mb-1">Response Rate</p>
              <p className="text-2xl font-bold text-foreground">{stats.response_rate?.toFixed(0)}%</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-card p-6 rounded-lg border border-border">
              <p className="text-sm text-muted-foreground mb-1">Pending Responses</p>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pending_reviews}</p>
            </motion.div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-card rounded-lg border border-border p-4 flex gap-4">
          <select value={ratingFilter} onChange={(e) => { setRatingFilter(Number(e.target.value)); setPage(1); }} className="px-4 py-2 border border-border rounded-lg bg-background text-foreground">
            <option value="0">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
          <select value={respondedFilter} onChange={(e) => { setRespondedFilter(e.target.value); setPage(1); }} className="px-4 py-2 border border-border rounded-lg bg-background text-foreground">
            <option value="">All Reviews</option>
            <option value="yes">Responded</option>
            <option value="no">Not Responded</option>
          </select>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.map((review) => (
            <motion.div key={review.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-card rounded-lg border border-border p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-foreground">{review.book?.title}</h3>
                  <p className="text-sm text-muted-foreground">{review.user?.first_name} {review.user?.last_name}</p>
                  <p className="text-xs text-muted-foreground">{new Date(review.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < review.rating ? 'text-yellow-500' : 'text-gray-300'}>★</span>
                  ))}
                </div>
              </div>
              <p className="text-foreground mb-4">{review.comment}</p>

              {review.author_response ? (
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-sm font-semibold text-foreground">Your Response:</p>
                    <button onClick={() => handleDeleteResponse(review.id)} className="text-xs text-red-600 hover:text-red-700">Delete</button>
                  </div>
                  <p className="text-sm text-foreground">{review.author_response}</p>
                  <p className="text-xs text-muted-foreground mt-2">{new Date(review.responded_at).toLocaleDateString()}</p>
                </div>
              ) : respondingTo === review.id ? (
                <div className="space-y-2">
                  <textarea value={responseText} onChange={(e) => setResponseText(e.target.value)} rows="3" placeholder="Write your response..." className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground" />
                  <div className="flex gap-2">
                    <button onClick={() => handleRespond(review.id)} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">Submit</button>
                    <button onClick={() => { setRespondingTo(null); setResponseText(''); }} className="px-4 py-2 border border-border rounded-lg hover:bg-muted">Cancel</button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setRespondingTo(review.id)} className="px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20">Respond</button>
              )}
            </motion.div>
          ))}
        </div>

        {reviews.length === 0 && <p className="text-center py-12 text-muted-foreground">No reviews found</p>}

        {/* Pagination */}
        {total > 20 && (
          <div className="flex justify-center items-center gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 border border-border rounded disabled:opacity-50">Previous</button>
            <span className="text-sm text-muted-foreground">Page {page} of {Math.ceil(total / 20)}</span>
            <button onClick={() => setPage(p => p + 1)} disabled={page >= Math.ceil(total / 20)} className="px-3 py-1 border border-border rounded disabled:opacity-50">Next</button>
          </div>
        )}
      </div>
    </AuthorLayout>
  );
}
