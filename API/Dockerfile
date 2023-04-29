FROM node:14-alpine AS builder

# Install perf
RUN apk add --no-cache linux-tools

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Build the app
RUN npm run build

# Production image
FROM node:14-alpine AS production

# Install perf
RUN apk add --no-cache linux-tools

# Create app directory
WORKDIR /usr/src/app

# Install only production dependencies
COPY package*.json ./
RUN npm install --production

# Copy the build files from the builder image
COPY --from=builder /usr/src/app/dist ./dist

# Expose port
EXPOSE 3000

# Start the app
CMD ["node", "dist/server.js"]
# CMD ["sh", "-c", "perf record -e cycles:u -g -- node --perf-basic-prof dist/server.js && perf script > perf.out"]
