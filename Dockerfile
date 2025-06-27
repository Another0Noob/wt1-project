# Use official Node.js LTS image
FROM node:lts

# Set working directory
WORKDIR /app

# Copy package.json and lock file first
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy rest of the code
COPY . .

# Build the Next.js app
RUN npm run build

# Expose default Next.js port
EXPOSE 3000

# Start the app in production mode
CMD ["npm", "start"]
