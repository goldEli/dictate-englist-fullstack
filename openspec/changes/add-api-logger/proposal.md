# Add API Logging System

## Summary
Implement a comprehensive logging system for the NestJS API backend using Winston logger with structured logging, request tracking, and environment-based configuration.

## Problem
The current NestJS backend lacks structured logging, making it difficult to:
- Track requests and responses for debugging
- Monitor application health and performance
- Debug authentication and business logic issues
- Meet production logging requirements
- Audit user actions and API usage

Without proper logging, troubleshooting production issues becomes challenging and time-consuming.

## Solution
Implement Winston-based logging system with:
- **Structured JSON logging** for easy parsing and analysis
- **Request/response logging** with correlation IDs for tracking
- **Error logging** with stack traces and context
- **Business event logging** for auth events, user actions
- **Environment-based configuration** (different levels for dev/prod)
- **Multiple transports** (console, file, etc.)
- **Log rotation** to prevent disk space issues

## Implementation Plan
1. Install Winston logging dependencies
2. Create logging configuration module
3. Set up global HTTP request logging interceptor
4. Add logging to AuthService (login, logout, errors)
5. Add logging to AppController and AppService
6. Configure log levels and outputs per environment
7. Test logging across all scenarios

## Success Criteria
- All HTTP requests/responses logged with method, URL, status, duration
- Authentication events logged (login attempts, failures, success)
- Errors logged with stack traces and context
- Structured JSON logs for production
- Console logs for development with readable format
- No performance degradation from logging
- Logs persist to files with rotation
- Correlation IDs track requests across services

## Rollback Plan
Logging can be safely disabled by removing Winston configuration and interceptor. Default to console.log for critical errors only. Winston integration is non-breaking.

## Metadata
- **Change ID**: add-api-logger
- **Created**: 2025-11-06
- **Scope**: Backend logging infrastructure
- **Risk**: Low (logging enhancement, non-breaking)
- **Effort**: Medium (2-3 hours)
- **Priority**: High (production readiness)
