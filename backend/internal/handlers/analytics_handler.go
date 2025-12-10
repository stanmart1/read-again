package handlers

import (
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"

	"readagain/internal/services"
	"readagain/internal/utils"
)

type AnalyticsHandler struct {
	service *services.AnalyticsService
}

func NewAnalyticsHandler(service *services.AnalyticsService) *AnalyticsHandler {
	return &AnalyticsHandler{service: service}
}

func (h *AnalyticsHandler) GetDashboard(c *fiber.Ctx) error {
	overview, err := h.service.GetDashboardOverview()
	if err != nil {
		utils.ErrorLogger.Printf("Failed to get dashboard overview: %v", err)
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch dashboard data"})
	}

	return c.JSON(fiber.Map{"data": overview})
}

func (h *AnalyticsHandler) GetSalesStats(c *fiber.Ctx) error {
	var startDate, endDate *time.Time

	if start := c.Query("start_date"); start != "" {
		if t, err := time.Parse("2006-01-02", start); err == nil {
			startDate = &t
		}
	}

	if end := c.Query("end_date"); end != "" {
		if t, err := time.Parse("2006-01-02", end); err == nil {
			endDate = &t
		}
	}

	stats, err := h.service.GetSalesStats(startDate, endDate)
	if err != nil {
		utils.ErrorLogger.Printf("Failed to get sales stats: %v", err)
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch sales statistics"})
	}

	return c.JSON(fiber.Map{"data": stats})
}

func (h *AnalyticsHandler) GetUserStats(c *fiber.Ctx) error {
	stats, err := h.service.GetUserStats()
	if err != nil {
		utils.ErrorLogger.Printf("Failed to get user stats: %v", err)
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch user statistics"})
	}

	return c.JSON(fiber.Map{"data": stats})
}

func (h *AnalyticsHandler) GetReadingStats(c *fiber.Ctx) error {
	stats, err := h.service.GetReadingStats()
	if err != nil {
		utils.ErrorLogger.Printf("Failed to get reading stats: %v", err)
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch reading statistics"})
	}

	return c.JSON(fiber.Map{"data": stats})
}

func (h *AnalyticsHandler) GetRevenueReport(c *fiber.Ctx) error {
	days, _ := strconv.Atoi(c.Query("days", "30"))

	reports, err := h.service.GetRevenueReport(days)
	if err != nil {
		utils.ErrorLogger.Printf("Failed to get revenue report: %v", err)
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch revenue report"})
	}

	return c.JSON(fiber.Map{"data": reports})
}

func (h *AnalyticsHandler) GetGrowthMetrics(c *fiber.Ctx) error {
	metrics, err := h.service.GetGrowthMetrics()
	if err != nil {
		utils.ErrorLogger.Printf("Failed to get growth metrics: %v", err)
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch growth metrics"})
	}

	return c.JSON(fiber.Map{"data": metrics})
}
