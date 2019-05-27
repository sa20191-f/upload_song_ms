FROM node:10-alpine

RUN mkdir -p /home/app

RUN mkdir -p /home/app/songs

WORKDIR /home/app

COPY package.json package.json

RUN npm install

COPY  . .

CMD [ "node", "index.js" ]