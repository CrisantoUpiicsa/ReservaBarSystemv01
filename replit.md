# Bar Reservation Management System

## Overview
This is a comprehensive bar reservation management system built with React, Express.js, and PostgreSQL. The application provides customer authentication, table reservations, bar-specific menu management, and staff administration tools. It features role-based access with separate interfaces for customers and staff, focusing on premium bar experiences with cocktails, spirits, and bar snacks.

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
The system uses PostgreSQL with comprehensive entities for bar operations:
- **Users**: Customer authentication with loyalty points, age verification, and role-based access (customer, staff, manager)
- **Tables**: Bar table management with area-specific locations (main bar, VIP, lounge, terrace, outdoor)
- **Reservations**: Customer booking system with payment integration and user association
- **Menu Categories**: Bar-specific organization (spirits, cocktails, wine, beer, snacks)
- **Menu Items**: Drinks and snacks with alcohol content, ingredients, and preparation time
- **Inventory Items**: Bar stock management with expiration dates and supplier tracking
- **Promotions**: Loyalty-based discounts and time-specific offers
- **Orders**: Customer order tracking linked to reservations
- **Events**: Special bar events and capacity management

## Key Components

### Customer Interface
- Customer registration and login with age/gender/birth date
- Personal reservation management and history
- Browse bar menu with detailed drink information
- View available tables by area
- Loyalty points tracking and profile management
- Mobile-optimized booking experience

### Authentication System
- Email-based login with password hashing
- Role-based access control (customer vs staff)
- Session management with secure cookies
- User profile with loyalty program integration

### Staff Dashboard
- Real-time reservation monitoring
- Table status management across bar areas
- Customer data and visit history
- Revenue tracking and analytics
- Inventory management with low stock alerts

### Bar Menu Management
- Category-based organization by drink type
- Detailed item information (alcohol content, ingredients, prep time)
- Availability status and popularity tracking
- Price management and special offers

### Reservation System
- Customer-initiated bookings with authentication
- Table preference selection by bar area
- Special requests and dietary accommodations
- Payment status tracking
- Staff confirmation workflow

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
- June 18, 2025: Initial setup
- June 18, 2025: Complete transformation to bar reservation system with customer authentication, role-based access, and comprehensive bar menu management

## Recent Changes
- ✓ Implemented customer authentication system with email/password login
- ✓ Added role-based access control (customer vs staff interfaces)
- ✓ Created comprehensive bar menu with spirits, cocktails, wine, beer, and snacks
- ✓ Enhanced database schema with loyalty points, bar areas, and payment tracking
- ✓ Built customer interface with reservation management and menu browsing
- ✓ Added authentication middleware and session management
- ✓ Integrated bar-specific features (alcohol content, ingredients, preparation time)
- ✓ Implemented table management across multiple bar areas (VIP, lounge, terrace)

## User Preferences
Preferred communication style: Simple, everyday language.
Project focus: Bar reservation system with customer login/registration, bar-specific menu items, and three user roles (customer, staff, manager).