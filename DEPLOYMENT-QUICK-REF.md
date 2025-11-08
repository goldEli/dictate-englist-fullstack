# Deployment Quick Reference

## Deployment Scripts

### 1. Initial Deployment
```bash
./deploy.sh
```
**Purpose**: First-time deployment, sets up environment, builds images, starts services

### 2. Update Deployment  
```bash
./deploy-update.sh
```
**Purpose**: Redeploy after code changes, rebuilds and restarts all services

### 3. Manual Management
```bash
# View status
docker-compose ps

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Restart services
docker-compose up -d
```

## Service URLs
- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:8081
- **MySQL**: localhost:3306
- **Redis**: localhost:6379

## Test Credentials
- **Email**: test@example.com
- **Password**: password123

## When to Use Each Script

| Scenario | Script |
|----------|--------|
| First time setup | `./deploy.sh` |
| After `git pull` | `./deploy-update.sh` |
| After code changes | `./deploy-update.sh` |
| Just restart services | `docker-compose restart` |
| View logs | `docker-compose logs -f` |

## Common Tasks

### Update and Redeploy
```bash
git pull
./deploy-update.sh
```

### Check Service Health
```bash
docker-compose ps
```

### View Application Logs
```bash
docker-compose logs -f backend
```

### Stop All Services
```bash
docker-compose down
```

### Restart Without Rebuild
```bash
docker-compose restart
```
