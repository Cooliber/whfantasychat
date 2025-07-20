# Chronicles Podcast Portfolio - replit.md

## Overview

This is a comprehensive React-based web application for showcasing podcast case studies with a medieval fantasy theme. The application serves as a portfolio website for documenting successful podcast strategies and campaigns, styled with a Warhammer Fantasy-inspired aesthetic.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **Styling**: Tailwind CSS with custom Warhammer Fantasy theme variables
- **UI Components**: Radix UI primitives with custom shadcn/ui component system
- **State Management**: Zustand for client-side state management
- **Data Fetching**: TanStack React Query for server state management
- **Routing**: Wouter for lightweight client-side routing

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: PostgreSQL-based sessions with connect-pg-simple

### Key Components

#### Frontend Components
1. **Portfolio System**: Case study display with filtering, modal views, and detailed analysis
2. **Navigation**: Smooth scrolling single-page application with fixed header
3. **Contact Form**: Lead capture with form validation and submission handling
4. **UI Components**: Comprehensive component library based on Radix UI primitives

#### Backend Components
1. **API Routes**: RESTful endpoints for contact form submissions and case study data
2. **Database Schema**: Structured data models for users, case studies, and contact submissions
3. **Storage Layer**: Abstracted storage interface with in-memory implementation for development

#### Shared Components
1. **Schema Definitions**: Shared TypeScript types and Zod validation schemas
2. **Type Safety**: End-to-end type safety between frontend and backend

## Data Flow

1. **Client Requests**: Frontend makes API calls using TanStack React Query
2. **Server Processing**: Express.js handles requests with proper error handling and validation
3. **Data Validation**: Zod schemas ensure data integrity at API boundaries
4. **Database Operations**: Drizzle ORM manages PostgreSQL interactions
5. **State Management**: Zustand stores manage client-side application state
6. **UI Updates**: React components re-render based on state changes

## External Dependencies

### Core Framework Dependencies
- React 18 ecosystem with TypeScript support
- Vite for build tooling and development server
- Express.js for backend API server

### Database and ORM
- PostgreSQL database (configured for Neon serverless)
- Drizzle ORM for type-safe database operations
- Drizzle Kit for schema migrations

### UI and Styling
- Tailwind CSS for utility-first styling
- Radix UI primitives for accessible components
- Custom fonts: Cinzel (headers) and Crimson Text (body)
- Lucide React for consistent iconography

### State and Data Management
- Zustand for lightweight state management
- TanStack React Query for server state caching
- React Hook Form with Zod resolvers for form handling

## Deployment Strategy

### Development Environment
- Vite dev server with HMR for frontend development
- tsx for running TypeScript server code directly
- Concurrent development of frontend and backend

### Production Build Process
1. **Frontend Build**: Vite builds React app to `dist/public`
2. **Backend Build**: esbuild bundles server code to `dist/index.js`
3. **Static Serving**: Express serves built frontend from `/dist/public`

### Database Management
- Environment-based DATABASE_URL configuration
- Drizzle migrations stored in `/migrations` directory
- Push-based schema deployment with `db:push` command

### Environment Configuration
- Development: NODE_ENV=development with live reloading
- Production: NODE_ENV=production with optimized builds
- Database URL required for all environments

### Replit-Specific Features
- Runtime error overlay for development debugging
- Cartographer plugin for enhanced development experience
- Replit dev banner for external access indication

## Project Structure Rationale

The monorepo structure separates concerns clearly:
- `/client` - Frontend React application
- `/server` - Backend Express API
- `/shared` - Common types and schemas
- Configuration files at root level for unified tooling

This architecture enables rapid development while maintaining production readiness, with comprehensive type safety and modern development tooling throughout the stack.