package handlers

import (
	"readagain/internal/services"
	"readagain/internal/utils"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

type AuthorOrderHandler struct {
	service *services.AuthorOrderService
}

func NewAuthorOrderHandler(service *services.AuthorOrderService) *AuthorOrderHandler {
	return &AuthorOrderHandler{service: service}
}

func (h *AuthorOrderHandler) GetOrderStats(c *fiber.Ctx) error {
	authorID := c.Locals("author_id").(uint)

	stats, err := h.service.GetOrderStats(authorID)
	if err != nil {
		utils.ErrorLogger.Printf("Failed to get order stats: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch order stats"})
	}

	return c.JSON(fiber.Map{"stats": stats})
}

func (h *AuthorOrderHandler) ListOrders(c *fiber.Ctx) error {
	authorID := c.Locals("author_id").(uint)

	page, _ := strconv.Atoi(c.Query("page", "1"))
	limit, _ := strconv.Atoi(c.Query("limit", "20"))
	status := c.Query("status", "")
	search := c.Query("search", "")

	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 20
	}

	orders, total, err := h.service.ListOrders(authorID, page, limit, status, search)
	if err != nil {
		utils.ErrorLogger.Printf("Failed to list orders: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch orders"})
	}

	return c.JSON(fiber.Map{
		"orders": orders,
		"total":  total,
		"page":   page,
		"limit":  limit,
	})
}

func (h *AuthorOrderHandler) GetOrder(c *fiber.Ctx) error {
	authorID := c.Locals("author_id").(uint)

	orderID, err := strconv.ParseUint(c.Params("id"), 10, 32)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid order ID"})
	}

	order, err := h.service.GetOrder(authorID, uint(orderID))
	if err != nil {
		return err
	}

	return c.JSON(fiber.Map{"order": order})
}
