FROM node:lts

WORKDIR /home/node

# Copy package.json and package-lock.json
COPY package.json package-lock.json /home/node/

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . /home/node/

# Expose the application port
EXPOSE 3001

# Start the application
CMD ["npm", "start"]