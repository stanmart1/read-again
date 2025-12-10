package handlers

import (
	"readagain/internal/middleware"
	"readagain/internal/services"

	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(
	app *fiber.App,
	authService *services.AuthService,
	userService *services.UserService,
	roleService *services.RoleService,
	categoryService *services.CategoryService,
	authorService *services.AuthorService,
	bookService *services.BookService,
	storageService *services.StorageService,
	cartService *services.CartService,
	orderService *services.OrderService,
	paymentService *services.PaymentService,
	libraryService *services.LibraryService,
	ereaderService *services.EReaderService,
	sessionService *services.ReadingSessionService,
	goalService *services.ReadingGoalService,
	achievementService *services.AchievementService,
	blogService *services.BlogService,
) {
	api := app.Group("/api/v1")

	authHandler := NewAuthHandler(authService)
	userHandler := NewUserHandler(userService)
	roleHandler := NewRoleHandler(roleService)
	categoryHandler := NewCategoryHandler(categoryService)
	authorHandler := NewAuthorHandler(authorService)
	bookHandler := NewBookHandler(bookService, storageService)
	cartHandler := NewCartHandler(cartService)
	checkoutHandler := NewCheckoutHandler(orderService, paymentService)
	orderHandler := NewOrderHandler(orderService)
	libraryHandler := NewLibraryHandler(libraryService, ereaderService)
	readingHandler := NewReadingHandler(sessionService, goalService)
	achievementHandler := NewAchievementHandler(achievementService)
	blogHandler := NewBlogHandler(blogService)

	auth := api.Group("/auth")
	auth.Post("/register", authHandler.Register)
	auth.Post("/login", authHandler.Login)
	auth.Post("/refresh", authHandler.RefreshToken)
	auth.Post("/logout", middleware.AuthRequired(), authHandler.Logout)
	auth.Get("/me", middleware.AuthRequired(), authHandler.GetMe)
	auth.Post("/forgot-password", authHandler.ForgotPassword)
	auth.Post("/reset-password", authHandler.ResetPassword)

	users := api.Group("/users")
	users.Get("/profile", middleware.AuthRequired(), userHandler.GetProfile)
	users.Put("/profile", middleware.AuthRequired(), userHandler.UpdateProfile)
	users.Post("/change-password", middleware.AuthRequired(), userHandler.ChangePassword)

	users.Post("/", middleware.AdminRequired(), userHandler.CreateUser)
	users.Get("/", middleware.AdminRequired(), userHandler.ListUsers)
	users.Get("/:id", middleware.AdminRequired(), userHandler.GetUser)
	users.Put("/:id", middleware.AdminRequired(), userHandler.UpdateUser)
	users.Patch("/:id/status", middleware.AdminRequired(), userHandler.ToggleStatus)
	users.Delete("/:id", middleware.AdminRequired(), userHandler.DeleteUser)
	users.Post("/:id/roles", middleware.AdminRequired(), userHandler.AssignRole)
	users.Delete("/:id/roles", middleware.AdminRequired(), userHandler.RemoveRole)
	users.Post("/:id/reset-password", middleware.AdminRequired(), userHandler.AdminResetPassword)
	
	users.Post("/bulk/activate", middleware.AdminRequired(), userHandler.BulkActivate)
	users.Post("/bulk/deactivate", middleware.AdminRequired(), userHandler.BulkDeactivate)
	users.Post("/bulk/delete", middleware.AdminRequired(), userHandler.BulkDelete)

	roles := api.Group("/roles")
	roles.Get("/", roleHandler.ListRoles)
	roles.Post("/", middleware.AdminRequired(), roleHandler.CreateRole)
	roles.Get("/:id", roleHandler.GetRole)
	roles.Put("/:id", middleware.AdminRequired(), roleHandler.UpdateRole)
	roles.Delete("/:id", middleware.AdminRequired(), roleHandler.DeleteRole)

	permissions := api.Group("/permissions")
	permissions.Get("/", roleHandler.ListPermissions)

	categories := api.Group("/categories")
	categories.Get("/", categoryHandler.ListCategories)
	categories.Get("/:id", categoryHandler.GetCategory)
	categories.Post("/", middleware.AdminRequired(), categoryHandler.CreateCategory)
	categories.Put("/:id", middleware.AdminRequired(), categoryHandler.UpdateCategory)
	categories.Delete("/:id", middleware.AdminRequired(), categoryHandler.DeleteCategory)

	authors := api.Group("/authors")
	authors.Get("/", authorHandler.ListAuthors)
	authors.Get("/:id", authorHandler.GetAuthor)
	authors.Post("/", middleware.AdminRequired(), authorHandler.CreateAuthor)
	authors.Put("/:id", middleware.AdminRequired(), authorHandler.UpdateAuthor)
	authors.Delete("/:id", middleware.AdminRequired(), authorHandler.DeleteAuthor)

	books := api.Group("/books")
	books.Get("/", bookHandler.ListBooks)
	books.Get("/featured", bookHandler.GetFeaturedBooks)
	books.Get("/new-releases", bookHandler.GetNewReleases)
	books.Get("/bestsellers", bookHandler.GetBestsellers)
	books.Get("/:id", bookHandler.GetBook)
	books.Post("/", middleware.AdminRequired(), bookHandler.CreateBook)
	books.Put("/:id", middleware.AdminRequired(), bookHandler.UpdateBook)
	books.Delete("/:id", middleware.AdminRequired(), bookHandler.DeleteBook)
	books.Patch("/:id/featured", middleware.AdminRequired(), bookHandler.ToggleFeatured)

	cart := api.Group("/cart", middleware.AuthRequired())
	cart.Get("/", cartHandler.GetCart)
	cart.Get("/count", cartHandler.GetCartCount)
	cart.Post("/", cartHandler.AddToCart)
	cart.Delete("/:id", cartHandler.RemoveFromCart)
	cart.Delete("/", cartHandler.ClearCart)
	cart.Post("/merge", cartHandler.MergeGuestCart)

	checkout := api.Group("/checkout", middleware.AuthRequired())
	checkout.Post("/initialize", checkoutHandler.InitializeCheckout)
	checkout.Post("/payment", checkoutHandler.InitializePayment)
	checkout.Get("/verify/:reference", checkoutHandler.VerifyPayment)

	webhooks := api.Group("/webhooks")
	webhooks.Post("/paystack", checkoutHandler.PaystackWebhook)
	webhooks.Post("/flutterwave", checkoutHandler.FlutterwaveWebhook)

	orders := api.Group("/orders", middleware.AuthRequired())
	orders.Get("/", orderHandler.GetUserOrders)
	orders.Get("/:id", orderHandler.GetOrder)
	orders.Post("/:id/cancel", orderHandler.CancelOrder)

	adminOrders := api.Group("/admin/orders", middleware.AdminRequired())
	adminOrders.Get("/", orderHandler.GetAllOrders)
	adminOrders.Get("/stats", orderHandler.GetOrderStatistics)
	adminOrders.Get("/:id", orderHandler.GetOrderAdmin)
	adminOrders.Patch("/:id/status", orderHandler.UpdateOrderStatus)

	library := api.Group("/library", middleware.AuthRequired())
	library.Get("/", libraryHandler.GetLibrary)
	library.Get("/statistics", libraryHandler.GetStatistics)
	library.Get("/:id/access", libraryHandler.AccessBook)
	library.Put("/:id/progress", libraryHandler.UpdateProgress)
	library.Get("/:id/bookmarks", libraryHandler.GetBookmarks)
	library.Post("/:id/bookmarks", libraryHandler.CreateBookmark)
	library.Delete("/bookmarks/:bookmarkId", libraryHandler.DeleteBookmark)
	library.Get("/:id/notes", libraryHandler.GetNotes)
	library.Post("/:id/notes", libraryHandler.CreateNote)
	library.Put("/notes/:noteId", libraryHandler.UpdateNote)
	library.Delete("/notes/:noteId", libraryHandler.DeleteNote)

	reading := api.Group("/reading", middleware.AuthRequired())
	reading.Post("/sessions/start", readingHandler.StartSession)
	reading.Post("/sessions/end", readingHandler.EndSession)
	reading.Get("/sessions", readingHandler.GetSessions)
	reading.Get("/goals", readingHandler.GetGoals)
	reading.Post("/goals", readingHandler.CreateGoal)
	reading.Put("/goals/:id", readingHandler.UpdateGoal)
	reading.Delete("/goals/:id", readingHandler.DeleteGoal)

	achievements := api.Group("/achievements")
	achievements.Get("/", achievementHandler.GetAllAchievements)
	achievements.Get("/user", middleware.AuthRequired(), achievementHandler.GetUserAchievements)
	achievements.Post("/check", middleware.AuthRequired(), achievementHandler.CheckAchievements)
	achievements.Post("/", middleware.AdminRequired(), achievementHandler.CreateAchievement)
	achievements.Put("/:id", middleware.AdminRequired(), achievementHandler.UpdateAchievement)
	achievements.Delete("/:id", middleware.AdminRequired(), achievementHandler.DeleteAchievement)

	blogs := api.Group("/blogs")
	blogs.Get("/", blogHandler.List)
	blogs.Get("/:slug", blogHandler.GetBySlug)

	adminBlogs := api.Group("/admin/blogs", middleware.AdminRequired())
	adminBlogs.Get("/", blogHandler.AdminList)
	adminBlogs.Get("/:id", blogHandler.GetByID)
	adminBlogs.Post("/", blogHandler.Create)
	adminBlogs.Put("/:id", blogHandler.Update)
	adminBlogs.Delete("/:id", blogHandler.Delete)
}
