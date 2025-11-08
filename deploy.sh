#!/bin/bash

# Docker Deployment Script for Dictate English Fullstack Application
# Usage: ./deploy.sh [options]
# Options:
#   --mysql-password PASSWORD    MySQL root and application password (required)
#   --port PORT                  Frontend access port (default: 3000)
#   --mysql-data PATH            MySQL data local path (default: ./mysql-data)
#   --mysql-port PORT            MySQL host port (default: 3306)
#   --help                       Show this help message

set -e

# Default values
MYSQL_PASSWORD="mypassword123"
PORT=8080
MYSQL_DATA="./mysql-data"
MYSQL_PORT=3306
ENV_FILE=".env"

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --mysql-password)
      MYSQL_PASSWORD="$2"
      shift 2
      ;;
    --port)
      PORT="$2"
      shift 2
      ;;
    --mysql-data)
      MYSQL_DATA="$2"
      shift 2
      ;;
    --mysql-port)
      MYSQL_PORT="$2"
      shift 2
      ;;
    --help)
      grep "^# " "$0" | sed 's/^# //' | sed 's/# Options:/Options:/'
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      echo "Use --help for usage information"
      exit 1
      ;;
  esac
done

# Validate required parameters
if [ -z "$MYSQL_PASSWORD" ]; then
  echo "Error: --mysql-password is required"
  echo "Use --help for usage information"
  exit 1
fi

echo "======================================"
echo "Dictate English Docker Deployment"
echo "======================================"
echo ""

# Create MySQL data directory
echo "Creating MySQL data directory: $MYSQL_DATA"
mkdir -p "$MYSQL_DATA"
mkdir -p mysql/init

# Generate JWT secret (32 characters minimum)
JWT_SECRET=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-32)

# Create .env file
echo "Creating environment file: $ENV_FILE"
cat > "$ENV_FILE" << ENVEOF
# MySQL Configuration
MYSQL_ROOT_PASSWORD=$MYSQL_PASSWORD
MYSQL_DATABASE=dictate_english
MYSQL_USER=dictate_user
MYSQL_PASSWORD=$MYSQL_PASSWORD
MYSQL_PORT=$MYSQL_PORT

# Redis Configuration
REDIS_HOST=redis
REDIS_PORT=6379

# Database Configuration (Backend)
DB_HOST=mysql
DB_PORT=3306
DB_USER=dictate_user
DB_PASSWORD=$MYSQL_PASSWORD
DB_NAME=dictate_english

# JWT Configuration
JWT_SECRET=$JWT_SECRET

# Frontend Configuration
FRONTEND_URL=http://localhost:$PORT
FRONTEND_PORT=$PORT

# Backend Configuration
PORT=3000
NODE_ENV=production
ENVEOF

echo "Environment file created successfully"
echo ""

# Create MySQL initialization script
cat > mysql/init/01-create-database.sql << 'SQLEOF'
CREATE DATABASE IF NOT EXISTS dictate_english;
USE dictate_english;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_sentences (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  sentence_id VARCHAR(255) NOT NULL,
  sentence_text TEXT NOT NULL,
  sentence_order INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_sentence (user_id, sentence_id)
);

GRANT ALL PRIVILEGES ON dictate_english.* TO 'dictate_user'@'%';
FLUSH PRIVILEGES;
SQLEOF

# Create seed script
cat > mysql/init/02-seed-user.sql << 'SQLEOF'
USE dictate_english;

INSERT IGNORE INTO users (id, email, password_hash, created_at, updated_at)
VALUES
  (
    1,
    'test@example.com',
    '\$2b\$10\$K8gN5P6L9M2Q3R4S5T6U7V8W9X0Y1Z2A3B4C5D6E7F8G9H0I1J2K3',
    NOW(),
    NOW()
  ),
  (
    2,
    'admin@example.com',
    '\$2b\$10\$K8gN5P6L9M2Q3R4S5T6U7V8W9X0Y1Z2A3B4C5D6E7F8G9H0I1J2K3',
    NOW(),
    NOW()
  );
SQLEOF

echo "MySQL initialization scripts created"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
  echo "Error: Docker is not running. Please start Docker and try again."
  exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null; then
  echo "Error: Docker Compose is not installed. Please install Docker Compose and try again."
  exit 1
fi

echo "Building and starting services..."
echo ""

# Build and start services
docker-compose down -v 2>/dev/null || true
docker-compose build --no-cache
docker-compose up -d

echo ""
echo "Waiting for services to be healthy..."
echo ""

# Wait for services to be healthy
MAX_RETRIES=30
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
  if docker-compose ps --services --filter "status=healthy" | grep -q "frontend"; then
    echo ""
    echo "======================================"
    echo "Deployment Successful!"
    echo "======================================"
    echo ""
    echo "Access your application:"
    echo "  Frontend: http://localhost:$PORT"
    echo "  API Docs: http://localhost:$PORT/docs"
    echo ""
    echo "Database:"
    echo "  Host: localhost"
    echo "  Port: $MYSQL_PORT"
    echo "  Database: dictate_english"
    echo ""
    echo "Test Users:"
    echo "  Email: test@example.com"
    echo "  Password: password123"
    echo ""
    echo "  Email: admin@example.com"
    echo "  Password: password123"
    echo ""
    echo "To stop the application:"
    echo "  docker-compose down"
    echo ""
    echo "To view logs:"
    echo "  docker-compose logs -f"
    echo ""
    exit 0
  fi
  
  echo -n "."
  sleep 2
  RETRY_COUNT=$((RETRY_COUNT + 1))
done

echo ""
echo "Error: Services failed to start within expected time"
echo "Check logs with: docker-compose logs"
exit 1
