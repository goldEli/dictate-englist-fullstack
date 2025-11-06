# Project Context: Dictate English Fullstack

## Overview
A full-stack dictation practice application built with Next.js frontend and NestJS backend. Users practice typing English sentences with audio feedback, progress tracking, and customizable difficulty levels.

## Tech Stack

### Frontend Stack
- **Framework**: Next.js 16.0.0 (App Router)
- **React**: 19.2.0
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4
- **Package Manager**: pnpm
- **State Management**: React hooks (no global state)
- **Storage**: localStorage for persistence
- **Audio**: Web Audio API for sound effects
- **Port**: 3008

### Backend Stack
- **Framework**: NestJS 11.x (core, common, platform-express)
- **Language**: TypeScript (strict mode)
- **Database**: MySQL 8.0+ with TypeORM 0.3.15
- **Cache/Sessions**: Redis 6.0+
- **Authentication**: JWT-based
- **Testing**: Jest 30.x
- **Database Driver**: MySQL2
- **Port**: 3000 (configurable via PORT env var)

### Additional Tools
- **Linting**: ESLint with TypeScript ESLint
- **Formatting**: Prettier
- **Build Tool**: Next.js bundler (frontend), NestJS CLI (backend)
- **Development**: pnpm workspaces for monorepo management

## Architecture

### Frontend Architecture (Next.js App Router)
```
frontend/
├── app/                    # App Router pages
│   ├── page.tsx           # Main dictation practice page
│   ├── layout.tsx         # Root layout with global styles
│   ├── globals.css        # Tailwind CSS styles
│   ├── login/             # Login page
│   ├── sentences/         # Default sentences data
│   ├── components/        # Reusable components
│   │   └── confetti.tsx   # Celebration animation
│   ├── hooks/             # Custom React hooks
│   │   └── useAudioCues.ts # Audio feedback management
│   └── lib/               # Utility functions
│       └── sentence-utils.ts # Sentence management & validation
```

### Backend Architecture (NestJS)
```
server/
├── src/
│   ├── main.ts            # Application bootstrap
│   ├── app.module.ts      # Root module (empty imports array)
│   ├── app.controller.ts  # HTTP request handlers
│   ├── app.service.ts     # Business logic layer
│   ├── app.controller.spec.ts # Unit tests
├── test/
│   ├── jest-e2e.json      # Jest E2E configuration
│   └── app.e2e-spec.ts    # E2E test suite
```

## Key Features

### Core Functionality
1. **Dictation Practice**
   - Display sentences for typing practice
   - Real-time validation of typed input
   - Progress tracking and statistics
   - Configurable difficulty levels

2. **Audio System**
   - Keypress sound effects
   - Completion celebration sounds
   - Configurable via preferences

3. **Sentence Management**
   - Default sentence library
   - Import/export functionality (JSON)
   - Local storage persistence
   - Progress tracking per sentence

4. **User Interface**
   - Clean, focused design
   - Real-time feedback
   - Responsive layout
   - Accessibility considerations

5. **Authentication** (Backend)
   - JWT-based authentication
   - MySQL user storage
   - Redis session management
   - Login/logout endpoints

## Database Schema

### MySQL Database: `dictate_english`

**Users Table** (defined in auth system)
- id (primary key)
- email (unique)
- password (hashed)
- created_at
- updated_at

**Additional tables TBD based on requirements**

