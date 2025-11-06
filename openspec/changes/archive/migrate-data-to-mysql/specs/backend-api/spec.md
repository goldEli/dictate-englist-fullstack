# Backend API for MySQL Migration

## ADDED Requirements

### Requirement: SentencesController
**Component**: server/src/sentences/sentences.controller.ts
**Type**: REST API
**Description**: Provide CRUD endpoints for sentence management

The system SHALL create a REST controller for sentence operations.

#### Scenario: GET /sentences Endpoint
- Given: User is authenticated
- When: GET /sentences request is received
- Then: Returns user's sentences from database
- Validation: Response includes array of sentences with id, text, and order

#### Scenario: POST /sentences Endpoint
- Given: User is authenticated
- When: POST /sentences request is received with sentence data
- Then: Saves sentence to database and returns created sentence
- Validation: Response includes created sentence with database id

#### Scenario: PUT /sentences/:id Endpoint
- Given: User is authenticated
- When: PUT /sentences/:id request is received
- Then: Updates sentence in database and returns updated sentence
- Validation: Sentence text is updated in database

#### Scenario: DELETE /sentences/:id Endpoint
- Given: User is authenticated
- When: DELETE /sentences/:id request is received
- Then: Removes sentence from database
- Validation: Sentence no longer exists in database

#### Scenario: PUT /sentences/reorder Endpoint
- Given: User is authenticated
- When: PUT /sentences/reorder request is received with ordered array
- Then: Updates sentence order in database
- Validation: All sentences have correct order values

### Requirement: SentencesService
**Component**: server/src/sentences/sentences.service.ts
**Type**: Business Logic
**Description**: Implement business logic for sentence operations

The system SHALL create a service layer for sentence business logic.

#### Scenario: Get User Sentences
- Given: User ID is provided
- When: getSentences() is called
- Then: Returns all sentences for user ordered by sentence_order
- Validation: SQL query retrieves sentences from UserSentence table

#### Scenario: Create Sentence
- Given: User ID and sentence data
- When: createSentence() is called
- Then: Inserts new sentence into UserSentence table
- Validation: New sentence appears in database with correct user_id

#### Scenario: Update Sentence
- Given: User ID, sentence ID, and new data
- When: updateSentence() is called
- Then: Updates sentence text in UserSentence table
- Validation: Sentence text is changed, other fields unchanged

#### Scenario: Delete Sentence
- Given: User ID and sentence ID
- When: deleteSentence() is called
- Then: Removes sentence from UserSentence table
- Validation: Sentence no longer exists in database

#### Scenario: Reorder Sentences
- Given: User ID and ordered array
- When: reorderSentences() is called
- Then: Updates sentence_order for all sentences
- Validation: All sentences have sequential order values starting from 0

### Requirement: Module Configuration
**Component**: server/src/sentences/sentences.module.ts
**Type**: Dependency Injection
**Description**: Configure dependency injection module

The system SHALL create a module for dependency injection.

#### Scenario: SentencesModule Setup
- Given: Controller and service are created
- When: SentencesModule is defined
- Then: Module exports controller and service
- Validation: Module can be imported in AppModule

#### Scenario: AppModule Registration
- Given: New module exists
- When: AppModule is updated
- Then: SentencesModule is imported in imports array
- Validation: Application starts without errors

## REMOVED Requirements

### Requirement: No PreferencesController
**Component**: server/src/preferences/preferences.controller.ts
**Type**: REST API
**Description**: Do not create preferences controller

The system SHALL NOT create a PreferencesController as preferences remain in localStorage.

#### Scenario: Preferences Stay Local
- Given: Preferences are device-specific settings
- When: Migration is planned
- Then: No preferences API endpoints are created
- Validation: No preference-related controller files exist

### Requirement: No PreferencesService
**Component**: server/src/preferences/preferences.service.ts
**Type**: Business Logic
**Description**: Do not create preferences service

The system SHALL NOT create a PreferencesService as preferences remain in localStorage.

#### Scenario: Preferences Handled Locally
- Given: Preferences are device-specific settings
- When: Frontend needs to access preferences
- Then: Preferences are read/written to localStorage, not API
- Validation: No preference-related service files exist

## API Endpoints Summary

### Sentences
- **GET /sentences** - Retrieve all user sentences
- **POST /sentences** - Create new sentence
- **PUT /sentences/:id** - Update specific sentence
- **DELETE /sentences/:id** - Delete specific sentence
- **PUT /sentences/reorder** - Reorder all sentences

Note: No preferences endpoints - preferences remain in localStorage.

## Cross-References
- **Related**: Database (queries UserSentence table)
- **Related**: Frontend Service (calls these endpoints)

## Authentication
All endpoints SHALL require authentication via JWT Bearer token in Authorization header.
