# Docker Deployment Guide

This guide explains how to deploy the Dictate English Fullstack application using Docker and Docker Compose on macOS.

```
./deploy.sh --mysql-password mypassword123 --port 8080 --mysql-data ./mysql-data
```

## Prerequisites

Before you begin, ensure you have the following installed on your Mac:

1. **Docker Desktop for Mac**
   - Download from: https://www.docker.com/products/docker-desktop
   - Docker Desktop includes both Docker and Docker Compose
   - Verify installation:
     ```bash
     docker --version
     docker-compose --version
     ```

2. **OpenSSL** (usually pre-installed on macOS)
   - Verify: `openssl version`

## Quick Start

### 1. Deploy the Application

Run the deployment script with your desired parameters:

```bash
# Make the script executable
chmod +x deploy.sh

# Deploy with default settings
./deploy.sh --mysql-password your-secure-password

# Deploy with custom port
./deploy.sh --mysql-password your-secure-password --port 8080

# Deploy with custom MySQL data location
./deploy.sh --mysql-password your-secure-password --mysql-data /path/to/mysql-data
```

### 2. Access the Application

After successful deployment:

- **Frontend**: http://localhost:3000 (or your custom port)
- **API Documentation**: http://localhost:3000/docs

### 3. Test User

Login with the pre-seeded test user:
- **Email**: test@example.com
- **Password**: password123

## Command-Line Options

The deployment script supports the following parameters:

| Parameter | Description | Default |
|-----------|-------------|---------|
| `--mysql-password` | MySQL root and application password (**required**) | None |
| `--port` | Frontend access port | 3000 |
| `--mysql-data` | Local path for MySQL data persistence | ./mysql-data |
| `--mysql-port` | MySQL host port mapping | 3306 |
| `--help` | Show usage information | - |

### Examples

```bash
# Minimal deployment
./deploy.sh --mysql-password mypassword123

# Custom port and MySQL data location
./deploy.sh \
  --mysql-password mypassword123 \
  --port 8080 \
  --mysql-data /Users/username/Documents/mysql-data

# Expose MySQL on non-default port
./deploy.sh \
  --mysql-password mypassword123 \
  --mysql-port 3307
```

## What the Deployment Script Does

1. **Creates MySQL data directory** at specified location
2. **Generates .env file** with all environment variables
3. **Generates JWT secret** for authentication
4. **Creates MySQL initialization scripts**:
   - Database creation
   - User and permissions setup
   - Test user seeding
5. **Stops any existing containers** (with cleanup)
6. **Builds Docker images** from Dockerfiles
7. **Starts all services** in correct order
8. **Waits for health checks** to pass
9. **Displays access information** and test credentials

## Docker Services

The deployment starts four Docker services:

### 1. MySQL 8.0
- **Port**: Configurable (default 3306)
- **Data Persistence**: Volume mounted to local path
- **Health Check**: mysqladmin ping
- **Initialization**: Automatic database and user creation

### 2. Redis
- **Port**: 6379
- **Data Persistence**: None (ephemeral)
- **Health Check**: redis-cli ping
- **Purpose**: Session management and caching

### 3. Backend (NestJS)
- **Port**: 3000 (internal)
- **Build**: Multi-stage production build
- **Health Check**: HTTP GET to /
- **Dependencies**: MySQL and Redis

### 4. Frontend (Next.js)
- **Port**: Configurable (default 3000, maps to host)
- **Build**: Multi-stage production build
- **Health Check**: HTTP GET to /
- **Dependencies**: Backend

## Managing the Application

### View Logs

```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql
docker-compose logs -f redis
```

### Stop the Application

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (deletes all data)
docker-compose down -v
```

### Restart the Application

```bash
# Restart all services
docker-compose restart

# Rebuild and restart (after code changes)
docker-compose up -d --build
```

### Check Service Status

```bash
# List all services and their status
docker-compose ps

# List running services only
docker-compose ps --services --filter "status=running"
```

## Development Mode

For active development with hot reloading:

1. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` with your preferences (or use defaults)

3. Run with Docker Compose (override mode):
   ```bash
   # Starts in development mode with volume mounts
   docker-compose up
   ```

   The override automatically:
   - Mounts source code directories
   - Runs dev servers with hot reload
   - Exposes debug ports
   - Uses development environment

