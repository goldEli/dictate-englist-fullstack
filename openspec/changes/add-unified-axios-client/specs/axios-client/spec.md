# Frontend Axios HTTP Client Specification

## ADDED Requirements

### Requirement: Axios Installation
**Component**: frontend/package.json
**Type**: Installation
**Description**: Install Axios in frontend project

The system SHALL install axios as a frontend dependency.

#### Scenario: Install Axios
- Given: Frontend project exists
- When: `axios` is added to package.json
- Then: Axios is successfully installed
- Validation: `pnpm list axios` shows installed version

### Requirement: ApiClient Singleton
**Component**: frontend/lib/api-client.ts
**Type**: Client
**Description**: Create Axios singleton instance

The system SHALL create a singleton ApiClient instance.

#### Scenario: Create ApiClient
- Given: Axios is installed
- When: ApiClient class is instantiated
- Then: Single instance is exported
- Validation: Import returns same instance

#### Scenario: Configure Base URL
- Given: ApiClient is created
- When: Base URL is configured from NEXT_PUBLIC_API_URL
- Then: All requests use correct base URL
- Validation: Requests go to http://localhost:3000

#### Scenario: Set Default Timeout
- Given: ApiClient is created
- When: Default timeout is set
- Then: All requests timeout after duration
- Validation: Long request times out

### Requirement: Request Interceptor
**Component**: frontend/lib/api-client.ts
**Type**: Interceptor
**Description**: Automatically add authentication token

The system SHALL add automatic token injection via request interceptor.

#### Scenario: Add Token to Request
- Given: Token exists in localStorage
- When: Request is sent
- Then: Authorization header is added
- Validation: Request includes Bearer token

#### Scenario: No Token Available
- Given: No token in localStorage
- When: Request is sent
- Then: Request sent without Authorization header
- Validation: No Bearer token in request

#### Scenario: Get Token from localStorage
- Given: localStorage has auth_token
- When: Request interceptor runs
- Then: Token is retrieved
- Validation: Token value matches localStorage

### Requirement: Response Interceptor - 401 Handling
**Component**: frontend/lib/api-client.ts
**Type**: Error Handling
**Description**: Handle 401 Unauthorized errors

The system SHALL handle 401 errors by clearing token and redirecting to login.

#### Scenario: 401 Error Received
- Given: Server returns 401 Unauthorized
- When: Response interceptor runs
- Then: Token is removed from localStorage
- Validation: localStorage no longer has auth_token

#### Scenario: Redirect to Login
- Given: 401 error received
- When: Response interceptor runs
- Then: User is redirected to /login page
- Validation: window.location.href changes to /login

#### Scenario: Clear Auth State
- Given: 401 error received
- When: Token is cleared
- Then: User must login again
- Validation: Subsequent requests fail without token

### Requirement: Response Interceptor - Other Errors
**Component**: frontend/lib/api-client.ts
**Type**: Error Handling
**Description**: Show user-friendly error messages

The system SHALL show user-friendly alerts for various error conditions.

#### Scenario: 403 Forbidden
- Given: Server returns 403 Forbidden
- When: Response interceptor runs
- Then: Show alert "Access denied"
- Validation: alert() is called with correct message

#### Scenario: 404 Not Found
- Given: Server returns 404 Not Found
- When: Response interceptor runs
- Then: Show alert "Resource not found"
- Validation: alert() is called with correct message

#### Scenario: 500+ Server Error
- Given: Server returns 500 Internal Server Error
- When: Response interceptor runs
- Then: Show alert "Server error, please try again"
- Validation: alert() is called with correct message

#### Scenario: Network Error
- Given: Request fails with network error
- When: Response interceptor runs
- Then: Show alert "Network error, please check connection"
- Validation: alert() is called with correct message

#### Scenario: Other HTTP Errors
- Given: Server returns other error code
- When: Response interceptor runs
- Then: Show alert "An error occurred: {message}"
- Validation: alert() includes error message

### Requirement: Convenience Methods
**Component**: frontend/lib/api-client.ts
**Type**: API
**Description**: Provide typed HTTP methods

The system SHALL provide convenience methods for HTTP requests.

#### Scenario: GET Request
- Given: ApiClient is configured
- When: get<T>(url) is called
- Then: GET request is sent and returns Promise<T>
- Validation: TypeScript ensures correct return type

