package main

import (
	"log"
	"os"
	"readagain/internal/config"
	"readagain/internal/database"
)

func main() {
	log.Println("🔄 Adding author response fields to reviews table...")

	cfg := config.Load()
	if err := database.Connect(cfg.Database.URL); err != nil {
		log.Fatal("❌ Failed to connect to database:", err)
	}

	if err := database.DB.Exec(`
		ALTER TABLE reviews 
		ADD COLUMN IF NOT EXISTS author_response TEXT,
		ADD COLUMN IF NOT EXISTS responded_at TIMESTAMP
	`).Error; err != nil {
		log.Fatalf("❌ Failed to add review response fields: %v", err)
	}

	log.Println("✅ Successfully added author_response and responded_at fields to reviews table")
	os.Exit(0)
}
