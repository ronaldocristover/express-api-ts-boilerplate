# Express TypeScript API Boilerplate

A production-ready Node.js Express.js REST API boilerplate built with TypeScript, featuring comprehensive middleware, validation, testing, and containerization setup.

## 🚀 Features

- **🏗️ Layered Architecture** - Clean separation of concerns with controllers, services, and repositories
- **🔒 Security First** - Helmet, CORS, rate limiting, input validation, and environment validation
- **📝 TypeScript** - Full TypeScript support with strict type checking
- **🗄️ Database** - MySQL with Prisma ORM, migrations, and seeding
- **🧪 Testing** - Jest with Supertest for comprehensive API testing
- **📊 Logging** - Winston logger with structured logging (Grafana-ready)
- **🐳 Docker** - Multi-stage builds with development and production configurations
- **🔍 Code Quality** - ESLint, Prettier, and pre-commit hooks
- **⚡ Performance** - Compression, request logging, and optimized middleware stack
- **🔧 Developer Experience** - Hot reload, path mapping, and comprehensive error handling

## 🛠️ Technology Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Runtime** | Node.js v18+ | JavaScript runtime |
| **Framework** | Express.js | Web application framework |
| **Language** | TypeScript | Type-safe JavaScript |
| **Database** | MySQL | Relational database |
| **ORM** | Prisma | Database toolkit and ORM |
| **Validation** | Zod | Environment and input validation |
| **Testing** | Jest + Supertest | Unit and integration testing |
| **Logging** | Winston | Structured logging |
| **Containerization** | Docker + Docker Compose | Container orchestration |
| **Code Quality** | ESLint + Prettier | Code linting and formatting |

## 📋 Prerequisites

- Node.js v18+ 
- MySQL database (v8.0 or higher recommended)
- npm package manager
- Docker (optional, for containerized development)

## ⚡ Quick Start

### 1. Clone and Install
```bash
git clone <repository-url>
cd boiler-express
npm install
```

### 2. Environment Setup
```bash
cp .env.example .env
# Edit .env with your MySQL database URL and JWT secret (32+ characters required)
# Example DATABASE_URL: mysql://root:password@localhost:3306/boiler_express
```

### 3. Database Setup
```bash
npm run db:generate  # Generate Prisma client
npm run db:migrate   # Run database migrations  
npm run db:seed      # Seed with initial data
```

### 4. Start Development
```bash
npm run dev         # Starts on http://localhost:3000
```

### 5. Verify Installation
```bash
npm run build       # Verify TypeScript compilation
npm run lint        # Verify code quality  
npm test           # Run test suite
```

## 🔧 Available Commands

### Development
```bash
npm run dev           # Start with hot reload
npm run build         # Build TypeScript
npm start            # Start production server
```

### Database Operations
```bash
npm run db:generate  # Generate Prisma client
npm run db:migrate   # Run migrations
npm run db:push      # Push schema to database
npm run db:studio    # Open Prisma Studio
npm run db:seed      # Seed database with initial data
npm run db:reset     # Reset database and run seed
```

### Code Quality & Testing
```bash
npm run lint         # Check code style
npm run lint:fix     # Fix code style issues
npm run prettier     # Format code
npm test            # Run tests
npm run test:watch  # Run tests in watch mode
npm audit           # Check for security vulnerabilities
npm audit fix       # Fix security vulnerabilities
```

### Docker
```bash
docker-compose up                          # Production environment
docker-compose -f docker-compose.dev.yml up  # Development environment
```

## 🌐 API Endpoints

### User Management
| Method | Endpoint | Description | Query Parameters |
|--------|----------|-------------|------------------|
| `GET` | `/api/v1/users` | List users with pagination | `page`, `limit`, `sortBy`, `sortOrder`, `q` |
| `GET` | `/api/v1/users/:id` | Get user by ID | - |
| `POST` | `/api/v1/users` | Create new user | - |
| `PUT` | `/api/v1/users/:id` | Update user | - |
| `DELETE` | `/api/v1/users/:id` | Delete user (soft delete) | `hard=true` for hard delete |

### System Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check |
| `GET` | `/api/v1` | API information |

## 🔐 Environment Variables

