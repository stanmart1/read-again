package main

import (
	"log"
	"readagain/internal/database"
	"readagain/internal/models"
)

func main() {
	log.Println("🔄 Running author earnings migration...")

	// Initialize database
	if err := database.InitDB(); err != nil {
		log.Fatal("❌ Failed to connect to database:", err)
	}

	// Add new columns to authors table
	log.Println("Adding financial columns to authors table...")
	if err := database.DB.AutoMigrate(&models.Author{}); err != nil {
		log.Fatal("❌ Failed to migrate authors table:", err)
	}

	// Create earnings table
	log.Println("Creating earnings table...")
	if err := database.DB.AutoMigrate(&models.Earning{}); err != nil {
		log.Fatal("❌ Failed to create earnings table:", err)
	}

	// Create payouts table
	log.Println("Creating payouts table...")
	if err := database.DB.AutoMigrate(&models.Payout{}); err != nil {
		log.Fatal("❌ Failed to create payouts table:", err)
	}

	log.Println("✅ Author earnings migration completed successfully!")
}