4. Access the development server:
   - Frontend: http://localhost:3008
   - Backend: http://localhost:3000
   - MySQL: localhost:3306
   - Redis: localhost:6379

## Customization

### Environment Variables

Edit the generated `.env` file to customize:

```bash
# After deployment, you can modify these values
nano .env

# Then restart services to apply changes
docker-compose restart
```

### Database Management

#### Connect to MySQL

```bash
# Connect to MySQL via Docker
docker-compose exec mysql mysql -u root -p

# Or connect from host
mysql -h 127.0.0.1 -P 3306 -u root -p
```

#### Backup Database

```bash
# Create backup
docker-compose exec mysql mysqldump -u root -p dictate_english > backup.sql

# Restore backup
docker-compose exec -T mysql mysql -u root -p dictate_english < backup.sql
```

#### Reset Database

```bash
# Stop and remove MySQL volume
docker-compose down -v

# Remove MySQL data directory
rm -rf ./mysql-data

# Redeploy
./deploy.sh --mysql-password your-password
```

## Troubleshooting

### Port Already in Use

If you get a port conflict error:

```bash
# Check what's using the port
lsof -i :3000

# Use a different port
./deploy.sh --mysql-password your-password --port 3001
```

### Containers Not Starting

```bash
# Check logs for errors
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mysql

# Common issues:
# - Port conflicts
# - Insufficient disk space
# - Docker Desktop not running
# - Permission issues
```

### Database Connection Issues

```bash
# Check MySQL health
docker-compose ps mysql

# View MySQL logs
docker-compose logs mysql

# Ensure MySQL is ready before backend starts
# (This is handled by health checks in docker-compose.yml)
```

### Permission Denied

```bash
# Make scripts executable
chmod +x deploy.sh
chmod +x setup-mysql.sh

# Check Docker permissions
# On Mac, Docker Desktop should handle this automatically
```

### Out of Disk Space

```bash
# Clean up Docker resources
docker system prune -a

# Or remove specific resources
docker-compose down -v
docker rmi $(docker images -q)
```

### Services Not Healthy

```bash
# Check service status
docker-compose ps

# View health check logs
docker inspect --format='{{json .State.Health}}' frontend
docker inspect --format='{{json .State.Health}}' backend

# Wait for services to be ready (max 60 seconds)
docker-compose up -d
sleep 60
docker-compose ps
```

## Directory Structure

After deployment, you'll have:

```
project-root/
├── deploy.sh                    # Deployment script
├── docker-compose.yml           # Production configuration
├── docker-compose.override.yml  # Development configuration
├── .env                         # Generated environment file
├── .env.example                 # Environment template
├── setup-mysql.sh              # MySQL setup script
├── mysql-data/                 # MySQL data directory
│   └── ...
├── mysql/init/                 # MySQL initialization scripts
│   ├── 01-create-database.sql
│   └── 02-seed-user.sql
├── frontend/
│   ├── Dockerfile
│   ├── .dockerignore
│   └── ...
├── server/
│   ├── Dockerfile
│   ├── .dockerignore
│   └── ...
└── README-Docker.md            # This file
```

## Security Notes

1. **Change default passwords** in production:
   ```bash
   ./deploy.sh --mysql-password your-unique-secure-password
   ```

2. **Use strong JWT secrets**: The script generates a 32-character secret

3. **Firewall configuration**: Only expose necessary ports (frontend 3000, MySQL 3306 if needed)

4. **Regular backups**: Implement regular database backups in production

5. **Environment variables**: Never commit `.env` file to version control

## Performance Tuning

### For Production

1. **Use environment-specific configurations**
2. **Configure proper resource limits** in docker-compose.yml
3. **Enable MySQL query cache**
4. **Use Redis for session storage**
5. **Set up proper logging and monitoring**

### For Development

1. **Use docker-compose.override.yml** for volume mounts
2. **Increase Docker Desktop resources** if needed
3. **Use specific node versions** in Dockerfiles
4. **Enable debugging** with exposed debug ports

## Support

If you encounter issues:

1. Check the logs: `docker-compose logs -f`
2. Verify Docker is running: `docker info`
3. Check disk space: `df -h`
4. Review this documentation
5. Check the project's issue tracker

## License

See the main project LICENSE file.
