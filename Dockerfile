# Use the official Node.js runtime as a parent image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Install required build tools for bcrypt and other native dependencies
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    bash \
    && python3 --version \
    && npm install -g node-gyp

# Copy package.json and package-lock.json files to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the tsconfig.json and .env file into the container
COPY tsconfig.json ./
COPY .env ./

# Copy the source code into the container
COPY ./src ./src

# Expose the port the app will run on
EXPOSE 5000

# Run the application using npm run dev (for development)
CMD ["npm", "run", "dev"]
