import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AuthorLayout from '../../components/author/AuthorLayout';
import { useAuthorAnalytics } from '../../hooks/useAuthorAnalytics';
import { useAuthorBooks } from '../../hooks/useAuthorBooks';
import { getImageUrl } from '../../lib/fileService';
import BookAnalyticsModal from '../../components/author/BookAnalyticsModal';

export default function Analytics() {
  const { overview, isLoading, error } = useAuthorAnalytics();
  const { books, fetchBooks } = useAuthorBooks();
  const [selectedBook, setSelectedBook] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('revenue');

  useEffect(() => {
    fetchBooks();
  }, []);

  const sortedBooks = [...(books || [])].sort((a, b) => {
    if (sortBy === 'revenue') return (b.revenue || 0) - (a.revenue || 0);
    if (sortBy === 'sales') return (b.sales || 0) - (a.sales || 0);
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    return 0;
  });

  const filteredBooks = sortedBooks.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <AuthorLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AuthorLayout>
    );
  }

  if (error) {
    return (
      <AuthorLayout>
        <div className="text-center py-12">
          <p className="text-destructive">{error}</p>
        </div>
      </AuthorLayout>
    );
  }

  return (
    <AuthorLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Sales Analytics</h1>

        {/* Stats Cards */}
        {overview && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card p-6 rounded-lg border border-border"
            >
              <p className="text-sm text-muted-foreground mb-1">Total Earnings</p>
              <p className="text-2xl font-bold text-foreground">₦{overview.total_earnings?.toLocaleString()}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card p-6 rounded-lg border border-border"
            >
              <p className="text-sm text-muted-foreground mb-1">This Month</p>
              <p className="text-2xl font-bold text-foreground">₦{overview.monthly_revenue?.toLocaleString()}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card p-6 rounded-lg border border-border"
            >
              <p className="text-sm text-muted-foreground mb-1">Total Sales</p>
              <p className="text-2xl font-bold text-foreground">{overview.total_sales?.toLocaleString()}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-card p-6 rounded-lg border border-border"
            >
              <p className="text-sm text-muted-foreground mb-1">Published Books</p>
              <p className="text-2xl font-bold text-foreground">{overview.published_books}</p>
            </motion.div>
          </div>
        )}

        {/* Books List */}
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <h2 className="text-lg font-semibold text-foreground">Book Performance</h2>
            <div className="flex gap-3 w-full md:w-auto">
              <input
                type="text"
                placeholder="Search books..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 md:w-64 px-4 py-2 border border-border rounded-lg bg-background text-foreground"
              />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-border rounded-lg bg-background text-foreground"
              >
                <option value="revenue">Revenue</option>
                <option value="sales">Sales</option>
                <option value="title">Title</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Book</th>
                  <th className="text-center py-3 px-4 text-muted-foreground font-medium">Status</th>
                  <th className="text-right py-3 px-4 text-muted-foreground font-medium">Sales</th>
                  <th className="text-right py-3 px-4 text-muted-foreground font-medium">Revenue</th>
                  <th className="text-right py-3 px-4 text-muted-foreground font-medium">Avg Rating</th>
                  <th className="text-center py-3 px-4 text-muted-foreground font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBooks.map((book) => (
                  <tr key={book.id} className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={getImageUrl(book.cover_image)}
                          alt={book.title}
                          className="w-12 h-16 object-cover rounded"
                        />
                        <div>
                          <p className="font-medium text-foreground">{book.title}</p>
                          <p className="text-sm text-muted-foreground">₦{book.price?.toLocaleString()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                        book.status === 'published' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}>
                        {book.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-foreground">{book.sales || 0}</td>
                    <td className="py-3 px-4 text-right text-foreground">₦{(book.revenue || 0).toLocaleString()}</td>
                    <td className="py-3 px-4 text-right text-foreground">{book.average_rating?.toFixed(1) || 'N/A'}</td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => {
                          setSelectedBook(book);
                          setShowDetailsModal(true);
                        }}
                        className="px-3 py-1 bg-primary/10 text-primary rounded hover:bg-primary/20 transition-colors text-sm"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredBooks.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No books found</p>
            </div>
          )}
        </div>
      </div>

      <BookAnalyticsModal
        book={selectedBook}
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedBook(null);
        }}
      />
    </AuthorLayout>
  );
}
