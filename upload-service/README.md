# Upload Service

Microservice for handling file uploads and serving for the ReadAgain platform.

## Features

- Upload ebook files (.epub, .pdf)
- Upload book cover images (.jpg, .jpeg, .png, .webp)
- Upload profile photos (.jpg, .jpeg, .png, .webp)
- Secure file serving with path traversal protection
- File validation (type and size)
- Unique filename generation

## Endpoints

### Upload Endpoints
- `POST /upload/ebook` - Upload ebook file
- `POST /upload/cover` - Upload book cover image
- `POST /upload/profile` - Upload profile photo

**Request:** multipart/form-data with `file` field

**Response:**
```json
{
  "success": true,
  "path": "/ebooks/1234567890.epub",
  "size": 5242880
}
```

### File Serving
- `GET /files/*` - Serve uploaded files

Example: `GET /files/ebooks/1234567890.epub`

### Health Check
- `GET /health` - Service health status

## Configuration

Environment variables:
- `PORT` - Server port (default: 8081)
- `STORAGE_PATH` - Storage directory path (default: /app/storage)
- `ALLOWED_ORIGINS` - CORS allowed origins (default: *)

## Deployment (Coolify)

1. Create new service in Coolify
2. Set build command: `go build -o bin/upload-service cmd/api/main.go`
3. Set start command: `./bin/upload-service`
4. Mount persistent volume: `/app/storage` → Coolify persistent storage
5. Set environment variable: `STORAGE_PATH=/app/storage`
6. Deploy

## Local Development

```bash
# Install dependencies
go mod download

# Run service
go run cmd/api/main.go
```

## File Structure

```
/app/storage (mounted from Coolify persistent storage)
  /ebooks      - Ebook files
  /covers      - Book cover images
  /profiles    - Profile photos
```
