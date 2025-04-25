FROM node:lts

WORKDIR /home/node
COPY package.json package-lock.json /home/node/
EXPOSE 3001