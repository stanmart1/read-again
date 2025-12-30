package services

import (
	"readagain/internal/models"
	"readagain/internal/utils"

	"gorm.io/gorm"
)

type AuthorBookService struct {
	db *gorm.DB
}

func NewAuthorBookService(db *gorm.DB) *AuthorBookService {
	return &AuthorBookService{db: db}
}

// ListBooks returns all books for a specific author
func (s *AuthorBookService) ListBooks(authorID uint, page, limit int, search, status string) ([]models.Book, *utils.PaginationMeta, error) {
	params := utils.GetPaginationParams(page, limit)

	query := s.db.Model(&models.Book{}).Where("author_id = ?", authorID).Preload("Category")

	// Search filter
	if search != "" {
		query = query.Where("title ILIKE ? OR description ILIKE ?", "%"+search+"%", "%"+search+"%")
	}

	// Status filter
	if status != "" {
		query = query.Where("status = ?", status)
	}

	var total int64
	if err := query.Count(&total).Error; err != nil {
		return nil, nil, utils.NewInternalServerError("Failed to count books", err)
	}

	var books []models.Book
	if err := query.Scopes(utils.Paginate(params)).Order("created_at DESC").Find(&books).Error; err != nil {
		return nil, nil, utils.NewInternalServerError("Failed to fetch books", err)
	}

	meta := utils.GetPaginationMeta(params.Page, params.Limit, total)
	return books, &meta, nil
}

// GetBook returns a single book if it belongs to the author
func (s *AuthorBookService) GetBook(authorID, bookID uint) (*models.Book, error) {
	var book models.Book
	if err := s.db.Preload("Category").Where("id = ? AND author_id = ?", bookID, authorID).First(&book).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, utils.NewNotFoundError("Book not found or you don't have permission to access it")
		}
		return nil, utils.NewInternalServerError("Failed to fetch book", err)
	}
	return &book, nil
}

// CreateBook creates a new book for the author
func (s *AuthorBookService) CreateBook(authorID uint, bookData map[string]interface{}) (*models.Book, error) {
	// Ensure author_id is set to the authenticated author
	bookData["author_id"] = authorID

	// Set default status to draft if not provided
	if _, exists := bookData["status"]; !exists {
		bookData["status"] = "draft"
	}

	book := models.Book{}
	
	// Map fields
	if title, ok := bookData["title"].(string); ok {
		book.Title = title
	}
	if subtitle, ok := bookData["subtitle"].(string); ok {
		book.Subtitle = subtitle
	}
	if description, ok := bookData["description"].(string); ok {
		book.Description = description
	}
	if shortDesc, ok := bookData["short_description"].(string); ok {
		book.ShortDescription = shortDesc
	}
	if price, ok := bookData["price"].(float64); ok {
		book.Price = price
	}
	if coverImage, ok := bookData["cover_image"].(string); ok {
		book.CoverImage = coverImage
	}
	if filePath, ok := bookData["file_path"].(string); ok {
		book.FilePath = filePath
	}
	if fileSize, ok := bookData["file_size"].(int64); ok {
		book.FileSize = fileSize
	}
	if categoryID, ok := bookData["category_id"].(uint); ok {
		book.CategoryID = &categoryID
	}
	if isbn, ok := bookData["isbn"].(string); ok {
		book.ISBN = isbn
	}
	if pages, ok := bookData["pages"].(int); ok {
		book.Pages = pages
	}
	if language, ok := bookData["language"].(string); ok {
		book.Language = language
	}
	if publisher, ok := bookData["publisher"].(string); ok {
		book.Publisher = publisher
	}
	if status, ok := bookData["status"].(string); ok {
		book.Status = status
	}

	book.AuthorID = authorID

	if err := s.db.Create(&book).Error; err != nil {
		return nil, utils.NewInternalServerError("Failed to create book", err)
	}

	// Reload with relations
	if err := s.db.Preload("Category").First(&book, book.ID).Error; err != nil {
		return nil, utils.NewInternalServerError("Failed to fetch created book", err)
	}

	return &book, nil
}

