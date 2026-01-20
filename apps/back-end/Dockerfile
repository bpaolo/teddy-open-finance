# Dockerfile for Backend Application
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY apps/back-end/package.json ./apps/back-end/
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
COPY apps/back-end ./apps/back-end
COPY libs ./libs

# Sync workspace and build the backend application
RUN npx nx sync || true
RUN npx nx build back-end --prod

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy built application
COPY --from=builder /app/apps/back-end/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

# Create a minimal package.json without "type": "module" for CommonJS build
RUN echo '{"name":"@org/back-end","version":"0.0.1","private":true,"main":"dist/main.js"}' > package.json

EXPOSE 3000

CMD ["node", "dist/main.js"]


