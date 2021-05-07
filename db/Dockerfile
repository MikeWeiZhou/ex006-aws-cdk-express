FROM amazon/aws-lambda-nodejs:14

COPY . .

RUN npm ci
RUN npx tsc

# Lambda function handler:
# file "lambda.js", "runMigration" function
CMD ["lambda.runMigration"]