// UpdateBook updates a book if it belongs to the author
func (s *AuthorBookService) UpdateBook(authorID, bookID uint, updates map[string]interface{}) (*models.Book, error) {
	var book models.Book
	if err := s.db.Where("id = ? AND author_id = ?", bookID, authorID).First(&book).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, utils.NewNotFoundError("Book not found or you don't have permission to edit it")
		}
		return nil, utils.NewInternalServerError("Failed to fetch book", err)
	}

	// Prevent changing author_id
	delete(updates, "author_id")

	if err := s.db.Model(&book).Updates(updates).Error; err != nil {
		return nil, utils.NewInternalServerError("Failed to update book", err)
	}

	// Reload with relations
	if err := s.db.Preload("Category").First(&book, bookID).Error; err != nil {
		return nil, utils.NewInternalServerError("Failed to fetch updated book", err)
	}

	return &book, nil
}

// DeleteBook soft deletes a book if it belongs to the author
func (s *AuthorBookService) DeleteBook(authorID, bookID uint) error {
	var book models.Book
	if err := s.db.Where("id = ? AND author_id = ?", bookID, authorID).First(&book).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return utils.NewNotFoundError("Book not found or you don't have permission to delete it")
		}
		return utils.NewInternalServerError("Failed to fetch book", err)
	}

	if err := s.db.Delete(&book).Error; err != nil {
		return utils.NewInternalServerError("Failed to delete book", err)
	}

	return nil
}

// PublishBook changes book status to published
func (s *AuthorBookService) PublishBook(authorID, bookID uint) (*models.Book, error) {
	var book models.Book
	if err := s.db.Where("id = ? AND author_id = ?", bookID, authorID).First(&book).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, utils.NewNotFoundError("Book not found or you don't have permission to publish it")
		}
		return nil, utils.NewInternalServerError("Failed to fetch book", err)
	}

	// Validate required fields before publishing
	if book.Title == "" || book.Price == 0 || book.CoverImage == "" || book.FilePath == "" {
		return nil, utils.NewBadRequestError("Cannot publish: Book must have title, price, cover image, and ebook file")
	}

	book.Status = "published"
	if err := s.db.Save(&book).Error; err != nil {
		return nil, utils.NewInternalServerError("Failed to publish book", err)
	}

	return &book, nil
}

// UnpublishBook changes book status to draft
func (s *AuthorBookService) UnpublishBook(authorID, bookID uint) (*models.Book, error) {
	var book models.Book
	if err := s.db.Where("id = ? AND author_id = ?", bookID, authorID).First(&book).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, utils.NewNotFoundError("Book not found or you don't have permission to unpublish it")
		}
		return nil, utils.NewInternalServerError("Failed to fetch book", err)
	}

	book.Status = "draft"
	if err := s.db.Save(&book).Error; err != nil {
		return nil, utils.NewInternalServerError("Failed to unpublish book", err)
	}

	return &book, nil
}

// GetBookStats returns statistics for a specific book
func (s *AuthorBookService) GetBookStats(authorID, bookID uint) (map[string]interface{}, error) {
	// Verify book belongs to author
	var book models.Book
	if err := s.db.Where("id = ? AND author_id = ?", bookID, authorID).First(&book).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, utils.NewNotFoundError("Book not found")
		}
		return nil, utils.NewInternalServerError("Failed to fetch book", err)
	}

	// Get sales count
	var salesCount int64
	if err := s.db.Model(&models.Earning{}).Where("book_id = ? AND author_id = ?", bookID, authorID).Count(&salesCount).Error; err != nil {
		return nil, utils.NewInternalServerError("Failed to count sales", err)
	}

	// Get total revenue
	var totalRevenue float64
	if err := s.db.Model(&models.Earning{}).Where("book_id = ? AND author_id = ?", bookID, authorID).Select("COALESCE(SUM(amount), 0)").Scan(&totalRevenue).Error; err != nil {
		return nil, utils.NewInternalServerError("Failed to calculate revenue", err)
	}

	stats := map[string]interface{}{
		"sales_count":   salesCount,
		"total_revenue": totalRevenue,
		"view_count":    book.ViewCount,
		"download_count": book.DownloadCount,
	}

	return stats, nil
}
