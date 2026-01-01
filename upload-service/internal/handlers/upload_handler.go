package handlers

import (
	"fmt"
	"mime/multipart"
	"os"
	"path/filepath"
	"strings"

	"github.com/gofiber/fiber/v2"
)

func validateFile(file *multipart.FileHeader, allowedExts []string, maxSize int64) error {
	ext := strings.ToLower(filepath.Ext(file.Filename))
	
	allowed := false
	for _, e := range allowedExts {
		if e == ext {
			allowed = true
			break
		}
	}
	
	if !allowed {
		return fmt.Errorf("invalid file type. Allowed: %v", allowedExts)
	}
	
	if file.Size > maxSize {
		return fmt.Errorf("file too large")
	}
	
	return nil
}

func saveFile(c *fiber.Ctx, file *multipart.FileHeader, uploadDir, subdir string) (string, error) {
	ext := strings.ToLower(filepath.Ext(file.Filename))
	filename := fmt.Sprintf("%d%s", c.Locals("timestamp"), ext)
	uploadPath := filepath.Join(uploadDir, subdir)
	
	if err := os.MkdirAll(uploadPath, 0755); err != nil {
		return "", err
	}
	
	fullPath := filepath.Join(uploadPath, filename)
	
	if err := c.SaveFile(file, fullPath); err != nil {
		return "", err
	}
	
	return fmt.Sprintf("/%s/%s", subdir, filename), nil
}
