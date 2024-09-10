# Stage 1: Build the React app
FROM node:18 AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the React app
RUN npm run build

# Stage 2: Serve the app using Express
FROM node:18

# Set the working directory
WORKDIR /app

# Copy the build output and server.js from the build stage
COPY --from=build /app/build ./build
COPY server.js ./

# Install Express
RUN npm install express

# Expose the port that the app will run on
EXPOSE 5001

# Start the application
CMD ["node", "server.js"]