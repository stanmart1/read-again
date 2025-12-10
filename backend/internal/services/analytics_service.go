package services

import (
	"time"

	"gorm.io/gorm"
)

type AnalyticsService struct {
	db *gorm.DB
}

func NewAnalyticsService(db *gorm.DB) *AnalyticsService {
	return &AnalyticsService{db: db}
}

type DashboardOverview struct {
	TotalUsers       int64   `json:"total_users"`
	ActiveUsers      int64   `json:"active_users"`
	TotalOrders      int64   `json:"total_orders"`
	TotalRevenue     float64 `json:"total_revenue"`
	TotalBooks       int64   `json:"total_books"`
	TotalBooksRead   int64   `json:"total_books_read"`
	TotalReadingTime int64   `json:"total_reading_time"`
	NewUsersToday    int64   `json:"new_users_today"`
	OrdersToday      int64   `json:"orders_today"`
	RevenueToday     float64 `json:"revenue_today"`
}

type SalesStats struct {
	TotalOrders      int64   `json:"total_orders"`
	CompletedOrders  int64   `json:"completed_orders"`
	PendingOrders    int64   `json:"pending_orders"`
	CancelledOrders  int64   `json:"cancelled_orders"`
	TotalRevenue     float64 `json:"total_revenue"`
	AverageOrderValue float64 `json:"average_order_value"`
}

type UserStats struct {
	TotalUsers    int64 `json:"total_users"`
	ActiveUsers   int64 `json:"active_users"`
	InactiveUsers int64 `json:"inactive_users"`
	NewThisMonth  int64 `json:"new_this_month"`
	NewThisWeek   int64 `json:"new_this_week"`
}

type ReadingStats struct {
	TotalBooksRead     int64 `json:"total_books_read"`
	TotalReadingTime   int64 `json:"total_reading_time"`
	TotalSessions      int64 `json:"total_sessions"`
	AverageSessionTime int64 `json:"average_session_time"`
	ActiveReaders      int64 `json:"active_readers"`
}

type RevenueReport struct {
	Date    string  `json:"date"`
	Revenue float64 `json:"revenue"`
	Orders  int64   `json:"orders"`
}

type GrowthMetrics struct {
	UsersGrowth   float64 `json:"users_growth"`
	RevenueGrowth float64 `json:"revenue_growth"`
	OrdersGrowth  float64 `json:"orders_growth"`
}

func (s *AnalyticsService) GetDashboardOverview() (*DashboardOverview, error) {
	var overview DashboardOverview
	today := time.Now().Truncate(24 * time.Hour)

	s.db.Model(&struct{ ID uint }{}).Table("users").Count(&overview.TotalUsers)
	s.db.Model(&struct{ ID uint }{}).Table("users").Where("is_active = ?", true).Count(&overview.ActiveUsers)
	s.db.Model(&struct{ ID uint }{}).Table("orders").Count(&overview.TotalOrders)
	s.db.Model(&struct{ ID uint }{}).Table("books").Count(&overview.TotalBooks)
	s.db.Model(&struct{ ID uint }{}).Table("user_books").Where("progress = ?", 100).Count(&overview.TotalBooksRead)
	s.db.Model(&struct{ ID uint }{}).Table("reading_sessions").Select("COALESCE(SUM(duration), 0)").Scan(&overview.TotalReadingTime)
	s.db.Model(&struct{ ID uint }{}).Table("users").Where("created_at >= ?", today).Count(&overview.NewUsersToday)
	s.db.Model(&struct{ ID uint }{}).Table("orders").Where("created_at >= ?", today).Count(&overview.OrdersToday)

	s.db.Model(&struct{ ID uint }{}).Table("orders").Select("COALESCE(SUM(total), 0)").Scan(&overview.TotalRevenue)
	s.db.Model(&struct{ ID uint }{}).Table("orders").Where("created_at >= ?", today).Select("COALESCE(SUM(total), 0)").Scan(&overview.RevenueToday)

	return &overview, nil
}

func (s *AnalyticsService) GetSalesStats(startDate, endDate *time.Time) (*SalesStats, error) {
	var stats SalesStats
	query := s.db.Model(&struct{ ID uint }{}).Table("orders")

	if startDate != nil {
		query = query.Where("created_at >= ?", startDate)
	}
	if endDate != nil {
		query = query.Where("created_at <= ?", endDate)
	}

	query.Count(&stats.TotalOrders)
	s.db.Model(&struct{ ID uint }{}).Table("orders").Where("status = ?", "completed").Count(&stats.CompletedOrders)
	s.db.Model(&struct{ ID uint }{}).Table("orders").Where("status = ?", "pending").Count(&stats.PendingOrders)
	s.db.Model(&struct{ ID uint }{}).Table("orders").Where("status = ?", "cancelled").Count(&stats.CancelledOrders)

	query.Select("COALESCE(SUM(total), 0)").Scan(&stats.TotalRevenue)

	if stats.TotalOrders > 0 {
		stats.AverageOrderValue = stats.TotalRevenue / float64(stats.TotalOrders)
	}

	return &stats, nil
}

