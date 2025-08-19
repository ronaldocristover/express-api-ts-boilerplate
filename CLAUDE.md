# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a production-ready Node.js Express.js REST API project using TypeScript, designed with a layered architecture following standard Express conventions. The project includes comprehensive middleware, validation, testing, and containerization setup.

## Technology Stack

- **Runtime:** Node.js 20+
- **Framework:** Express.js
- **Language:** TypeScript
- **Package Manager:** npm
- **Database:** MySQL with Prisma ORM
- **Validation:** Zod for environment variables and input validation
- **Logging:** Winston (connected to Grafana)
- **Testing:** Jest with Supertest
- **Containerization:** Docker & Docker Compose
- **Code Quality:** ESLint, Prettier

## Project Structure

The project follows a standard Express layered architecture:

```
/src
  /controllers      # HTTP request/response handlers
  /services         # Business logic layer
    user.service.ts # Service files use lowercase naming with module.service.ts format
  /routes           # API route definitions
    index.ts        # Auto register route under this folder
    user.route.ts   # Route files use lowercase naming with module.route.ts format, auto registered to routes/index.ts
  /middlewares      # Custom middleware (auth, validation, error handling)
  /validators       # Input validation schemas using express-validator
  /repository       # Data access layer (DB/Redis operations)
    user.repository.ts # Repository files use lowercase naming with module.repository.ts format
  /models           # TypeScript types & interfaces
  /utils            # Utility functions and helpers (envValidator, etc.)
  /config           # Environment configuration & constants
  app.ts            # Express application setup
  server.ts         # Server initialization with env validation
/tests              # Unit & integration tests
/prisma             # Database schema and migrations
/logs               # Application logs
```

## Environment Variables

**Critical:** Environment validation and database connectivity testing occur at startup using Zod schemas and Prisma connection tests. The server will not start if required variables are missing/invalid or if database connection fails.

### Required Variables:

