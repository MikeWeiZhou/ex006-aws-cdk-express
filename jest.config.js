module.exports = {
  verbose: true,
  roots: ['<rootDir>/tests'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  globals: {
    apiSocketAddress: `http://localhost:${process.env.EAR_TEST_API_PORT}`,
  },
};
