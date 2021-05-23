/**
 * Server configuration.
 */
export const serverConfig = {
  /**
   * Port used for listening to requests.
   */
  apiPort: Number.parseInt(process.env.EAR_API_PORT!, 10),
};
