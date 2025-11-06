# Add Frontend Axios HTTP Client

## Why
The frontend currently uses the Fetch API which requires:
- Manual token management for each request
- Repetitive try-catch error handling blocks
- Inconsistent error message patterns
- No automatic redirect logic for 401 errors

This creates maintenance overhead and inconsistent user experience. Axios provides built-in interceptors for token injection and centralized error handling, resulting in cleaner, more maintainable code.

## What Changes
The following files will be modified:
- **frontend/package.json**: Add axios dependency
- **frontend/lib/api-client.ts**: Create new Axios singleton with interceptors
- **frontend/app/lib/auth-client.ts**: Migrate from fetch to Axios

The implementation includes:
- Request interceptor for automatic token injection
- Response interceptor for error handling (401→redirect, others→alerts)
- Convenience methods (get, post, put, patch, delete)

## Summary
Replace the existing fetch-based HTTP client in the frontend with Axios, providing automatic token handling, centralized error handling with user prompts and login redirects, and simplified API methods.

## Problem
The current `auth-client.ts` uses the Fetch API with:
- Manual header management for authentication
- Repetitive error handling code
- Inconsistent request patterns
- No automatic token injection

This leads to:
- Manual token management for each request
- Duplicate error handling logic
- Inconsistent error messages
- Redirect logic scattered across components

## Solution
Implement Axios-based HTTP client for frontend with:

### Features
- **ApiClient**: Singleton Axios instance with base configuration
- **Automatic Token Handling**: Request interceptor adds token from localStorage
- **401 Error Handling**: Automatic redirect to login page
- **Other Errors**: User-friendly error messages via alert/prompt
- **Convenience Methods**: Simplified get, post, put, delete methods
- **Type Safety**: TypeScript interfaces for requests/responses

### Error Handling Strategy
- **401 Unauthorized**: Clear token and redirect to `/login`
- **403 Forbidden**: Show "Access denied" message
- **404 Not Found**: Show "Resource not found" message
- **500+ Server Error**: Show "Server error, please try again"
- **Network Error**: Show "Network error, please check connection"
- **Other Errors**: Show "An error occurred: {message}"

### Implementation Plan

### Phase 1: Install and Setup
1. Install Axios in frontend
2. Create ApiClient singleton
3. Configure base URL from environment

### Phase 2: Implement ApiClient
1. Add request interceptor for automatic token injection
2. Add response interceptor for error handling
3. Create convenience methods (get, post, put, delete)
4. Add TypeScript interfaces

### Phase 3: Migrate auth-client.ts
1. Replace fetch calls with Axios calls
2. Test all endpoints (login, logout, getCurrentUser)
3. Verify error handling works correctly
4. Ensure no breaking changes

## Success Criteria
- Frontend uses Axios for all API calls
- Tokens automatically added to requests
- 401 errors redirect to login page
- Other errors show user-friendly messages
- All auth endpoints work correctly (login, logout, getCurrentUser)
- Code is cleaner and more maintainable
- No extra complexity or unnecessary features

## Rollback Plan
Simple rollback:
- Restore original auth-client.ts using fetch
- Remove Axios dependency
- All changes are contained to frontend only

## Metadata
- **Change ID**: add-unified-axios-client
- **Created**: 2025-11-06
- **Scope**: Frontend HTTP client only
- **Risk**: Low (frontend-only, no backend changes)
- **Effort**: Small (1-2 hours)
- **Priority**: Medium (developer experience improvement)
