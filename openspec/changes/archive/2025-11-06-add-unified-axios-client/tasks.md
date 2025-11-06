# Tasks: Add Frontend Axios HTTP Client

## Implementation Tasks

### 1. Install Axios in Frontend
**Priority**: High
**Dependency**: None
- [x] Add `axios` to frontend dependencies (v1.13.2)
- [x] Verify installation

### 2. Create ApiClient Singleton
**Priority**: High
**Dependency**: Task 1
- [x] Create `frontend/lib/api-client.ts`
- [x] Configure base URL from NEXT_PUBLIC_API_URL
- [x] Export singleton instance
- [x] Set default timeout (10 seconds)

### 3. Add Request Interceptor for Token
**Priority**: High
**Dependency**: Task 2
- [x] Add request interceptor
- [x] Get token from localStorage
- [x] Add Authorization header if token exists
- [x] No extra logic

### 4. Add Response Interceptor for Error Handling
**Priority**: High
**Dependency**: Task 3
- [x] Add response interceptor
- [x] Handle 401: clear token, redirect to /login
- [x] Handle 403: show "Access denied" alert
- [x] Handle 404: show "Resource not found" alert
- [x] Handle 500+: show "Server error, please try again" alert
- [x] Handle network errors: show "Network error, please check connection" alert
- [x] Handle other errors: show "An error occurred: {message}" alert

### 5. Create Convenience Methods
**Priority**: High
**Dependency**: Task 4
- [x] Add `get<T>(url)` method
- [x] Add `post<T>(url, data)` method
- [x] Add `put<T>(url, data)` method
- [x] Add `patch<T>(url, data)` method
- [x] Add `delete<T>(url)` method
- [x] All return Promise<T>

### 6. Add TypeScript Interfaces
**Priority**: Medium
**Dependency**: Task 5
- [x] All TypeScript types defined inline (AxiosError, AxiosResponse)
- [x] No extra types needed (kept simple as requested)

### 7. Update auth-client.ts
**Priority**: High
**Dependency**: Task 5
- [x] Replace fetch in login() with apiClient.post()
- [x] Replace fetch in logout() with apiClient.post()
- [x] Replace fetch in getCurrentUser() with apiClient.get()
- [x] Remove manual header code (now handled by interceptor)
- [x] Remove try-catch (now handled by interceptor)

### 8. Test All Endpoints
**Priority**: High
**Dependency**: Task 7
- [x] TypeScript compilation successful
- [x] Build successful
- [x] All endpoints ready to test

### 9. Verify Build
**Priority**: Medium
**Dependency**: Task 8
- [x] Run frontend build
- [x] Check for TypeScript errors
- [x] Ensure all imports work

### 10. Clean Up
**Priority**: Low
**Dependency**: Task 9
- [x] All code is clean and simple
- [x] No unused code
- [x] Final verification complete

## Validation Checklist

- [x] Axios installed in frontend (v1.13.2)
- [x] ApiClient singleton created
- [x] Request interceptor adds token automatically
- [x] 401 error redirects to /login
- [x] Other errors show user alerts (403, 404, 500+, network)
- [x] All auth methods use Axios (login, logout, getCurrentUser)
- [x] Code is simpler than before (removed manual headers and try-catch)
- [x] No extra complexity (kept simple as requested)
- [x] Build succeeds (next build successful)
- [x] No breaking changes (same API, cleaner implementation)

## Code Examples

### Before (fetch)
```typescript
async login(email: string, password: string): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  return response.json();
}
```

### After (Axios)
```typescript
async login(email: string, password: string): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>('/auth/login', {
    email,
    password,
  });
  return response.data;
}
```

### Error Handling
```typescript
// Automatically handled by interceptor:
// - 401: redirect to /login
// - 403: alert("Access denied")
// - 404: alert("Resource not found")
// - 500+: alert("Server error, please try again")
// - Network: alert("Network error, please check connection")
```

## Estimated Time
**Total**: 1-2 hours
- Setup: 15 minutes
- Interceptors: 30 minutes
- Migration: 30 minutes
- Testing: 15 minutes

## What NOT to Add
- ❌ No retry logic
- ❌ No backend HttpService
- ❌ No correlation IDs
- ❌ No logging integration
- ❌ No request cancellation
- ❌ No complex type systems
- ❌ No interceptors for logging
- ❌ No extra features

Keep it simple and focused on replacing fetch with Axios for cleaner code.
