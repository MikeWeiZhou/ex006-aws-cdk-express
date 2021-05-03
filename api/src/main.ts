import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

const app = express();

app.get('/', (req: express.Request, res: express.Response) => {
  res.send('Hello world!');
});
app.listen(process.env.API_PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Express API server running on port ${process.env.API_PORT}.`);
});
