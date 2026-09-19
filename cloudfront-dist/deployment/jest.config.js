/**
 * Jest configuration for the CloudFront deployment CDK app.
 *
 * These tests synthesize the stacks and assert on the resulting CloudFormation
 * template. They run entirely offline: no AWS credentials, no network, and no
 * built `dist/` directory (the stacks take their asset paths as a constructor
 * argument, so the tests point them at `test/fixtures/dist`).
 */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/test'],
  testMatch: ['**/*.test.ts'],
  snapshotSerializers: ['<rootDir>/test/setup/snapshot-serializer.js'],
  collectCoverageFrom: ['lib/**/*.ts', 'bin/**/*.ts'],
  coverageReporters: ['text', 'lcov'],
  // Synthesis stages assets to a temp dir; the default 5s is tight on cold CI runners.
  testTimeout: 30000
}