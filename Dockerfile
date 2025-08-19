# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies for building)
RUN npm ci && npm cache clean --force

# Copy TypeScript configuration first
COPY tsconfig.json ./

# Copy source code
COPY src ./src
COPY prisma ./prisma

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Production dependencies stage
FROM node:18-alpine AS deps

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev && npm cache clean --force

# Production stage
FROM node:18-alpine AS production

# Create app directory
WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# Install curl for health checks
RUN apk add --no-cache curl

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/dist ./dist
COPY --from=deps --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package*.json ./
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

# Create logs directory
RUN mkdir -p logs && chown nextjs:nodejs logs

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Start the application
CMD ["node", "dist/server.js"]