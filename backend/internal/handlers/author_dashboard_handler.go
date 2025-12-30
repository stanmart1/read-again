package handlers

import (
	"readagain/internal/models"
	"readagain/internal/services"
	"readagain/internal/utils"

	"github.com/gofiber/fiber/v2"
)

type AuthorDashboardHandler struct {
	dashboardService *services.AuthorDashboardService
}

func NewAuthorDashboardHandler(dashboardService *services.AuthorDashboardService) *AuthorDashboardHandler {
	return &AuthorDashboardHandler{dashboardService: dashboardService}
}

// GetDashboard returns dashboard overview for authenticated author
func (h *AuthorDashboardHandler) GetDashboard(c *fiber.Ctx) error {
	author, ok := c.Locals("author").(*models.Author)
	if !ok {
		return utils.NewUnauthorizedError("Author not found in context")
	}

	overview, err := h.dashboardService.GetDashboardOverview(author.ID)
	if err != nil {
		utils.ErrorLogger.Printf("Failed to get dashboard overview for author %d: %v", author.ID, err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to load dashboard"})
	}

	return c.JSON(fiber.Map{
		"success": true,
		"data":    overview,
	})
}

// GetProfile returns author profile
func (h *AuthorDashboardHandler) GetProfile(c *fiber.Ctx) error {
	author, ok := c.Locals("author").(*models.Author)
	if !ok {
		return utils.NewUnauthorizedError("Author not found in context")
	}

	profile, err := h.dashboardService.GetProfile(author.ID)
	if err != nil {
		utils.ErrorLogger.Printf("Failed to get profile for author %d: %v", author.ID, err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to load profile"})
	}

	return c.JSON(fiber.Map{
		"success": true,
		"author":  profile,
	})
}

// UpdateProfile updates author profile
func (h *AuthorDashboardHandler) UpdateProfile(c *fiber.Ctx) error {
	author, ok := c.Locals("author").(*models.Author)
	if !ok {
		return utils.NewUnauthorizedError("Author not found in context")
	}

	var updates map[string]interface{}
	if err := c.BodyParser(&updates); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
	}

	// Prevent updating sensitive fields
	delete(updates, "id")
	delete(updates, "user_id")
	delete(updates, "total_earnings")
	delete(updates, "available_balance")
	delete(updates, "pending_balance")

	profile, err := h.dashboardService.UpdateProfile(author.ID, updates)
	if err != nil {
		utils.ErrorLogger.Printf("Failed to update profile for author %d: %v", author.ID, err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update profile"})
	}

	utils.InfoLogger.Printf("Author %d updated profile", author.ID)
	return c.JSON(fiber.Map{
		"success": true,
		"author":  profile,
	})
}
