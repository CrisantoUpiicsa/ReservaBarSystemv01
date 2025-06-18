# Restaurant Management System

## Overview
This is a full-stack restaurant management system built with React, Express.js, and PostgreSQL. The application provides comprehensive tools for managing reservations, tables, menu items, and inventory in a restaurant setting. It features a modern web interface with real-time data management and responsive design.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **UI Library**: Shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: Wouter for client-side routing
- **Build Tool**: Vite for fast development and building

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL via Neon serverless
- **Development**: Hot reload with Vite integration

### Database Design
The system uses PostgreSQL with the following main entities:
- **Users**: Authentication and role-based access (customer, staff, manager)
- **Tables**: Restaurant table management with capacity and status tracking
- **Reservations**: Customer booking system with date/time management
- **Menu Categories**: Hierarchical menu organization
- **Menu Items**: Individual dishes with pricing and categorization
- **Inventory Items**: Stock management with minimum thresholds

## Key Components

### Dashboard
- Real-time statistics display
- Today's reservations overview
- Available tables count
- Revenue tracking (mock data)
- Recent reservations feed

### Reservation Management
- Create, update, and cancel reservations
- Filter by date, status, and table
- Customer information tracking
- Special requests handling
- Status workflow (pending → confirmed → completed/cancelled)

### Table Management
- Visual table layout
- Real-time status updates (available, occupied, reserved, unavailable)
- Capacity management
- Location tracking

### Menu Management
- Category-based organization
- Item pricing and descriptions
- Availability status
- Hierarchical menu structure

### Inventory Management
- Stock level tracking
- Low stock alerts
- Unit pricing and cost calculations
- Category-based organization

## Data Flow

1. **Client Requests**: React components use custom hooks powered by TanStack Query
2. **API Layer**: Express.js routes handle HTTP requests with validation
3. **Database Layer**: Drizzle ORM manages PostgreSQL operations
4. **State Updates**: Optimistic updates with cache invalidation
5. **Real-time Updates**: Automatic refetching on mutations

## External Dependencies

### Database
- **Neon PostgreSQL**: Serverless PostgreSQL database
- **Connection**: Via @neondatabase/serverless with WebSocket support

### UI Components
- **Radix UI**: Headless accessible components
- **Lucide React**: Icon library
- **Date-fns**: Date manipulation utilities

### Development Tools
- **Replit Integration**: Runtime error overlay and cartographer
- **TypeScript**: Strict type checking across the stack
- **ESBuild**: Production bundling for server code

## Deployment Strategy

### Development
- **Environment**: Replit with hot reload
- **Port**: 5000 for development server
- **Database**: Managed PostgreSQL instance

### Production
- **Build Process**: Vite builds client, ESBuild bundles server
- **Deployment Target**: Autoscale deployment
- **Static Assets**: Served from dist/public
- **Environment Variables**: DATABASE_URL required

### Configuration
- **Modules**: Node.js 20, Web, PostgreSQL 16
- **Build Command**: `npm run build`
- **Start Command**: `npm run start`
- **Database Migration**: `npm run db:push`

## Changelog
- June 18, 2025. Initial setup

## User Preferences
Preferred communication style: Simple, everyday language.