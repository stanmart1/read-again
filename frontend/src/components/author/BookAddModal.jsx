import { useState, useRef } from 'react';
import api from '../../lib/api';
import { uploadEbook, uploadCover } from '../../lib/fileService';

const BookAddModal = ({ isOpen, onClose, categories, onSuccess }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    category_id: '',
    price: '',
    isbn: '',
    description: '',
    language: 'English',
    pages: '',
    publication_date: '',
    publisher: '',
    status: 'draft',
    cover_image: null,
    ebook_file: null
  });
  const [errors, setErrors] = useState({});
  const [dragActive, setDragActive] = useState({ cover: false, ebook: false });

  const coverInputRef = useRef(null);
  const ebookInputRef = useRef(null);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileChange = (field, file) => {
    setFormData(prev => ({ ...prev, [field]: file }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleDrag = (e, type) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(prev => ({ ...prev, [type]: true }));
    } else if (e.type === 'dragleave') {
      setDragActive(prev => ({ ...prev, [type]: false }));
    }
  };

  const handleDrop = (e, type) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(prev => ({ ...prev, [type]: false }));

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const field = type === 'cover' ? 'cover_image' : 'ebook_file';
      handleFileChange(field, files[0]);
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.title.trim()) newErrors.title = 'Title is required';
      if (!formData.category_id) newErrors.category_id = 'Category is required';
      if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Valid price is required';
    }

    if (step === 2) {
      if (!formData.cover_image) newErrors.cover_image = 'Cover image is required';
      if (!formData.ebook_file) {
        newErrors.ebook_file = 'Ebook file is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(2)) return;

    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      setUploadProgress(10);
      const coverResult = await uploadCover(formData.cover_image);
      
      setUploadProgress(50);
      const ebookResult = await uploadEbook(formData.ebook_file);
      
      setUploadProgress(80);

      const bookData = {
        title: formData.title,
        category_id: formData.category_id,
        price: formData.price,
        isbn: formData.isbn || '',
        description: formData.description || '',
        language: formData.language,
        pages: formData.pages || '',
        publication_date: formData.publication_date || '',
        publisher: formData.publisher || '',
        status: formData.status,
        cover_image: coverResult.path,
        file_url: ebookResult.path
      };

      const response = await api.post('/author/books', bookData);
      
      if (!response.data.book_id) {
        throw new Error('Book creation failed - no book ID returned');
      }

      setUploadProgress(100);
      const bookTitle = response.data.book?.title || formData.title;
      alert(`Book "${bookTitle}" uploaded successfully!`);

      setTimeout(() => {
        onSuccess();
        resetForm();
      }, 500);
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error.response?.data?.detail || error.response?.data?.error || error.message || 'Upload failed';
      alert(`Upload failed: ${errorMessage}`);
      setUploadProgress(0);
    } finally {
      setIsSubmitting(false);
    }
  };


  const resetForm = () => {
    setFormData({
      title: '',
      category_id: '',
      price: '',
      isbn: '',
      description: '',
      language: 'English',
      pages: '',
      publication_date: '',
      publisher: '',
      status: 'draft',
      cover_image: null,
      ebook_file: null
    });
    setErrors({});
    setCurrentStep(1);
    setUploadProgress(0);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      resetForm();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-primary/5 to-primary/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">Add New Book</h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Step {currentStep} of 2 - {currentStep === 1 ? 'Book Information' : 'Upload Files'}
              </p>
            </div>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="text-muted-foreground hover:text-muted-foreground disabled:opacity-50"
            >
              <i className="ri-close-line text-2xl"></i>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-4 sm:px-6 py-3">
          <div className="flex items-center space-x-2 mb-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${currentStep >= 1 ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
              }`}>1</div>
            <div className={`flex-1 h-1 rounded-full ${currentStep >= 2 ? 'bg-primary' : 'bg-muted'
              }`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${currentStep >= 2 ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
              }`}>2</div>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Book Details</span>
            <span>Upload Files</span>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 sm:px-6 py-4 sm:py-6 overflow-y-auto max-h-[calc(95vh-220px)]">

          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {/* Title */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Book Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-ring focus:border-primary transition-all ${errors.title ? 'border-red-400 bg-red-50 dark:bg-red-900/20' : 'border-border hover:border-input'
                      }`}
                    placeholder="Enter the book title"
                  />
                  {errors.title && <p className="text-red-500 text-sm mt-1 flex items-center"><i className="ri-error-warning-line mr-1"></i>{errors.title}</p>}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => handleInputChange('category_id', e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-ring focus:border-primary transition-all appearance-none bg-card ${errors.category_id ? 'border-red-400 bg-red-50 dark:bg-red-900/20' : 'border-border hover:border-input'
                      }`}
                  >
                    <option value="">Select a category</option>
                    {categories.filter(cat => cat.status === 'active').map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {errors.category_id && <p className="text-red-500 text-sm mt-1 flex items-center"><i className="ri-error-warning-line mr-1"></i>{errors.category_id}</p>}
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Price (₦) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-ring focus:border-primary transition-all ${errors.price ? 'border-red-400 bg-red-50 dark:bg-red-900/20' : 'border-border hover:border-input'
                      }`}
                    placeholder="0.00"
                  />
                  {errors.price && <p className="text-red-500 text-sm mt-1 flex items-center"><i className="ri-error-warning-line mr-1"></i>{errors.price}</p>}
                </div>

                {/* ISBN */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    ISBN
                  </label>
                  <input
                    type="text"
                    value={formData.isbn}
                    onChange={(e) => handleInputChange('isbn', e.target.value)}
                    className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-primary"
                    placeholder="978-0-000-00000-0"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Status
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleInputChange('status', 'published')}
                      className={`p-3 rounded-xl border-2 transition-all text-center ${formData.status === 'published'
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700'
                        : 'border-border hover:border-input text-muted-foreground'
                        }`}
                    >
                      <i className="ri-check-line text-xl mb-1 block"></i>
                      <span className="text-sm font-medium">Published</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInputChange('status', 'draft')}
                      className={`p-3 rounded-xl border-2 transition-all text-center ${formData.status === 'draft'
                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                        : 'border-border hover:border-input text-muted-foreground'
                        }`}
                    >
                      <i className="ri-draft-line text-xl mb-1 block"></i>
                      <span className="text-sm font-medium">Draft</span>
                    </button>
                  </div>
                </div>

                {/* Publisher */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Publisher
                  </label>
                  <input
                    type="text"
                    value={formData.publisher}
                    onChange={(e) => handleInputChange('publisher', e.target.value)}
                    className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-primary"
                    placeholder="Publisher name"
                  />
                </div>
              </div>

              <div className="flex justify-between gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-6 py-2.5 border-2 border-input rounded-xl hover:bg-muted transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2.5 bg-gradient-to-r from-primary to-primary text-white rounded-xl hover:from-primary/90 hover:to-primary/90 transition-colors font-medium"
                >
                  Next Step →
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Files & Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              {/* Cover Image Upload */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Cover Image * {formData.cover_image && <span className="text-green-600 dark:text-green-400">✓ Uploaded</span>}
                </label>
                <div
                  onDragEnter={(e) => handleDrag(e, 'cover')}
                  onDragLeave={(e) => handleDrag(e, 'cover')}
                  onDragOver={(e) => handleDrag(e, 'cover')}
                  onDrop={(e) => handleDrop(e, 'cover')}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${dragActive.cover ? 'border-primary bg-primary/10' :
                    errors.cover_image ? 'border-red-500' : 'border-input hover:border-primary'
                    }`}
                  onClick={() => coverInputRef.current?.click()}
                >
                  <i className="ri-image-add-line text-4xl text-muted-foreground mb-2"></i>
                  <p className="text-sm text-muted-foreground">
                    {formData.cover_image ? formData.cover_image.name : 'Drag & drop cover image or click to browse'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">PNG, JPG, JPEG, WebP, GIF up to 10MB</p>
                  <input
                    ref={coverInputRef}
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp,.gif"
                    onChange={(e) => e.target.files[0] && handleFileChange('cover_image', e.target.files[0])}
                    className="hidden"
                  />
                </div>
                {errors.cover_image && <p className="text-red-500 text-sm mt-1">{errors.cover_image}</p>}
              </div>

              {/* Ebook File Upload */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Ebook File * {formData.ebook_file && <span className="text-green-600 dark:text-green-400">✓ Uploaded</span>}
                </label>
                <div
                  onDragEnter={(e) => handleDrag(e, 'ebook')}
                  onDragLeave={(e) => handleDrag(e, 'ebook')}
                  onDragOver={(e) => handleDrag(e, 'ebook')}
                  onDrop={(e) => handleDrop(e, 'ebook')}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${dragActive.ebook ? 'border-primary bg-primary/10' :
                    errors.ebook_file ? 'border-red-500' : 'border-input hover:border-primary'
                    }`}
                  onClick={() => ebookInputRef.current?.click()}
                >
                  <i className="ri-file-pdf-line text-4xl text-muted-foreground mb-2"></i>
                  <p className="text-sm text-muted-foreground">
                    {formData.ebook_file ? formData.ebook_file.name : 'Drag & drop ebook file or click to browse'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">PDF, EPUB, MOBI, HTML up to 500MB</p>
                  <input
                    ref={ebookInputRef}
                    type="file"
                    accept=".pdf,.epub,.mobi,.html,.htm"
                    onChange={(e) => e.target.files[0] && handleFileChange('ebook_file', e.target.files[0])}
                    className="hidden"
                  />
                </div>
                {errors.ebook_file && <p className="text-red-500 text-sm mt-1">{errors.ebook_file}</p>}
              </div>

              {/* Upload Progress */}
              {isSubmitting && (
                <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-900">Uploading...</span>
                    <span className="text-sm font-medium text-blue-900">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="flex justify-between gap-3 pt-4">
                <button
                  type="button"
                  onClick={handlePrevious}
                  disabled={isSubmitting}
                  className="px-6 py-2 border border-input rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-gradient-to-r from-primary to-primary text-white rounded-lg hover:from-primary/90 hover:to-primary/90 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Uploading...' : 'Upload Book'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookAddModal;
