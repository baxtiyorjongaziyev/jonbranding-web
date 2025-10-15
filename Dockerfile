# --- Dockerfile ---
# Use the official lightweight Node.js 20 image.
# https://hub.docker.com/_/node
FROM node:20-alpine AS base

# 1. ---- Builder ----
FROM base AS builder
# Set working directory
WORKDIR /app
# Copy package.json and package-lock.json
COPY package*.json ./
# Install dependencies
RUN npm ci
# Copy all other files
COPY . .
# Build the Next.js application
RUN npm run build

# 2. ---- Runner ----
FROM base AS runner
WORKDIR /app

# Set environment variables
ENV NODE_ENV=production

# Copy necessary files from the builder stage
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Expose the port the app runs on
EXPOSE 8080

# Command to run the application
CMD ["node", "server.js"]
