# Use official Node.js LTS image
FROM node:20-slim

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies by copying package.json and package-lock.json
COPY package*.json ./

# Install production dependencies (or all dependencies if build scripts need them)
RUN npm ci

# Bundle app source
COPY . .

# Expose the port your Express app runs on
EXPOSE 3000

# Start the application
CMD [ "npm", "start" ]
