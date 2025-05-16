FROM node:22

WORKDIR /usr/src/clean-node-api

COPY ./package*.json .
ENV HUSKY=0
RUN npm ci