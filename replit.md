# Warhammer Fantasy Tavern - replit.md

## Overview

This is a comprehensive React-based web application that simulates an immersive Warhammer Fantasy tavern environment with AI-powered characters, real-time conversations, and multiplayer WebSocket integration. The application features 6+ distinct AI characters that engage in continuous live conversations using OpenAI's GPT-4o model, creating an authentic medieval fantasy tavern experience.

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
- **AI Integration**: OpenAI GPT-4o for character conversations and personalities
- **Real-time Communication**: WebSocket server for live tavern interactions
- **Database**: PostgreSQL with Drizzle ORM (optional storage)
- **Memory Storage**: In-memory storage for development and demo purposes

### Key Components

#### Frontend Components
1. **Live Tavern Interface**: Real-time conversation display with WebSocket integration
2. **Scene Management**: Dynamic scene switching (Cichy Wieczór, Dzień Targowy, Noc Burzy)
3. **Character Panel**: Interactive AI character selection and information display
4. **Conversation System**: Live chat interface for player-character interactions
5. **Connection Status**: Real-time WebSocket connection indicator

#### Backend Components
1. **Conversation Engine**: OpenAI-powered character personality system with unique speaking styles
2. **WebSocket Server**: Real-time communication for live tavern conversations  
3. **Character Management**: 6 distinct AI characters with individual personalities, backgrounds, and relationships
4. **Auto-Conversation System**: Automated character interactions every 45 seconds
5. **API Routes**: RESTful endpoints for character data and conversation generation

#### Shared Components
1. **Schema Definitions**: Shared TypeScript types and Zod validation schemas
2. **Type Safety**: End-to-end type safety between frontend and backend

## Data Flow

1. **WebSocket Connection**: Client establishes real-time connection to tavern server
2. **AI Character System**: OpenAI GPT-4o generates authentic character responses and conversations
3. **Live Conversations**: Automated character interactions broadcast to all connected clients
4. **Player Interactions**: Users can chat directly with AI characters in real-time
5. **Scene Management**: Dynamic scene changes affect conversation context and atmosphere
6. **State Synchronization**: Real-time updates keep all clients synchronized

## External Dependencies

### Core Framework Dependencies
- React 18 ecosystem with TypeScript support
- Vite for build tooling and development server
- Express.js for backend API server
- OpenAI SDK for AI character conversations
- WebSocket (ws) for real-time communication

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

## Recent Changes (January 2025)

✓ **AI Integration Complete**: Implemented OpenAI GPT-4o for character conversations
✓ **WebSocket System**: Real-time communication for live tavern interactions  
✓ **Character Personalities**: 6 distinct AI characters with unique speaking styles
✓ **Auto-Conversations**: Characters talk automatically every 45 seconds
✓ **Live Chat Interface**: Players can interact directly with AI characters
✓ **Scene-Based Context**: Conversations adapt to current tavern scene
✓ **Polish Language Support**: Medieval fantasy terminology and authentic dialogue

## AI Character System

### Featured Characters
1. **Wilhelm von Schreiber** - Empire Scholar with formal speaking style
2. **Greta Żelazna Kuźnia** - Dwarf Blacksmith with practical, direct personality
3. **Aelindra Szept Księżyca** - Elf Mage speaking in poetic, nature-focused riddles
4. **Marcus Steiner** - Empire Scout with military terminology and paranoid observations
5. **Lorenzo Złota Ręka** - Tilean Merchant with charming, calculating business focus
6. **Balin Poszukiwacz Złota** - Dwarf Merchant with traditional clan-focused personality

This architecture enables immersive fantasy roleplay experiences with comprehensive AI integration, real-time multiplayer functionality, and authentic Warhammer Fantasy atmosphere.