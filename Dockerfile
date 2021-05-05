FROM node:14.16.1-alpine

WORKDIR /api
COPY . .

# Build API server
RUN npm install
RUN npx tsc

# Expose API port to linked services (not host)
EXPOSE $EAR_API_PORT

# Run API server
CMD node ./dist/main.js