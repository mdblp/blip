const commonJestConfig = require('../common-jest.config')
module.exports = {
  ...commonJestConfig,

  displayName: 'yourloops integration',

  maxWorkers: '30%',

  // The glob patterns Jest uses to detect test files
  testMatch: [
    '<rootDir>/**/*.spec.tsx'
  ]
}
