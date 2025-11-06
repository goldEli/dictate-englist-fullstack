# Migrate Application Data from localStorage to MySQL

## Why
The application currently stores user data in browser localStorage:
- Custom sentence lists
- Current sentence index
- User preferences (sound effects settings)

This approach has limitations for sentences:
- No data synchronization across devices
- Data loss if browser cache is cleared
- No backup or recovery options
- Cannot access sentences from different browsers/devices

Migrating sentences to MySQL provides:
- Persistent storage across sessions and devices
- Data backup and recovery
- User data consistency
- Better scalability

Preferences remain in localStorage because:
- They're device-specific settings (sound on/off)
- Users typically want different settings per device
- No need for cross-device synchronization

Note: Authentication tokens in localStorage will remain unchanged as they are handled by the ApiClient interceptor.

## What Changes
The following files will be modified:

**Backend (Server)**
- `server/src/user-sentence.entity.ts` - New entity for user sentences
- `server/src/sentences/` - New module for sentence CRUD operations
  - `sentences.controller.ts` - REST endpoints for sentences
  - `sentences.service.ts` - Business logic for sentences
  - `sentences.module.ts` - Dependency injection module
- `server/src/app.module.ts` - Register new module and entity

**Frontend (App)**
- `frontend/lib/sentences-service.ts` - New service for API calls to sentences endpoints
- `frontend/app/page.tsx` - Remove localStorage usage for sentences, use API service instead
- `frontend/app/lib/sentence-utils.ts` - Remove STORAGE_KEY constants and localStorage logic

**What Stays in localStorage:**
- User preferences (sound settings) - remain in localStorage
- Authentication tokens - remain in localStorage (handled by apiClient)

## Implementation Plan

### Phase 1: Backend Database Schema
1. Create UserSentence entity with fields: id, userId, sentenceId, text, order
2. Update app.module.ts to include new entity

### Phase 2: Backend API Layer
1. Create SentencesModule with controller and service
   - GET /sentences - Get user's sentences
   - POST /sentences - Create new sentence
   - PUT /sentences/:id - Update sentence
   - DELETE /sentences/:id - Delete sentence
   - PUT /sentences/reorder - Reorder sentences

### Phase 3: Frontend Service Layer
1. Create sentences-service.ts with methods:
   - getSentences() - Fetch from API
   - saveSentences(sentences) - Save to API
   - addSentence(sentence) - Add to API
   - updateSentence(id, sentence) - Update via API
   - deleteSentence(id) - Delete via API
   - reorderSentences(sentences) - Reorder via API

### Phase 4: Frontend Migration
1. Remove localStorage logic from page.tsx for sentences:
   - Remove window.localStorage.getItem() calls for sentences
   - Remove window.localStorage.setItem() calls for sentences
   - Load sentences from API on component mount
   - Save sentences to API when changed

2. Update sentence-utils.ts:
   - Keep utility functions (normalize, sanitize, etc.)
   - Remove STORAGE_KEY constants
   - Remove localStorage persistence logic

3. Keep preferences in localStorage (unchanged)

## Success Criteria
- User sentences stored in MySQL
- Frontend loads sentences from API instead of localStorage
- No localStorage usage except for preferences and authentication tokens
- User can access same sentences from any device after login
- Sentences persist across browser sessions
- Import/export functionality still works
- Preferences remain in localStorage (device-specific settings)

## Rollback Plan
- Revert frontend changes to use localStorage
- Keep backend changes (no harm in having extra endpoints)
- Users may lose data created after migration

## Metadata
- **Change ID**: migrate-data-to-mysql
- **Created**: 2025-11-06
- **Scope**: Full-stack (backend + frontend)
- **Risk**: Medium (data migration, API changes)
- **Effort**: 3-4 hours
- **Priority**: High (user data persistence improvement)
