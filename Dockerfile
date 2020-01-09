FROM node:9-alpine

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY index.js .
COPY server.js .
COPY multas.js .
COPY passport.js .
COPY setupbd.js .
COPY apikeys.js .
COPY db.js .
COPY swagger-doc.js .

EXPOSE 3000

CMD npm start