func (s *AnalyticsService) GetUserStats() (*UserStats, error) {
	var stats UserStats
	now := time.Now()
	weekAgo := now.AddDate(0, 0, -7)
	monthAgo := now.AddDate(0, -1, 0)

	s.db.Model(&struct{ ID uint }{}).Table("users").Count(&stats.TotalUsers)
	s.db.Model(&struct{ ID uint }{}).Table("users").Where("is_active = ?", true).Count(&stats.ActiveUsers)
	s.db.Model(&struct{ ID uint }{}).Table("users").Where("is_active = ?", false).Count(&stats.InactiveUsers)
	s.db.Model(&struct{ ID uint }{}).Table("users").Where("created_at >= ?", monthAgo).Count(&stats.NewThisMonth)
	s.db.Model(&struct{ ID uint }{}).Table("users").Where("created_at >= ?", weekAgo).Count(&stats.NewThisWeek)

	return &stats, nil
}

func (s *AnalyticsService) GetReadingStats() (*ReadingStats, error) {
	var stats ReadingStats

	s.db.Model(&struct{ ID uint }{}).Table("user_books").Where("progress = ?", 100).Count(&stats.TotalBooksRead)
	s.db.Model(&struct{ ID uint }{}).Table("reading_sessions").Select("COALESCE(SUM(duration), 0)").Scan(&stats.TotalReadingTime)
	s.db.Model(&struct{ ID uint }{}).Table("reading_sessions").Count(&stats.TotalSessions)
	s.db.Model(&struct{ ID uint }{}).Table("reading_sessions").Distinct("user_id").Count(&stats.ActiveReaders)

	if stats.TotalSessions > 0 {
		stats.AverageSessionTime = stats.TotalReadingTime / stats.TotalSessions
	}

	return &stats, nil
}

func (s *AnalyticsService) GetRevenueReport(days int) ([]RevenueReport, error) {
	var reports []RevenueReport
	startDate := time.Now().AddDate(0, 0, -days)

	rows, err := s.db.Raw(`
		SELECT 
			DATE(created_at) as date,
			COALESCE(SUM(total), 0) as revenue,
			COUNT(*) as orders
		FROM orders
		WHERE created_at >= ? AND status = 'completed'
		GROUP BY DATE(created_at)
		ORDER BY date DESC
	`, startDate).Rows()

	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var report RevenueReport
		if err := rows.Scan(&report.Date, &report.Revenue, &report.Orders); err != nil {
			return nil, err
		}
		reports = append(reports, report)
	}

	return reports, nil
}

func (s *AnalyticsService) GetGrowthMetrics() (*GrowthMetrics, error) {
	var metrics GrowthMetrics
	now := time.Now()
	lastMonth := now.AddDate(0, -1, 0)
	twoMonthsAgo := now.AddDate(0, -2, 0)

	var currentUsers, previousUsers int64
	var currentRevenue, previousRevenue float64
	var currentOrders, previousOrders int64

	s.db.Model(&struct{ ID uint }{}).Table("users").Where("created_at >= ?", lastMonth).Count(&currentUsers)
	s.db.Model(&struct{ ID uint }{}).Table("users").Where("created_at >= ? AND created_at < ?", twoMonthsAgo, lastMonth).Count(&previousUsers)

	s.db.Model(&struct{ ID uint }{}).Table("orders").Where("created_at >= ?", lastMonth).Select("COALESCE(SUM(total), 0)").Scan(&currentRevenue)
	s.db.Model(&struct{ ID uint }{}).Table("orders").Where("created_at >= ? AND created_at < ?", twoMonthsAgo, lastMonth).Select("COALESCE(SUM(total), 0)").Scan(&previousRevenue)

	s.db.Model(&struct{ ID uint }{}).Table("orders").Where("created_at >= ?", lastMonth).Count(&currentOrders)
	s.db.Model(&struct{ ID uint }{}).Table("orders").Where("created_at >= ? AND created_at < ?", twoMonthsAgo, lastMonth).Count(&previousOrders)

	if previousUsers > 0 {
		metrics.UsersGrowth = ((float64(currentUsers) - float64(previousUsers)) / float64(previousUsers)) * 100
	}
	if previousRevenue > 0 {
		metrics.RevenueGrowth = ((currentRevenue - previousRevenue) / previousRevenue) * 100
	}
	if previousOrders > 0 {
		metrics.OrdersGrowth = ((float64(currentOrders) - float64(previousOrders)) / float64(previousOrders)) * 100
	}

	return &metrics, nil
}
