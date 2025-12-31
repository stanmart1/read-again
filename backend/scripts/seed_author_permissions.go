package main

import (
	"log"

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

	// Get Author role (ID: 3)
	var authorRole models.Role
	if err := database.DB.Where("name = ?", "Author").First(&authorRole).Error; err != nil {
		log.Fatal("❌ Author role not found. Please run seed_roles.go first")
	}

	log.Printf("Found Author role (ID: %d)", authorRole.ID)

	// Get all author permissions
	authorPermissionNames := []string{
		"author.manage_own_books",
		"author.view_own_sales",
		"author.view_own_earnings",
		"author.manage_profile",
		"author.respond_reviews",
		"author.request_payout",
		"author.create_categories",
	}

	var permissions []models.Permission
	if err := database.DB.Where("name IN ?", authorPermissionNames).Find(&permissions).Error; err != nil {
		log.Fatal("❌ Failed to fetch author permissions:", err)
	}

	log.Printf("Found %d author permissions", len(permissions))

	// Assign permissions to Author role using GORM association
	if err := database.DB.Model(&authorRole).Association("Permissions").Append(&permissions); err != nil {
		log.Fatal("❌ Failed to assign permissions:", err)
	}

	log.Println("✓ Assigned all author permissions to Author role")

	log.Println("\n✅ Author role permissions assigned successfully!")
}
