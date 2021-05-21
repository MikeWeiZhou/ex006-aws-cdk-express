#!/usr/bin/env node
/* eslint-disable no-console */
import { serverConfig, typeormConfig } from './config';
import { Server } from './core/server';
import { mainRouter } from './main.router';

const server = new Server(
  serverConfig.apiPort,
  mainRouter,
  typeormConfig,
);
server.start();

process.on('SIGTERM', async () => {
  console.log('Shutting down server.');
  await server.stop();
});
process.on('SIGINT', async () => {
  console.log('Shutting down server.');
  await server.stop();
});
