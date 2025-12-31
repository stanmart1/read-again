package handlers

import (
	"read-again/internal/services"
	"read-again/internal/utils"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
)

type AuthorAnalyticsHandler struct {
	service *services.AuthorAnalyticsService
}

func NewAuthorAnalyticsHandler(service *services.AuthorAnalyticsService) *AuthorAnalyticsHandler {
	return &AuthorAnalyticsHandler{service: service}
}

func (h *AuthorAnalyticsHandler) GetOverview(c *fiber.Ctx) error {
	authorID := c.Locals("author_id").(uint)
	
	stats, err := h.service.GetOverview(authorID)
	if err != nil {
		utils.ErrorLogger.Printf("Failed to get analytics overview: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch analytics"})
	}
	
	return c.JSON(fiber.Map{"stats": stats})
}

func (h *AuthorAnalyticsHandler) GetSalesData(c *fiber.Ctx) error {
	authorID := c.Locals("author_id").(uint)
	
	// Parse date range
	startDateStr := c.Query("start_date", time.Now().AddDate(0, -1, 0).Format("2006-01-02"))
	endDateStr := c.Query("end_date", time.Now().Format("2006-01-02"))
	
	startDate, err := time.Parse("2006-01-02", startDateStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid start_date format"})
	}
	
	endDate, err := time.Parse("2006-01-02", endDateStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid end_date format"})
	}
	
	salesData, err := h.service.GetSalesData(authorID, startDate, endDate)
	if err != nil {
		utils.ErrorLogger.Printf("Failed to get sales data: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch sales data"})
	}
	
	return c.JSON(fiber.Map{"sales": salesData})
}

func (h *AuthorAnalyticsHandler) GetRevenueData(c *fiber.Ctx) error {
	authorID := c.Locals("author_id").(uint)
	
	// Parse date range
	startDateStr := c.Query("start_date", time.Now().AddDate(0, -1, 0).Format("2006-01-02"))
	endDateStr := c.Query("end_date", time.Now().Format("2006-01-02"))
	groupBy := c.Query("group_by", "day")
	
	startDate, err := time.Parse("2006-01-02", startDateStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid start_date format"})
	}
	
	endDate, err := time.Parse("2006-01-02", endDateStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid end_date format"})
	}
	
	revenueData, err := h.service.GetRevenueData(authorID, startDate, endDate, groupBy)
	if err != nil {
		utils.ErrorLogger.Printf("Failed to get revenue data: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch revenue data"})
	}
	
	return c.JSON(fiber.Map{"revenue": revenueData})
}

func (h *AuthorAnalyticsHandler) GetTopBooks(c *fiber.Ctx) error {
	authorID := c.Locals("author_id").(uint)
	
	limit, err := strconv.Atoi(c.Query("limit", "5"))
	if err != nil || limit < 1 {
		limit = 5
	}
	
	topBooks, err := h.service.GetTopBooks(authorID, limit)
	if err != nil {
		utils.ErrorLogger.Printf("Failed to get top books: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch top books"})
	}
	
	return c.JSON(fiber.Map{"books": topBooks})
}
