FROM node:alpine3.19

WORKDIR /app

COPY . /app/

RUN chmod +x start.sh

RUN npm install