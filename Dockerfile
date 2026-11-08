# Use official Node.js LTS image
FROM node:20-slim

# Create app directory
WORKDIR /usr/src

# Install app dependencies
COPY backend/package*.json ./backend/
WORKDIR /usr/src/backend
RUN npm ci

# Copy full application code (both backend and frontend)
WORKDIR /usr/src
COPY . .

# Expose port
EXPOSE 3000

WORKDIR /usr/src/backend
CMD [ "npm", "start" ]
