package handlers

import (
	"readagain/internal/services"
	"readagain/internal/utils"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

type AuthorReviewHandler struct {
	service *services.AuthorReviewService
}

func NewAuthorReviewHandler(service *services.AuthorReviewService) *AuthorReviewHandler {
	return &AuthorReviewHandler{service: service}
}

func (h *AuthorReviewHandler) GetReviewStats(c *fiber.Ctx) error {
	authorID := c.Locals("author_id").(uint)

	stats, err := h.service.GetReviewStats(authorID)
	if err != nil {
		utils.ErrorLogger.Printf("Failed to get review stats: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch review stats"})
	}

	return c.JSON(fiber.Map{"stats": stats})
}

func (h *AuthorReviewHandler) ListReviews(c *fiber.Ctx) error {
	authorID := c.Locals("author_id").(uint)

	page, _ := strconv.Atoi(c.Query("page", "1"))
	limit, _ := strconv.Atoi(c.Query("limit", "20"))
	bookID, _ := strconv.ParseUint(c.Query("book_id", "0"), 10, 32)
	rating, _ := strconv.Atoi(c.Query("rating", "0"))
	responded := c.Query("responded", "")

	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 20
	}

	reviews, total, err := h.service.ListReviews(authorID, page, limit, uint(bookID), rating, responded)
	if err != nil {
		utils.ErrorLogger.Printf("Failed to list reviews: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch reviews"})
	}

	return c.JSON(fiber.Map{
		"reviews": reviews,
		"total":   total,
		"page":    page,
		"limit":   limit,
	})
}

func (h *AuthorReviewHandler) RespondToReview(c *fiber.Ctx) error {
	authorID := c.Locals("author_id").(uint)

	reviewID, err := strconv.ParseUint(c.Params("id"), 10, 32)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid review ID"})
	}

	var input struct {
		Response string `json:"response"`
	}

	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request"})
	}

	if input.Response == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Response cannot be empty"})
	}

	err = h.service.RespondToReview(authorID, uint(reviewID), input.Response)
	if err != nil {
		return err
	}

	utils.InfoLogger.Printf("Author %d responded to review %d", authorID, reviewID)
	return c.JSON(fiber.Map{"message": "Response saved successfully"})
}

func (h *AuthorReviewHandler) DeleteResponse(c *fiber.Ctx) error {
	authorID := c.Locals("author_id").(uint)

	reviewID, err := strconv.ParseUint(c.Params("id"), 10, 32)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid review ID"})
	}

	err = h.service.DeleteResponse(authorID, uint(reviewID))
	if err != nil {
		return err
	}

	utils.InfoLogger.Printf("Author %d deleted response to review %d", authorID, reviewID)
	return c.JSON(fiber.Map{"message": "Response deleted successfully"})
}
