FROM node:14.16.1-alpine

WORKDIR /db-migrate
COPY . .

RUN npm install

CMD ["npm", "run", "db-migrate"]