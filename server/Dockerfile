# Build stage
FROM node:20-alpine AS builder

# Install Python and dependencies for audio generation
RUN apk add --no-cache python3 py3-pip py3-uv

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package.json ./

# Install dependencies using npm
RUN npm install

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM node:20-alpine AS runner

# Install curl for healthcheck and Python for audio generation
RUN apk add --no-cache curl python3 py3-pip py3-uv

# Install Python dependencies for audio generation
RUN pip3 install --no-cache-dir --break-system-packages gradio_client

# Create app directory
WORKDIR /usr/src/app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# Copy package files
COPY package.json ./

# Install only production dependencies using npm
RUN npm install --production

# Copy built application from builder stage
COPY --from=builder /usr/src/app/dist ./dist

# Copy audio generation scripts
COPY shell/audio.py ./shell/audio.py

# Set proper permissions
RUN chown -R nestjs:nodejs /usr/src/app
USER nestjs

# Expose port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production

# Start application
CMD ["node", "dist/main"]