### Required Variables
- `DATABASE_URL` - MySQL connection string (format: mysql://username:password@host:port/database)
- `JWT_SECRET` - JWT signing secret (minimum 32 characters)

### Optional Variables (with defaults)
- `NODE_ENV` - Environment mode (development, production, test)
- `PORT` - Server port (3000)
- `HOST` - Server host (localhost)
- `JWT_EXPIRES_IN` - Token expiration (7d)
- `LOG_LEVEL` - Logging level (info)
- `RATE_LIMIT_WINDOW_MS` - Rate limit window (900000)
- `RATE_LIMIT_MAX_REQUESTS` - Max requests per window (100)
- `CORS_ORIGIN` - Allowed origins (http://localhost:3000)
- `API_VERSION` - API version prefix (v1)

## 🏗️ Project Structure

```
├── src/
│   ├── controllers/     # HTTP request/response handlers
│   ├── services/        # Business logic layer
│   ├── routes/          # API route definitions
│   ├── middlewares/     # Custom middleware
│   ├── validators/      # Input validation schemas
│   ├── repository/      # Data access layer
│   ├── models/          # TypeScript types & interfaces
│   ├── utils/           # Utility functions
│   ├── config/          # Configuration files
│   ├── app.ts          # Express application setup
│   └── server.ts       # Server initialization
├── tests/              # Unit & integration tests
├── prisma/             # Database schema and migrations
├── logs/               # Application logs
├── docker-compose.yml  # Production Docker setup
└── docker-compose.dev.yml  # Development Docker setup
```

## 🧪 Testing

The project includes comprehensive testing setup:

- **Unit Tests** - Test individual functions and methods
- **Integration Tests** - Test API endpoints end-to-end
- **Database Testing** - Isolated test database with cleanup
- **Mocking** - Service and repository layer mocking

### Test Structure
```bash
tests/
├── setup.ts           # Test environment setup
├── user.test.ts       # User API endpoint tests
└── __mocks__/         # Mock implementations
```

### Running Tests
```bash
npm test                # Run all tests
npm run test:watch     # Run tests in watch mode
npm test -- --coverage # Run with coverage report
```

## 🐳 Docker Development

### Development Environment
```bash
docker-compose -f docker-compose.dev.yml up
```

### Production Environment  
```bash
docker-compose up
```

### Features
- **Multi-stage builds** for optimized production images
- **Hot reload** in development containers
- **Volume mounting** for logs and data persistence
- **Health checks** for container monitoring
- **Non-root user** in production for security

## 🚨 Troubleshooting

### Common Issues

#### Build Errors
- **TypeScript compilation fails**: Run `npm run build` to see specific errors
- **Missing dependencies**: Run `npm install` to ensure all packages are installed
- **Path resolution issues**: Check TypeScript path mapping in `tsconfig.json`

#### Environment Issues
- **Server won't start**: Verify all required environment variables are set
- **Database connection fails**: Check `DATABASE_URL` format (mysql://username:password@host:port/database) and MySQL server accessibility  
- **JWT secret too short**: Ensure `JWT_SECRET` is at least 32 characters

#### Code Quality Issues
- **ESLint errors**: Run `npm run lint:fix` to auto-fix issues
- **Code formatting**: Run `npm run prettier` to format code
- **Security vulnerabilities**: Run `npm audit fix` to update packages

## 📈 Performance Considerations

- **Compression** - Automatic response compression
- **Rate Limiting** - Configurable rate limits per endpoint type
- **Request Logging** - Structured logging with response times
- **Connection Pooling** - Optimized database connections
- **Error Handling** - Centralized error handling with proper HTTP status codes

## 🔐 Security Features

- **Environment Validation** - Startup validation using Zod schemas
- **Input Validation** - Comprehensive request validation
- **Rate Limiting** - Multiple rate limiting tiers
- **Security Headers** - Helmet.js security headers
- **CORS** - Configurable CORS policies  
- **SQL Injection Prevention** - Prisma ORM protection
- **Password Hashing** - bcrypt with configurable salt rounds

## 📝 Development Workflow

1. **Before Development**: Run setup commands and verify build
2. **During Development**: Use `npm run dev` for hot reload
3. **Before Committing**: Run `npm run lint`, `npm run prettier`, `npm run build`
4. **Regular Maintenance**: Run `npm audit` and `npm audit fix`

## 🚀 Production Deployment

1. **Environment Setup**: Configure production environment variables
2. **Database Setup**: Run migrations and seed data if needed
3. **Build Verification**: Test `npm run build` and `npm start`
4. **Security Check**: Verify no vulnerabilities with `npm audit`
5. **Container Deployment**: Use `docker-compose up` for production

## 📚 Additional Resources

- **Database Seeding**: See `prisma/README.md` for seeding documentation
- **API Documentation**: Generate with tools like Swagger/OpenAPI
- **Monitoring**: Winston logs are Grafana-ready for monitoring setup
- **Architecture**: Follow the layered architecture pattern documented in code

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make changes following the coding standards
4. Run tests and linting: `npm test && npm run lint`
5. Commit changes: `git commit -m 'Add feature'`
6. Push to branch: `git push origin feature-name`
7. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**🚀 Ready to build amazing APIs!** Start developing with `npm run dev` and check the health endpoint at `http://localhost:3000/health`