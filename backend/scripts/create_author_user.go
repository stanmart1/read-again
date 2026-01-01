package main

import (
	"log"
	"os"
	"readagain/internal/config"
	"readagain/internal/database"
	"readagain/internal/models"

	"github.com/joho/godotenv"
	"golang.org/x/crypto/bcrypt"
)

func main() {
	log.Println("🔄 Creating author user...")

	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using environment variables")
	}

	// Load config
	cfg := config.Load()

	// Initialize database
	if err := database.Connect(cfg.Database.URL); err != nil {
		log.Fatal("❌ Failed to connect to database:", err)
	}

	// Get Author role
	var authorRole models.Role
	if err := database.DB.Where("name = ?", "Author").First(&authorRole).Error; err != nil {
		log.Fatal("❌ Author role not found. Run seed_roles.go first:", err)
	}

	// Check if user already exists
	var existingUser models.User
	if err := database.DB.Where("email = ?", "author@readagain.com").First(&existingUser).Error; err == nil {
		log.Println("⚠️  User with email author@readagain.com already exists")
		return
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte("author123"), bcrypt.DefaultCost)
	if err != nil {
		log.Fatal("❌ Failed to hash password:", err)
	}

	// Create user
	user := models.User{
		Email:           "author@readagain.com",
		Username:        "author",
		PasswordHash:    string(hashedPassword),
		FirstName:       "Test",
		LastName:        "Author",
		RoleID:          authorRole.ID,
		IsActive:        true,
		IsEmailVerified: true,
	}

	if err := database.DB.Create(&user).Error; err != nil {
		log.Fatal("❌ Failed to create user:", err)
	}

	// Create author profile
	author := models.Author{
		UserID:          user.ID,
		Bio:             "Test author account",
		Status:          "active",
		CommissionRate:  70.0,
		TotalEarnings:   0,
		AvailableBalance: 0,
		PendingBalance:  0,
	}

	if err := database.DB.Create(&author).Error; err != nil {
		log.Fatal("❌ Failed to create author profile:", err)
	}

	log.Println("✅ Author user created successfully!")
	log.Println("📧 Email: author@readagain.com")
	log.Println("🔑 Password: author123")
	log.Println("👤 Username: author")
	
	os.Exit(0)
}
