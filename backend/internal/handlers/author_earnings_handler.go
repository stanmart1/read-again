package handlers

import (
	"readagain/internal/services"
	"readagain/internal/utils"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

type AuthorEarningsHandler struct {
	service *services.AuthorEarningsService
}

func NewAuthorEarningsHandler(service *services.AuthorEarningsService) *AuthorEarningsHandler {
	return &AuthorEarningsHandler{service: service}
}

func (h *AuthorEarningsHandler) GetEarningsSummary(c *fiber.Ctx) error {
	authorID := c.Locals("author_id").(uint)

	summary, err := h.service.GetEarningsSummary(authorID)
	if err != nil {
		utils.ErrorLogger.Printf("Failed to get earnings summary: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch earnings summary"})
	}

	return c.JSON(fiber.Map{"summary": summary})
}

func (h *AuthorEarningsHandler) ListEarnings(c *fiber.Ctx) error {
	authorID := c.Locals("author_id").(uint)

	page, _ := strconv.Atoi(c.Query("page", "1"))
	limit, _ := strconv.Atoi(c.Query("limit", "20"))
	status := c.Query("status", "")

	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 20
	}

	earnings, total, err := h.service.ListEarnings(authorID, page, limit, status)
	if err != nil {
		utils.ErrorLogger.Printf("Failed to list earnings: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch earnings"})
	}

	return c.JSON(fiber.Map{
		"earnings": earnings,
		"total":    total,
		"page":     page,
		"limit":    limit,
	})
}

func (h *AuthorEarningsHandler) ListPayouts(c *fiber.Ctx) error {
	authorID := c.Locals("author_id").(uint)

	page, _ := strconv.Atoi(c.Query("page", "1"))
	limit, _ := strconv.Atoi(c.Query("limit", "20"))

	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 20
	}

	payouts, total, err := h.service.ListPayouts(authorID, page, limit)
	if err != nil {
		utils.ErrorLogger.Printf("Failed to list payouts: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch payouts"})
	}

	return c.JSON(fiber.Map{
		"payouts": payouts,
		"total":   total,
		"page":    page,
		"limit":   limit,
	})
}

func (h *AuthorEarningsHandler) RequestPayout(c *fiber.Ctx) error {
	authorID := c.Locals("author_id").(uint)

	var input struct {
		Amount         float64 `json:"amount"`
		Method         string  `json:"method"`
		AccountDetails string  `json:"account_details"`
	}

	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request"})
	}

	payout, err := h.service.RequestPayout(authorID, input.Amount, input.Method, input.AccountDetails)
	if err != nil {
		utils.ErrorLogger.Printf("Failed to request payout: %v", err)
		return err
	}

	utils.InfoLogger.Printf("Author %d requested payout of %.2f", authorID, input.Amount)
	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"payout": payout})
}

func (h *AuthorEarningsHandler) GetPayout(c *fiber.Ctx) error {
	authorID := c.Locals("author_id").(uint)

	payoutID, err := strconv.ParseUint(c.Params("id"), 10, 32)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid payout ID"})
	}

	payout, err := h.service.GetPayout(authorID, uint(payoutID))
	if err != nil {
		return err
	}

	return c.JSON(fiber.Map{"payout": payout})
}
