import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AuthorLayout from '../../components/author/AuthorLayout';
import { useAuthorBooks } from '../../hooks/useAuthorBooks';
import { getImageUrl } from '../../lib/fileService';
import BookAddModal from '../../components/author/BookAddModal';
import BookEditModal from '../../components/author/BookEditModal';
import BookDetailsModal from '../../components/author/BookDetailsModal';
import CategoriesTab from '../../components/author/CategoriesTab';
import api from '../../lib/api';

export default function AuthorBooks() {
  const { books, isLoading, error, fetchBooks, deleteBook, publishBook, unpublishBook } = useAuthorBooks();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState('books');

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories');
        setCategories(response.data.categories || response.data || []);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    fetchCategories();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBooks(1, 20, searchTerm, statusFilter);
  };

  const handleDelete = async (bookId, bookTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${bookTitle}"?`)) return;
    
    const result = await deleteBook(bookId);
    if (!result.success) {
      alert(result.error);
    }
  };

  const handlePublish = async (bookId) => {
    const result = await publishBook(bookId);
    if (!result.success) {
      alert(result.error);
    }
  };

  const handleUnpublish = async (bookId) => {
    const result = await unpublishBook(bookId);
    if (!result.success) {
      alert(result.error);
    }
  };

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
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <p className="text-destructive">{error}</p>
        </div>
      </AuthorLayout>
    );
  }

  const publishedBooks = books.filter(b => b.status === 'published').length;
  const draftBooks = books.filter(b => b.status === 'draft').length;

  return (
    <AuthorLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">My Books</h1>
              <p className="text-muted-foreground">Manage your book collection</p>
            </div>
            {activeTab === 'books' && (
              <button 
                onClick={() => setShowAddModal(true)}
                className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
              >
                <i className="ri-add-line text-xl"></i>
                Add New Book
              </button>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-4 border-b border-border">
            <button
              onClick={() => setActiveTab('books')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'books'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Books
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'categories'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              My Categories
            </button>
          </div>
        </motion.div>

        {activeTab === 'categories' ? (
          <CategoriesTab />
        ) : (
          <>
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-xl shadow-md p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-1">Total Books</p>
                <p className="text-3xl font-bold text-foreground">{books.length}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <i className="ri-book-line text-2xl text-primary"></i>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-xl shadow-md p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-1">Published</p>
                <p className="text-3xl font-bold text-foreground">{publishedBooks}</p>
              </div>
              <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
                <i className="ri-check-line text-2xl text-green-600 dark:text-green-400"></i>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card rounded-xl shadow-md p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-1">Drafts</p>
                <p className="text-3xl font-bold text-foreground">{draftBooks}</p>
              </div>
              <div className="w-12 h-12 bg-orange-500/10 rounded-full flex items-center justify-center">
                <i className="ri-draft-line text-2xl text-orange-600 dark:text-orange-400"></i>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card rounded-xl shadow-md p-6 mb-6"
        >
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search books..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-primary bg-background text-foreground"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-primary bg-background text-foreground"
            >
              <option value="">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
            <button
              type="submit"
              className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Search
            </button>
          </form>
        </motion.div>

        {/* Books Grid */}
        {books.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center py-12"
          >
            <i className="ri-book-line text-6xl text-muted-foreground mb-4"></i>
            <h3 className="text-xl font-semibold text-foreground mb-2">No books yet</h3>
            <p className="text-muted-foreground mb-6">Start by adding your first book</p>
            <button 
              onClick={() => setShowAddModal(true)}
              className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Add Your First Book
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book, index) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="bg-card rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative h-48">
                  <img
                    src={getImageUrl(book.cover_image)}
                    alt={book.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/placeholder-book.jpg';
                    }}
                  />
                  <div className="absolute top-2 right-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      book.status === 'published'
                        ? 'bg-green-500/90 text-white'
                        : 'bg-orange-500/90 text-white'
                    }`}>
                      {book.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">{book.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">₦{book.price?.toLocaleString()}</p>
                  
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => {
                        setSelectedBook(book);
                        setShowDetailsModal(true);
                      }}
                      className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-3 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
                    >
                      View
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedBook(book);
                        setShowEditModal(true);
                      }}
                      className="flex-1 bg-primary/10 text-primary px-3 py-2 rounded-lg hover:bg-primary/20 transition-colors text-sm"
                    >
                      Edit
                    </button>
                    {book.status === 'draft' ? (
                      <button
                        onClick={() => handlePublish(book.id)}
                        className="flex-1 bg-green-500/10 text-green-600 dark:text-green-400 px-3 py-2 rounded-lg hover:bg-green-500/20 transition-colors text-sm"
                      >
                        Publish
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUnpublish(book.id)}
                        className="flex-1 bg-orange-500/10 text-orange-600 dark:text-orange-400 px-3 py-2 rounded-lg hover:bg-orange-500/20 transition-colors text-sm"
                      >
                        Unpublish
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(book.id, book.title)}
                      className="bg-destructive/10 text-destructive px-3 py-2 rounded-lg hover:bg-destructive/20 transition-colors"
                    >
                      <i className="ri-delete-bin-line"></i>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <BookAddModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        categories={categories}
        onSuccess={() => {
          setShowAddModal(false);
          fetchBooks();
        }}
      />

      <BookEditModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedBook(null);
        }}
        book={selectedBook}
        categories={categories}
        onSuccess={() => {
          setShowEditModal(false);
          setSelectedBook(null);
          fetchBooks();
        }}
      />

      <BookDetailsModal
        book={selectedBook}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedBook(null);
        }}
      />
      </>
        )}
    </AuthorLayout>
  );
}
