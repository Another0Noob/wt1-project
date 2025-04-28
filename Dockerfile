FROM node:lts AS builder
WORKDIR /home/node
COPY package.json package-lock.json /home/node/
RUN npm install --production
COPY . /home/node/

# Production stage
FROM node:lts-slim
WORKDIR /home/node
COPY --from=builder /home/node /home/node
EXPOSE 3001
CMD ["node", "index.js"]