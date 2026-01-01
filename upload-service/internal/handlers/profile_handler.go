package handlers

import (
	"github.com/gofiber/fiber/v2"
	"upload-service/internal/config"
)

type ProfileHandler struct {
	config *config.Config
}

func NewProfileHandler(cfg *config.Config) *ProfileHandler {
	return &ProfileHandler{config: cfg}
}

func (h *ProfileHandler) Upload(c *fiber.Ctx) error {
	file, err := c.FormFile("file")
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "No file provided"})
	}

	allowedExts := []string{".jpg", ".jpeg", ".png", ".webp"}
	maxSize := int64(5 * 1024 * 1024) // 5MB for images
	
	if err := validateFile(file, allowedExts, maxSize); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": err.Error()})
	}

	filePath, err := saveFile(c, file, h.config.UploadDir, "profiles")
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to save file"})
	}

	return c.JSON(fiber.Map{
		"success": true,
		"path":    filePath,
		"size":    file.Size,
	})
}
