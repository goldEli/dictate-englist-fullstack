<!-- OPENSPEC:START -->
# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Monorepo Structure

This is a full-stack application with two main directories:

- **frontend** - Next.js 16.0.0 React application (port 3008)
- **server** - NestJS backend API (port 3000, configurable via PORT env var)

## Common Commands

### Frontend (Next.js)
```bash
cd frontend
pnpm dev        # Start development server on :3008
pnpm build      # Build for production
pnpm start      # Start production server
pnpm lint       # Run ESLint
```

### Server (NestJS)
```bash
cd server
pnpm start           # Start production server
pnpm start:dev       # Start in watch mode (development)
pnpm start:debug     # Start in debug mode with watch
pnpm test            # Run unit tests
pnpm test:watch      # Run tests in watch mode
pnpm test:cov        # Run tests with coverage
pnpm test:e2e        # Run end-to-end tests
pnpm lint            # Run ESLint with auto-fix
pnpm format          # Format code with Prettier
pnpm seed            # Create test user in database
```

## High-Level Architecture

### Frontend (Next.js App Router)
The frontend uses Next.js 14+ app directory structure:
- **app/** - Route handlers and page components
  - `page.tsx` - Main application page (dictation practice interface)
  - `layout.tsx` - Root layout with global styles
  - `globals.css` - Global Tailwind CSS styles
- **app/components/** - Reusable React components
  - `confetti.tsx` - Celebration animation component
- **app/hooks/** - Custom React hooks
  - `useAudioCues.ts` - Audio feedback management
- **app/lib/** - Utility functions and types
  - `sentence-utils.ts` - Sentence management, validation, localStorage utilities
- **app/sentences/** - Default sentence data (page.tsx)

**Key Dependencies:**
- React 19.2.0
- Tailwind CSS v4 (via @tailwindcss/postcss)
- TypeScript for type safety

**Core Features:**
- Dictation practice interface with sentence display and input validation
- Local storage persistence for sentences, progress, and preferences
- Audio cues for keypress and completion
- Import/export functionality for sentence lists
- Configurable preferences (sound effects)

### Server (NestJS)
The backend follows standard NestJS architecture:
- **src/** - Application source code
  - `main.ts` - Application bootstrap (creates NestFactory on PORT env var)
  - `app.module.ts` - Root module (currently empty imports array)
  - `app.controller.ts` - HTTP request handlers
  - `app.service.ts` - Business logic layer
  - `app.controller.spec.ts` - Unit tests for controller
- **test/** - E2E test configuration
  - `jest-e2e.json` - Jest configuration for e2e tests
  - `app.e2e-spec.ts` - E2E test suite

**Key Dependencies:**
- NestJS 11.x (core, common, platform-express)
- TypeORM 0.3.x with MySQL2 driver
- Jest 30.x for testing
- TypeScript with strict mode

**Database:**
- Uses MySQL via TypeORM (version 3.15.3)
- TypeORM is configured but entities/models not yet defined in app.module

## Authentication Setup

The application includes a full authentication system with MySQL and Redis:

### Prerequisites
- **MySQL Server**: Version 8.0 or higher
  - Default credentials: user=`root`, password=`123456`
  - Database name: `dictate_english`
- **Redis Server**: Version 6.0 or higher
  - Default host: `localhost`, port: `6379`

### Setup Steps

1. **Start MySQL Server**
   ```bash
   mysql -u root -p123456
   CREATE DATABASE dictate_english;
   exit;
   ```

2. **Start Redis Server**
   ```bash
   redis-server
   ```

3. **Create Test User**
   ```bash
   cd server
   pnpm seed
   ```
   This creates a test user: `test@example.com` with password: `password123`

4. **Environment Variables**
   Create `.env` file in server directory:
   ```
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=123456
   DB_NAME=dictate_english
   REDIS_HOST=localhost
   REDIS_PORT=6379
   JWT_SECRET=your-secret-key
   ```

5. **Frontend API URL**
   Create `.env.local` in frontend directory:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```

### API Endpoints

- `POST /auth/login` - Login with email/password
- `POST /auth/logout` - Logout and invalidate session
- `GET /auth/me` - Get current user info

### Frontend Pages

- `/login` - Login page with email and password form
- Auth context available via `useAuth()` hook

## Development Notes

- Both projects use **pnpm** as the package manager
- **TypeScript** is used throughout (ESLint + TypeScript ESLint configured)
- The frontend runs on **port 3008** (configured in frontend/package.json)
- The backend runs on **port 3000** by default (configurable via `PORT` environment variable)
- This appears to be a dictation practice application based on the frontend page.tsx and sentence-utils.ts
