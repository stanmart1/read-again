package main

import (
	"log"

	"golang.org/x/crypto/bcrypt"
	"readagain/internal/config"
	"readagain/internal/database"
	"readagain/internal/models"
)

func main() {
	cfg := config.Load()

	if err := database.Connect(cfg.Database.URL); err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	log.Println("✅ Database connected")

	var existingUser models.User
	err := database.DB.Where("email = ?", "admin@readnwin.com").First(&existingUser).Error
	if err == nil {
		log.Println("❌ Admin user already exists")
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte("admiin123"), bcrypt.DefaultCost)
	if err != nil {
		log.Fatal("Failed to hash password:", err)
	}

	adminUser := models.User{
		FirstName:       "Admin",
		LastName:        "User",
		Email:           "admin@readnwin.com",
		Username:        "admin",
		PasswordHash:    string(hashedPassword),
		RoleID:          1, // SuperAdmin role
		IsActive:        true,
		IsEmailVerified: true,
	}

	if err := database.DB.Create(&adminUser).Error; err != nil {
		log.Fatal("❌ Failed to create admin user:", err)
	}

	log.Printf("✅ Admin user created successfully!")
	log.Printf("   Email: admin@readnwin.com")
	log.Printf("   Username: admin")
	log.Printf("   Password: admiin123")
	log.Printf("   Role: SuperAdmin (ID: 1)")
}
