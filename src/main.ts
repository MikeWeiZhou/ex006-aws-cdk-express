#!/usr/bin/env node
import express from 'express';
import mysql from 'mysql2/promise';

const app = express();

const connectionOptions = {
  host: process.env.EAR_DB_HOST,
  port: Number.parseInt(process.env.EAR_DB_PORT!, 10),
  user: process.env.EAR_DB_USER,
  database: process.env.EAR_DB_NAME,
  password: process.env.EAR_DB_PASSWORD,
};

app.get('/', async (req: express.Request, res: express.Response) => {
  const results = await mysql.createConnection(connectionOptions)
    .then((conn) => conn.query('SHOW TABLES;'));
  res.send(results);
});
app.listen(process.env.EAR_API_PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Express API server running on port ${process.env.EAR_API_PORT}.`);
});
