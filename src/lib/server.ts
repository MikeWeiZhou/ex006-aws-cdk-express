import 'reflect-metadata';
import http from 'http';
import express from 'express';
import { Connection, ConnectionOptions, createConnection } from 'typeorm';
import mainRouter from '../common/main.router';

/**
 * Express API server.
 */
export class Server {
  /**
   * Express API app instance.
   */
  private readonly app: express.Express;

  /**
   * Port used to listen for requests.
   */
  private readonly apiPort: number;

  /**
   * Database connection options.
   */
  private readonly connectionOptions?: ConnectionOptions;

  /**
   * Is server started?
   */
  private started: boolean;

  /**
   * http.Server instance.
   */
  private server?: http.Server;

  /**
   * Database connection.
   */
  private connection?: Connection;

  /**
   * Create a new API server.
   * @param apiPort port used to listen for requests
   * @param [connectionOptions] database connections options, defaults to options in ORM config file
   */
  constructor(apiPort: number, connectionOptions?: ConnectionOptions) {
    this.app = express();
    this.apiPort = apiPort;
    this.connectionOptions = connectionOptions;
    this.started = false;

    // parse application/json
    this.app.use(express.json());

    // setup routes
    this.app.use(mainRouter);
  }

  /**
   * Start server.
   */
  async start(): Promise<void> {
    if (this.started) {
      return;
    }
    this.started = true;

    // create database connection pool
    // connection is stored in TypeORM Connection Manager
    if (this.connectionOptions) {
      this.connection = await createConnection(this.connectionOptions);
    } else {
      this.connection = await createConnection();
    }

    // listen for requests on specified port
    this.server = this.app.listen(this.apiPort, () => {
      console.log(`Express API server running on port ${this.apiPort}.`); // eslint-disable-line no-console
    });
  }

  /**
   * Stop server.
   */
  stop(): void {
    if (!this.started) {
      return;
    }
    this.started = false;

    // close server listener and connections
    this.server?.close(async () => {
      await this.connection?.close();
      this.connection = undefined;
    });
    this.server = undefined;
  }
}
