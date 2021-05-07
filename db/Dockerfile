FROM amazon/aws-lambda-nodejs:14

COPY . .

RUN npm install
RUN npx tsc

# Specify lambda function handler
# file "lambda.js", "runMigration" function
CMD ["lambda.runMigration"]