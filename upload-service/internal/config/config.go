package config

import (
	"os"
)

type Config struct {
	Port           string
	UploadDir      string
	MaxFileSize    int64
	AllowedOrigins string
}

func Load() *Config {
	return &Config{
		Port:           getEnv("PORT", "8081"),
		UploadDir:      getEnv("STORAGE_PATH", "/app/storage"),
		MaxFileSize:    10 * 1024 * 1024 * 1024, // 10GB max
		AllowedOrigins: getEnv("ALLOWED_ORIGINS", "*"),
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
