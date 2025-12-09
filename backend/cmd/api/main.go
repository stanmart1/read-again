package main

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"

	"readagain/internal/config"
	"readagain/internal/database"
	"readagain/internal/handlers"
	"readagain/internal/middleware"
	"readagain/internal/services"
	"readagain/internal/utils"
)

func main() {
	utils.InitLogger()
	cfg := config.Load()

	if err := database.Connect(cfg.Database.URL); err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	app := fiber.New(fiber.Config{
		AppName:      "ReadAgain API v1.0.0",
		ErrorHandler: middleware.ErrorHandler,
	})

	app.Use(logger.New())
	
	allowOrigins := "*"
	if cfg.Server.Env != "development" {
		allowOrigins = "https://readagain.com"
	}
	
	app.Use(cors.New(cors.Config{
		AllowOrigins: allowOrigins,
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
		AllowMethods: "GET, POST, PUT, DELETE, PATCH, OPTIONS",
	}))

	app.Static("/uploads", "./uploads")

	app.Get("/", handlers.GetRoot)
	app.Get("/health", handlers.GetHealth)

	authService := services.NewAuthService(database.DB, cfg)
	userService := services.NewUserService(database.DB)
	roleService := services.NewRoleService(database.DB)
	categoryService := services.NewCategoryService(database.DB)
	authorService := services.NewAuthorService(database.DB)
	bookService := services.NewBookService(database.DB)
	storageService := services.NewStorageService("./uploads")
	cartService := services.NewCartService(database.DB)

	handlers.SetupRoutes(app, authService, userService, roleService, categoryService, authorService, bookService, storageService, cartService)

	utils.InfoLogger.Printf("🚀 Server starting on port %s", cfg.Server.Port)
	if err := app.Listen(":" + cfg.Server.Port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
