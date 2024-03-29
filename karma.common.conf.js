/**
 * Copyright (c) 2021, Diabeloop
 * Karma test configuration file
 *
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

const path = require('path')
const _ = require('lodash')

const isWSL = _.isString(process.env.WSL_DISTRO_NAME)
const browsers = ['CustomChromeHeadless']
if (!isWSL) {
  browsers.push('FirefoxHeadless')
}

const defaultConfig = {
  autoWatch: false,
  port: '8080',
  browserNoActivityTimeout: 60000,
  captureTimeout: 60000,
  colors: true,
  concurrency: 1,
  singleRun: true,
  browsers,
  customLaunchers: {
    CustomChromeHeadless: {
      base: 'ChromeHeadless',
      flags: [
        '--enable-automation',
        '--no-default-browser-check',
        '--no-first-run',
        '--disable-default-apps',
        '--disable-popup-blocking',
        '--disable-translate',
        '--disable-background-timer-throttling',
        '--disable-renderer-backgrounding',
        '--disable-device-discovery-notifications',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--headless',
        '--no-sandbox',
        '--remote-debugging-port=9222'
      ]
    }
  },
  junitReporter: {
    logReport: false,
    name: 'yourloops',
    filename: 'junit.xml'
  },
  mime: {
    'text/x-typescript': ['ts', 'tsx']
  },
  frameworks: ['mocha'],
  reporters: ['mocha', 'junit'],
  webpackMiddleware: {
    noInfo: true,
    stats: 'errors-only'
  },
  plugins: [
    'karma-*',
    require('./karma.junit.reporter')
  ]
}

let updatedConfig = null

/**
 * @param {string} projectName "yourloops" | "blip" | "viz" | "tideline"
 * @param {object} karmaConfig To override the default config
 * @param {object} webpackConfig Project webpack config
 * @param {boolean} typescriptProject true for typescript project
 */
function updateDefaultConfig(projectName, karmaConfig, webpackConfig, typescriptProject = false) {
  delete webpackConfig.entry
  delete webpackConfig.output
  webpackConfig.devtool = 'inline-source-map'
  if (typescriptProject) {
    webpackConfig.module.rules[0].options = { configFile: 'test/tsconfig.test.json' }
  }
  updatedConfig = _.defaultsDeep(karmaConfig, defaultConfig)

  // special config for unit test debug
  if (process.env.DEBUG_UNIT_TEST === 'true') {
    // since we're in debug, we do not want to run tests in headless
    // we wait for a manual chrome visit to localhost:9876 to start tests
    updatedConfig.browsers = []
    updatedConfig.customLaunchers = {}
    updatedConfig.port = '9876'
    updatedConfig.reporters = ['mocha', 'junit', 'progress']
  }

  updatedConfig.files.unshift('../../node-compat.js')
  updatedConfig.files.unshift('../../branding/**/*.css')
  updatedConfig.webpack = webpackConfig
  updatedConfig.junitReporter.name = projectName
  updatedConfig.junitReporter.filename = path.join(__dirname, `reports/${projectName}.junit.xml`)
}

/**
 * The export function to return by karma.conf.js
 * @param {object} config
 */
function setKarmaConfig(config) {
  updatedConfig.logLevel = config.LOG_INFO
  config.set(updatedConfig)
}

module.exports = { updateDefaultConfig, setKarmaConfig }
