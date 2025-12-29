import { useState, useEffect, useRef } from 'react';
import { useUsers } from '../../hooks/useUsers';
import { useBookManagement } from '../../hooks/useBookManagement';
import { useToast } from '../../hooks/useToast';
import { useDebounce } from '../../hooks/useDebounce';
import Toast from '../Toast';
import api from '../../lib/api';

const LibraryManagement = () => {
  const [libraries, setLibraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [assignmentDetails, setAssignmentDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedFormat, setSelectedFormat] = useState('ebook');
  const [userSearch, setUserSearch] = useState('');
  const [bookSearch, setBookSearch] = useState('');
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showBookDropdown, setShowBookDropdown] = useState(false);
  const [assignLoading, setAssignLoading] = useState(false);
  const [userLibrary, setUserLibrary] = useState([]);
  const userDropdownRef = useRef(null);
  const bookDropdownRef = useRef(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    user_id: undefined,
    dateFrom: '',
    dateTo: '',
    sortBy: 'created_at',
    sortOrder: 'desc'
  });
  const [stats, setStats] = useState(null);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkUsers, setBulkUsers] = useState([]);
  const [bulkBook, setBulkBook] = useState(null);
  const [bulkFormat, setBulkFormat] = useState('ebook');
  const [bulkLoading, setBulkLoading] = useState(false);
  const debouncedSearch = useDebounce(filters.search, 300);

  const { users, fetchUsers } = useUsers();
  const { books, loadBooks } = useBookManagement();
  const { toasts, showToast, removeToast } = useToast();

  // Load users and books once on mount
  useEffect(() => {
    fetchUsers({ limit: 100 });
    loadBooks();
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
      if (bookDropdownRef.current && !bookDropdownRef.current.contains(event.target)) {
        setShowBookDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch user's library when user is selected
  useEffect(() => {
    if (selectedUser) {
      fetchUserLibrary();
    }
  }, [selectedUser]);

  const fetchUserLibrary = async () => {
    if (!selectedUser) return;
    try {
      const response = await api.get('/admin/library-assignments', {
        params: { user_id: selectedUser, limit: 1000 }
      });
      setUserLibrary(response.data.assignments || []);
    } catch (error) {
      console.error('Error fetching user library:', error);
    }
  };

  const isBookAlreadyAssigned = (bookId) => {
    return userLibrary.some(item => item.book_id === bookId);
  };

  // Load library data when filters change
  useEffect(() => {
    loadData();
  }, [pagination.page, debouncedSearch, filters.status, filters.user_id, filters.dateFrom, filters.dateTo, filters.sortBy, filters.sortOrder]);

  // Load stats on mount
  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await api.get('/admin/library-stats');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const params = {
        skip: (pagination.page - 1) * pagination.limit,
        limit: pagination.limit,
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(filters.user_id && { user_id: filters.user_id }),
        ...(filters.status && { status: filters.status }),
        ...(filters.dateFrom && { date_from: filters.dateFrom }),
        ...(filters.dateTo && { date_to: filters.dateTo }),
        sort_by: filters.sortBy,
        sort_order: filters.sortOrder
      };

      const response = await api.get('/admin/library-assignments', { params });
      const result = response.data;

      console.log('Library assignments response:', result);
      setLibraries(result.assignments || []);
      setPagination(prev => ({
        ...prev,
        total: result.total || 0,
        pages: result.pagination?.pages || Math.ceil((result.total || 0) / pagination.limit)
      }));
    } catch (error) {
      console.error('Failed to load libraries:', error);
      if (error.response?.status === 403) {
        showToast('Access denied. Admin privileges required.', 'error');
      } else {
        showToast(`Failed to load library assignments: ${error.response?.data?.detail || error.message}`, 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAssignBook = async () => {
    if (!selectedUser || !selectedBook) {
      showToast('Please select both user and book', 'warning');
      return;
    }

    if (isBookAlreadyAssigned(selectedBook)) {
      showToast('This book is already assigned to the selected user', 'warning');
      return;
    }

    setAssignLoading(true);
    try {
      await api.post('/admin/user-library', {
        user_id: selectedUser,
        book_id: selectedBook,
        format: selectedFormat
      });

      showToast('Book assigned successfully!');
      setShowAssignModal(false);
      setSelectedUser(null);
      setSelectedBook(null);
      setSelectedFormat('ebook');
      setUserSearch('');
      setBookSearch('');
      setShowUserDropdown(false);
      setShowBookDropdown(false);
      setUserLibrary([]);
      loadData();
      loadStats();
    } catch (error) {
      console.error('Assignment error:', error);
      const errorMsg = error.response?.data?.detail || error.message || 'Failed to assign book';
      showToast(errorMsg, 'error');
    } finally {
      setAssignLoading(false);
    }
  };

  const handleBulkAssign = async () => {
    if (bulkUsers.length === 0 || !bulkBook) {
      showToast('Please select users and a book', 'warning');
      return;
    }

    setBulkLoading(true);
    try {
      const response = await api.post('/admin/bulk-assign', {
        user_ids: bulkUsers,
        book_id: bulkBook,
        format: bulkFormat
      });

      showToast(`Book assigned to ${response.data.assigned_count} users successfully!`);
      setShowBulkModal(false);
      setBulkUsers([]);
      setBulkBook(null);
      setBulkFormat('ebook');
      loadData();
      loadStats();
    } catch (error) {
      showToast(error.response?.data?.detail || 'Failed to bulk assign', 'error');
    } finally {
      setBulkLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const params = {
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(filters.user_id && { user_id: filters.user_id }),
        ...(filters.status && { status: filters.status }),
        ...(filters.dateFrom && { date_from: filters.dateFrom }),
        ...(filters.dateTo && { date_to: filters.dateTo })
      };

      const response = await api.get('/admin/library-assignments', { 
        params: { ...params, limit: 10000 } 
      });

      const csv = [
        ['User Name', 'User Email', 'Book Title', 'Author', 'Format', 'Progress', 'Status', 'Assigned Date'],
        ...response.data.assignments.map(a => [
          a.user_name,
          a.user_email,
          a.book_title,
          a.book_author,
          a.format,
          `${a.progress}%`,
          a.status,
          new Date(a.assigned_at).toLocaleDateString()
        ])
      ].map(row => row.join(',')).join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `library-assignments-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);

      showToast('Export completed successfully!');
    } catch (error) {
      showToast('Failed to export data', 'error');
    }
  };

  const handleViewDetails = async (libraryId) => {
    setSelectedAssignment(libraryId);
    setShowDetailsModal(true);
    setDetailsLoading(true);
    
    try {
      const [detailsRes, analyticsRes] = await Promise.all([
        api.get(`/admin/library-assignment/${libraryId}/details`),
        api.get(`/admin/library-assignment/${libraryId}/analytics`)
      ]);
      setAssignmentDetails({
        ...detailsRes.data,
        analytics: analyticsRes.data
      });
    } catch (error) {
      console.error('Failed to load details:', error);
      showToast('Failed to load reading details', 'error');
      setShowDetailsModal(false);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleRemoveAssignment = async (libraryId) => {
    if (!confirm('Are you sure you want to remove this book assignment?')) return;

    try {
      await api.delete(`/admin/library-assignment/${libraryId}`);
      showToast('Assignment removed successfully!');
      loadData();
      loadStats();
    } catch (error) {
      console.error('Remove error:', error);
      showToast('Failed to remove assignment', 'error');
    }
  };

  return (
    <div className="p-6">
      {/* Toast Notifications */}
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">Library Management</h2>
        <p className="text-muted-foreground mt-1">Manage user book assignments and reading progress</p>
      </div>

      {/* Statistics Dashboard */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <div className="bg-card rounded-lg shadow-md p-3 sm:p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <i className="ri-book-line text-white text-lg sm:text-xl"></i>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-muted-foreground truncate">Total Assignments</p>
                <p className="text-lg sm:text-2xl font-bold text-foreground truncate">{stats.total_assignments || 0}</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-lg shadow-md p-3 sm:p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <i className="ri-user-line text-white text-lg sm:text-xl"></i>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-muted-foreground truncate">Active Readers</p>
                <p className="text-lg sm:text-2xl font-bold text-foreground truncate">{stats.active_readers || 0}</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-lg shadow-md p-3 sm:p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <i className="ri-trophy-line text-white text-lg sm:text-xl"></i>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-muted-foreground truncate">Completion Rate</p>
                <p className="text-lg sm:text-2xl font-bold text-foreground truncate">{stats.completion_rate || 0}%</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-lg shadow-md p-3 sm:p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <i className="ri-bar-chart-line text-white text-lg sm:text-xl"></i>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-muted-foreground truncate">Avg Progress</p>
                <p className="text-lg sm:text-2xl font-bold text-foreground truncate">{stats.avg_progress || 0}%</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Actions */}
      <div className="bg-card rounded-lg shadow-md p-3 sm:p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="lg:col-span-2">
            <input
              type="text"
              placeholder="Search by user name, email, or book title..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
            />
          </div>
          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="unread">Unread</option>
            <option value="reading">Reading</option>
            <option value="completed">Completed</option>
          </select>
          <select
            value={filters.user_id || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, user_id: e.target.value ? parseInt(e.target.value) : undefined }))}
            className="px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
          >
            <option value="">All Users</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.first_name} {user.last_name}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
            className="px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
            placeholder="From Date"
          />
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
            className="px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
            placeholder="To Date"
          />
          <select
            value={`${filters.sortBy}-${filters.sortOrder}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split('-');
              setFilters(prev => ({ ...prev, sortBy, sortOrder }));
            }}
            className="px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
          >
            <option value="created_at-desc">Newest First</option>
            <option value="created_at-asc">Oldest First</option>
            <option value="progress-desc">Highest Progress</option>
            <option value="progress-asc">Lowest Progress</option>
            <option value="status-asc">Status A-Z</option>
          </select>
        </div>
        <div className="flex flex-wrap gap-2 justify-end">
          <button
            onClick={handleExport}
            className="px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors text-sm flex items-center gap-2"
          >
            <i className="ri-download-line"></i>
            <span className="hidden sm:inline">Export CSV</span>
            <span className="sm:hidden">Export</span>
          </button>
          <button
            onClick={() => setShowBulkModal(true)}
            className="px-3 sm:px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 dark:hover:bg-primary transition-colors text-sm flex items-center gap-2"
          >
            <i className="ri-group-line"></i>
            <span className="hidden sm:inline">Bulk Assign</span>
            <span className="sm:hidden">Bulk</span>
          </button>
          <button
            onClick={() => setShowAssignModal(true)}
            className="px-3 sm:px-4 py-2 bg-gradient-to-r from-primary to-primary text-white rounded-lg hover:from-primary/90 hover:to-primary/90 transition-all text-sm flex items-center gap-2"
          >
            <i className="ri-add-line"></i>
            <span className="hidden sm:inline">Assign Book</span>
            <span className="sm:hidden">Assign</span>
          </button>
        </div>
      </div>

      {/* Libraries Table */}
      <div className="bg-card rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Book
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Format
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Active Readers
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Assigned
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4 whitespace-nowrap" colSpan={8}>
                      <div className="animate-pulse bg-muted h-4 rounded"></div>
                    </td>
                  </tr>
                ))
              ) : libraries.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <i className="ri-book-shelf-line text-6xl text-muted-foreground mb-4"></i>
                    <p className="text-muted-foreground">No library assignments found</p>
                  </td>
                </tr>
              ) : (
                libraries.map((library) => (
                  <tr key={library.id} className="hover:bg-muted">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-foreground">{library.user_name}</div>
                      <div className="text-sm text-muted-foreground">{library.user_email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-foreground">{library.book_title}</div>
                      <div className="text-sm text-muted-foreground">{library.book_author}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-primary/20 text-blue-800">
                        {library.format}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <i className="ri-user-line text-green-600 dark:text-green-400"></i>
                        <span className="text-sm font-semibold text-foreground">{library.active_readers || 0}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-full bg-muted rounded-full h-2 mr-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${library.progress || 0}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-muted-foreground">{(library.progress || 0).toFixed(2)}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        library.status === 'reading' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' :
                        library.status === 'completed' ? 'bg-primary/20 text-blue-800' :
                        'bg-muted text-foreground'
                      }`}>
                        {library.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {new Date(library.assigned_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewDetails(library.id)}
                          className="text-primary hover:text-primary/90"
                          title="View Details"
                        >
                          <i className="ri-eye-line"></i>
                        </button>
                        <button
                          onClick={() => handleRemoveAssignment(library.id)}
                          className="text-red-600 dark:text-red-400 hover:text-red-800 dark:text-red-200"
                          title="Remove Assignment"
                        >
                          <i className="ri-delete-bin-line"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {libraries.length > 0 && (
        <div className="flex items-center justify-between bg-card rounded-lg shadow-md p-4 mt-4">
          <div className="text-sm text-foreground">
    