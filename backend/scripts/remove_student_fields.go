package main

import (
	"log"
	"os"
	"readagain/internal/config"
	"readagain/internal/database"
)

func main() {
	log.Println("🔄 Removing student-related fields from users table...")

	cfg := config.Load()
	if err := database.Connect(cfg.Database.URL); err != nil {
		log.Fatal("❌ Failed to connect to database:", err)
	}

	if err := database.DB.Exec(`
		ALTER TABLE users 
		DROP COLUMN IF EXISTS school_name,
		DROP COLUMN IF EXISTS school_category,
		DROP COLUMN IF EXISTS class_level,
		DROP COLUMN IF EXISTS department
	`).Error; err != nil {
		log.Fatalf("❌ Failed to remove student fields: %v", err)
	}

	log.Println("✅ Successfully removed student fields from users table")
	os.Exit(0)
}
