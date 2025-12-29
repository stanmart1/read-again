import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import ReviewForm from '../../components/ReviewForm';
import { useLibrary } from '../../hooks';
import { getImageUrl } from '../../lib/fileService';

export default function Library() {
  const [filter, setFilter] = useState('all');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [removing, setRemoving] = useState(false);
  const { books, loading, refetch } = useLibrary();

  const { filteredBooks, counts } = useMemo(() => {
    // Consider books >= 98% as completed (industry standard)
    // This accounts for end pages like "About the Author", "Copyright", etc.
    const COMPLETION_THRESHOLD = 98;
    
    const readingBooks = books.filter(b => b.progress > 0 && b.progress < COMPLETION_THRESHOLD);
    const completedBooks = books.filter(b => b.progress >= COMPLETION_THRESHOLD || b.status === 'completed');
    
    const filtered = (() => {
      switch (filter) {
        case 'reading':
          return readingBooks;
        case 'completed':
          return completedBooks;
        default:
          return books;
      }
    })();

    return {
      filteredBooks: filtered,
      counts: {
        all: books.length,
        reading: readingBooks.length,
        completed: completedBooks.length
      }
    };
  }, [books, filter]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse w-72">
                <div className="aspect-[3/4] bg-gray-200 rounded-2xl mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">My Library</h1>
            <p className="text-muted-foreground">{books.length} books in your collection</p>
          </div>
          <Link
            to="/books"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary to-primary text-white font-semibold rounded-xl hover:shadow-xl transition-all transform hover:scale-105"
          >
            <i className="ri-add-line mr-2"></i>
            Explore Books
          </Link>
        </div>

        {/* Filter Tabs */}
        {books.length > 0 && (
          <div className="bg-card rounded-2xl p-6 shadow-lg border border-border">
            <div className="flex flex-wrap gap-3">
              {[
                { key: 'all', label: 'All Books', icon: 'ri-book-line', count: counts.all },
                { key: 'reading', label: 'Reading', icon: 'ri-play-line', count: counts.reading },
                { key: 'completed', label: 'Completed', icon: 'ri-check-line', count: counts.completed }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className={`inline-flex items-center px-6 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 transform hover:scale-105 ${
                    filter === tab.key
                      ? 'bg-gradient-to-r from-primary to-primary text-white shadow-lg shadow-blue-600/25'
                      : 'bg-muted text-muted-foreground hover:text-primary hover:bg-primary/10 border border-border hover:border-primary/30 hover:shadow-md'
                  }`}
                >
                  <i className={`${tab.icon} mr-2 text-base`}></i>
                  {tab.label}
                  {tab.count > 0 && (
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-bold ${
                      filter === tab.key ? 'bg-card/20 text-white' : 'bg-primary/20 text-primary'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredBooks.length === 0 ? (
          <div className="bg-card rounded-2xl shadow-lg border border-border text-center py-20">
            <div className="w-28 h-28 mx-auto mb-8 bg-gradient-to-br from-primary/10 to-primary/20 rounded-full flex items-center justify-center shadow-lg">
              <i className="ri-book-line text-4xl text-primary"></i>
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3">
              {books.length === 0 ? 'Your Library Awaits' : `No ${filter} Books Found`}
            </h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto text-lg">
              {books.length === 0 
                ? 'Discover amazing books and start your reading journey today' 
                : `You don't have any ${filter} books at the moment`}
            </p>
            {books.length === 0 && (
              <Link 
                to="/books"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary to-primary text-white text-lg font-semibold rounded-2xl hover:from-primary/90 hover:to-primary/90 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                <i className="ri-search-line mr-2 text-lg"></i>
                Explore Books
              </Link>
            )}
          </div>
        ) : (
          <div className="flex flex-wrap gap-6">
            {filteredBooks.map((book, index) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group bg-card rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-border hover:border-primary/30 transform hover:-translate-y-2 w-full sm:w-72 md:w-80 flex-shrink-0"
              >
                {/* Cover Image */}
                <div className="aspect-[3/5] relative overflow-hidden">
                  <img
                    src={getImageUrl(book.cover_image_url)}
                    alt={book.title || book.book?.title || 'Book cover'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Format Badge */}
                  <div className="absolute top-3 right-3">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm shadow-lg ${
                      book.format === 'ebook' 
                        ? 'bg-gradient-to-r from-primary to-primary text-white' 
                        : 'bg-gradient-to-r from-amber-600 to-orange-600 text-white'
                    }`}>
                      {book.format === 'ebook' ? 'Digital' : 'Physical'}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  {book.progress > 0 && book.format === 'ebook' && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-card/20 rounded-full h-1.5">
                          <div 
                            className="bg-card h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${book.progress}%` }}
                          />
                        </div>
                        <span className="text-white text-xs font-medium">{Math.round(book.progress)}%</span>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Content */}
                <div className="p-3 flex flex-col">
                  {/* Title - More Prominent */}
                  <h3 className="font-bold text-foreground text-base mb-1.5 line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                    {book.title || book.book?.title}
                  </h3>
                  {/* Author */}
                  <p className="text-muted-foreground text-xs mb-3 line-clamp-1">
                    <span className="font-semibold">Author:</span> {book.author || book.book?.author_name || book.book?.author}
                  </p>
                  
                  {/* Reading Stats */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                    {(book.format || book.book?.format) === 'ebook' && (
                      <span>{Math.round(book.progress || 0)}%</span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    {(book.format || book.book?.format) === 'ebook' ? (
                      <Link
                        to={`/reading/${book.book_id}`}
                        className="w-full inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-primary to-primary text-white text-sm font-semibold rounded-xl hover:from-primary/90 hover:to-primary/90 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                      >
                        <i className={`${book.progress > 0 ? 'ri-play-line' : 'ri-book-open-line'} mr-2 text-base`}></i>
                        {book.progress > 0 ? 'Continue Reading' : 'Start Reading'}
                      </Link>
                    ) : (
                      <div className="w-full inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-gray-400 to-gray-500 text-white text-sm font-semibold rounded-xl shadow-lg">
                        <i className="ri-book-line mr-2 text-base"></i>
                        Physical Book
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedBook(book);
                          setShowReviewModal(true);
                        }}
                        className="flex-1 inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                      >
                        <i className="ri-star-line mr-2 text-base"></i>
                        Review
                      </button>
                      <button
                        onClick={() => {
                          setSelectedBook(book);
                          setShowRemoveModal(true);
                        }}
                        className="px-4 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-semibold rounded-xl hover:bg-red-100 dark:bg-red-900/30 border border-red-200 hover:border-red-300 transition-all duration-200"
                        title="Remove from library"
                      >
                        <i className="ri-delete-bin-line text-base"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Review Modal */}
        {showReviewModal && selectedBook && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <ReviewForm
                  bookId={selectedBook.book_id}
                  bookTitle={selectedBook.book?.title}
                  onSuccess={() => {
                    setShowReviewModal(false);
                    setSelectedBook(null);
                    alert('Review submitted successfully!');
                  }}
                  onCancel={() => {
                    setShowReviewModal(false);
                    setSelectedBook(null);
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Remove Book Modal */}
        {showRemoveModal && selectedBook && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-card rounded-2xl max-w-md w-full shadow-2xl"
            >
              <div className="p-6">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-full">
                  <i className="ri-alert-line text-3xl text-red-600 dark:text-red-400"></i>
                </div>
                <h3 className="text-xl font-bold text-foreground text-center mb-2">
                  Remove from Library?
                </h3>
                <p className="text-muted-foreground text-center mb-6">
                  Are you sure you want to remove <span className="font-semibold">"{selectedBook.title || selectedBook.book?.title}"</span> from your library?
                </p>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <i className="ri-error-warning-line text-yellow-600 dark:text-yellow-400 text-xl flex-shrink-0 mt-0.5"></i>
                    <div>
                      <p className="text-sm font-semibold text-yellow-800 mb-1">Important Warning</p>
                      <p className="text-sm text-yellow-700">
                        You will need to repurchase this book if you want to add it back to your library later.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowRemoveModal(false);
                      setSelectedBook(null);
                    }}
                    disabled={removing}
                    className="flex-1 px-4 py-3 bg-muted text-foreground font-semibold rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        setRemoving(true);
                        const token = localStorage.getItem('token');
                        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/library/${selectedBook.id}`, {
                          method: 'DELETE',
                          headers: {
                            'Authorization': `Bearer ${token}`
                          }
                        });
                        
                        if (response.ok) {
                          await refetch();
                          setShowRemoveModal(false);
                          setSelectedBook(null);
                        } else {
                          alert('Failed to remove book from library');
                        }
                      } catch (error) {
                        console.error('Error removing book:', error);
                        alert('Failed to remove book from library');
                      } finally {
                        setRemoving(false);
                      }
                    }}
                    disabled={removing}
                    className="flex-1 px-4 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 dark:hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {removing ? 'Removing...' : 'Remove Book'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
