package services

import (
	"readagain/internal/models"
	"readagain/internal/utils"
	"time"

	"gorm.io/gorm"
)

type AuthorReviewService struct {
	db *gorm.DB
}

func NewAuthorReviewService(db *gorm.DB) *AuthorReviewService {
	return &AuthorReviewService{db: db}
}

type ReviewStats struct {
	TotalReviews   int64   `json:"total_reviews"`
	AverageRating  float64 `json:"average_rating"`
	ResponseRate   float64 `json:"response_rate"`
	PendingReviews int64   `json:"pending_reviews"`
}

func (s *AuthorReviewService) GetReviewStats(authorID uint) (*ReviewStats, error) {
	var stats ReviewStats

	// Get total reviews
	s.db.Model(&models.Review{}).
		Joins("JOIN books ON books.id = reviews.book_id").
		Where("books.author_id = ?", authorID).
		Count(&stats.TotalReviews)

	// Get average rating
	s.db.Model(&models.Review{}).
		Joins("JOIN books ON books.id = reviews.book_id").
		Where("books.author_id = ?", authorID).
		Select("COALESCE(AVG(rating), 0)").
		Scan(&stats.AverageRating)

	// Get response rate
	var respondedCount int64
	s.db.Model(&models.Review{}).
		Joins("JOIN books ON books.id = reviews.book_id").
		Where("books.author_id = ? AND author_response != ''", authorID).
		Count(&respondedCount)

	if stats.TotalReviews > 0 {
		stats.ResponseRate = (float64(respondedCount) / float64(stats.TotalReviews)) * 100
	}

	// Get pending reviews (not responded)
	s.db.Model(&models.Review{}).
		Joins("JOIN books ON books.id = reviews.book_id").
		Where("books.author_id = ? AND (author_response IS NULL OR author_response = '')", authorID).
		Count(&stats.PendingReviews)

	return &stats, nil
}

func (s *AuthorReviewService) ListReviews(authorID uint, page, limit int, bookID uint, rating int, responded string) ([]models.Review, int64, error) {
	var reviews []models.Review
	var total int64

	query := s.db.Model(&models.Review{}).
		Joins("JOIN books ON books.id = reviews.book_id").
		Where("books.author_id = ?", authorID)

	if bookID > 0 {
		query = query.Where("reviews.book_id = ?", bookID)
	}

	if rating > 0 {
		query = query.Where("reviews.rating = ?", rating)
	}

	if responded == "yes" {
		query = query.Where("reviews.author_response != ''")
	} else if responded == "no" {
		query = query.Where("reviews.author_response IS NULL OR reviews.author_response = ''")
	}

	query.Count(&total)

	offset := (page - 1) * limit
	err := query.
		Preload("User").
		Preload("Book").
		Order("reviews.created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&reviews).Error

	if err != nil {
		return nil, 0, utils.NewInternalServerError("Failed to fetch reviews", err)
	}

	return reviews, total, nil
}

func (s *AuthorReviewService) RespondToReview(authorID, reviewID uint, response string) error {
	// Verify review belongs to author's book
	var review models.Review
	err := s.db.
		Joins("JOIN books ON books.id = reviews.book_id").
		Where("reviews.id = ? AND books.author_id = ?", reviewID, authorID).
		First(&review).Error

	if err != nil {
		return utils.NewNotFoundError("Review not found")
	}

	now := time.Now()
	err = s.db.Model(&review).Updates(map[string]interface{}{
		"author_response": response,
		"responded_at":    now,
	}).Error

	if err != nil {
		return utils.NewInternalServerError("Failed to save response", err)
	}

	return nil
}

func (s *AuthorReviewService) DeleteResponse(authorID, reviewID uint) error {
	// Verify review belongs to author's book
	var review models.Review
	err := s.db.
		Joins("JOIN books ON books.id = reviews.book_id").
		Where("reviews.id = ? AND books.author_id = ?", reviewID, authorID).
		First(&review).Error

	if err != nil {
		return utils.NewNotFoundError("Review not found")
	}

	err = s.db.Model(&review).Updates(map[string]interface{}{
		"author_response": "",
		"responded_at":    nil,
	}).Error

	if err != nil {
		return utils.NewInternalServerError("Failed to delete response", err)
	}

	return nil
}
