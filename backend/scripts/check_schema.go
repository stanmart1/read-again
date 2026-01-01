package main

import (
	"fmt"
	"log"
	"read-again/internal/database"
	"read-again/internal/models"
	"reflect"
)

func main() {
	log.Println("🔍 Checking database schema...")

	// Initialize database
	if err := database.InitDB(); err != nil {
		log.Fatal("❌ Failed to connect to database:", err)
	}

	// List of all models
	modelsList := []interface{}{
		&models.User{},
		&models.Role{},
		&models.Permission{},
		&models.AuthLog{},
		&models.TokenBlacklist{},
		&models.Author{},
		&models.Book{},
		&models.Category{},
		&models.Cart{},
		&models.Order{},
		&models.OrderItem{},
		&models.UserLibrary{},
		&models.ReadingSession{},
		&models.ReadingGoal{},
		&models.Blog{},
		&models.FAQ{},
		&models.Review{},
		&models.SystemSettings{},
		&models.AuditLog{},
		&models.Notification{},
		&models.Achievement{},
		&models.UserAchievement{},
		&models.Earning{},
		&models.Payout{},
	}

	missingTables := []string{}
	existingTables := []string{}

	for _, model := range modelsList {
		tableName := database.DB.NamingStrategy.TableName(reflect.TypeOf(model).Elem().Name())
		
		if database.DB.Migrator().HasTable(model) {
			existingTables = append(existingTables, tableName)
			
			// Check for missing columns
			stmt := &database.DB.Statement
			stmt.Parse(model)
			
			for _, field := range stmt.Schema.Fields {
				if !database.DB.Migrator().HasColumn(model, field.DBName) {
					fmt.Printf("⚠️  Table '%s' is missing column: %s\n", tableName, field.DBName)
				}
			}
		} else {
			missingTables = append(missingTables, tableName)
		}
	}

	// Print results
	fmt.Println("\n📊 Schema Check Results:")
	fmt.Printf("✅ Existing tables: %d\n", len(existingTables))
	for _, table := range existingTables {
		fmt.Printf("   - %s\n", table)
	}

	if len(missingTables) > 0 {
		fmt.Printf("\n❌ Missing tables: %d\n", len(missingTables))
		for _, table := range missingTables {
			fmt.Printf("   - %s\n", table)
		}
		fmt.Println("\n⚠️  Run migration script to create missing tables!")
	} else {
		fmt.Println("\n✅ All tables exist in database!")
	}
}
