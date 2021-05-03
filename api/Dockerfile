FROM node:14.16.1-alpine

WORKDIR /api
COPY . .

RUN npm install
RUN npm run lint
RUN npm run build

EXPOSE $API_PORT

CMD ["npm", "start"]