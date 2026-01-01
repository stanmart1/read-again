package handlers

import (
	"github.com/gofiber/fiber/v2"
	"upload-service/internal/config"
)

type PaymentProofHandler struct {
	config *config.Config
}

func NewPaymentProofHandler(cfg *config.Config) *PaymentProofHandler {
	return &PaymentProofHandler{config: cfg}
}

func (h *PaymentProofHandler) Upload(c *fiber.Ctx) error {
	file, err := c.FormFile("file")
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "No file provided"})
	}

	allowedExts := []string{".jpg", ".jpeg", ".png", ".pdf"}
	maxSize := int64(5 * 1024 * 1024) // 5MB
	
	if err := validateFile(file, allowedExts, maxSize); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": err.Error()})
	}

	filePath, err := saveFile(c, file, h.config.UploadDir, "payment-proofs")
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to save file"})
	}

	return c.JSON(fiber.Map{
		"success": true,
		"path":    filePath,
		"size":    file.Size,
	})
}