- `DATABASE_URL`: MySQL connection string (format: mysql://username:password@host:port/database)
- `JWT_SECRET`: Must be at least 32 characters

### Optional Variables (with defaults):

- `NODE_ENV`: development | production | test (default: development)
- `PORT`: Server port (default: 3000)
- `HOST`: Server host (default: localhost)
- `JWT_EXPIRES_IN`: Token expiration (default: 7d)
- `LOG_LEVEL`: error|warn|info|debug (default: info)
- `RATE_LIMIT_WINDOW_MS`: Rate limit window (default: 900000)
- `RATE_LIMIT_MAX_REQUESTS`: Max requests per window (default: 100)
- `CORS_ORIGIN`: Allowed origins (default: http://localhost:3000)
- `API_VERSION`: API version prefix (default: v1)

## Common Commands

```bash
# Setup
npm install
cp .env.example .env  # Configure required variables (REQUIRED BEFORE STARTING)

# Development
npm run dev           # Start with hot reload
npm run build         # Build TypeScript
npm start            # Start production server

# Database
npm run db:generate  # Generate Prisma client
npm run db:migrate   # Run migrations
npm run db:push      # Push schema to database
npm run db:studio    # Open Prisma Studio
npm run db:seed      # Seed database with initial data
npm run db:reset     # Reset database and run seed

# Quality & Testing
npm run lint         # Check code style
npm run lint:fix     # Fix code style issues
npm run prettier     # Format code
npm test            # Run tests
npm run test:watch  # Run tests in watch mode
npm audit           # Check for security vulnerabilities
npm audit fix       # Fix security vulnerabilities

# Docker
docker-compose up                    # Production environment
docker-compose -f docker-compose.dev.yml up  # Development environment
```

## Quick Start Guide

### Prerequisites

- Node.js v20+
- MySQL database (v8.0 or higher recommended)
- npm package manager

### Setup Steps

1. **Clone and install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your MySQL database URL and JWT secret (32+ chars)
   # Example DATABASE_URL: mysql://root:password@localhost:3306/boiler_express
   ```

3. **Setup database**

   ```bash
   npm run db:generate  # Generate Prisma client
   npm run db:migrate   # Run database migrations
   npm run db:seed      # Seed with initial data
   ```

4. **Start development**
   ```bash
   npm run dev         # Starts on http://localhost:3000
   ```

### Verification Commands

```bash
npm run build        # Verify TypeScript compilation
npm run lint         # Verify code quality
npm run prettier     # Format code
npm test            # Run test suite (if database is configured)
```

## API Endpoints

### User Management API

- **GET** `/api/v1/users` - List users with pagination and search
  - Query params:
    - `page` - Page number (default: 1)
    - `limit` - Items per page (default: 10)
    - `sortBy` - Sort field (default: createdAt)
    - `sortOrder` - Sort direction: asc | desc (default: desc)
    - `q` - Search query (searches firstName, lastName, email with case-insensitive matching)
- **GET** `/api/v1/users/:id` - Get user by ID
- **POST** `/api/v1/users` - Create new user
- **PUT** `/api/v1/users/:id` - Update user
- **DELETE** `/api/v1/users/:id` - Delete user (soft delete by default)

### System Endpoints

- **GET** `/health` - Health check with database connectivity status
- **GET** `/api/v1` - API information

### Search Functionality

The user management API includes advanced search capabilities:

- **Case-insensitive search** across multiple fields (firstName, lastName, email)
- **Flexible query parameter** `q` that searches all relevant text fields
- **Maintains pagination** while filtering results
- **Performance optimized** with Prisma's native filtering
- **Validation included** for search query length (1-100 characters)

Example search requests:

```bash
GET /api/v1/users?q=john          # Search for "john" in all fields
GET /api/v1/users?q=example.com&page=2&limit=5  # Search with pagination
GET /api/v1/users?q=doe&sortBy=firstName&sortOrder=asc  # Search with sorting
```

## Implemented Features

### Middleware Stack

- **Security**: Helmet, CORS, rate limiting
- **Request Processing**: Body parsing, compression
- **Logging**: Winston with structured logging
- **Validation**: Zod with custom middleware for type-safe validation
- **Error Handling**: Centralized error handling with custom error classes

### Validation & Error Handling

- Environment validation using Zod schemas
- Input validation using Zod schemas with custom middleware
- Type-safe request validation with automatic data transformation
- Custom error classes with HTTP status codes
- Centralized error handling middleware
- Async error handling wrapper

### Database Layer

- Prisma ORM with MySQL
- Repository pattern for data access
- Connection pooling and query logging
- Migration support
- Environment-specific database seeding
- Password hashing with bcrypt (12 salt rounds)
- Idempotent seed operations (safe to run multiple times)
- Advanced search functionality with case-insensitive matching across multiple fields

### Testing Setup

- Jest configuration with TypeScript support
- Supertest for API testing
- Database cleanup between tests
- Path mapping for imports

### Development Tools

- Hot reload with tsx
- TypeScript path mapping
- ESLint with TypeScript support
- Prettier for code formatting
- Docker multi-stage builds

## Development Guidelines

### Architecture Patterns

- **Layered Architecture:** Controllers → Services → Repositories → Database
- **RESTful API Design:** Follow REST principles with consistent endpoint naming
- **Error Handling:** Use custom error classes and centralized error handling
- **Async Operations:** Use async/await with proper error handling wrappers

### Code Organization

- Place HTTP logic in controllers
- Keep business logic in services
- Handle data operations in repositories
- Use middleware for cross-cutting concerns
- Define TypeScript interfaces in models directory
- Implement validation in dedicated validators

### File Naming Conventions

- **Service files**: Use `module.service.ts` format (e.g., `user.service.ts`)
- **Repository files**: Use `module.repository.ts` format (e.g., `user.repository.ts`)
- **Controller files**: Use `module.controller.ts` format (e.g., `user.controller.ts`)
- **Route files**: Use `module.route.ts` format (e.g., `user.route.ts`)
- **All module files**: Use lowercase naming for consistency and cross-platform compatibility

### Security Best Practices

- Environment variable validation at startup
- Input validation on all endpoints
- Rate limiting with different tiers (general, API, strict)
- Security headers with Helmet
- CORS configuration
- SQL injection prevention through Prisma

### Testing Strategy

- Unit tests for services and utilities
- Integration tests for API endpoints
- Database cleanup between tests
- Test environment isolation

### Database Management

- Use Prisma for all database operations
- Define models in `prisma/schema.prisma`
- Run migrations for schema changes
- Use repository pattern for data access abstraction
- Implement soft deletes where appropriate
- Use environment-specific seeding for different deployment stages
- Seed database with `npm run db:seed` (idempotent operation)
- Reset and seed with `npm run db:reset` for clean state

### Containerization

- Multi-stage Docker builds for optimization
- Separate development and production configurations
- Health checks for containers
- Volume mounting for logs and data persistence
- Non-root user in production containers
- Comprehensive .dockerignore for minimal build context
- Production image size optimized (~198MB)

### Environment Management

- Validate all environment variables at startup
- Test database connectivity before server initialization
- Use Zod schemas for type-safe configuration
- Provide clear error messages for missing/invalid variables or connection failures
- Fail fast approach - server won't start with invalid configuration or database issues
- Maintain comprehensive `.env.example`

### Error Handling Best Practices

- Use custom error classes with meaningful messages
- Log errors with context (IP, user agent, request details)
- Return consistent error response format
- Handle both operational and programming errors
- Implement graceful shutdown for uncaught exceptions

### Performance Considerations

- Use compression middleware
- Implement request/response logging
- Configure appropriate rate limits
- Use connection pooling for database
- Implement caching strategies where appropriate

## Troubleshooting

### Common Issues

#### Build Errors

- **TypeScript compilation fails**: Run `npm run build` to see specific errors
- **Missing dependencies**: Run `npm install` to ensure all packages are installed
- **Path resolution issues**: Check that TypeScript path mapping is correctly configured in `tsconfig.json`

#### Environment Issues

- **Server won't start**: Verify all required environment variables are set in `.env`
- **Database connection fails**: Check `DATABASE_URL` format (mysql://username:password@host:port/database) and MySQL server accessibility
- **JWT secret too short**: Ensure `JWT_SECRET` is at least 32 characters

#### Code Quality Issues

- **ESLint errors**: Run `npm run lint:fix` to auto-fix issues
- **Code formatting**: Run `npm run prettier` to format code
- **Security vulnerabilities**: Run `npm audit fix` to update vulnerable packages

#### Test Issues

- **Tests won't run**: Ensure test database is configured and accessible
- **Module resolution in tests**: Check Jest configuration for path mapping
- **Test timeouts**: Increase `testTimeout` in `jest.config.js` if needed

### Development Workflow

1. **Before starting development**: Run setup commands and verify build
2. **During development**: Use `npm run dev` for hot reload
3. **Before committing**: Run `npm run lint`, `npm run prettier`, and `npm run build`
4. **Regular maintenance**: Run `npm audit` and `npm audit fix` for security

### Production Deployment

1. **Environment setup**: Ensure production environment variables are configured
2. **Database setup**: Run migrations and seed data if needed
3. **Build verification**: Test `npm run build` and `npm start`
4. **Security check**: Verify no vulnerabilities with `npm audit`
5. **Docker deployment**: Use `docker-compose up` for containerized deployment
