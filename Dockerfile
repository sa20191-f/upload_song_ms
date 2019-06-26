FROM node:10-alpine

RUN mkdir -p /home/app

RUN mkdir -p /home/app/songs

WORKDIR /home/app

COPY package.json package.json

RUN npm install

COPY  . .

EXPOSE 3002

CMD [ "node", "index.js" ]