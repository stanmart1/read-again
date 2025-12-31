import { X } from 'lucide-react';
import { getImageUrl } from '../../lib/fileService';

export default function BookDetailsModal({ book, onClose }) {
  if (!book) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Book Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Cover Image */}
            <div className="flex-shrink-0">
              <img
                src={getImageUrl(book.cover_image)}
                alt={book.title}
                className="w-48 h-64 object-cover rounded-lg shadow-lg"
              />
            </div>

            {/* Book Info */}
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{book.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{book.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Price</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">${book.price}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                  <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                    book.status === 'published' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  }`}>
                    {book.status}
                  </span>
                </div>
                {book.isbn && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">ISBN</p>
                    <p className="text-gray-900 dark:text-white">{book.isbn}</p>
                  </div>
                )}
                {book.publisher && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Publisher</p>
                    <p className="text-gray-900 dark:text-white">{book.publisher}</p>
                  </div>
                )}
                {book.publication_date && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Publication Date</p>
                    <p className="text-gray-900 dark:text-white">{new Date(book.publication_date).toLocaleDateString()}</p>
                  </div>
                )}
                {book.language && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Language</p>
                    <p className="text-gray-900 dark:text-white">{book.language}</p>
                  </div>
                )}
                {book.pages && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Pages</p>
                    <p className="text-gray-900 dark:text-white">{book.pages}</p>
                  </div>
                )}
              </div>

              {book.categories && book.categories.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Categories</p>
                  <div className="flex flex-wrap gap-2">
                    {book.categories.map((cat) => (
                      <span key={cat.id} className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-sm">
                        {cat.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">Created</p>
                <p className="text-gray-900 dark:text-white">{new Date(book.created_at).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
