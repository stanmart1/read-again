package handlers

import (
	"strconv"

	"readagain/internal/middleware"
	"readagain/internal/services"
	"readagain/internal/utils"

	"github.com/gofiber/fiber/v2"
)

type OrderHandler struct {
	orderService *services.OrderService
}

func NewOrderHandler(orderService *services.OrderService) *OrderHandler {
	return &OrderHandler{orderService: orderService}
}

func (h *OrderHandler) GetUserOrders(c *fiber.Ctx) error {
	userID := c.Locals("userID").(uint)
	page, _ := strconv.Atoi(c.Query("page", "1"))
	limit, _ := strconv.Atoi(c.Query("limit", "20"))
	status := c.Query("status", "")

	orders, meta, err := h.orderService.GetUserOrders(userID, page, limit, status)
	if err != nil {
		utils.ErrorLogger.Printf("Failed to get user orders: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to retrieve orders"})
	}

	return c.JSON(fiber.Map{
		"orders":     orders,
		"pagination": meta,
	})
}

func (h *OrderHandler) GetOrder(c *fiber.Ctx) error {
	userID := c.Locals("userID").(uint)
	orderID, err := strconv.ParseUint(c.Params("id"), 10, 32)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid order ID"})
	}

	order, err := h.orderService.GetOrderByID(uint(orderID))
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Order not found"})
	}

	if order.UserID != userID {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "Access denied"})
	}

	return c.JSON(fiber.Map{"order": order})
}

func (h *OrderHandler) CancelOrder(c *fiber.Ctx) error {
	userID := c.Locals("userID").(uint)
	orderID, err := strconv.ParseUint(c.Params("id"), 10, 32)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid order ID"})
	}

	if err := h.orderService.CancelOrder(uint(orderID), userID); err != nil {
		utils.ErrorLogger.Printf("Failed to cancel order: %v", err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	middleware.LogAudit(c, "cancel_order", "order", uint(orderID), "", "")
	utils.InfoLogger.Printf("User %d cancelled order %d", userID, orderID)
	return c.JSON(fiber.Map{"message": "Order cancelled successfully"})
}

