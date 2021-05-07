import * as lambda from 'aws-lambda';
import { dbMigrate } from './lib/dbmigrate';

export const runMigration: lambda.APIGatewayProxyHandler = async () => {
  await dbMigrate();
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/plain' },
    body: 'Successful db-migrations.',
  };
};
