package handlers

import (
	"readagain/internal/services"

	"github.com/gofiber/fiber/v2"
)

type AuthorProfileHandler struct {
	service *services.AuthorProfileService
}

func NewAuthorProfileHandler(service *services.AuthorProfileService) *AuthorProfileHandler {
	return &AuthorProfileHandler{service: service}
}

func (h *AuthorProfileHandler) GetProfile(c *fiber.Ctx) error {
	authorID, ok := c.Locals("author_id").(uint)
	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Unauthorized"})
	}

	profile, err := h.service.GetProfile(authorID)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Profile not found"})
	}

	return c.JSON(fiber.Map{"profile": profile})
}

func (h *AuthorProfileHandler) UpdateProfile(c *fiber.Ctx) error {
	authorID, ok := c.Locals("author_id").(uint)
	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Unauthorized"})
	}

	var input services.UpdateProfileInput
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
	}

	profile, err := h.service.UpdateProfile(authorID, input)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update profile"})
	}

	return c.JSON(fiber.Map{"message": "Profile updated", "profile": profile})
}

func (h *AuthorProfileHandler) UpdatePhoto(c *fiber.Ctx) error {
	authorID, ok := c.Locals("author_id").(uint)
	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Unauthorized"})
	}

	file, err := c.FormFile("photo")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Photo file is required"})
	}

	photoPath := "/uploads/authors/" + file.Filename
	if err := c.SaveFile(file, "."+photoPath); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to upload photo"})
	}

	if err := h.service.UpdatePhoto(authorID, photoPath); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update photo"})
	}

	return c.JSON(fiber.Map{"message": "Photo updated", "photo": photoPath})
}
