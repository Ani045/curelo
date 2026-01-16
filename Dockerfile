
# Stage 1: Build the application
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
# This generates the 'dist' folder that the API server will serve
RUN npm run build

# Start the application using the Node.js server
# This script starts both the API and serves the frontend from 'dist'
EXPOSE 3001
CMD ["npm", "run", "dev:api"]
