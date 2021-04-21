const webpackConf = require('./webpack.config.js');

webpackConf.externals = {
  cheerio: 'window',
  'react/addons': true,
  'react/lib/ExecutionEnvironment': true,
  'react/lib/ReactContext': true,
};

webpackConf.devtool = 'inline-source-map';

webpackConf.output = {
  filename: '[name]',
};

const isWSL = typeof process.env.WSL_DISTRO_NAME === 'string';
const browsers = ['CustomChromeHeadless'];
if (!isWSL) {
  browsers.push('FirefoxHeadless');
}

module.exports = function karmaConfig(config) {
  config.set({
    autoWatch: true,
    browserNoActivityTimeout: 60000,
    browsers,
    captureTimeout: 60000,
    colors: true,
    concurrency: 1,
    coverageReporter: {
      dir: 'coverage/',
      reporters: [
        { type: 'html' },
      ],
    },
    customLaunchers: {
      CustomChromeHeadless: {
        base: 'ChromeHeadless',
        flags: [
          '--headless',
          '--disable-gpu',
          '--no-sandbox',
          '--remote-debugging-port=9222',
        ],
      },
    },
    files: [
      'loadtests.js',
    ],
    frameworks: ['mocha', 'chai', 'sinon'],
    logLevel: config.LOG_INFO,
    preprocessors: {
      'loadtests.js': ['webpack', 'sourcemap'],
    },
    reporters: ['mocha', 'coverage'],
    singleRun: true,
    webpack: webpackConf,
    webpackMiddleware: {
      noInfo: true,
      stats: 'errors-only',
    },
  });
};
