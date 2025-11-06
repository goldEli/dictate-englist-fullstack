# API Logging System Specification

## ADDED Requirements

### Requirement 1: Winston Logger Installation
**Component**: server/package.json
**Type**: Installation
**Description**: Install and configure Winston logging library and NestJS adapter

#### Scenario: Install Winston Dependencies
- Given: Server is running NestJS 11.x
- When: winston, nest-winston, and winston-daily-rotate-file are added to package.json
- Then: Dependencies install successfully without peer dependency conflicts
- Validation: `pnpm list winston nest-winston` shows installed versions

#### Scenario: Verify Package Compatibility
- Given: NestJS 11.x is installed
- When: nest-winston is installed
- Then: Package versions are compatible (latest stable version)
- Validation: No peer dependency warnings during installation

### Requirement 2: Logger Configuration Module
**Component**: server/src/config/logger.config.ts
**Type**: Configuration
**Description**: Create comprehensive Winston logger configuration with multiple transports

#### Scenario: Create Logger Configuration
- Given: Winston packages are installed
- When: logger.config.ts is created with Winston configuration
- Then: Logger is configured with console and file transports
- Validation: Logger can be instantiated without errors

#### Scenario: Configure Development Environment
- Given: Logger configuration exists
- When: NODE_ENV is 'development'
- Then: Logs output to console with readable format (colors, pretty print)
- Validation: Console logs are human-readable with timestamps and levels

#### Scenario: Configure Production Environment
- Given: Logger configuration exists
- When: NODE_ENV is 'production'
- Then: Logs output to files in JSON format with rotation
- Validation: Log files are created in logs/ directory with JSON structure

#### Scenario: Set Log Rotation
- Given: Production environment is configured
- When: Application runs for multiple days
- Then: Log files rotate daily with size and age limits
- Validation: `ls logs/` shows dated log files (app-2025-11-06.log)

### Requirement 3: NestJS Logging Module Integration
**Component**: server/src/app.module.ts
**Type**: Integration
**Description**: Integrate Winston logger with NestJS application

#### Scenario: Import Winston Module
- Given: Logger configuration exists
- When: WinstonModule is imported into AppModule
- Then: Module imports successfully without errors
- Validation: Application starts without module initialization errors

#### Scenario: Configure Logger for Dependency Injection
- Given: WinstonModule is imported
- When: Logger is injected into a service
- Then: Service receives configured Winston logger instance
- Validation: Service can call logger.info(), logger.error(), etc.

### Requirement 4: Global HTTP Request Interceptor
**Component**: server/src/interceptors/http-logging.interceptor.ts
**Type**: Feature
**Description**: Create interceptor to log all HTTP requests and responses

#### Scenario: Log Incoming Requests
- Given: Interceptor is created and registered
- When: Client makes HTTP request to API
- Then: Request is logged with method, URL, timestamp, correlation ID
- Validation: Logs show: `POST /auth/login - correlationId: req-xyz789`

#### Scenario: Log Response Status and Duration
- Given: Request is being processed
- When: Response is sent back to client
- Then: Response status code and duration are logged
- Validation: Logs show: `POST /auth/login - 201 - 123ms - correlationId: req-xyz789`

#### Scenario: Generate Correlation ID
- Given: Request arrives without correlation ID
- When: Interceptor processes request
- Then: Unique correlation ID is generated and added to request
- Validation: Logs include correlationId field, request object has correlationId

#### Scenario: Register Global Interceptor
- Given: Interceptor is created
- When: app.useGlobalInterceptors() is called in main.ts
- Then: All HTTP routes are automatically logged
- Validation: Make request to any endpoint, logs appear

### Requirement 5: AuthService Logging
**Component**: server/src/auth/auth.service.ts
**Type**: Enhancement
**Description**: Add comprehensive logging to authentication service

#### Scenario: Log Successful Login
- Given: User provides valid credentials
- When: AuthService.validateUser() succeeds
- Then: Login success is logged with user ID and email
- Validation: Logs show: `User login successful - userId: 1, email: test@example.com`

#### Scenario: Log Failed Login - User Not Found
- Given: User provides email that doesn't exist
- When: AuthService.validateUser() fails
- Then: Failed login is logged with email and reason
- Validation: Logs show: `Login failed - email: test@example.com, reason: User not found`

#### Scenario: Log Failed Login - Invalid Password
- Given: User provides wrong password
- When: AuthService.validateUser() fails password check
- Then: Failed login is logged with email and reason
- Validation: Logs show: `Login failed - email: test@example.com, reason: Invalid password`

#### Scenario: Log Logout Events
- Given: User is logged in with valid token
- When: AuthService.logout() is called
- Then: Logout is logged with user ID
- Validation: Logs show: `User logout successful - userId: 1`

#### Scenario: Log Session Validation Failures
- Given: User provides invalid or expired token
- When: AuthService.getCurrentUser() fails
- Then: Session failure is logged with reason
- Validation: Logs show: `Session validation failed - reason: Invalid or expired session`

#### Scenario: Log Errors with Stack Traces
- Given: Unexpected error occurs in AuthService
- When: Error is caught and re-thrown
- Then: Error is logged with full stack trace and context
- Validation: Logs show error message, stack trace, and user context

### Requirement 6: AppService Logging
**Component**: server/src/app.service.ts
**Type**: Enhancement
**Description**: Add logging to main application service

