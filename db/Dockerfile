FROM node:14.16.1-alpine

WORKDIR /db-migrate
COPY . .

RUN npm install

# Run db-migrate up and exit
CMD npx db-migrate up