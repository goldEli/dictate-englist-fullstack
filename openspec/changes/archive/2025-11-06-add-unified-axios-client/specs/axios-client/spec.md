# Frontend Axios HTTP Client Specification

## ADDED Requirements



The system SHALL implement this requirement.
The system SHALL install axios as a frontend dependency.

#### Scenario: Install Axios
- Given: Frontend project exists
- When: `axios` is added to package.json
- Then: Axios is successfully installed
- Validation: `pnpm list axios` shows installed version



The system SHALL implement this requirement.
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



The system SHALL implement this requirement.
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



The system SHALL implement this requirement.
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



The system SHALL implement this requirement.
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



The system SHALL implement this requirement.
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



The system SHALL implement this requirement.
#### Scenario: Define ApiError
- Given: Error handling needs types
- When: ApiError interface is defined
- Then: Interface includes message, status
- Validation: TypeScript accepts error structure



The system SHALL implement this requirement.
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



The system SHALL implement this requirement.
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



The system SHALL implement this requirement.
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