#### Scenario: Log Application Health Checks
- Given: GET / endpoint is called
- When: AppService.getHello() is executed
- Then: Health check is logged with response
- Validation: Logs show: `Health check performed - response: Hello World!`

#### Scenario: Log Application Startup
- Given: Application is starting
- When: AppService is instantiated
- Then: Startup event is logged
- Validation: Logs show: `Application starting - version: 1.0`

### Requirement 7: Request Context Logging
**Component**: server/src/middleware/request-context.middleware.ts
**Type**: Middleware
**Description**: Add request context to all logs

#### Scenario: Capture User IP Address
- Given: Request comes from client
- When: Middleware processes request
- Then: Client IP address is captured and added to request
- Validation: Request logs include ip field (e.g., "ip": "192.168.1.1")

#### Scenario: Capture User Agent
- Given: Request includes User-Agent header
- When: Middleware processes request
- Then: User-Agent is captured and added to request
- Validation: Request logs include userAgent field

#### Scenario: Add User ID to Authenticated Requests
- Given: Request has valid authentication token
- When: Request is processed by auth guard
- Then: User ID from token is added to request context
- Validation: Auth request logs include userId field

### Requirement 8: Environment-Based Configuration
**Component**: server/src/config/logger.config.ts
**Type**: Configuration
**Description**: Different logging configurations for dev and production

#### Scenario: Development Log Level
- Given: NODE_ENV is 'development'
- When: Logger is configured
- Then: Log level is set to 'debug' for verbose logging
- Validation: All log levels (error, warn, info, debug) appear in console

#### Scenario: Production Log Level
- Given: NODE_ENV is 'production'
- When: Logger is configured
- Then: Log level is set to 'info' to reduce noise
- Validation: Only error, warn, and info logs appear in files

#### Scenario: Development Output Format
- Given: NODE_ENV is 'development'
- When: Log is written
- Then: Log uses simple format with colors for readability
- Validation: Console output is easy to read with timestamps and colors

#### Scenario: Production Output Format
- Given: NODE_ENV is 'production'
- When: Log is written
- Then: Log uses JSON format for structured logging
- Validation: Log files contain valid JSON objects per line

### Requirement 9: Performance and Non-Blocking Logging
**Component**: Full System
**Type**: Quality
**Description**: Logging should not significantly impact API performance

#### Scenario: Minimal Performance Impact
- Given: Server is under normal load
- When: Logging is enabled for all requests
- Then: Average response time increases by less than 5%
- Validation: Benchmark shows acceptable performance degradation

#### Scenario: Async Logging
- Given: Log event occurs
- When: Logger writes to file
- Then: File write is async and doesn't block request processing
- Validation: Response sent to client before log write completes

### Requirement 10: Log File Management
**Component**: Production Logging
**Type**: Maintenance
**Description**: Logs are properly managed to prevent disk space issues

#### Scenario: Daily Log Rotation
- Given: Production logging is enabled
- When: New day begins
- Then: New log file is created with current date
- Validation: logs/app-2025-11-06.log created at midnight

#### Scenario: Log File Size Limit
- Given: Log files are being written
- When: File reaches max size (e.g., 20MB)
- Then: File is rotated and compressed
- Validation: Multiple files exist with incremental names

#### Scenario: Maximum File Retention
- Given: Log rotation is configured
- When: More than retention period has passed (e.g., 30 days)
- Then: Old log files are deleted
- Validation: Only last 30 days of logs exist in logs/ directory

## Dependencies
- Requires Winston packages (winston, nest-winston, winston-daily-rotate-file)
- Requires NestJS interceptors and middleware

## Cross-References
- **Related**: Authentication system (logs auth events)
- **Future**: Database query logging (similar pattern)
- **Future**: External log aggregation (ELK stack integration)

## Validation Commands
```bash
# Start server
cd server && pnpm start

# Check logs directory
ls -la logs/

# View logs
tail -f logs/app.log

# Test logging
curl http://localhost:3000/

# Test auth logging
curl -X POST http://localhost:3000/auth/login -H "Content-Type: application/json" -d '{"email":"test@example.com","password":"password123"}'
```

## Log Output Verification

### Verify Request Logging
```bash
# Make request
curl http://localhost:3000/

# Check logs for entry
tail logs/app.log | grep "GET /"
# Expected: {"timestamp":"...","level":"info","message":"HTTP Request","method":"GET","url":"/","statusCode":200,"duration":5,"correlationId":"...","ip":"...","userAgent":"..."}
```

### Verify Auth Logging
```bash
# Make auth request
curl -X POST http://localhost:3000/auth/login -H "Content-Type: application/json" -d '{"email":"test@example.com","password":"password123"}'

# Check logs for auth entry
tail logs/app.log | grep "User login"
# Expected: {"timestamp":"...","level":"info","message":"User login successful","context":"AuthService","userId":1,"email":"test@example.com"}
```

### Verify Error Logging
```bash
# Make invalid request
curl http://localhost:3000/nonexistent

# Check logs for error
tail logs/app.log | grep "HTTP Request"
# Expected: {"timestamp":"...","level":"warn","message":"HTTP Request","method":"GET","url":"/nonexistent","statusCode":404,"duration":3,"correlationId":"..."}
```
