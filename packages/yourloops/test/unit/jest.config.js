const commonJestConfig = require('../common-jest.config')
module.exports = {
  ...commonJestConfig,

  displayName: 'yourloops unit',

  // The glob patterns Jest uses to detect test files
  testMatch: [
    '<rootDir>/**/*.test.*'
  ]
}
