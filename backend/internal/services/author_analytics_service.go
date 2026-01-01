package services

import (
	"readagain/internal/models"
	"readagain/internal/utils"
	"time"

	"gorm.io/gorm"
)

type AuthorAnalyticsService struct {
	db *gorm.DB
}

func NewAuthorAnalyticsService(db *gorm.DB) *AuthorAnalyticsService {
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

type BookBuyer struct {
	UserID       uint      `json:"user_id"`
	FullName     string    `json:"full_name"`
	Email        string    `json:"email"`
	PurchaseDate time.Time `json:"purchase_date"`
	AmountPaid   float64   `json:"amount_paid"`
	OrderID      uint      `json:"order_id"`
}

type DownloadStat struct {
	BookID    uint   `json:"book_id"`
	Title     string `json:"title"`
	Downloads int64  `json:"downloads"`
}

type RecentOrder struct {
	OrderID      uint      `json:"order_id"`
	CustomerName string    `json:"customer_name"`
	BookTitle    string    `json:"book_title"`
	Amount       float64   `json:"amount"`
	OrderDate    time.Time `json:"order_date"`
	Status       string    `json:"status"`
}

type RecentReview struct {
	ReviewID     uint      `json:"review_id"`
	BookTitle    string    `json:"book_title"`
	CustomerName string    `json:"customer_name"`
	Rating       int       `json:"rating"`
	Comment      string    `json:"comment"`
	ReviewDate   time.Time `json:"review_date"`
}

func (s *AuthorAnalyticsService) GetOverview(authorID uint) (*OverviewStats, error) {
	var stats OverviewStats
	
	// Get author earnings
	var author models.Author
	if err := s.db.Select("total_earnings, available_balance").First(&author, authorID).Error; err != nil {
		return nil, utils.NewNotFoundError("Author not found")
	}
	stats.TotalEarnings = author.TotalEarnings
	
	// Get monthly revenue
	startOfMonth := time.Now().Truncate(24 * time.Hour).AddDate(0, 0, -time.Now().Day()+1)
	s.db.Model(&models.Earning{}).
		Where("author_id = ? AND created_at >= ?", authorID, startOfMonth).
		Select("COALESCE(SUM(amount), 0)").
		Scan(&stats.MonthlyRevenue)
	
	// Get book counts
	s.db.Model(&models.Book{}).Where("author_id = ?", authorID).Count(&stats.TotalBooks)
	s.db.Model(&models.Book{}).Where("author_id = ? AND status = ?", authorID, "published").Count(&stats.PublishedBooks)
	
	// Get sales count
	s.db.Model(&models.OrderItem{}).
		Joins("JOIN books ON books.id = order_items.book_id").
		Where("books.author_id = ?", authorID).
		Count(&stats.TotalSales)
	
	// Get downloads count (same as sales for digital books)
	stats.TotalDownloads = stats.TotalSales
	
	// Get average rating
	s.db.Model(&models.Review{}).
		Joins("JOIN books ON books.id = reviews.book_id").
		Where("books.author_id = ?", authorID).
		Select("COALESCE(AVG(rating), 0)").
		Scan(&stats.AverageRating)
	
	return &stats, nil
}

func (s *AuthorAnalyticsService) GetSalesData(authorID uint, startDate, endDate time.Time) ([]SalesData, error) {
	var salesData []SalesData
	
	err := s.db.Raw(`
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
	
	err := s.db.Raw(`
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
	
	err := s.db.Raw(query, authorID, startDate, endDate).Scan(&revenueData).Error
	
	if err != nil {
		return nil, utils.NewInternalServerError("Failed to fetch revenue data", err)
	}
	
	return revenueData, nil
}

func (s *AuthorAnalyticsService) GetBookBuyers(authorID, bookID uint, page, limit int) ([]BookBuyer, int64, error) {
	// Verify book belongs to author
	var book models.Book
	if err := s.db.Where("id = ? AND author_id = ?", bookID, authorID).First(&book).Error; err != nil {
		return nil, 0, utils.NewNotFoundError("Book not found")
	}
	
	var buyers []BookBuyer
	var total int64
	
	offset := (page - 1) * limit
	
	// Get total count
	s.db.Model(&models.OrderItem{}).
		Joins("JOIN orders ON orders.id = order_items.order_id").
		Joins("JOIN users ON users.id = orders.user_id").
		Where("order_items.book_id = ? AND orders.status = 'completed'", bookID).
		Count(&total)
	
	// Get buyers
	err := s.db.Raw(`
		SELECT 
			users.id as user_id,
			users.full_name,
			users.email,
			orders.created_at as purchase_date,
			order_items.price * order_items.quantity as amount_paid,
			orders.id as order_id
		FROM order_items
		JOIN orders ON orders.id = order_items.order_id
		JOIN users ON users.id = orders.user_id
		WHERE order_items.book_id = ? AND orders.status = 'completed'
		ORDER BY orders.created_at DESC
		LIMIT ? OFFSET ?
	`, bookID, limit, offset).Scan(&buyers).Error
	
	if err != nil {
		return nil, 0, utils.NewInternalServerError("Failed to fetch book buyers", err)
	}
	
	return buyers, total, nil
}

func (s *AuthorAnalyticsService) GetDownloadStats(authorID uint) ([]DownloadStat, error) {
	var downloads []DownloadStat
	
	err := s.db.Raw(`
		SELECT 
			books.id as book_id,
			books.title,
			COUNT(DISTINCT order_items.order_id) as downloads
		FROM books
		LEFT JOIN order_items ON order_items.book_id = books.id
		LEFT JOIN orders ON orders.id = order_items.order_id AND orders.status = 'completed'
		WHERE books.author_id = ?
		GROUP BY books.id, books.title
		ORDER BY downloads DESC
	`, authorID).Scan(&downloads).Error
	
	if err != nil {
		return nil, utils.NewInternalServerError("Failed to fetch download stats", err)
	}
	
	return downloads, nil
}

func (s *AuthorAnalyticsService) GetRecentOrders(authorID uint, limit int) ([]RecentOrder, error) {
	var orders []RecentOrder
	
	err := s.db.Raw(`
		SELECT 
			orders.id as order_id,
			users.full_name as customer_name,
			books.title as book_title,
			order_items.price * order_items.quantity as amount,
			orders.created_at as order_date,
			orders.status
		FROM orders
		JOIN order_items ON order_items.order_id = orders.id
		JOIN books ON books.id = order_items.book_id
		JOIN users ON users.id = orders.user_id
		WHERE books.author_id = ?
		ORDER BY orders.created_at DESC
		LIMIT ?
	`, authorID, limit).Scan(&orders).Error
	
	if err != nil {
		return nil, utils.NewInternalServerError("Failed to fetch recent orders", err)
	}
	
	return orders, nil
}

func (s *AuthorAnalyticsService) GetRecentReviews(authorID uint, limit int) ([]RecentReview, error) {
	var reviews []RecentReview
	
	err := s.db.Raw(`
		SELECT 
			reviews.id as review_id,
			books.title as book_title,
			users.full_name as customer_name,
			reviews.rating,
			reviews.comment,
			reviews.created_at as review_date
		FROM reviews
		JOIN books ON books.id = reviews.book_id
		JOIN users ON users.id = reviews.user_id
		WHERE books.author_id = ?
		ORDER BY reviews.created_at DESC
		LIMIT ?
	`, authorID, limit).Scan(&reviews).Error
	
	if err != nil {
		return nil, utils.NewInternalServerError("Failed to fetch recent reviews", err)
	}
	
	return reviews, nil
}

