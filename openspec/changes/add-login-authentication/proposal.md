## Why
The dictation practice application currently lacks user authentication, making it impossible to:
- Store user progress in a persistent database
- Support multiple users on the same device
- Implement user-specific settings and preferences
- Add future features like user statistics and progress tracking

## What Changes
- **Frontend**: Add a login page with email/password form at `/login` route
- **Backend**: Implement authentication API endpoints for login/logout/session validation
- **Database**: Create User entity and authentication table in MySQL
- **Session Management**: Add Redis-based session caching for improved performance
- **Security**: Implement password hashing (bcrypt) and session management
- **Integration**: Connect frontend to backend authentication API

## Impact
- Affected specs: New authentication capability will be added
- Affected code:
  - Frontend: New login page component, API integration
  - Backend: New auth module, controllers, services, entities
  - Database: New User table
  - Infrastructure: Redis integration for sessions

**Breaking Changes**: None - this is a net-new feature

## Database Configuration
- MySQL: user=root, password=123456
- Redis: Session cache storage
- Passwords: Bcrypt hashing (10 rounds)