#### Scenario: POST Request
- Given: ApiClient is configured
- When: post<T>(url, data) is called
- Then: POST request is sent with JSON body
- Validation: Data is properly serialized

#### Scenario: PUT Request
- Given: ApiClient is configured
- When: put<T>(url, data) is called
- Then: PUT request is sent with JSON body
- Validation: Response typed as T

#### Scenario: DELETE Request
- Given: ApiClient is configured
- When: delete<T>(url) is called
- Then: DELETE request is sent
- Validation: Return type is T

### Requirement: Migration from fetch
**Component**: frontend/lib/auth-client.ts
**Type**: Migration
**Description**: Replace fetch with Axios

The system SHALL replace fetch with Axios in auth-client.ts.

#### Scenario: Login Method
- Given: authClient.login() exists
- When: fetch is replaced with Axios
- Then: Same functionality with cleaner code
- Validation: Login still works

#### Scenario: Logout Method
- Given: authClient.logout() exists
- When: fetch is replaced with Axios
- Then: Same functionality with cleaner code
- Validation: Logout still works

#### Scenario: GetCurrentUser Method
- Given: authClient.getCurrentUser() exists
- When: fetch is replaced with Axios
- Then: Same functionality with cleaner code
- Validation: User data is returned

#### Scenario: Remove Manual Headers
- Given: authClient has manual header code
- When: Migration completes
- Then: Headers are handled by interceptor
- Validation: No duplicate header code

#### Scenario: Remove Manual Error Handling
- Given: authClient has try-catch blocks
- When: Migration completes
- Then: Errors handled by interceptor
- Validation: No duplicate error handling

### Requirement: No Breaking Changes
**Component**: frontend
**Type**: Compatibility
**Description**: Ensure existing functionality works

The system SHALL maintain backward compatibility.

#### Scenario: Login Still Works
- Given: User logs in
- When: Request is sent via Axios
- Then: User receives token and can authenticate
- Validation: Token is stored in localStorage

#### Scenario: Logout Still Works
- Given: User logs out
- When: Request is sent via Axios
- Then: Token is removed
- Validation: localStorage is cleared

#### Scenario: GetCurrentUser Still Works
- Given: User is authenticated
- When: Request is sent via Axios
- Then: User data is returned
- Validation: Response matches expected format

### Requirement: Simplified Code
**Component**: frontend/lib/auth-client.ts
**Type**: Quality
**Description**: Code should be cleaner

The system SHALL result in cleaner, more maintainable code.

#### Scenario: Less Boilerplate
- Given: Before migration code
- When: After migration code
- Then: Code is more concise
- Validation: Fewer lines of code

#### Scenario: No Duplicate Logic
- Given: Request handling code
- When: Interceptor handles common logic
- Then: No duplicate code in methods
- Validation: DRY principle followed

## Cross-References
- **Related**: Authentication (uses ApiClient for auth)
- **Related**: Login page (receives 401 redirects)

## Validation Commands
```bash
# Install dependencies
cd frontend
pnpm install axios

# Build frontend
pnpm build

# Test locally
pnpm dev
```

## Example Usage

### Simple GET
```typescript
const response = await apiClient.get<User>('/users/1');
```

### POST with Data
```typescript
const response = await apiClient.post<LoginResponse>('/auth/login', {
  email: 'test@example.com',
  password: 'password123',
});
```

### Error Handling (Automatic)
```typescript
// 401 -> redirect to /login (automatic)
// 403 -> alert("Access denied") (automatic)
// 404 -> alert("Resource not found") (automatic)
// 500+ -> alert("Server error, please try again") (automatic)
// Network -> alert("Network error, please check connection") (automatic)
```

## What This Implementation Does
✅ Installs Axios in frontend
✅ Creates simple ApiClient singleton
✅ Automatic token injection
✅ 401 error -> redirect to login
✅ Other errors -> user alerts
✅ Simple convenience methods
✅ Direct migration of auth-client.ts
✅ No extra complexity

## What This Implementation Does NOT Do
❌ No backend HttpService
❌ No retry logic
❌ No correlation IDs
❌ No logging integration
❌ No request cancellation
❌ No complex interceptors
❌ No extra features

Keep it simple and focused.
