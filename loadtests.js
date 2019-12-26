require('@babel/polyfill');
require('intl/locale-data/jsonp/en.js');

const enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-15');

enzyme.configure({
  adapter: new Adapter(),
  disableLifecycleMethods: true,
});

// Load .js files in /test excluding *.trending*.js
const context = require.context('./test', true, /\/(?!.*trends).*\js$/); 
// eslint-disable-next-line lodash/prefer-lodash-method
context.keys().forEach(context);
