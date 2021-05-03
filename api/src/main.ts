import express from 'express';

const app = express();

app.get('/', (req: express.Request, res: express.Response) => {
  res.send('Hello world!');
});
app.listen(process.env.EAR_API_PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Express API server running on port ${process.env.EAR_API_PORT}.`);
});
