const {
  EAR_TEST_API_HOST,
  EAR_TEST_API_PORT,
} = process.env;

export default {
  /**
   * Base URL of API server, includes port.
   */
  baseUrl: `http://${EAR_TEST_API_HOST}:${EAR_TEST_API_PORT}`,
};
