import * as fs from 'fs';
import * as path from 'path';
import { Router } from 'express';

/**
 * Utility library to help combine all module routers into a single router.
 */
export class RouterAggregator {
  /**
   * Allowed router file extensions.
   * The application can be run in development mode (TS) or in production mode (JS).
   * @default "['ts', 'js']"
   */
  private readonly routerFileExtensions = ['ts', 'js'];

  /**
   * Filename suffix of the router file, excluding file extension.
   * @default "router"
   */
  private readonly routerFileSuffix;

  /**
   * Absolute path to the modules directory.
   * @default ".../src/modules" (... is absolute path to project's root directory)
   */
  private readonly modulesDirectory;

  /**
   * Create new RouterAggregator.
   * @param [routerFileSuffix] Router filename suffix without extension; default 'router'
   * @param [modulesDirectory] Absolute path to the modules directory; default '.../src/modules'
   */
  constructor(routerFileSuffix?: string, modulesDirectory?: string) {
    this.routerFileSuffix = routerFileSuffix ?? 'router';
    this.modulesDirectory = modulesDirectory ?? path.join(__dirname, '../modules');
  }

  /**
   * Returns a single router that combines all indidivual module routers.
   * @param [urlPathPrefix] URL prefix for all aggregated routers, defaults to '/'
   * @returns aggregated router
   */
  async aggregate(urlPathPrefix?: string): Promise<Router> {
    const urlPrefix = urlPathPrefix ?? '/';

    const aggregateRouter = Router();
    const moduleNames = await this.modules();
    const moduleRouterPromises = moduleNames.map((moduleName) => this.router(moduleName));
    const moduleRouters = await Promise.all(moduleRouterPromises);
    moduleRouters.forEach((moduleRouter) => {
      aggregateRouter.use(urlPrefix, moduleRouter);
    });
    return aggregateRouter;
  }

  /**
   * Returns a list of module names.
   * @returns list of module names
   */
  private async modules(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      fs.readdir(this.modulesDirectory, { withFileTypes: true }, (err, files) => {
        if (err) {
          return reject(err);
        }
        const list = files
          .filter((file) => file.isDirectory())
          .map((file) => file.name);
        return resolve(list);
      });
    });
  }

  /**
   * Returns an Express Router for a given module.
   * @param moduleName Name of module (folder name)
   * @returns Express Router
   */
  private async router(moduleName: string): Promise<Router> {
    return new Promise((resolve, reject) => {
      const moduleDirectory = path.join(this.modulesDirectory, moduleName);
      fs.readdir(moduleDirectory, async (err, filenames) => {
        if (err) {
          return reject(err);
        }

        const filenameRegExp = new RegExp(
          // e.g. company.router.(ts|js)
          `${moduleName}.${this.routerFileSuffix}.(${this.routerFileExtensions.join('|')})`,
          'g',
        );
        const routerFilename = filenames.find((filename) => filenameRegExp.test(filename));

        if (routerFilename === undefined) {
          return reject(new Error(`Router file not found for module: ${moduleName}`));
        }

        const routerFilePath = path.join(moduleDirectory, routerFilename);
        const router = (await import(routerFilePath)).default;
        return resolve(router);
      });
    });
  }
}
