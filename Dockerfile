# Use an official Node.js runtime as a parent image
FROM node:20-alpine AS builder

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application's code
COPY . .

# Build the Next.js application
RUN npm run build

# ---
# Second stage: create a smaller image for production
FROM node:20-alpine AS runner

WORKDIR /app

# Set the environment to production and disable telemetry
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED 1

# Expose the port the app runs on (Cloud Run / Firebase App Hosting standard)
ENV PORT 8080
EXPOSE 8080

# Copy necessary files from builder stage
# Automatically leverages output: 'standalone' from next.config.js
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# The command to run the application using the standalone server
CMD ["node", "server.js"]
