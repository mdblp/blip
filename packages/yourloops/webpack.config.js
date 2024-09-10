/*
 * Copyright (c) 2022-2024, Diabeloop
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
/* eslint-disable @typescript-eslint/no-var-requires */
const _ = require('lodash')
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { SubresourceIntegrityPlugin } = require('webpack-subresource-integrity')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const blipWebpack = require('./webpack.config.blip')
const buildConfig = require('../../server/config.app')
const brandings = require('../../branding/branding.json')
const languages = require('../../locales/languages.json')
const pkg = require('./package.json')

/** Match files ending with .js | .jsx | .ts | .tsx */
const reJTSX = /\.[jt]sx?$/

// Compile mode
const mode =
  process.argv.includes('--mode=production') || process.env.NODE_ENV === 'production' ? 'production' : 'development'
const isTest = process.env.NODE_ENV === 'test'
const isProduction = mode === 'production'
const isDev = !isProduction

console.log(`Compiling ${pkg.name} v${pkg.version} for ${mode}/${process.env.NODE_ENV}.`)

if (process.env.USE_WEBPACK_DEV_SERVER === 'true') {
  console.log(buildConfig)
}

if (!brandings.includes(buildConfig.BRANDING)) {
  throw new Error(`Invalid branding found ${buildConfig.BRANDING}. Valid branding must be one of : ${brandings.toString()}`)
}

const alias = {
  'branding/global.css': path.resolve(__dirname, '../../branding/global.css'),
  'classes.css': path.resolve(__dirname, 'css/classes.css'),
  'cartridge.png': path.resolve(__dirname, '../../branding/sitechange/cartridge.png'),
  'infusion.png': path.resolve(__dirname, '../../branding/sitechange/infusion.png'),
  'cartridge-vicentra.png': path.resolve(__dirname, '../../branding/sitechange/cartridge-vicentra.png'),
  'warmup-dexcom.svg': path.resolve(__dirname, '../../branding/warmup/warmup-dexcom.svg'),
  'device-event.svg': path.resolve(__dirname, '../../branding/alarm-event/device-event.svg'),
  'hyperglycemia-event.svg': path.resolve(__dirname, '../../branding/alarm-event/hyperglycemia-event.svg'),
  'hypoglycemia-event.svg': path.resolve(__dirname, '../../branding/alarm-event/hypoglycemia-event.svg'),
  'dana-pump.svg': path.resolve(__dirname, '../../branding/pump/dana-pump.svg'),
  'insight-pump.svg': path.resolve(__dirname, '../../branding/pump/insight-pump.svg'),
  'kaleido-pump.svg': path.resolve(__dirname, '../../branding/pump/kaleido-pump.svg'),
  'medisafe-pump.svg': path.resolve(__dirname, '../../branding/pump/medisafe-pump.svg'),
  'diabeloop-logo.svg': path.resolve(__dirname, '../../branding/diabeloop/diabeloop-logo.svg'),
  'diabeloop-label.svg': path.resolve(__dirname, '../../branding/diabeloop/diabeloop-label.svg'),
  images: path.resolve(__dirname, 'images/'),
  Museo_Slab: path.resolve(__dirname, '../../branding/fonts/museo-slab/'),
  ...blipWebpack.resolve.alias
}

// Dynamically import dayjs locales from our declared locales

const dayJSLocales = _.map(_.keysIn(languages.resources), (lang) => `dayjs/locale/${lang}`)
// Bundle the dayjs plugins too
dayJSLocales.push('dayjs/plugin/utc')
dayJSLocales.push('dayjs/plugin/timezone')
dayJSLocales.push('dayjs/plugin/localizedFormat')
if (!isProduction) {
  dayJSLocales.push('dayjs/plugin/devHelper')
}

const plugins = [
  new webpack.DefinePlugin({
    BUILD_CONFIG:
      isTest || isProduction ? `'${JSON.stringify({ DEV: isDev, TEST: isTest })}'` : `'${JSON.stringify(buildConfig)}'`,
    // Create a global with declared branding, used in initTheme to have only one theme defined
    BRANDING_LIST: JSON.stringify(brandings.map(brand => brand.replace('/', '-')))
  }),
  new MiniCssExtractPlugin({
    filename: isDev ? 'style.css' : 'style.[contenthash].css'
  }),
  new SubresourceIntegrityPlugin({
    hashFuncNames: ['sha512'],
    enabled: isProduction
  }),
  new HtmlWebpackPlugin({
    title: 'YourLoops',
    showErrors: !isProduction,
    template: path.resolve(__dirname, '../../templates/index.html'),
    scriptLoading: 'defer',
    inject: 'body',
    hash: false,
    minify: false
  }),
  new webpack.ProvidePlugin({
    Buffer: ['buffer', 'Buffer']
  })
]

if (isTest) {
  plugins.push(
    new webpack.SourceMapDevToolPlugin({
      filename: null, // if no value is provided the sourcemap is inlined
      test: reJTSX // process .js and .ts files only
    })
  )
}

