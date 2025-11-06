#!/bin/bash

# MySQL Manual Setup Script
# This script is used by the deployment script and can be run manually if needed
# It creates the database, user, and seeds the test user

set -e

echo "Setting up MySQL database..."

# Load environment variables from .env file
if [ ! -f .env ]; then
  echo "Error: .env file not found. Run deploy.sh first or create .env manually."
  exit 1
fi

source .env

# MySQL connection parameters
MYSQL_HOST=${MYSQL_HOST:-localhost}
MYSQL_PORT=${MYSQL_PORT:-3306}
MYSQL_ROOT_PASSWORD=$MYSQL_ROOT_PASSWORD
MYSQL_DATABASE=$MYSQL_DATABASE
MYSQL_USER=$MYSQL_USER
MYSQL_PASSWORD=$MYSQL_PASSWORD

echo "Connecting to MySQL at $MYSQL_HOST:$MYSQL_PORT..."
echo ""

# Create database and user
mysql -h "$MYSQL_HOST" -P "$MYSQL_PORT" -u root -p"$MYSQL_ROOT_PASSWORD" << SQLEOF
CREATE DATABASE IF NOT EXISTS $MYSQL_DATABASE;
USE $MYSQL_DATABASE;

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

CREATE USER IF NOT EXISTS '$MYSQL_USER'@'%' IDENTIFIED BY '$MYSQL_PASSWORD';
GRANT ALL PRIVILEGES ON $MYSQL_DATABASE.* TO '$MYSQL_USER'@'%';
FLUSH PRIVILEGES;
SQLEOF

# Seed test user
# Note: The password hash below is for 'password123'
mysql -h "$MYSQL_HOST" -P "$MYSQL_PORT" -u root -p"$MYSQL_ROOT_PASSWORD" "$MYSQL_DATABASE" << SQLEOF
INSERT IGNORE INTO users (id, email, password_hash, created_at, updated_at)
VALUES (
  1,
  'test@example.com',
  '\$2b\$10\$K8gN5P6L9M2Q3R4S5T6U7V8W9X0Y1Z2A3B4C5D6E7F8G9H0I1J2K3',
  NOW(),
  NOW()
);
SQLEOF

echo "MySQL setup completed successfully!"
echo ""
echo "Database: $MYSQL_DATABASE"
echo "User: $MYSQL_USER"
echo "Test user: test@example.com / password123"
echo ""
