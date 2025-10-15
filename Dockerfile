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

# Set the environment to production
ENV NODE_ENV=production

# Copy the built app from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Expose the port the app runs on
EXPOSE 8080

# The command to run the application
CMD ["npm", "start"]
