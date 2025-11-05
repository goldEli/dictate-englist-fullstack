## ADDED Requirements

### Requirement: User Authentication System
The system SHALL provide secure user authentication using email and password with MySQL database verification and Redis session caching.

#### Scenario: User login success
- **WHEN** valid email and password are provided
- **THEN** the system SHALL validate credentials against MySQL users table
- **AND** SHALL generate a JWT token
- **AND** SHALL store session in Redis
- **AND** SHALL return user data and authentication token
- **AND** SHALL set HTTP-only session cookie

#### Scenario: User login failure
- **WHEN** invalid credentials are provided
- **THEN** the system SHALL return 401 Unauthorized error
- **AND** SHALL NOT store a session
- **AND** SHALL provide clear error message

#### Scenario: Session validation
- **WHEN** authenticated user makes API request with valid token
- **THEN** the system SHALL validate session from Redis cache
- **AND** SHALL allow access to protected resources
- **AND** SHALL return user context in response

#### Scenario: User logout
- **WHEN** authenticated user requests logout
- **THEN** the system SHALL remove session from Redis
- **AND** SHALL clear session cookie
- **AND** SHALL return success confirmation

### Requirement: User Entity Management
The system SHALL store user data in MySQL with the following schema:

#### Scenario: User table structure
- **GIVEN** MySQL database is configured
- **WHEN** application starts
- **THEN** the system SHALL create users table with:
  - id (PRIMARY KEY, AUTO_INCREMENT)
  - email (VARCHAR, UNIQUE, NOT NULL)
  - password_hash (VARCHAR, NOT NULL)
  - created_at (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)

### Requirement: Session Management
The system SHALL manage user sessions using Redis for caching and JWT for token-based authentication.

#### Scenario: Session creation
- **WHEN** user successfully logs in
- **THEN** the system SHALL:
  - Generate JWT token with user ID and expiration
  - Store session data in Redis with token as key
  - Set TTL to 24 hours
  - Return token in response

#### Scenario: Session expiration
- **WHEN** session expires (24 hours elapsed)
- **THEN** Redis SHALL automatically remove session data
- **AND** subsequent requests SHALL return 401 Unauthorized
- **AND** user SHALL need to re-authenticate

### Requirement: Password Security
The system SHALL securely hash passwords using bcrypt before storing in database.

#### Scenario: Password hashing
- **WHEN** user registers (future requirement) or password is set
- **THEN** the system SHALL hash password with bcrypt (10 rounds)
- **AND** SHALL store only the hash, never plaintext password
- **AND** SHALL use salt automatically included in bcrypt hash

#### Scenario: Password verification
- **WHEN** user attempts login
- **THEN** the system SHALL:
  - Retrieve password_hash from database
  - Verify provided password against hash using bcrypt
  - Return success only if password matches

### Requirement: Frontend Login Page
The system SHALL provide a login page accessible at `/login` route in the Next.js frontend.

#### Scenario: Login page render
- **WHEN** user navigates to `/login`
- **THEN** the page SHALL display:
  - Email input field
  - Password input field
  - Login submit button
  - Proper form validation messages

#### Scenario: Form submission
- **WHEN** user fills form and clicks login
- **THEN** the frontend SHALL:
  - Validate email format
  - Validate password is not empty
  - Send POST request to `/auth/login`
  - Show loading state during request
  - Handle success/error responses
  - Redirect to main page on success

#### Scenario: Login error handling
- **WHEN** login request fails
- **THEN** the frontend SHALL:
  - Display error message to user
  - NOT redirect to main page
  - Allow user to retry login
  - Clear password field for security

### Requirement: API Integration
The system SHALL provide RESTful API endpoints for authentication operations.

#### Scenario: POST /auth/login
- **WHEN** POST request to `/auth/login` with email and password
- **THEN** endpoint SHALL:
  - Validate request body (email, password required)
  - Query MySQL for user by email
  - Verify password with bcrypt
  - Create Redis session
  - Return { success: true, user: {...}, token: "..." }

#### Scenario: POST /auth/logout
- **WHEN** POST request to `/auth/logout` with authentication token
- **THEN** endpoint SHALL:
  - Validate authentication token
  - Remove session from Redis
  - Clear session cookie
  - Return { success: true }

#### Scenario: GET /auth/me
- **WHEN** GET request to `/auth/me` with authentication token
- **THEN** endpoint SHALL:
  - Validate token from cookie or header
  - Check Redis for active session
  - Return { success: true, user: {...} }
  - Return 401 if session invalid or expired
