# Use official Node.js 20 LTS image as the base
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies first (better caching)
COPY package*.json ./
RUN npm ci

# Copy all source files
COPY . .

# Required at build time for next.config.ts rewrites
ENV NEXT_PUBLIC_API_BASE_URL="http://200.69.13.70:5030"

# Build the Next.js app
RUN npm run build

# ---- Production image ----
FROM node:20-alpine AS runner

WORKDIR /app

# Don't run as root
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# Copy only the necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Set env for production
ENV NEXT_PUBLIC_API_BASE_URL="http://200.69.13.70:5030"
ENV NODE_ENV=production
ENV PORT=8080

# Expose Cloud Run's default port
EXPOSE $PORT

# Start the Next.js app
CMD ["npm", "start"]
