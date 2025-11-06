# OpenSpec Agent Guidelines

This document provides guidance for AI assistants working on the Dictate English Fullstack project using the OpenSpec workflow.

## When to Read This Document

You **MUST** open this document when a request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

## OpenSpec Workflow

The OpenSpec workflow follows these steps:

### 1. Project Context
The `openspec/project.md` file contains the authoritative context about this project including:
- Tech stack details
- Architecture decisions
- Code conventions and patterns
- Key dependencies and their versions
- Development workflows and commands

Always reference this file to understand project-wide decisions.

### 2. Change Proposal Process

When a feature or change is requested:

1. **Create a proposal** - Use the `/openspec:proposal` slash command to scaffold a new change proposal
2. **Validate the proposal** - The proposal will be automatically validated for format and completeness
3. **Apply the proposal** - Once approved, use `/openspec:apply` to implement the change
4. **Archive when complete** - Use `/openspec:archive` when the feature is deployed

### 3. Proposal Format

Change proposals must include:

```markdown
# [Change Title]

## Summary
Brief description of what this change accomplishes (1-2 sentences)

## Problem
What problem does this solve? Why is it needed?

## Solution
High-level approach and architecture

## Implementation Plan
Step-by-step breakdown of work

## Success Criteria
How will we know this is complete?

## Rollback Plan
How to undo this change if needed
```

### 4. Project Structure

This is a full-stack monorepo:

```
dictate-englist-fullstack/
├── frontend/          # Next.js 16.0.0 React app (port 3008)
│   ├── app/          # App Router structure
│   ├── components/   # Reusable React components
│   ├── hooks/        # Custom React hooks
│   ├── lib/          # Utility functions
│   └── sentences/    # Default sentence data
├── server/           # NestJS backend (port 3000)
│   └── src/         # NestJS application code
└── openspec/        # OpenSpec documentation
    ├── AGENTS.md    # This file
    └── project.md   # Project context
```

### 5. Key Conventions

#### Frontend (Next.js)
- **Framework**: Next.js 16.0.0 with App Router
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript (strict mode)
- **Package Manager**: pnpm
- **Port**: 3008 (configurable)
- **Components**: Use function components with hooks
- **State**: Local state for UI, no global state management yet
- **Storage**: localStorage for persistence
- **Audio**: Web Audio API for sound effects

#### Backend (NestJS)
- **Framework**: NestJS 11.x
- **Database**: MySQL with TypeORM 0.3.x
- **Cache**: Redis for sessions
- **Auth**: JWT-based authentication
- **Language**: TypeScript (strict mode)
- **Testing**: Jest 30.x
- **Port**: 3000 (configurable via PORT env var)

#### Database
- **MySQL**: Version 8.0+
- **Redis**: Version 6.0+
- **Default credentials**: root/123456
- **Database name**: dictate_english

### 6. Development Commands

#### Frontend
```bash
cd frontend
pnpm dev         # Start dev server on :3008
pnpm build       # Build for production
pnpm start       # Start production server
pnpm lint        # Run ESLint
```

#### Backend
```bash
cd server
pnpm start           # Start production server
pnpm start:dev       # Start in watch mode
pnpm test            # Run unit tests
pnpm test:cov        # Run tests with coverage
pnpm test:e2e        # Run end-to-end tests
pnpm seed            # Create test user
```

### 7. Code Style Guidelines

- **TypeScript**: Always use strict mode, define proper types
- **Imports**: Use absolute imports with @ alias (configured in tsconfig)
- **Naming**: Use camelCase for variables/functions, PascalCase for components
- **Components**: Function components only, use hooks for state/effects
- **Error Handling**: Always handle errors gracefully, log appropriately
- **Security**: Never commit secrets, validate all inputs, sanitize outputs

### 8. Git Workflow

- **Branch naming**: feature/description, fix/description, chore/description
- **Commits**: Use conventional commits (feat, fix, chore, etc.)
- **PRs**: All changes via pull requests
- **Testing**: Run tests before submitting PRs

### 9. Common Patterns

#### Frontend Patterns
- **Custom Hooks**: Extract reusable logic into hooks
- **Component Composition**: Use composition over inheritance
- **Performance**: Use React.memo for expensive components
- **Audio**: useAudioCues hook for sound management

#### Backend Patterns
- **Modules**: NestJS modules for dependency injection
- **Services**: Business logic in services
- **Controllers**: HTTP handling in controllers
- **DTOs**: Use Data Transfer Objects for validation
- **Guards**: Authentication/authorization guards

### 10. Environment Setup

Required services:
- MySQL 8.0+ (root/123456, database: dictate_english)
- Redis 6.0+ (localhost:6379)

Test user: test@example.com / password123

### 11. Important Files to Know

#### Frontend
- `frontend/app/page.tsx` - Main dictation interface
- `frontend/app/layout.tsx` - Root layout
- `frontend/app/globals.css` - Global styles
- `frontend/app/lib/sentence-utils.ts` - Sentence management
- `frontend/app/hooks/useAudioCues.ts` - Audio system

#### Backend
- `server/src/main.ts` - Application bootstrap
- `server/src/app.module.ts` - Root module
- `server/src/app.controller.ts` - HTTP endpoints
- `server/src/app.service.ts` - Business logic

### 12. Feature Development

When adding new features:

1. **Plan first** - Create a change proposal
2. **Check existing patterns** - Look at similar features
3. **Follow conventions** - Match existing code style
4. **Test thoroughly** - Add tests for new functionality
5. **Document changes** - Update relevant comments/docs

### 13. Security Best Practices

- Validate all inputs on both frontend and backend
- Use parameterized queries (TypeORM handles this)
- Implement proper authentication/authorization
- Never log sensitive information
- Use environment variables for configuration
- Implement rate limiting for APIs
- Sanitize user-generated content

### 14. Performance Considerations

- **Frontend**: Lazy load routes/components, optimize images, minimize bundle size
- **Backend**: Use caching (Redis), optimize database queries, implement pagination
- **Database**: Add indexes for frequently queried fields, avoid N+1 queries

### 15. Working with AI Assistants

When collaborating with AI:

- Be specific about requirements
- Provide context from project.md
- Reference existing code patterns
- Ask for explanations of complex changes
- Review all changes before accepting
- Test thoroughly after implementation

## Slash Commands

- `/openspec:proposal` - Create a new change proposal
- `/openspec:apply` - Apply an approved proposal
- `/openspec:archive` - Archive a completed change

Use these commands to manage the OpenSpec workflow efficiently.
