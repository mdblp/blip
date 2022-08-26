## Running the tests

The tests are run using [Jest](https://jestjs.io/). The components rendering and elements querying is done
using [React Testing Library](https://testing-library.com/).
It is advised to use Goland or webstorm to run unit tests. The test configurations should automatically be created,
otherwise, simply create a new Jest configuration that points to `blip/packages/yourloops/test/unit/jest.config.js`
or `blip/packages/yourloops/test/integration/jest.config.js`.

Running all the test will display a code coverage reports at the bottom on the console. This reports can also be
accessible from a web browser by navigating to the file found
in `blip/packages/yourloops/test/unit/coverage/lcov-report/index.html`
or `blip/packages/yourloops/test/integration/coverage/lcov-report/index.html`.

The test can also be run from the command line with `npm run test-yourloops`.