/* Copy branding assets for dynamic use in the app
Since we're not importing statically assets (with import), webpack does not know he needs to bundle it,
so we're doing it here. Moreover, we're flatting files because of the lambda serving only assets with flat hierarchy ...
will copy /branding/diabeloop/blue/favicon.ico in /branding_diabeloop_blue_favicon.ico */
const patterns = []
for (const branding of brandings) {
  patterns.push({
    from: `../../branding/${branding.replace('_', '/')}`,
    to: `branding_${branding}_[name][ext]`
  })
}
plugins.push(
  new CopyWebpackPlugin({ patterns: [...patterns, { from: '../../branding/palette.css', to: 'palette.css' }] })
)

/** @type {webpack.Configuration & { devServer: { [index: string]: any; }}} */
const webpackConfig = {
  entry: {
    nodeCompat: {
      import: path.resolve(__dirname, '../../node-compat.js'),
      runtime: false,
      filename: 'node-compat.[contenthash].js'
    },
    dayjs: { import: dayJSLocales, runtime: false, filename: 'dayjs.[contenthash].js' },
    yourloops: {
      import: path.resolve(__dirname, './app/index.tsx'),
      dependOn: ['nodeCompat', 'dayjs'],
      filename: 'yourloops.[contenthash].js'
    }
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    chunkFilename: '[id].[contenthash].js',
    crossOriginLoading: 'anonymous',
    assetModuleFilename: '[contenthash][ext]'
  },
  target: 'web',
  mode,
  stats: 'minimal', // See https://webpack.js.org/configuration/stats/

  // Enable sourcemaps for debugging webpack's output.
  devtool: isTest || isDev ? 'inline-source-map' : false,
  // todo: enhance this part
  devServer: {
    allowedHosts: 'auto',
    compress: false,
    port: 3001,
    historyApiFallback: {
      rewrites: [
        {
          from: /./,
          to: (context) => {
            const dirname = path.dirname(context.parsedUrl.pathname)
            const basename = path.basename(context.parsedUrl.pathname)
            const now = new Date().toISOString()
            if (basename.indexOf('.') > 0 && dirname !== '/') {
              console.log(now, context.request.method, context.parsedUrl.pathname, '=>', `/${basename}`)
              return `/${basename}`
            }
            console.log(now, context.request.method, context.parsedUrl.pathname)
            return '/'
          }
        }
      ]
    },
    devMiddleware: {
      publicPath: '/'
    },
    static: {
      staticOptions: {
        redirect: true
      }
    },
    client: {
      progress: true,
      logging: 'verbose'
    }
  },

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions. , ".js", ".json", ".css", ".html"
    extensions: ['.ts', '.tsx', '.js', '.css'],
    alias,
    fallback: {
      stream: require.resolve('stream-browserify'),
      buffer: require.resolve('buffer')
    },
    cache: true,
    symlinks: true
  },

  resolveLoader: {
    alias
  },

  optimization: {
    realContentHash: true,
    minimizer: [
      new TerserPlugin({
        test: /\.js(\?.*)?$/i,
        parallel: true,
        extractComments: isProduction,
        terserOptions: {
          // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
          toplevel: true,
          ecma: 2020,
          output: {
            comments: false,
            beautify: false
          }
        }
      }),
      new CssMinimizerPlugin()
    ],
    splitChunks: {
      chunks: 'all',
      minSize: 32768,
      cacheGroups: {
        polyfills: {
          test: /\/node_modules\/(.*babel.*|core-js.*)\//,
          priority: 0,
          reuseExistingChunk: true,
          idHint: 'polyfills',
          filename: 'polyfills.[contenthash].js'
        },
        d3: {
          test: /\/node_modules\/.*d3.*\//,
          priority: 0,
          reuseExistingChunk: true,
          idHint: 'd3',
          filename: 'd3.[contenthash].js'
        },
        pdfkit: {
          test: /\/node_modules\/pdfkit\//,
          priority: 0,
          reuseExistingChunk: true,
          idHint: 'pdfkit',
          filename: 'pdfkit.[contenthash].js'
        },
        react: {
          test: /\/node_modules\/(@material-ui|.*react.*)\//,
          priority: 0,
          reuseExistingChunk: true,
          idHint: 'react',
          filename: 'react.[contenthash].js'
        },
        modules: {
          test: /(node_modules)/,
          priority: -1,
          reuseExistingChunk: true,
          idHint: 'modules',
          filename: 'modules.[contenthash].js'
        }
      }
    }
  },

  plugins,
  module: {
    rules: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          projectReferences: true,
          configFile: 'tsconfig.json'
        }
      },
      blipWebpack.babelLoaderConfiguration,
      blipWebpack.lessLoaderConfiguration,
      blipWebpack.cssLoaderConfiguration,
      blipWebpack.imageLoaderConfiguration,
      blipWebpack.fontLoaderConfiguration,

      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      { enforce: 'pre', test: reJTSX, loader: 'source-map-loader' },
      { test: /locales\/languages\.json$/, loader: '../../webpack.locales-loader.js' }
    ]
  },
  experiments: {
    topLevelAwait: true
  }
}

module.exports = webpackConfig
