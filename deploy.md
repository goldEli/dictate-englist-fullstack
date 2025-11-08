# Dictate English - Deployment Guide

This guide will help you deploy the Dictate English full-stack application using Docker Compose.

## Prerequisites

- Docker (version 20.0 or higher)
- Docker Compose (version 2.0 or higher)
- At least 4GB of available RAM
- At least 10GB of available disk space

## Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd dictate-englist-fullstack
```

### 2. Configure Environment

The deployment script will automatically generate the `.env` file with the necessary configuration. If you want to customize settings, you can edit the `.env` file after running the deployment script.

### 3. Run Deployment

Simply execute the deployment script:

```bash
chmod +x deploy.sh
./deploy.sh
```

The script will:
- Create necessary directories
- Generate environment configuration
- Build Docker images
- Start all services
- Wait for services to be healthy
- Display access information

## Update Deployment (After Code Changes)

When you have made code changes and need to redeploy:

```bash
chmod +x deploy-update.sh
./deploy-update.sh
```

The update script will:
- Stop all running services
- Rebuild Docker images with latest code
- Restart all services
- Wait for services to be healthy
- Display deployment status

**Important:** Use `deploy-update.sh` for code updates, not `deploy.sh`. The `deploy.sh` script is for initial deployment only.

## Manual Deployment

If you prefer to deploy manually or the script fails:

### 1. Create Environment File

Create a `.env` file in the project root:

```env
# MySQL Configuration
MYSQL_ROOT_PASSWORD=mypassword123
MYSQL_DATABASE=dictate_english
MYSQL_USER=dictate_user
MYSQL_PASSWORD=mypassword123
MYSQL_PORT=3306

# Redis Configuration
REDIS_HOST=redis
REDIS_PORT=6379

# Database Configuration (Backend)
DB_HOST=mysql
DB_PORT=3306
DB_USER=dictate_user
DB_PASSWORD=mypassword123
DB_NAME=dictate_english

# JWT Configuration
JWT_SECRET=your-secret-key-min-32-chars

# Frontend Configuration
FRONTEND_URL=http://localhost:8080
FRONTEND_PORT=8080

# Backend Configuration
PORT=3000
NODE_ENV=production
```

### 2. Create MySQL Initialization Scripts

Create the `mysql/init` directory and add the following files:

**mysql/init/01-create-database.sql**
```sql
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
```

**mysql/init/02-seed-user.sql**
```sql
USE dictate_english;

INSERT IGNORE INTO users (id, email, password_hash, created_at, updated_at)
VALUES
  (
    1,
    'test@example.com',
    '$2b$10$K8gN5P6L9M2Q3R4S5T6U7V8W9X0Y1Z2A3B4C5D6E7F8G9H0I1J2K3',
    NOW(),
    NOW()
  ),
  (
    2,
    'admin@example.com',
    '$2b$10$K8gN5P6L9M2Q3R4S5T6U7V8W9X0Y1Z2A3B4C5D6E7F8G9H0I1J2K3',
    NOW(),
    NOW()
  );
```

### 3. Build and Start Services

```bash
# Stop any existing containers
docker-compose down -v

# Build images
docker-compose build --no-cache

# Start services
docker-compose up -d
```

### 4. Verify Deployment

Wait for services to be healthy (about 30-60 seconds):

```bash
docker-compose ps
```

You should see all services with "healthy" status:
- mysql: Up (healthy)
- redis: Up (healthy)
- backend: Up (healthy)
- frontend: Up (healthy)

## Accessing the Application

### Web Interface
- **URL**: http://localhost:8080
- **Test User**: test@example.com
- **Password**: password123

### API Endpoint
- **URL**: http://localhost:8081
- **Health Check**: http://localhost:8081

### Database
- **Host**: localhost
- **Port**: 3306
- **Database**: dictate_english
- **User**: dictate_user
- **Password**: (from .env file)

## Management Commands

### Quick Commands

```bash
# Update deployment (after code changes)
./deploy-update.sh

