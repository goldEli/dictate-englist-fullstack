# Tasks: Add Docker Deployment

## Implementation Tasks

### 1. Create Frontend Dockerfile
**Priority**: High
**Dependency**: None
- [x] Create `frontend/Dockerfile` with multi-stage build
- [x] Use Node.js 20 Alpine base image
- [x] Install pnpm in build stage
- [x] Copy package.json and install dependencies
- [x] Build Next.js application
- [x] Use production-ready base image for runtime
- [x] Set proper environment variables
- [x] Add .dockerignore file

### 2. Create Backend Dockerfile
**Priority**: High
**Dependency**: None
- [x] Create `server/Dockerfile` with multi-stage build
- [x] Use Node.js 20 Alpine base image
- [x] Install dependencies with pnpm
- [x] Build NestJS application
- [x] Use production-ready base image for runtime
- [x] Set proper environment variables
- [x] Add .dockerignore file
- [x] Expose port 3000

### 3. Create Docker Compose Configuration
**Priority**: High
**Dependency**: Tasks 1 & 2
- [x] Create `docker-compose.yml` with all services
- [x] Configure MySQL 8.0 service
- [x] Configure Redis service
- [x] Configure backend service
- [x] Configure frontend service with port mapping
- [x] Set up environment variables
- [x] Configure volume for MySQL data persistence
- [x] Configure network for inter-service communication
- [x] Add health checks for all services

### 4. Create Environment Template
**Priority**: High
**Dependency**: Task 3
- [x] Create `.env.example` with all required variables
- [x] Document all environment variables
- [x] Include MySQL configuration
- [x] Include Redis configuration
- [x] Include JWT secret configuration

### 5. Create Deployment Script
**Priority**: High
**Dependency**: Tasks 3 & 4
- [x] Create `deploy.sh` script
- [x] Parse command-line parameters:
  - MySQL password (--mysql-password)
  - Access port (--port)
  - MySQL data local address (--mysql-data)
  - MySQL host port (--mysql-port, optional)
- [x] Generate .env file from parameters
- [x] Start services with docker-compose
- [x] Wait for services to be healthy
- [x] Display access information
- [x] Add stop/cleanup commands

### 6. Create MySQL Initialization Script
**Priority**: Medium
**Dependency**: Task 3
- [x] Create `setup-mysql.sh` for manual database setup
- [x] Create database and user
- [x] Grant proper permissions
- [x] Run seed script to create test user
- [x] Add to docker-compose initialization

### 7. Create Development Override
**Priority**: Low
**Dependency**: Task 3
- [x] Create `docker-compose.override.yml` for development
- [x] Enable volume mounts for hot reloading
- [x] Map source directories
- [x] Override build context

### 8. Create Documentation
**Priority**: Medium
**Dependency**: All tasks
- [x] Create `README-Docker.md` with deployment instructions
- [x] Document prerequisites (Docker, Docker Compose)
- [x] Explain all parameters
- [x] Provide usage examples
- [x] Document troubleshooting steps
- [x] Include screenshots or diagrams

## Deployment Commands

### Quick Start
```bash
chmod +x deploy.sh
./deploy.sh --mysql-password yourpassword --port 3000 --mysql-data ./mysql-data
```

### Access Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:3000 (internal)
- API Documentation: http://localhost:3000/docs
- MySQL: localhost:3306 (if exposed)

### Stop Services
```bash
docker-compose down
```

### Clean Up (including data)
```bash
docker-compose down -v
rm -rf ./mysql-data
```

## Docker Services

### Frontend
- Port: Configurable (default 3000)
- Build: Docker multi-stage
- Environment: NEXT_PUBLIC_API_URL

### Backend
- Port: 3000 (internal)
- Build: Docker multi-stage
- Environment: All API configs
- Dependencies: MySQL, Redis

### MySQL
- Version: 8.0
- Port: 3306 (internal)
- Volume: MySQL data persistence
- Initialization: Automatic database creation

### Redis
- Version: Latest Alpine
- Port: 6379 (internal)
- No persistence required

## Environment Variables

### Required
- MYSQL_PASSWORD
- MYSQL_DATABASE
- MYSQL_USER
- MYSQL_ROOT_PASSWORD
- JWT_SECRET
- REDIS_HOST
- DB_HOST
- FRONTEND_URL

### Generated
- Database credentials from parameters
- API URLs based on port configuration

## Success Criteria
- All Dockerfiles build successfully
- docker-compose up starts all services
- Health checks pass for all services
- Application accessible at configured port
- Database persists data across restarts
- Test user can login
- Documentation is complete and accurate

