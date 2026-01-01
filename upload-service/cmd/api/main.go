package main

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/joho/godotenv"

	"upload-service/internal/config"
	"upload-service/internal/handlers"
	"upload-service/internal/middleware"
)

func main() {
	godotenv.Load()

	cfg := config.Load()

	app := fiber.New(fiber.Config{
		BodyLimit: int(cfg.MaxFileSize),
	})

	app.Use(logger.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins: cfg.AllowedOrigins,
		AllowHeaders: "Origin, Content-Type, Accept",
	}))
	app.Use(middleware.TimestampMiddleware())

	// Initialize handlers
	ebookHandler := handlers.NewEbookHandler(cfg)
	coverHandler := handlers.NewCoverHandler(cfg)
	profileHandler := handlers.NewProfileHandler(cfg)
	paymentProofHandler := handlers.NewPaymentProofHandler(cfg)
	fileHandler := handlers.NewFileHandler(cfg)

	// API routes
	api := app.Group("/api")
	api.Post("/upload/ebook", ebookHandler.Upload)
	api.Post("/upload/cover", coverHandler.Upload)
	api.Post("/upload/profile", profileHandler.Upload)
	api.Post("/upload/payment-proof", paymentProofHandler.Upload)
	
	// File serving
	app.Get("/files/*", fileHandler.Serve)

	// Root endpoint
	app.Get("/", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"service": "ReadAgain Upload Service",
			"version": "1.0.0",
			"status":  "running",
		})
	})

	// Health check
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"status": "ok"})
	})

	log.Printf("Upload service starting on port %s", cfg.Port)
	log.Fatal(app.Listen(":" + cfg.Port))
}
