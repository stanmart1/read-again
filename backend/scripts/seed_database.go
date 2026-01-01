package main

import (
	"log"
	"os"
	"readagain/internal/config"
	"readagain/internal/database"
	"readagain/internal/models"
	"readagain/internal/utils"
	"time"
)

func main() {
	log.Println("🌱 Starting comprehensive database seeding...")

	cfg := config.Load()
	if err := database.Connect(cfg.Database.URL); err != nil {
		log.Fatal("❌ Failed to connect to database:", err)
	}

	// Seed in order of dependencies
	seedRoles()
	seedUsers()
	seedAuthors()
	seedCategories()
	seedBooks()
	seedUserLibrary()

	log.Println("✅ Database seeding completed successfully!")
	os.Exit(0)
}

func seedRoles() {
	log.Println("📝 Seeding roles...")

	roles := []models.Role{
		{Name: "SuperAdmin", Description: "Super administrator with full system access"},
		{Name: "Admin", Description: "Administrator with full access"},
		{Name: "Author", Description: "Book author/publisher"},
	}

	for _, role := range roles {
		var existing models.Role
		if err := database.DB.Where("name = ?", role.Name).First(&existing).Error; err != nil {
			database.DB.Create(&role)
			log.Printf("  ✓ Created role: %s", role.Name)
		}
	}
}

func seedUsers() {
	log.Println("👥 Seeding users...")

	hashedPassword, _ := utils.HashPassword("password123")

	users := []models.User{
		{
			Email:        "reader@example.com",
			Username:     "john_reader",
			PasswordHash: hashedPassword,
			FirstName:    "John",
			LastName:     "Reader",
			PhoneNumber:  "+1234567890",
			RoleID:       4, // Customer
			IsActive:     true,
		},
		{
			Email:        "jane.author@example.com",
			Username:     "jane_author",
			PasswordHash: hashedPassword,
			FirstName:    "Jane",
			LastName:     "Author",
			PhoneNumber:  "+1234567891",
			RoleID:       3, // Author
			IsActive:     true,
		},
		{
			Email:        "system.admin@example.com",
			Username:     "system_admin",
			PasswordHash: hashedPassword,
			FirstName:    "System",
			LastName:     "Admin",
			PhoneNumber:  "+1234567892",
			RoleID:       2, // Admin
			IsActive:     true,
		},
	}

	for _, user := range users {
		var existing models.User
		if err := database.DB.Where("email = ?", user.Email).First(&existing).Error; err != nil {
			database.DB.Create(&user)
			log.Printf("  ✓ Created user: %s (%s)", user.Username, user.Email)
		}
	}
}

func seedAuthors() {
	log.Println("✍️  Seeding authors...")

	var authorUser models.User
	database.DB.Where("email = ?", "jane.author@example.com").First(&authorUser)

	authors := []models.Author{
		{
			UserID:       authorUser.ID,
			BusinessName: "Jane Author Publishing",
			Bio:          "Bestselling author of fiction and non-fiction books",
			Email:        "jane.author@example.com",
			Status:       "active",
		},
	}

	for _, author := range authors {
		var existing models.Author
		if err := database.DB.Where("user_id = ?", author.UserID).First(&existing).Error; err != nil {
			database.DB.Create(&author)
			log.Printf("  ✓ Created author: %s", author.BusinessName)
		}
	}
}

func seedCategories() {
	log.Println("📚 Seeding categories...")

	categories := []models.Category{
		{Name: "Fiction", Description: "Fictional stories and novels", Status: "active"},
		{Name: "Technology", Description: "Technology and programming books", Status: "active"},
		{Name: "Business", Description: "Business and entrepreneurship", Status: "active"},
	}

	for _, category := range categories {
		var existing models.Category
		if err := database.DB.Where("name = ?", category.Name).First(&existing).Error; err != nil {
			database.DB.Create(&category)
			log.Printf("  ✓ Created category: %s", category.Name)
		}
	}
}

func seedBooks() {
	log.Println("📖 Seeding books...")

	var author models.Author
	database.DB.Where("email = ?", "jane.author@example.com").First(&author)

	var fictionCat, techCat, businessCat models.Category
	database.DB.Where("name = ?", "Fiction").First(&fictionCat)
	database.DB.Where("name = ?", "Technology").First(&techCat)
	database.DB.Where("name = ?", "Business").First(&businessCat)

	pubDate1 := time.Date(2024, 1, 15, 0, 0, 0, 0, time.UTC)
	pubDate2 := time.Date(2024, 3, 20, 0, 0, 0, 0, time.UTC)
	pubDate3 := time.Date(2024, 6, 10, 0, 0, 0, 0, time.UTC)

	books := []models.Book{
		{
			Title:            "The Digital Revolution",
			Subtitle:         "How Technology Changed Our World",
			Description:      "An in-depth look at how digital technology has transformed society, business, and daily life.",
			AuthorID:         author.ID,
			CategoryID:       &techCat.ID,
			Price:            19.99,
			ISBN:             "978-1234567890",
			Publisher:        "Tech Press",
			PublicationDate:  &pubDate1,
			Language:         "English",
			Pages:            350,
			CoverImage:       "/uploads/covers/digital-revolution.jpg",
			FilePath:         "/uploads/books/digital-revolution.epub",
			FileSize:         2500000,
			Status:           "published",
		},
		{
			Title:            "Building Successful Startups",
			Subtitle:         "A Practical Guide for Entrepreneurs",
			Description:      "Learn the essential strategies and tactics for building and scaling a successful startup from idea to exit.",
			AuthorID:         author.ID,
			CategoryID:       &businessCat.ID,
			Price:            24.99,
			ISBN:             "978-1234567891",
			Publisher:        "Business Books Inc",
			PublicationDate:  &pubDate2,
			Language:         "English",
			Pages:            420,
			CoverImage:       "/uploads/covers/startups.jpg",
			FilePath:         "/uploads/books/startups.epub",
			FileSize:         3200000,
			Status:           "published",
		},
		{
			Title:            "The Last Journey",
			Subtitle:         "A Tale of Adventure and Discovery",
			Description:      "An epic adventure story following a group of explorers on their quest to discover a lost civilization.",
			AuthorID:         author.ID,
			CategoryID:       &fictionCat.ID,
			Price:            14.99,
			ISBN:             "978-1234567892",
			Publisher:        "Fiction House",
			PublicationDate:  &pubDate3,
			Language:         "English",
			Pages:            480,
			CoverImage:       "/uploads/covers/last-journey.jpg",
			FilePath:         "/uploads/books/last-journey.epub",
			FileSize:         2800000,
			Status:           "published",
		},
	}

	for _, book := range books {
		var existing models.Book
		if err := database.DB.Where("isbn = ?", book.ISBN).First(&existing).Error; err != nil {
			database.DB.Create(&book)
			log.Printf("  ✓ Created book: %s", book.Title)
		}
	}
}

func seedUserLibrary() {
	log.Println("📚 Seeding user library...")

	var reader models.User
	database.DB.Where("email = ?", "reader@example.com").First(&reader)

	var books []models.Book
	database.DB.Limit(2).Find(&books)

	for _, book := range books {
		var existing models.UserLibrary
		if err := database.DB.Where("user_id = ? AND book_id = ?", reader.ID, book.ID).First(&existing).Error; err != nil {
			library := models.UserLibrary{
				UserID:     reader.ID,
				BookID:     book.ID,
				Progress:   0,
				LastReadAt: nil,
			}
			database.DB.Create(&library)
			log.Printf("  ✓ Added book to library: %s", book.Title)
		}
	}
}
