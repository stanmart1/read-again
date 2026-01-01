package middleware

import (
	"time"

	"github.com/gofiber/fiber/v2"
)

func TimestampMiddleware() fiber.Handler {
	return func(c *fiber.Ctx) error {
		c.Locals("timestamp", time.Now().UnixNano())
		return c.Next()
	}
}
