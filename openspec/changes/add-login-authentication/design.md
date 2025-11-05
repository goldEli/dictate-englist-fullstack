## Context
This change introduces authentication to a previously unauthenticated dictation practice application. The system needs to support:
- User login with email/password
- Session-based authentication using Redis
- Persistent user data in MySQL
- Seamless integration with existing frontend application

## Goals / Non-Goals
- Goals:
  - Secure user authentication with hashed passwords
  - High-performance session management via Redis
  - Simple, intuitive login experience for users
  - RESTful API design for authentication endpoints
  - Integration with existing Next.js frontend

- Non-Goals:
  - Social login (Google, GitHub, etc.)
  - Password reset functionality
  - User registration/self-signup
  - Two-factor authentication
  - OAuth integration

## Decisions

### Session Management Strategy
- **Decision**: Use Redis for session storage with JWT tokens for stateless authentication
- **Rationale**: Redis provides fast in-memory storage for sessions, while JWT allows stateless API calls. This hybrid approach offers both performance and flexibility.

### Password Storage
- **Decision**: Use bcrypt with 10 rounds for password hashing
- **Rationale**: Bcrypt is industry-standard, salted hashing that protects against rainbow table attacks. 10 rounds balances security and performance.

### Database Schema
- **Decision**: Single `users` table with minimal required fields (id, email, password_hash, created_at)
- **Rationale**: Keep authentication schema simple and extensible. Additional user data can be added later.

### Frontend State Management
- **Decision**: Use React Context API for authentication state
- **Rationale**: Simple, built-in solution for managing auth state across the application without adding external dependencies.

## Risks / Trade-offs
- **Risk**: Redis dependency adds operational complexity
  - **Mitigation**: Document Redis setup requirements clearly. Provide fallback in-memory session store for development.

- **Risk**: JWT token expiration handling complexity
  - **Mitigation**: Implement automatic token refresh on 401 errors. Provide clear error messages.

- **Risk**: User experience friction from mandatory login
  - **Mitigation**: Design clean, simple login UI. Consider "Remember me" option.

## Migration Plan
1. Deploy authentication system alongside existing app
2. Create initial admin user in MySQL
3. Test login flow end-to-end
4. Frontend will redirect to login when accessing protected routes (future enhancement)
5. Current public functionality remains accessible without login (graceful degradation)

## Open Questions
1. Should user registration be self-service or admin-only initially?
2. How to handle user data migration when users first login?
3. What session timeout duration is appropriate? (Default: 24 hours)
