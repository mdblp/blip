const commonJestConfig = require('../common-jest.config')
module.exports = {
  ...commonJestConfig,
  // ...
  // An array of glob patterns indicating a set of files for which coverage information should be collected
  collectCoverageFrom: [
    '<rootDir>/../**/**.spec.ts*'
  ],
  displayName: 'yourloops integration',

  // The glob patterns Jest uses to detect test files
  testMatch: [
    '<rootDir>/**/*.spec.tsx'
  ]
}
