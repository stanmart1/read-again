package main

import (
	"log"
	"os"

	"readagain/internal/config"
	"readagain/internal/database"
	"readagain/internal/models"

	"github.com/joho/godotenv"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using environment variables")
	}

	// Load config
	cfg := config.Load()

	// Connect to database
	if err := database.Connect(cfg.Database.URL); err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	log.Println("🔄 Starting database migration...")

	// AutoMigrate all models
	err := database.AutoMigrate(
		// User & Auth
		&models.User{},
		&models.Role{},
		&models.Permission{},
		
		// Books & Content
		&models.Book{},
		&models.Category{},
		&models.Author{},
		&models.Review{},
		
		// Orders & Payments
		&models.Order{},
		&models.OrderItem{},
		&models.Payment{},
		&models.Cart{},
		&models.CartItem{},
		
		// Reading
		&models.ReadingSession{},
		&models.ReadingGoal{},
		&models.UserLibrary{},
		&models.Bookmark{},
		&models.Note{},
		
		// Content Management
		&models.Blog{},
		&models.FAQ{},
		&models.Testimonial{},
		&models.AboutContent{},
		&models.ContactMessage{},
		&models.Work{},
		
		// System
		&models.Notification{},
		&models.Achievement{},
		&models.UserAchievement{},
		&models.Activity{},
		&models.AuditLog{},
		&models.SystemSettings{},
		&models.EmailTemplate{},
		&models.ShippingSettings{},
		&models.PaymentSettings{},
	)

	if err != nil {
		log.Fatal("❌ Migration failed:", err)
	}

	log.Println("✅ Database migration completed successfully!")
	log.Println("📊 All tables created/updated")
	
	os.Exit(0)
}
