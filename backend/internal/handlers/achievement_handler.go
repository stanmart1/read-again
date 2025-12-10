package handlers

import (
	"readagain/internal/services"
	"readagain/internal/utils"

	"github.com/gofiber/fiber/v2"
)

type AchievementHandler struct {
	achievementService *services.AchievementService
}

func NewAchievementHandler(achievementService *services.AchievementService) *AchievementHandler {
	return &AchievementHandler{achievementService: achievementService}
}

func (h *AchievementHandler) GetAllAchievements(c *fiber.Ctx) error {
	achievements, err := h.achievementService.GetAllAchievements()
	if err != nil {
		utils.ErrorLogger.Printf("Failed to get achievements: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to retrieve achievements"})
	}

	return c.JSON(fiber.Map{"achievements": achievements})
}

func (h *AchievementHandler) GetUserAchievements(c *fiber.Ctx) error {
	userID := c.Locals("userID").(uint)

	userAchievements, err := h.achievementService.GetUserAchievements(userID)
	if err != nil {
		utils.ErrorLogger.Printf("Failed to get user achievements: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to retrieve user achievements"})
	}

	return c.JSON(fiber.Map{"achievements": userAchievements})
}

func (h *AchievementHandler) CheckAchievements(c *fiber.Ctx) error {
	userID := c.Locals("userID").(uint)

	newAchievements, err := h.achievementService.CheckAndUnlockAchievements(userID)
	if err != nil {
		utils.ErrorLogger.Printf("Failed to check achievements: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to check achievements"})
	}

	return c.JSON(fiber.Map{
		"new_achievements": newAchievements,
		"count":            len(newAchievements),
	})
}
