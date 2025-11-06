# Frontend Service Layer for MySQL Migration

## ADDED Requirements

### Requirement: SentencesService
**Component**: frontend/lib/sentences-service.ts
**Type**: API Client
**Description**: Provide methods for sentence API operations

The system SHALL create a service for sentence operations using apiClient.

#### Scenario: Get Sentences
- Given: User is authenticated
- When: sentencesService.getSentences() is called
- Then: Returns array of sentences from API
- Validation: API call GET /sentences returns sentence data

#### Scenario: Save Sentences
- Given: User is authenticated and has sentences
- When: sentencesService.saveSentences(sentences) is called
- Then: Saves all sentences to API and returns success
- Validation: API call POST/PUT /sentences updates database

#### Scenario: Add Sentence
- Given: User is authenticated
- When: sentencesService.addSentence(sentence) is called
- Then: Adds sentence to API and returns created sentence
- Validation: API call POST /sentences creates new record

#### Scenario: Update Sentence
- Given: User is authenticated and sentence exists
- When: sentencesService.updateSentence(id, sentence) is called
- Then: Updates sentence via API and returns updated sentence
- Validation: API call PUT /sentences/:id updates record

#### Scenario: Delete Sentence
- Given: User is authenticated and sentence exists
- When: sentencesService.deleteSentence(id) is called
- Then: Deletes sentence via API
- Validation: API call DELETE /sentences/:id removes record

#### Scenario: Reorder Sentences
- Given: User is authenticated and sentences exist
- When: sentencesService.reorderSentences(sentences) is called
- Then: Updates sentence order via API
- Validation: API call PUT /sentences/reorder updates order

## REMOVED Requirements

### Requirement: No PreferencesService
**Component**: frontend/lib/preferences-service.ts
**Type**: API Client
**Description**: Do not create preferences service

The system SHALL NOT create a preferences service as preferences remain in localStorage.

#### Scenario: Preferences Stay Local
- Given: Preferences are device-specific settings
- When: Frontend needs to access preferences
- Then: Preferences are read/written to localStorage
- Validation: No preferences-service.ts file is created

### Requirement: Remove localStorage from page.tsx (Sentences Only)
**Component**: frontend/app/page.tsx
**Type**: UI Component
**Description**: Remove localStorage usage for sentences from main page

The system SHALL remove localStorage calls for sentences from page.tsx.

#### Scenario: Remove Sentence localStorage
- Given: page.tsx exists
- When: Migration is applied
- Then: All localStorage.getItem() and localStorage.setItem() calls for sentences are removed
- Validation: No localStorage references remain for sentence data

#### Scenario: Remove Index localStorage
- Given: page.tsx exists
- When: Migration is applied
- Then: All localStorage calls for current index are removed
- Validation: No localStorage references remain for index data

#### Scenario: Keep Preferences localStorage
- Given: page.tsx exists
- When: Migration is applied
- Then: localStorage calls for preferences are kept
- Validation: Preferences still load from and save to localStorage

### Requirement: Remove localStorage from sentence-utils.ts (Partial)
**Component**: frontend/app/lib/sentence-utils.ts
**Type**: Utility Library
**Description**: Remove localStorage constants for sentences

The system SHALL remove localStorage persistence logic for sentences from sentence-utils.ts.

#### Scenario: Remove Sentence Storage Keys
- Given: sentence-utils.ts exists
- When: Migration is applied
- Then: STORAGE_KEY and INDEX_STORAGE_KEY constants are removed
- Validation: No sentence storage key constants remain in file

#### Scenario: Keep Preferences Storage Key
- Given: sentence-utils.ts exists
- When: Migration is applied
- Then: PREFERENCES_KEY constant is kept
- Validation: PREFERENCES_KEY remains in file for preferences

#### Scenario: Keep Utility Functions
- Given: sentence-utils.ts is updated
- When: Migration is applied
- Then: Normalize, sanitize, and validation functions remain
- Validation: All utility functions still work correctly

## MODIFIED Requirements

### Requirement: Keep Authentication localStorage
**Component**: frontend/lib/api-client.ts & frontend/app/lib/auth-context.tsx
**Type**: Authentication
**Description**: Preserve localStorage usage for auth tokens

The system SHALL keep localStorage usage for authentication tokens.

#### Scenario: Auth Token in localStorage
- Given: User logs in
- When: Authentication succeeds
- Then: Token is stored in localStorage by apiClient
- Validation: localStorage.getItem('auth_token') returns token

#### Scenario: Auth Token Retrieved on Mount
- Given: User revisits application
- When: page loads
- Then: authContext uses localStorage token to check authentication
- Validation: User remains logged in without re-entering credentials

## Integration Points

### Load Data Flow
1. User logs in
2. page.tsx mounts
3. sentencesService.getSentences() called
4. API returns sentences
5. UI displays sentences
6. Preferences loaded from localStorage

### Save Data Flow
1. User modifies sentences
2. sentencesService.saveSentences() called
3. API updates database
4. User sentences persisted
5. Preferences saved to localStorage

### Preferences Flow (LocalStorage)
1. User logs in
2. Preferences loaded from localStorage (no API call)
3. UI displays sound settings
4. User toggles setting
5. Preferences saved to localStorage (no API call)

## Cross-References
- **Related**: Backend API (consumes these endpoints)
- **Related**: Database (data ultimately stored here)
- **Related**: Auth (authentication required for all API calls)

## Error Handling
All service methods SHALL handle API errors gracefully and return user-friendly error messages.
