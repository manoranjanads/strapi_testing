FROM node:12-alpine

RUN mkdir -p /app
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . /app
RUN npm run build

CMD npm run start
