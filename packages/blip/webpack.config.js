/* eslint-disable lodash/prefer-lodash-typecheck */
const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const SriWebpackPlugin = require('webpack-subresource-integrity');
const DblpHtmlWebpackPlugin = require('./dblp-webpack-html-plugin');
const buildConfig = require('../../server/config.app');

const isDev = (process.env.NODE_ENV === 'development');
const isTest = (process.env.NODE_ENV === 'test');
const isProduction = (process.env.NODE_ENV === 'production');
const useWebpackDevServer = isDev && (process.env.USE_WEBPACK_DEV_SERVER === 'true');

// Enzyme as of v2.4.1 has trouble with classes
// that do not start and *end* with an alpha character
// but that will sometimes happen with the base64 hashes
// so we leave them off in the test env
const localIdentName = process.env.NODE_ENV === 'test'
  ? '[name]--[local]'
  : '[name]--[local]--[hash:base64:5]';

const lessLoaderConfiguration = {
  test: /\.less$/,
  use: [
    (isProduction) ? MiniCssExtractPlugin.loader : 'style-loader',
    {
      loader: 'css-loader',
      options: {
        importLoaders: 2,
        sourceMap: true,
        onlyLocals: false,
        modules: {
          auto: true,
          exportGlobals: true,
          localIdentName,
        }
      },
    },
    {
      loader: 'postcss-loader',
      options: {
        sourceMap: true,
        config: {
          path: __dirname,
        }
      },
    },
    {
      loader: 'less-loader',
      options: {
        sourceMap: true,
        lessOptions: {
          strictUnits: true,
          strictMath: true,
          javascriptEnabled: true, // Deprecated
        },
      },
    },
  ],
};
const cssLoaderConfiguration = {
  test: /\.css$/,
  use: [
    (isProduction) ? MiniCssExtractPlugin.loader : 'style-loader',
    {
      loader: 'css-loader',
      options: {
        importLoaders: 1,
        sourceMap: true,
        modules: {
          localIdentName,
        }
      },
    },
    {
      loader: 'postcss-loader',
      options: {
        sourceMap: true,
        ident: 'postcss',
        config: {
          path: __dirname,
        }
      },
    }
  ],
};

const babelLoaderConfiguration = [
  {
    test: /\.js$/,
    use: {
      loader: 'babel-loader',
      options: {
        cacheDirectory: true,
      },
    },
  },
  {
    test: /\.js?$/,
    // include: [
    //   fs.realpathSync('../sundial'),
    //   fs.realpathSync('../platform-client'),
    //   fs.realpathSync('../viz'),
    //   fs.realpathSync('../tideline/js'),
    //   fs.realpathSync('../tideline/plugins'),
    // ],
    use: {
      loader: 'source-map-loader',
    },
  },
];

// This is needed for webpack to import static images in JavaScript files
const imageLoaderConfiguration = {
  test: /\.(gif|jpe?g|png|svg)$/,
  use: {
    loader: 'url-loader',
    options: {
      name: '[name].[ext]',
      esModule: false,
    },
  },
};

const fontLoaderConfiguration = [
  {
    test: /\.eot$/,
    use: {
      loader: 'url-loader',
      query: {
        limit: 10000,
        mimetype: 'application/vnd.ms-fontobject',
      },
    },
  },
  {
    test: /\.woff$/,
    use: {
      loader: 'url-loader',
      query: {
        limit: 10000,
        mimetype: 'application/font-woff',
      },
    },
  },
  {
    test: /\.ttf$/,
    use: {
      loader: 'url-loader',
      query: {
        limit: 10000,
        mimetype: 'application/octet-stream',
      },
    },
  },
];

const localesLoader = {
  test: /locales\/languages\.json$/,
  use: {
    loader: './locales-loader.js'
  }
};

const plugins = [
  // these values are required in the config.app.js file -- we can't use
  // process.env with webpack, we have to create these magic constants
  // individually.
  // When running the test, we always use the default config.
  new webpack.DefinePlugin({
    BUILD_CONFIG: `'${JSON.stringify(isTest ? {DEV: isDev, TEST: isTest} : buildConfig)}'`,
    __DEV__: isDev,
    __TEST__: isTest,
  }),
  new CopyWebpackPlugin({
    patterns: [{
      from: path.resolve(__dirname, 'node_modules/d3/d3.min.js'),
      to: '[name].[contenthash].[ext]',
      transformPath: DblpHtmlWebpackPlugin.transformJSPath
    }],
    options: { concurrency: 1 }, // Set to 1 to keep the JS loading order
  }),
  new MiniCssExtractPlugin({
    filename: isDev ? 'style.css' : 'style.[contenthash].css',
  }),
  new SriWebpackPlugin({
    hashFuncNames: ['sha512'],
    enabled: isProduction,
  }),
  new HtmlWebpackPlugin({
    template: '../../server/templates/index.html',
    favicon: `../../branding/${buildConfig.BRANDING}/favicon.ico`,
    minify: false,
    scriptLoading: 'defer',
    inject: 'body',
    showErrors: !isProduction,
    title: buildConfig.BRANDING,
  }),
  new DblpHtmlWebpackPlugin(),
];

