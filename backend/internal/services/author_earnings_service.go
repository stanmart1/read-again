package services

import (
	"readagain/internal/models"
	"readagain/internal/utils"
	"time"

	"gorm.io/gorm"
)

type AuthorEarningsService struct {
	db *gorm.DB
}

func NewAuthorEarningsService(db *gorm.DB) *AuthorEarningsService {
	return &AuthorEarningsService{db: db}
}

type EarningsSummary struct {
	AvailableBalance float64 `json:"available_balance"`
	PendingBalance   float64 `json:"pending_balance"`
	TotalEarnings    float64 `json:"total_earnings"`
	TotalWithdrawn   float64 `json:"total_withdrawn"`
	CommissionRate   float64 `json:"commission_rate"`
}

func (s *AuthorEarningsService) GetEarningsSummary(authorID uint) (*EarningsSummary, error) {
	var author models.Author
	if err := s.db.First(&author, authorID).Error; err != nil {
		return nil, utils.NewNotFoundError("Author not found")
	}

	var totalWithdrawn float64
	s.db.Model(&models.Payout{}).
		Where("author_id = ? AND status = ?", authorID, "completed").
		Select("COALESCE(SUM(amount), 0)").
		Scan(&totalWithdrawn)

	return &EarningsSummary{
		AvailableBalance: author.AvailableBalance,
		PendingBalance:   author.PendingBalance,
		TotalEarnings:    author.TotalEarnings,
		TotalWithdrawn:   totalWithdrawn,
		CommissionRate:   author.CommissionRate,
	}, nil
}

func (s *AuthorEarningsService) ListEarnings(authorID uint, page, limit int, status string) ([]models.Earning, int64, error) {
	var earnings []models.Earning
	var total int64

	query := s.db.Model(&models.Earning{}).Where("author_id = ?", authorID)
	
	if status != "" {
		query = query.Where("status = ?", status)
	}

	query.Count(&total)

	offset := (page - 1) * limit
	err := query.
		Preload("Book").
		Preload("Order").
		Order("created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&earnings).Error

	if err != nil {
		return nil, 0, utils.NewInternalServerError("Failed to fetch earnings", err)
	}

	return earnings, total, nil
}

func (s *AuthorEarningsService) ListPayouts(authorID uint, page, limit int) ([]models.Payout, int64, error) {
	var payouts []models.Payout
	var total int64

	query := s.db.Model(&models.Payout{}).Where("author_id = ?", authorID)
	query.Count(&total)

	offset := (page - 1) * limit
	err := query.
		Order("created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&payouts).Error

	if err != nil {
		return nil, 0, utils.NewInternalServerError("Failed to fetch payouts", err)
	}

	return payouts, total, nil
}

func (s *AuthorEarningsService) RequestPayout(authorID uint, amount float64, method, accountDetails string) (*models.Payout, error) {
	// Get author
	var author models.Author
	if err := s.db.First(&author, authorID).Error; err != nil {
		return nil, utils.NewNotFoundError("Author not found")
	}

	// Validate amount
	if amount <= 0 {
		return nil, utils.NewBadRequestError("Invalid payout amount")
	}

	// Check minimum threshold (e.g., $10)
	minThreshold := 10.0
	if amount < minThreshold {
		return nil, utils.NewBadRequestError("Minimum payout amount is $10")
	}

	// Check available balance
	if amount > author.AvailableBalance {
		return nil, utils.NewBadRequestError("Insufficient available balance")
	}

	// Create payout request
	payout := models.Payout{
		AuthorID:       authorID,
		Amount:         amount,
		Status:         "requested",
		Method:         method,
		AccountDetails: accountDetails, // Should be encrypted in production
		RequestedAt:    time.Now(),
	}

	if err := s.db.Create(&payout).Error; err != nil {
		return nil, utils.NewInternalServerError("Failed to create payout request", err)
	}

	// Deduct from available balance
	if err := s.db.Model(&author).Update("available_balance", gorm.Expr("available_balance - ?", amount)).Error; err != nil {
		return nil, utils.NewInternalServerError("Failed to update balance", err)
	}

	return &payout, nil
}

func (s *AuthorEarningsService) GetPayout(authorID, payoutID uint) (*models.Payout, error) {
	var payout models.Payout
	if err := s.db.Where("id = ? AND author_id = ?", payoutID, authorID).First(&payout).Error; err != nil {
		return nil, utils.NewNotFoundError("Payout not found")
	}
	return &payout, nil
}
