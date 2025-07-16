
# -------- STAGE 1: Builder --------
FROM node:18 AS builder

# Set working directory
WORKDIR /app

# update environment
ENV NODE_ENV=production

# Copy dependency files and install all dependencies
COPY package*.json ./
RUN npm install

# Copy the entire app (TypeScript source)
COPY . .

# Build TypeScript (and optionally copy other folders like mails)
RUN npm run build

# -------- STAGE 2: Production Image --------
FROM node:18

WORKDIR /app

# Copy only production dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy built files and required runtime assets from builder
COPY --from=builder /app/build ./build
COPY --from=builder /app/mails ./mails

# Expose the server port
EXPOSE 8000

# Start the server
CMD ["node", "build/server.js"]

