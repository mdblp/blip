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

## TypeScript declaration files
Declaration files in TypeScript are files where the code of a file is described and documented.
It's also very helpful for the IDE to understand the codebase of your project.
These files have the extension `.d.ts` and can look like this :
```typescript
declare const count: number
declare const getLastCount: () => number
declare function getUserName(id: string): Promise<string>
```
In Blip project we still have some Javascript files with undocumented code. Fortunately TypeScript is able to generate declaration files from Javascript.
To do this run this following command
```
npx -p typescript tsc {PATH/TO/FILES} --declaration --allowJs --emitDeclarationOnly --outDir {OUTPUT/DIRECTORY}
```
Here is an example to generate all definition files for the blip plugins in Tideline package to a folder types (created at the root of the project)
```
npx -p typescript tsc packages/tideline/plugins/blip/**/*.js --declaration --allowJs --emitDeclarationOnly --outDir types
```
