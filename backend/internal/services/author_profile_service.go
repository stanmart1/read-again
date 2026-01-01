package services

import (
	"errors"
	"readagain/internal/database"
	"readagain/internal/models"
)

type AuthorProfileService struct{}

func NewAuthorProfileService() *AuthorProfileService {
	return &AuthorProfileService{}
}

func (s *AuthorProfileService) GetProfile(authorID uint) (*models.Author, error) {
	var author models.Author
	if err := database.DB.Preload("User").First(&author, authorID).Error; err != nil {
		return nil, err
	}
	return &author, nil
}

type UpdateProfileInput struct {
	BusinessName string `json:"business_name"`
	Bio          string `json:"bio"`
	Website      string `json:"website"`
	Email        string `json:"email"`
}

func (s *AuthorProfileService) UpdateProfile(authorID uint, input UpdateProfileInput) (*models.Author, error) {
	var author models.Author
	if err := database.DB.First(&author, authorID).Error; err != nil {
		return nil, err
	}

	updates := map[string]interface{}{}
	if input.BusinessName != "" {
		updates["business_name"] = input.BusinessName
	}
	if input.Bio != "" {
		updates["bio"] = input.Bio
	}
	if input.Website != "" {
		updates["website"] = input.Website
	}
	if input.Email != "" {
		updates["email"] = input.Email
	}

	if len(updates) > 0 {
		if err := database.DB.Model(&author).Updates(updates).Error; err != nil {
			return nil, err
		}
	}

	if err := database.DB.Preload("User").First(&author, authorID).Error; err != nil {
		return nil, err
	}

	return &author, nil
}

func (s *AuthorProfileService) UpdatePhoto(authorID uint, photoURL string) error {
	if photoURL == "" {
		return errors.New("photo URL is required")
	}

	return database.DB.Model(&models.Author{}).Where("id = ?", authorID).Update("photo", photoURL).Error
}
