#!/usr/bin/env node
/* eslint-disable no-console */
import 'reflect-metadata';
import { Server } from './lib/server';

const apiPort = Number.parseInt(process.env.EAR_API_PORT!, 10);

const server = new Server(apiPort);
server.start();

process.on('SIGTERM', async () => {
  console.log('Shutting down server.');
  await server.stop();
});
process.on('SIGINT', async () => {
  console.log('Shutting down server.');
  await server.stop();
});
