module.exports = {
  verbose: true,
  roots: ['<rootDir>/tests'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@ear/(.*)$': '<rootDir>/src/$1',
    '^@ear-tests/(.*)$': '<rootDir>/tests/$1',
  },
};
