# Multi-stage build for Frontend Application
FROM node:20-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY apps/front-end/package.json ./apps/front-end/
COPY nx.json ./
COPY tsconfig.base.json ./

# Install dependencies
RUN npm ci --legacy-peer-deps

# Build application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules

# Copy only necessary files for build
COPY package*.json ./
COPY nx.json ./
COPY tsconfig.base.json ./
COPY tsconfig.json ./
COPY apps/front-end ./apps/front-end
COPY libs ./libs

# Sync workspace and build the frontend application
RUN npx nx sync || true
RUN npx nx build front-end --prod

# Production image with Nginx
FROM nginx:alpine AS runner

# Copy built files to nginx
COPY --from=builder /app/apps/front-end/dist /usr/share/nginx/html

# Copy nginx configuration
COPY apps/front-end/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]


