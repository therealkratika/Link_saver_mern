FROM node:20-alpine

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the server code
COPY . .

EXPOSE 5000

# Using dev mode as per your previous setup
CMD ["npm", "run", "dev"]