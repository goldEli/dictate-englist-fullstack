# Project Context

## Purpose
A full-stack dictation practice application that helps users improve their English typing and listening skills. Users can:
- Practice typing sentences with audio playback
- Track progress through a sequence of sentences
- Import/export custom sentence lists
- Configure preferences (sound effects, keypress feedback)
- Persist progress locally in browser storage

## Tech Stack
- **Frontend**: Next.js 16.0.0 (App Router), React 19.2.0, TypeScript
- **Styling**: Tailwind CSS v4 (@tailwindcss/postcss)
- **Backend**: NestJS 11.x (Node.js framework), TypeScript
- **Database**: MySQL 3.15.3 with TypeORM 0.3.27
- **Package Manager**: pnpm
- **Testing**: Jest 30.x (unit + e2e for backend)

## Project Conventions

### Code Style
- **TypeScript**: Strict mode enabled across both projects
- **Linting**: ESLint 9.x with TypeScript rules
  - Frontend: eslint-config-next
  - Server: eslint-config-prettier
- **Formatting**: Prettier (server)
- **Naming**: camelCase for variables/functions, PascalCase for components/classes

### Architecture Patterns
- **Frontend**: Next.js App Router with:
  - `app/` directory for routes and layouts
  - Custom hooks in `app/hooks/` for reusable logic
  - Components in `app/components/` for UI elements
  - Utilities in `app/lib/` for helper functions
  - Client-side state with React hooks + localStorage
- **Backend**: NestJS modular architecture:
  - Controllers handle HTTP requests
  - Services contain business logic
  - TypeORM entities for data modeling
  - Configuration via environment variables (PORT)

### Testing Strategy
- **Frontend**: No test framework configured yet
- **Backend**: Jest with:
  - Unit tests: `*.spec.ts` files
  - E2E tests: `*.e2e-spec.ts` files in `test/` directory
  - Coverage reports available
  - Debug mode support via `--inspect-brk`

### Git Workflow
- Standard git repository (no specific workflow documented)
- Commit conventions not specified
- .gitignore files present in both frontend and server

## Domain Context
**Dictation Practice Workflow:**
1. System displays a sentence to the user
2. User types the sentence in an input field
3. System compares input (normalized, case/punctuation-insensitive)
4. Audio cues provide feedback (keypress sounds, completion sounds)
5. User advances to next sentence upon correct completion
6. Progress persists across browser sessions
7. Users can import/export custom sentence lists

**Core Entities:**
- **Sentence**: Text content with unique ID
- **Preferences**: Sound settings (completionSound, keypressSound)
- **Progress**: Current sentence index (0-based)

## Important Constraints
- **Ports**: Frontend (3008), Backend (3000)
- **Browser Storage**: Frontend relies on localStorage for persistence
- **Database**: MySQL required for backend (TypeORM configured)
- **No Auth**: No authentication system currently implemented
- **Client-Side Validation**: Frontend includes input sanitization utilities

## External Dependencies
- **Audio APIs**: Web Speech API (for text-to-speech functionality)
- **Browser Storage**: localStorage API
- **MySQL Database**: External MySQL server required for backend
- **pnpm**: Required package manager (not npm/yarn)
