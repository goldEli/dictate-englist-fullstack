# Database Schema for MySQL Migration

## ADDED Requirements

### Requirement: UserSentence Entity
**Component**: server/src/user-sentence.entity.ts
**Type**: Database Schema
**Description**: Define TypeORM entity for user sentences

The system SHALL create a TypeORM entity for storing user sentences with proper relationships.

#### Scenario: UserSentence Entity Structure
- Given: TypeORM is configured
- When: UserSentence entity is defined
- Then: Entity has id, userId, sentenceId, text, and order fields
- Validation: Entity can be imported and used in module

#### Scenario: Entity Relationships
- Given: User entity exists
- When: UserSentence entity is created
- Then: Many-to-one relationship with User entity is established
- Validation: TypeORM recognizes the foreign key relationship

#### Scenario: Database Indexing
- Given: UserSentence entity is created
- When: Database tables are synchronized
- Then: Unique index on (user_id, sentence_id) is created
- Validation: Query performance optimized for user-specific lookups

### Requirement: Module Registration
**Component**: server/src/app.module.ts
**Type**: Configuration
**Description**: Register UserSentence entity in TypeORM module

The system SHALL register the UserSentence entity in the application module.

#### Scenario: Entity Registration
- Given: UserSentence entity exists
- When: AppModule is configured
- Then: Entity is included in TypeOrmModule.forRoot entities array
- Validation: Entity is recognized by TypeORM

#### Scenario: Database Synchronization
- Given: Entity is registered
- When: Application starts
- Then: TypeORM creates tables automatically
- Validation: user_sentences table exists in MySQL database

## REMOVED Requirements

### Requirement: No UserPreference Entity
**Component**: server/src/user-preference.entity.ts
**Type**: Database Schema
**Description**: Do not create preference entity

The system SHALL NOT create a UserPreference entity as preferences remain in localStorage.

#### Scenario: Preferences in LocalStorage
- Given: Preferences are device-specific settings
- When: Migration is planned
- Then: Preferences stay in localStorage, no database table needed
- Validation: No preference-related API endpoints or entities created

## Cross-References
- **Related**: Backend API (uses UserSentence entity)
- **Related**: Frontend Service (calls APIs that query user_sentences table)

## Database Tables

### user_sentences
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

Note: No user_preferences table - preferences remain in localStorage as device-specific settings.