## Environment Configuration

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Backend (.env)
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=123456
DB_NAME=dictate_english
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=your-secret-key
PORT=3000
```

### Default Services
- **MySQL**: localhost:3306, user=root, password=123456
- **Redis**: localhost:6379
- **Test User**: test@example.com / password123

## Development Conventions

### Code Style
- **TypeScript Strict Mode**: Enabled across all projects
- **ESLint**: Configured with TypeScript rules
- **Prettier**: Code formatting
- **Imports**: Absolute imports with @ alias (configured in tsconfig)

### Naming Conventions
- **Variables/Functions**: camelCase
- **Components/Types**: PascalCase
- **Files**: kebab-case for components, camelCase for utilities
- **Constants**: UPPER_SNAKE_CASE

### Component Patterns
- **Function Components**: Only function components with hooks
- **Custom Hooks**: Extract reusable logic (e.g., useAudioCues)
- **Props**: Define TypeScript interfaces for all props
- **State**: Use useState/useReducer for local state

### State Management
- **Local State**: React hooks (useState, useReducer)
- **Persistence**: localStorage for non-sensitive data
- **Server State**: Direct API calls, no global state management library yet

### API Patterns
- **RESTful**: Follow REST conventions for endpoints
- **Validation**: DTOs with class-validator
- **Error Handling**: Custom exceptions, proper HTTP status codes
- **Authentication**: JWT tokens in Authorization header

## Testing Strategy

### Frontend Testing
- Unit tests: TBD (no testing setup currently)
- E2E tests: TBD (potential Cypress or Playwright)
- Component testing: TBD

### Backend Testing
- **Unit Tests**: Jest with @nestjs/testing
- **E2E Tests**: Jest with supertest
- **Test Coverage**: Run with `pnpm test:cov`
- **Database**: Test database (separate from dev/prod)

## Deployment

### Frontend Deployment
- Static site generation (Next.js)
- Build: `pnpm build`
- Output: `.next/` directory
- Can deploy to Vercel, Netlify, or any static host

### Backend Deployment
- Node.js application
- Build: `pnpm build` (transpiles to `dist/`)
- Can deploy to Heroku, AWS, DigitalOcean, etc.
- Requires MySQL and Redis services

## Performance Considerations

### Frontend
- **Bundle Size**: Minimize with code splitting
- **Images**: Optimize and use next/image
- **Audio**: Preload audio files
- **Rendering**: Leverage Next.js App Router optimizations

### Backend
- **Database**: Index frequently queried fields
- **Caching**: Use Redis for session data
- **Queries**: Avoid N+1 queries with proper TypeORM relations
- **API**: Implement pagination for list endpoints

## Security Considerations

- **Authentication**: JWT with secure secret
- **Passwords**: Bcrypt hashing
- **Input Validation**: Both frontend and backend
- **SQL Injection**: TypeORM prevents with parameterized queries
- **XSS**: Sanitize user-generated content
- **CSRF**: Consider for form submissions
- **Rate Limiting**: TBD for API endpoints
- **Environment Variables**: Never commit secrets

## Roadmap & Open Questions

### Implemented
- [x] Basic Next.js frontend structure
- [x] Dictation interface
- [x] Audio system with keypress sounds
- [x] Sentence management (CRUD, import/export)
- [x] Local storage persistence
- [x] NestJS backend skeleton
- [x] Authentication system setup (MySQL + Redis)
- [x] Basic API endpoints

### Next Steps (Potential Features)
- [ ] User profiles and progress tracking
- [ ] Difficulty levels and adaptive learning
- [ ] Statistics and analytics dashboard
- [ ] Sentence categories/tags
- [ ] Typing speed and accuracy metrics
- [ ] Collaboration features (shared sentence lists)
- [ ] Mobile responsive optimizations
- [ ] Offline support (PWA)
- [ ] Text-to-speech for sentence playback
- [ ] Keyboard shortcuts and accessibility
- [ ] Multi-language support
- [ ] Cloud storage for user data

## Recent Changes

- **c919080**: feat - Added login functionality
- **dbafd90**: feat - Initial project setup

## Important Files

### Frontend
- `frontend/app/page.tsx` - Main dictation interface (THE most important file)
- `frontend/app/lib/sentence-utils.ts` - Sentence CRUD operations
- `frontend/app/hooks/useAudioCues.ts` - Audio system
- `frontend/package.json` - Dependencies and scripts

### Backend
- `server/src/main.ts` - Application entry point
- `server/src/app.module.ts` - Module configuration
- `server/package.json` - Dependencies and scripts

## Learning Resources

- **Next.js**: https://nextjs.org/docs
- **NestJS**: https://docs.nestjs.com/
- **TypeORM**: https://typeorm.io/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **React Hooks**: https://react.dev/reference/react

## Support & Contact

For questions about this project:
1. Check this document first
2. Review the codebase for examples
3. Check AGENTS.md for workflow guidance
4. Open an issue on the repository

---

**Last Updated**: 2025-11-06
**Version**: 1.0.0