# View all services status
docker-compose ps
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql
docker-compose logs -f redis
```

### Stop Services
```bash
# Stop without removing containers
docker-compose stop

# Stop and remove containers
docker-compose down

# Stop and remove containers + volumes (WARNING: destroys data)
docker-compose down -v
```

### Restart Services
```bash
docker-compose restart
```

### Check Service Status
```bash
docker-compose ps
```

### Execute Commands in Containers
```bash
# Backend shell
docker-compose exec backend sh

# MySQL shell
docker-compose exec mysql mysql -u root -p

# Redis CLI
docker-compose exec redis redis-cli
```

## Troubleshooting

### Services Not Starting

Check the logs for errors:
```bash
docker-compose logs [service-name]
```

### Frontend Not Accessible
- Ensure backend is healthy first
- Check if port 8080 is available
- Verify the NEXT_PUBLIC_API_URL environment variable

### Backend Not Starting
- Ensure MySQL and Redis are healthy
- Check database credentials in .env
- Verify the JWT_SECRET is set (minimum 32 characters)

### MySQL Connection Issues
- Wait for MySQL to be fully healthy (may take 30-60 seconds on first run)
- Check MySQL logs: `docker-compose logs mysql`
- Verify MySQL root password in .env matches the one used during initialization

### Database Data Loss
- Never use `docker-compose down -v` unless you want to destroy all data
- Data persists in the `mysql-data` Docker volume
- To backup: `docker run --rm -v dictate-englist-fullstack_mysql-data:/data -v $(pwd):/backup alpine tar czf /backup/mysql-backup.tar.gz /data`

## Updating the Application

When code changes are made, you can either use the update script (recommended) or manual commands:

### Recommended: Using Update Script

```bash
# Pull latest changes (if using git)
git pull

# Run update script (rebuilds and redeploys)
./deploy-update.sh
```

### Manual Method

```bash
# Pull latest changes
git pull

# Rebuild and restart
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## Configuration Options

### Changing Ports

Edit `docker-compose.yml` and modify the port mappings:

```yaml
services:
  frontend:
    ports:
      - "8080:3000"  # Change 8080 to your desired port

  backend:
    ports:
      - "8081:3000"  # Change 8081 to your desired port
```

### Custom Domain

To use a custom domain:

1. Update `FRONTEND_URL` and `BACKEND_URL` in .env
2. Update `NEXT_PUBLIC_API_URL` in docker-compose.yml frontend service
3. Configure reverse proxy (nginx, traefik, etc.) to route to the containers

### Production Deployment

For production:

1. **Security**:
   - Change all default passwords
   - Use strong JWT secrets
   - Enable HTTPS/TLS
   - Restrict database access
   - Use secrets management (Docker secrets, Vault, etc.)

2. **Performance**:
   - Increase resource limits in docker-compose.yml
   - Configure database indexing
   - Enable Redis persistence
   - Use CDN for static assets

3. **Monitoring**:
   - Add health check endpoints
   - Set up log aggregation
   - Configure metrics collection
   - Use a process manager (PM2, systemd, etc.)

4. **Backup**:
   - Schedule regular database backups
   - Back up user data and uploads
   - Test restoration procedures

## Architecture

### Services

- **Frontend** (Next.js): React-based web application running on port 3000
- **Backend** (NestJS): REST API running on port 3000
- **MySQL**: Database server on port 3306
- **Redis**: Session store and caching on port 6379

### Network

All services communicate via Docker network `app-network`:
- Frontend → Backend: http://backend:3000
- Backend → MySQL: mysql:3306
- Backend → Redis: redis:6379

### Volumes

- **mysql-data**: Persistent MySQL data storage

## Support

For issues or questions:
- Check the logs: `docker-compose logs`
- Review Docker documentation
- Check project README
- Open an issue in the repository

## License

This project is licensed under the MIT License.
