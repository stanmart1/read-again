package handlers

import (
	"strconv"

	"readagain/internal/models"
	"readagain/internal/services"
	"readagain/internal/utils"

	"github.com/gofiber/fiber/v2"
)

type AuthorBookHandler struct {
	bookService *services.AuthorBookService
}

func NewAuthorBookHandler(bookService *services.AuthorBookService) *AuthorBookHandler {
	return &AuthorBookHandler{bookService: bookService}
}

// ListBooks returns all books for the authenticated author
func (h *AuthorBookHandler) ListBooks(c *fiber.Ctx) error {
	author, ok := c.Locals("author").(*models.Author)
	if !ok {
		return utils.NewUnauthorizedError("Author not found in context")
	}

	page, _ := strconv.Atoi(c.Query("page", "1"))
	limit, _ := strconv.Atoi(c.Query("limit", "20"))
	search := c.Query("search", "")
	status := c.Query("status", "")

	books, meta, err := h.bookService.ListBooks(author.ID, page, limit, search, status)
	if err != nil {
		utils.ErrorLogger.Printf("Failed to list books for author %d: %v", author.ID, err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to retrieve books"})
	}

	return c.JSON(fiber.Map{
		"success":    true,
		"books":      books,
		"pagination": meta,
	})
}

// GetBook returns a single book
func (h *AuthorBookHandler) GetBook(c *fiber.Ctx) error {
	author, ok := c.Locals("author").(*models.Author)
	if !ok {
		return utils.NewUnauthorizedError("Author not found in context")
	}

	bookID, err := strconv.ParseUint(c.Params("id"), 10, 32)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid book ID"})
	}

	book, err := h.bookService.GetBook(author.ID, uint(bookID))
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{
		"success": true,
		"book":    book,
	})
}

// CreateBook creates a new book
func (h *AuthorBookHandler) CreateBook(c *fiber.Ctx) error {
	author, ok := c.Locals("author").(*models.Author)
	if !ok {
		return utils.NewUnauthorizedError("Author not found in context")
	}

	var bookData map[string]interface{}
	if err := c.BodyParser(&bookData); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
	}

	book, err := h.bookService.CreateBook(author.ID, bookData)
	if err != nil {
		utils.ErrorLogger.Printf("Failed to create book for author %d: %v", author.ID, err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	utils.InfoLogger.Printf("Author %d created book %d", author.ID, book.ID)
	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"success": true,
		"book":    book,
	})
}

// UpdateBook updates a book
func (h *AuthorBookHandler) UpdateBook(c *fiber.Ctx) error {
	author, ok := c.Locals("author").(*models.Author)
	if !ok {
		return utils.NewUnauthorizedError("Author not found in context")
	}

	bookID, err := strconv.ParseUint(c.Params("id"), 10, 32)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid book ID"})
	}

	var updates map[string]interface{}
	if err := c.BodyParser(&updates); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
	}

	book, err := h.bookService.UpdateBook(author.ID, uint(bookID), updates)
	if err != nil {
		utils.ErrorLogger.Printf("Failed to update book %d for author %d: %v", bookID, author.ID, err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	utils.InfoLogger.Printf("Author %d updated book %d", author.ID, bookID)
	return c.JSON(fiber.Map{
		"success": true,
		"book":    book,
	})
}

// DeleteBook deletes a book
func (h *AuthorBookHandler) DeleteBook(c *fiber.Ctx) error {
	author, ok := c.Locals("author").(*models.Author)
	if !ok {
		return utils.NewUnauthorizedError("Author not found in context")
	}

	bookID, err := strconv.ParseUint(c.Params("id"), 10, 32)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid book ID"})
	}

	if err := h.bookService.DeleteBook(author.ID, uint(bookID)); err != nil {
		utils.ErrorLogger.Printf("Failed to delete book %d for author %d: %v", bookID, author.ID, err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	utils.InfoLogger.Printf("Author %d deleted book %d", author.ID, bookID)
	return c.JSON(fiber.Map{
		"success": true,
		"message": "Book deleted successfully",
	})
}

// PublishBook publishes a book
func (h *AuthorBookHandler) PublishBook(c *fiber.Ctx) error {
	author, ok := c.Locals("author").(*models.Author)
	if !ok {
		return utils.NewUnauthorizedError("Author not found in context")
	}

	bookID, err := strconv.ParseUint(c.Params("id"), 10, 32)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid book ID"})
	}

	book, err := h.bookService.PublishBook(author.ID, uint(bookID))
	if err != nil {
		utils.ErrorLogger.Printf("Failed to publish book %d for author %d: %v", bookID, author.ID, err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	utils.InfoLogger.Printf("Author %d published book %d", author.ID, bookID)
	return c.JSON(fiber.Map{
		"success": true,
		"book":    book,
		"message": "Book published successfully",
	})
}

// UnpublishBook unpublishes a book
func (h *AuthorBookHandler) UnpublishBook(c *fiber.Ctx) error {
	author, ok := c.Locals("author").(*models.Author)
	if !ok {
		return utils.NewUnauthorizedError("Author not found in context")
	}

	bookID, err := strconv.ParseUint(c.Params("id"), 10, 32)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid book ID"})
	}

	book, err := h.bookService.UnpublishBook(author.ID, uint(bookID))
	if err != nil {
		utils.ErrorLogger.Printf("Failed to unpublish book %d for author %d: %v", bookID, author.ID, err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	utils.InfoLogger.Printf("Author %d unpublished book %d", author.ID, bookID)
	return c.JSON(fiber.Map{
		"success": true,
		"book":    book,
		"message": "Book unpublished successfully",
	})
}

// GetBookStats returns statistics for a book
func (h *AuthorBookHandler) GetBookStats(c *fiber.Ctx) error {
	author, ok := c.Locals("author").(*models.Author)
	if !ok {
		return utils.NewUnauthorizedError("Author not found in context")
	}

	bookID, err := strconv.ParseUint(c.Params("id"), 10, 32)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid book ID"})
	}

	stats, err := h.bookService.GetBookStats(author.ID, uint(bookID))
	if err != nil {
		utils.ErrorLogger.Printf("Failed to get stats for book %d: %v", bookID, err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to retrieve book statistics"})
	}

	return c.JSON(fiber.Map{
		"success": true,
		"stats":   stats,
	})
}
