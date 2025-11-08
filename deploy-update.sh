#!/bin/bash

# Deployment Update Script
# This script rebuilds and redeploys the application after code changes
# Usage: ./deploy-update.sh

set -e

echo "======================================"
echo "Dictate English - Deployment Update"
echo "======================================"
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

echo "Step 1: Stopping current services..."
echo "----------------------------------------"
docker-compose -f docker-compose.yml down

echo ""
echo "Step 2: Rebuilding Docker images (this may take a few minutes)..."
echo "----------------------------------------"
docker-compose -f docker-compose.yml build --no-cache

echo ""
echo "Step 3: Starting services..."
echo "----------------------------------------"
docker-compose -f docker-compose.yml up -d

echo ""
echo "Step 4: Waiting for services to be healthy..."
echo "----------------------------------------"

# Wait for services to be healthy
MAX_RETRIES=30
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
  BACKEND_HEALTHY=$(docker-compose -f docker-compose.yml ps --services --filter "status=healthy" 2>/dev/null | grep "^backend$" || echo "")
  FRONTEND_HEALTHY=$(docker-compose -f docker-compose.yml ps --services --filter "status=healthy" 2>/dev/null | grep "^frontend$" || echo "")
  MYSQL_HEALTHY=$(docker-compose -f docker-compose.yml ps --services --filter "status=healthy" 2>/dev/null | grep "^mysql$" || echo "")
  REDIS_HEALTHY=$(docker-compose -f docker-compose.yml ps --services --filter "status=healthy" 2>/dev/null | grep "^redis$" || echo "")

  if [ -n "$BACKEND_HEALTHY" ] && [ -n "$FRONTEND_HEALTHY" ] && [ -n "$MYSQL_HEALTHY" ] && [ -n "$REDIS_HEALTHY" ]; then
    echo ""
    echo "======================================"
    echo "✅ Deployment Update Successful!"
    echo "======================================"
    echo ""
    echo "Access your application:"
    echo "  🌐 Frontend: http://localhost:8080"
    echo "  🔌 Backend API: http://localhost:8081"
    echo ""
    echo "Test User:"
    echo "  📧 Email: test@example.com"
    echo "  🔑 Password: password123"
    echo ""
    echo "Service Status:"
    echo "  ✅ Backend (NestJS): Healthy"
    echo "  ✅ Frontend (Next.js): Healthy"
    echo "  ✅ MySQL Database: Healthy"
    echo "  ✅ Redis Cache: Healthy"
    echo ""
    exit 0
  fi

  echo -n "."
  sleep 2
  RETRY_COUNT=$((RETRY_COUNT + 1))
done

echo ""
echo "Error: Services failed to start within expected time"
echo ""
echo "Service Status:"
docker-compose -f docker-compose.yml ps
echo ""
echo "Logs:"
echo "  Backend: docker-compose logs backend"
echo "  Frontend: docker-compose logs frontend"
echo "  MySQL: docker-compose logs mysql"
echo "  Redis: docker-compose logs redis"
echo ""
exit 1
