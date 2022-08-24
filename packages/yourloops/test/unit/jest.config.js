const commonJestConfig = require('../common-jest.config')
module.exports = {
  ...commonJestConfig,
  // ...
  // An array of glob patterns indicating a set of files for which coverage information should be collected
  collectCoverageFrom: [
    '<rootDir>/../app/**/**.ts*',
    '<rootDir>/../components/**/**.ts*',
    '<rootDir>/../lib/**/**.ts*',
    '<rootDir>/../models/**/**.ts*',
    '<rootDir>/../pages/**/**.ts*',
    '<rootDir>/../services/**/**.ts*'
  ],
  displayName: 'yourloops unit',

  // The glob patterns Jest uses to detect test files
  testMatch: [
    '<rootDir>/**/*.test.tsx'
  ]
}