if (isDev) {
  plugins.push(new webpack.HotModuleReplacementPlugin());
}

const minimizer = [
  new TerserPlugin({
    test: /\.js(\?.*)?$/i,
    cache: true,
    parallel: true,
    sourceMap: true,
    extractComments: isProduction,
    terserOptions: {
      // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
      ie8: false,
      toplevel: true,
      warnings: false,
      ecma: 2017,
      compress: {},
      output: {
        comments: false,
        beautify: false
      }
    }
  }),
  new OptimizeCSSAssetsPlugin({}),
];

/** @type {webpack.Output} */
const output = {
  filename: isDev || isTest ? 'bundle.js' : 'bundle.[hash].js',
  path: path.join(__dirname, 'dist'),
  globalObject: `(typeof self !== 'undefined' ? self : this)`, // eslint-disable-line quotes
};

if (typeof process.env.PUBLIC_PATH === 'string' && process.env.PUBLIC_PATH.startsWith('https')) {
  output.publicPath = process.env.PUBLIC_PATH;
}

const resolve = {
  modules: [
    path.join(__dirname, 'node_modules'),
  ],
  alias: {
    pdfkit: 'pdfkit/js/pdfkit.standalone.js',
    './images/tidepool/logo.png': path.resolve(__dirname, `../../branding/${buildConfig.BRANDING}/logo.png`),
    '@tidepool/viz': path.resolve(__dirname, '../viz/src/index.js'),
    sundial: path.resolve(__dirname, '../sundial/sundial.js'),
    'tidepool-platform-client': path.resolve(__dirname, '../platform-client/tidepool.js'),
    'tideline/plugins/nurseshark': path.resolve(__dirname, '../tideline/plugins/nurseshark/index.js'),
    'tideline/plugins/blip': path.resolve(__dirname, '../tideline/plugins/blip/index.js'),
    'tideline/js/tidelinedata': path.resolve(__dirname, '../tideline/js/tidelinedata.js'),
    'tideline/css/tideline.less': path.resolve(__dirname, '../tideline/css/tideline.less')
  }
};

let entry = [];
let devServer;
if (useWebpackDevServer) {
  console.info('Webpack dev-server is enable');
  const devPublicPath = process.env.WEBPACK_PUBLIC_PATH || 'http://localhost:3001/';
  output.publicPath = devPublicPath;
  entry = [
    'webpack-dev-server/client?' + devPublicPath,
    'webpack/hot/only-dev-server',
    './app/main.dev.js',
  ];
  devServer = {
    publicPath: devPublicPath,
    historyApiFallback: true,
    hot: isDev,
    clientLogLevel: 'info',
    disableHostCheck: true,
  };
  resolve.alias['./Root.prod'] = './Root.dev';
  resolve.alias['./configureStore.prod'] = './configureStore.dev';
} else {
  entry = [ './app/main.prod.js' ];
}

let devtool = 'source-map';
if (process.env.WEBPACK_DEVTOOL === 'false') {
  devtool = undefined;
} else if (isTest) {
  devtool = 'inline-source-map';
} else if (isProduction) {
  devtool = 'source-map';
} else if (typeof process.env.WEBPACK_DEVTOOL === 'string') {
  devtool = process.env.WEBPACK_DEVTOOL;
}

module.exports = {
  devServer,
  devtool,
  entry,
  mode: isDev || isTest ? 'development' : 'production',
  module: {
    rules: [
      ...babelLoaderConfiguration,
      imageLoaderConfiguration,
      lessLoaderConfiguration,
      cssLoaderConfiguration,
      ...fontLoaderConfiguration,
      localesLoader,
    ],
  },
  optimization: {
    noEmitOnErrors: true,
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.(css|less)$/,
          chunks: 'all',
          enforce: true
        }
      }
    },
    minimize: isProduction,
    minimizer
  },
  output,
  plugins,
  resolve,
  resolveLoader: resolve,
  cache: isDev,
  externals: {
    'd3': 'd3',
  }
};
