import cors from 'cors';
import express, { Router } from 'express';
import http from 'http';
import 'reflect-metadata';
import { Connection, ConnectionOptions, createConnection } from 'typeorm';
import { ErrorHandler } from './error-handler';

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
  private readonly connectionOptions: ConnectionOptions;

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
   * @param router router used for server
   * @param connectionOptions database connections options
   */
  constructor(apiPort: number, router: Router, connectionOptions: ConnectionOptions) {
    this.app = express();
    this.apiPort = apiPort;
    this.connectionOptions = connectionOptions;
    this.started = false;

    // allow cross-origin requests from anyone
    this.app.use(cors());

    // parse application/json
    this.app.use(express.json());

    // setup routes
    this.app.use(router);

    // error handlers
    this.app.use(ErrorHandler.NotFoundHandler);
    // must be last to register to become the global Express error handler
    this.app.use(ErrorHandler.GeneralErrorHandler);
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
    this.connection = await createConnection(this.connectionOptions);

    // listen for requests on specified port
    this.server = this.app.listen(this.apiPort, () => {
      console.log(`Express API server running on port ${this.apiPort}.`); // eslint-disable-line no-console
    });

    // ensure all inactive connections are terminated by the ALB, by setting this a few seconds
    // higher than the ALB idle timeout
    this.server.keepAliveTimeout = 65000;
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
