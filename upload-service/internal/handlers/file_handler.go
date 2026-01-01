package handlers

import (
	"os"
	"path/filepath"
	"strings"

	"github.com/gofiber/fiber/v2"
	"upload-service/internal/config"
)

type FileHandler struct {
	config *config.Config
}

func NewFileHandler(cfg *config.Config) *FileHandler {
	return &FileHandler{config: cfg}
}

func (h *FileHandler) Serve(c *fiber.Ctx) error {
	filePath := c.Params("*")
	fullPath := filepath.Join(h.config.UploadDir, filePath)

	if !strings.HasPrefix(filepath.Clean(fullPath), h.config.UploadDir) {
		return c.Status(403).JSON(fiber.Map{"error": "Access denied"})
	}

	if _, err := os.Stat(fullPath); os.IsNotExist(err) {
		return c.Status(404).JSON(fiber.Map{"error": "File not found"})
	}

	return c.SendFile(fullPath)
}
