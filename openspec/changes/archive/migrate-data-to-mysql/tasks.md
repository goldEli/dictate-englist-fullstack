# Tasks: Migrate Application Data from localStorage to MySQL

## Implementation Tasks

### 1. Create Database Entity
**Priority**: High
**Dependency**: None
- [x] Create `server/src/user-sentence.entity.ts` with TypeORM decorators
- [x] Add entity to `server/src/app.module.ts` TypeOrmModule config

### 2. Create Sentences Module
**Priority**: High
**Dependency**: Task 1
- [x] Create `server/src/sentences/sentences.controller.ts` with CRUD endpoints
- [x] Create `server/src/sentences/sentences.service.ts` with business logic
- [x] Create `server/src/sentences/sentences.module.ts` for DI
- [x] Add SentencesModule to `server/src/app.module.ts`

### 3. Create Frontend Service Layer
**Priority**: High
**Dependency**: Task 2
- [x] Create `frontend/lib/sentences-service.ts` with API methods
- [x] Verify services compile without errors

### 4. Remove localStorage from page.tsx (Sentences Only)
**Priority**: High
**Dependency**: Task 3
- [x] Remove localStorage.getItem() calls for sentences
- [x] Remove localStorage.setItem() calls for sentences
- [x] Remove localStorage.getItem() calls for current index
- [x] Remove localStorage.setItem() calls for current index
- [x] Load sentences from API on component mount
- [x] Save sentences to API when sentences change
- [x] Save current index to API when index changes

### 5. Clean Up sentence-utils.ts
**Priority**: Medium
**Dependency**: Task 4
- [x] Remove STORAGE_KEY constant
- [x] Keep INDEX_STORAGE_KEY constant (for current index)
- [x] Keep utility functions (normalize, sanitize, etc.)
- [x] Verify TypeScript compilation

### 6. Keep Preferences in localStorage
**Priority**: Medium
**Dependency**: None
- [x] Verify preferences remain in localStorage
- [x] No changes to preferences handling
- [x] PREFERENCES_KEY stays in sentence-utils.ts

### 7. Test Migration
**Priority**: High
**Dependency**: Tasks 4, 5 & 6
- [x] Start backend server
- [x] Start frontend dev server
- [x] Login with test user
- [x] Verify sentences load from MySQL (empty initially)
- [x] Add sentences and verify they save to MySQL
- [x] Verify preferences load from localStorage (defaults initially)
- [x] Update preferences and verify they save to localStorage
- [x] Test import/export functionality still works

### 8. Verify Build
**Priority**: Medium
**Dependency**: All tasks complete
- [x] Run `pnpm build` in frontend
- [x] Run `pnpm build` in server
- [x] Check for TypeScript errors
- [x] Ensure all imports work correctly

## Data Flow (After Migration)

### Loading Sentences
1. User logs in
2. page.tsx mounts
3. sentencesService.getSentences() called
4. API GET /sentences
5. Backend queries UserSentence table
6. Frontend displays sentences

### Saving Sentences
1. User imports or modifies sentences
2. page.tsx calls sentencesService.saveSentences()
3. API POST/PUT /sentences
4. Backend saves to UserSentence table
5. Success response

### Preferences (LocalStorage)
1. User logs in
2. Preferences loaded from localStorage (no API call)
3. User toggles sound setting
4. Preferences saved to localStorage (no API call)

## Database Schema

### UserSentence Table
```sql
CREATE TABLE user_sentences (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  sentence_id VARCHAR(255) NOT NULL,
  sentence_text TEXT NOT NULL,
  sentence_order INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_sentence (user_id, sentence_id)
);
```

## API Endpoints

### Sentences
- GET /sentences - Get user's sentences (with authentication)
- POST /sentences - Create new sentence
- PUT /sentences/:id - Update sentence
- DELETE /sentences/:id - Delete sentence
- PUT /sentences/reorder - Reorder sentences array

## What Stays in localStorage

### User Preferences
- completionSound - sound for sentence completion
- keypressSound - sound for key presses
- These are device-specific settings that users want to control per device

### Authentication Token
- auth_token - JWT token managed by apiClient
- Auto-handled by axios interceptor

## Key Points
- Keep authentication localStorage unchanged (auth-client.ts)
- Keep preferences in localStorage (device-specific settings)
- Only sentences move to MySQL
- Import/export functionality preserved
- Default sentences for new users (from DEFAULT_SENTENCES)
- No breaking changes to UI
