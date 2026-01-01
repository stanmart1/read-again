package services

import (
	"readagain/internal/models"
	"readagain/internal/utils"

	"gorm.io/gorm"
)

type AuthorOrderService struct {
	db *gorm.DB
}

func NewAuthorOrderService(db *gorm.DB) *AuthorOrderService {
	return &AuthorOrderService{db: db}
}

type AuthorOrderStats struct {
	TotalOrders    int64   `json:"total_orders"`
	TotalRevenue   float64 `json:"total_revenue"`
	PendingOrders  int64   `json:"pending_orders"`
	CompletedOrders int64  `json:"completed_orders"`
}

func (s *AuthorOrderService) GetOrderStats(authorID uint) (*AuthorOrderStats, error) {
	var stats AuthorOrderStats

	// Get total orders containing author's books
	s.db.Raw(`
		SELECT COUNT(DISTINCT orders.id) as total_orders
		FROM orders
		JOIN order_items ON order_items.order_id = orders.id
		JOIN books ON books.id = order_items.book_id
		WHERE books.author_id = ?
	`, authorID).Scan(&stats.TotalOrders)

	// Get total revenue (author's earnings)
	s.db.Raw(`
		SELECT COALESCE(SUM(order_items.price * order_items.quantity), 0) as total_revenue
		FROM orders
		JOIN order_items ON order_items.order_id = orders.id
		JOIN books ON books.id = order_items.book_id
		WHERE books.author_id = ? AND orders.status = 'completed'
	`, authorID).Scan(&stats.TotalRevenue)

	// Get pending orders
	s.db.Raw(`
		SELECT COUNT(DISTINCT orders.id) as pending_orders
		FROM orders
		JOIN order_items ON order_items.order_id = orders.id
		JOIN books ON books.id = order_items.book_id
		WHERE books.author_id = ? AND orders.status = 'pending'
	`, authorID).Scan(&stats.PendingOrders)

	// Get completed orders
	s.db.Raw(`
		SELECT COUNT(DISTINCT orders.id) as completed_orders
		FROM orders
		JOIN order_items ON order_items.order_id = orders.id
		JOIN books ON books.id = order_items.book_id
		WHERE books.author_id = ? AND orders.status = 'completed'
	`, authorID).Scan(&stats.CompletedOrders)

	return &stats, nil
}

func (s *AuthorOrderService) ListOrders(authorID uint, page, limit int, status, search string) ([]models.Order, int64, error) {
	var orders []models.Order
	var total int64

	// Build query to get orders containing author's books
	query := s.db.Model(&models.Order{}).
		Joins("JOIN order_items ON order_items.order_id = orders.id").
		Joins("JOIN books ON books.id = order_items.book_id").
		Where("books.author_id = ?", authorID).
		Distinct()

	if status != "" {
		query = query.Where("orders.status = ?", status)
	}

	if search != "" {
		query = query.Where("orders.id::text LIKE ? OR users.full_name LIKE ?", "%"+search+"%", "%"+search+"%")
	}

	query.Count(&total)

	offset := (page - 1) * limit
	err := query.
		Preload("User").
		Preload("OrderItems.Book").
		Order("orders.created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&orders).Error

	if err != nil {
		return nil, 0, utils.NewInternalServerError("Failed to fetch orders", err)
	}

	return orders, total, nil
}

func (s *AuthorOrderService) GetOrder(authorID, orderID uint) (*models.Order, error) {
	var order models.Order

	// Verify order contains author's books
	var count int64
	s.db.Model(&models.OrderItem{}).
		Joins("JOIN books ON books.id = order_items.book_id").
		Where("order_items.order_id = ? AND books.author_id = ?", orderID, authorID).
		Count(&count)

	if count == 0 {
		return nil, utils.NewNotFoundError("Order not found")
	}

	err := s.db.
		Preload("User").
		Preload("OrderItems.Book").
		First(&order, orderID).Error

	if err != nil {
		return nil, utils.NewNotFoundError("Order not found")
	}

	return &order, nil
}
