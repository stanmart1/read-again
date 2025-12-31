package services

import (
	"read-again/internal/database"
	"read-again/internal/models"
	"read-again/internal/utils"
	"time"
)

type AuthorAnalyticsService struct {
	db *database.Database
}

func NewAuthorAnalyticsService(db *database.Database) *AuthorAnalyticsService {
	return &AuthorAnalyticsService{db: db}
}

type OverviewStats struct {
	TotalEarnings    float64 `json:"total_earnings"`
	MonthlyRevenue   float64 `json:"monthly_revenue"`
	TotalBooks       int64   `json:"total_books"`
	PublishedBooks   int64   `json:"published_books"`
	TotalSales       int64   `json:"total_sales"`
	TotalDownloads   int64   `json:"total_downloads"`
	AverageRating    float64 `json:"average_rating"`
}

type SalesData struct {
	Date   string  `json:"date"`
	Sales  int64   `json:"sales"`
	Revenue float64 `json:"revenue"`
}

type TopBook struct {
	BookID   uint    `json:"book_id"`
	Title    string  `json:"title"`
	Sales    int64   `json:"sales"`
	Revenue  float64 `json:"revenue"`
	Downloads int64  `json:"downloads"`
}

func (s *AuthorAnalyticsService) GetOverview(authorID uint) (*OverviewStats, error) {
	var stats OverviewStats
	
	// Get author earnings
	var author models.Author
	if err := s.db.DB.Select("total_earnings, available_balance").First(&author, authorID).Error; err != nil {
		return nil, utils.NewNotFoundError("Author not found", err)
	}
	stats.TotalEarnings = author.TotalEarnings
	
	// Get monthly revenue
	startOfMonth := time.Now().Truncate(24 * time.Hour).AddDate(0, 0, -time.Now().Day()+1)
	s.db.DB.Model(&models.Earning{}).
		Where("author_id = ? AND created_at >= ?", authorID, startOfMonth).
		Select("COALESCE(SUM(amount), 0)").
		Scan(&stats.MonthlyRevenue)
	
	// Get book counts
	s.db.DB.Model(&models.Book{}).Where("author_id = ?", authorID).Count(&stats.TotalBooks)
	s.db.DB.Model(&models.Book{}).Where("author_id = ? AND status = ?", authorID, "published").Count(&stats.PublishedBooks)
	
	// Get sales count
	s.db.DB.Model(&models.OrderItem{}).
		Joins("JOIN books ON books.id = order_items.book_id").
		Where("books.author_id = ?", authorID).
		Count(&stats.TotalSales)
	
	// Get downloads count (same as sales for digital books)
	stats.TotalDownloads = stats.TotalSales
	
	// Get average rating
	s.db.DB.Model(&models.Review{}).
		Joins("JOIN books ON books.id = reviews.book_id").
		Where("books.author_id = ?", authorID).
		Select("COALESCE(AVG(rating), 0)").
		Scan(&stats.AverageRating)
	
	return &stats, nil
}

func (s *AuthorAnalyticsService) GetSalesData(authorID uint, startDate, endDate time.Time) ([]SalesData, error) {
	var salesData []SalesData
	
	err := s.db.DB.Raw(`
		SELECT 
			DATE(orders.created_at) as date,
			COUNT(DISTINCT orders.id) as sales,
			COALESCE(SUM(order_items.price * order_items.quantity), 0) as revenue
		FROM orders
		JOIN order_items ON order_items.order_id = orders.id
		JOIN books ON books.id = order_items.book_id
		WHERE books.author_id = ? 
			AND orders.status = 'completed'
			AND orders.created_at BETWEEN ? AND ?
		GROUP BY DATE(orders.created_at)
		ORDER BY date ASC
	`, authorID, startDate, endDate).Scan(&salesData).Error
	
	if err != nil {
		return nil, utils.NewInternalServerError("Failed to fetch sales data", err)
	}
	
	return salesData, nil
}

func (s *AuthorAnalyticsService) GetTopBooks(authorID uint, limit int) ([]TopBook, error) {
	var topBooks []TopBook
	
	err := s.db.DB.Raw(`
		SELECT 
			books.id as book_id,
			books.title,
			COUNT(DISTINCT order_items.order_id) as sales,
			COALESCE(SUM(order_items.price * order_items.quantity), 0) as revenue,
			COUNT(DISTINCT order_items.order_id) as downloads
		FROM books
		LEFT JOIN order_items ON order_items.book_id = books.id
		LEFT JOIN orders ON orders.id = order_items.order_id AND orders.status = 'completed'
		WHERE books.author_id = ?
		GROUP BY books.id, books.title
		ORDER BY revenue DESC
		LIMIT ?
	`, authorID, limit).Scan(&topBooks).Error
	
	if err != nil {
		return nil, utils.NewInternalServerError("Failed to fetch top books", err)
	}
	
	return topBooks, nil
}

func (s *AuthorAnalyticsService) GetRevenueData(authorID uint, startDate, endDate time.Time, groupBy string) ([]SalesData, error) {
	var revenueData []SalesData
	
	dateFormat := "DATE(orders.created_at)"
	if groupBy == "week" {
		dateFormat = "DATE_TRUNC('week', orders.created_at)"
	} else if groupBy == "month" {
		dateFormat = "DATE_TRUNC('month', orders.created_at)"
	}
	
	query := `
		SELECT 
			` + dateFormat + ` as date,
			COUNT(DISTINCT orders.id) as sales,
			COALESCE(SUM(order_items.price * order_items.quantity), 0) as revenue
		FROM orders
		JOIN order_items ON order_items.order_id = orders.id
		JOIN books ON books.id = order_items.book_id
		WHERE books.author_id = ? 
			AND orders.status = 'completed'
			AND orders.created_at BETWEEN ? AND ?
		GROUP BY ` + dateFormat + `
		ORDER BY date ASC
	`
	
	err := s.db.DB.Raw(query, authorID, startDate, endDate).Scan(&revenueData).Error
	
	if err != nil {
		return nil, utils.NewInternalServerError("Failed to fetch revenue data", err)
	}
	
	return revenueData, nil
}
