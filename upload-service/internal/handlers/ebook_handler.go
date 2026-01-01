package handlers

import (
	"github.com/gofiber/fiber/v2"
	"upload-service/internal/config"
)

type EbookHandler struct {
	config *config.Config
}

func NewEbookHandler(cfg *config.Config) *EbookHandler {
	return &EbookHandler{config: cfg}
}

func (h *EbookHandler) Upload(c *fiber.Ctx) error {
	file, err := c.FormFile("file")
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "No file provided"})
	}

	allowedExts := []string{".epub", ".pdf"}
	if err := validateFile(file, allowedExts, h.config.MaxFileSize); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": err.Error()})
	}

	filePath, err := saveFile(c, file, h.config.UploadDir, "ebooks")
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to save file"})
	}

	return c.JSON(fiber.Map{
		"success": true,
		"path":    filePath,
		"size":    file.Size,
	})
}
