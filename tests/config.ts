const {
  EAR_TEST_API_HOST,
  EAR_TEST_API_PORT,
} = process.env;

/**
 * Test configuration.
 */
export default {
  /**
   * Base URL of API server, includes port.
   */
  baseUrl: `http://${EAR_TEST_API_HOST}:${EAR_TEST_API_PORT}`,

  /**
   * Automatically delete created resources after test runs successfully.
   */
  cleanup: true,
};
