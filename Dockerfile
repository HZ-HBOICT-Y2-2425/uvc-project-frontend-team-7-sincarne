# Step 1: Build the SvelteKit app
FROM node:20 AS build

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./
RUN npm install

# Copy the source code
COPY . .

# Build the app
RUN npm run build

# Step 2: Set up the production server
FROM node:20-slim

WORKDIR /app

# Install production dependencies
COPY --from=build /app/package*.json ./
RUN npm install --production

# Copy the build output
COPY --from=build /app/build /app/build

# Expose port 3000 (default for Node.js apps)
EXPOSE 3000

# Start the app using Node.js
CMD ["node", "build"]
