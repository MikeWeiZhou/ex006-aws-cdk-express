FROM node:14.16.1-alpine

WORKDIR /api
COPY . .

RUN npm ci
RUN npx tsc
RUN chmod +x ./dist/main.js

EXPOSE $EAR_API_PORT

CMD ["./dist/main.js"]