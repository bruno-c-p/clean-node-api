FROM node:22-slim
WORKDIR /usr/src/clean-node-api
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build