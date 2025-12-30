package services

import (
	"readagain/internal/models"
	"readagain/internal/utils"

	"gorm.io/gorm"
)

type AuthorDashboardService struct {
	db *gorm.DB
}

func NewAuthorDashboardService(db *gorm.DB) *AuthorDashboardService {
	return &AuthorDashboardService{db: db}
}

// GetDashboardOverview returns overview stats for author dashboard
func (s *AuthorDashboardService) GetDashboardOverview(authorID uint) (map[string]interface{}, error) {
	var totalBooks int64
	var publishedBooks int64
	var totalEarnings float64
	var pendingBalance float64
	var availableBalance float64

	// Count total books
	if err := s.db.Model(&models.Book{}).Where("author_id = ?", authorID).Count(&totalBooks).Error; err != nil {
		return nil, utils.NewInternalServerError("Failed to count books", err)
	}

	// Count published books
	if err := s.db.Model(&models.Book{}).Where("author_id = ? AND status = ?", authorID, "published").Count(&publishedBooks).Error; err != nil {
		return nil, utils.NewInternalServerError("Failed to count published books", err)
	}

	// Get author financial data
	var author models.Author
	if err := s.db.First(&author, authorID).Error; err != nil {
		return nil, utils.NewNotFoundError("Author not found")
	}

	totalEarnings = author.TotalEarnings
	pendingBalance = author.PendingBalance
	availableBalance = author.AvailableBalance

	// Get total sales count
	var totalSales int64
	if err := s.db.Model(&models.Earning{}).Where("author_id = ?", authorID).Count(&totalSales).Error; err != nil {
		return nil, utils.NewInternalServerError("Failed to count sales", err)
	}

	// Get this month's revenue
	var thisMonthRevenue float64
	if err := s.db.Model(&models.Earning{}).
		Where("author_id = ? AND EXTRACT(MONTH FROM created_at) = EXTRACT(MONTH FROM CURRENT_DATE) AND EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM CURRENT_DATE)", authorID).
		Select("COALESCE(SUM(amount), 0)").
		Scan(&thisMonthRevenue).Error; err != nil {
		return nil, utils.NewInternalServerError("Failed to calculate monthly revenue", err)
	}

	overview := map[string]interface{}{
		"total_books":       totalBooks,
		"published_books":   publishedBooks,
		"total_earnings":    totalEarnings,
		"pending_balance":   pendingBalance,
		"available_balance": availableBalance,
		"total_sales":       totalSales,
		"this_month_revenue": thisMonthRevenue,
	}

	return overview, nil
}

// GetProfile returns author profile
func (s *AuthorDashboardService) GetProfile(authorID uint) (*models.Author, error) {
	var author models.Author
	if err := s.db.Preload("User").First(&author, authorID).Error; err != nil {
		return nil, utils.NewNotFoundError("Author not found")
	}
	return &author, nil
}

// UpdateProfile updates author profile
func (s *AuthorDashboardService) UpdateProfile(authorID uint, updates map[string]interface{}) (*models.Author, error) {
	var author models.Author
	if err := s.db.First(&author, authorID).Error; err != nil {
		return nil, utils.NewNotFoundError("Author not found")
	}

	if err := s.db.Model(&author).Updates(updates).Error; err != nil {
		return nil, utils.NewInternalServerError("Failed to update profile", err)
	}

	if err := s.db.Preload("User").First(&author, authorID).Error; err != nil {
		return nil, utils.NewNotFoundError("Author not found")
	}

	return &author, nil
}
