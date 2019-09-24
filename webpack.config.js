const path = require('path');
const _ = require('lodash');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isProduction = (process.env.NODE_ENV === 'production');
const isDev = (process.env.NODE_ENV === 'development');
const isTest = (process.env.NODE_ENV === 'test');

const styleLoaderConfiguration = {
  test: /\.less$/i,
  use: [
    isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
    {
      loader: 'css-loader',
      options: {
        importLoaders: 2,
        modules: false,
        sourceMap: isDev,
      },
    },
    {
      loader: 'postcss-loader',
      options: {
        sourceMap: isDev,
      },
    },
    {
      loader: 'less-loader',
      options: {
        sourceMap: isDev,
        javascriptEnabled: true,
      },
    },
  ],
};

const babelLoaderConfiguration = [
  {
    test: /\.js$/,
    exclude: function(modulePath) {
      return /node_modules/.test(modulePath) && !/node_modules\/(tideline|tidepool-platform-client)/.test(modulePath);
    },
    use: {
      loader: 'babel-loader',
      options: {
        cacheDirectory: true,
      },
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

const plugins = [
  // these values are required in the config.app.js file -- we can't use
  // process.env with webpack, we have to create these magic constants
  // individually.
  new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': isDev || isTest ? JSON.stringify('development') : JSON.stringify('production'),
    },
    __UPLOAD_API__: JSON.stringify(process.env.UPLOAD_API || null),
    __API_HOST__: JSON.stringify(process.env.API_HOST || null),
    __INVITE_KEY__: JSON.stringify(process.env.INVITE_KEY || null),
    __LATEST_TERMS__: JSON.stringify(process.env.LATEST_TERMS || null),
    __PASSWORD_MIN_LENGTH__: JSON.stringify(process.env.PASSWORD_MIN_LENGTH || null),
    __PASSWORD_MAX_LENGTH__: JSON.stringify(process.env.PASSWORD_MAX_LENGTH || null),
    __ABOUT_MAX_LENGTH__: JSON.stringify(process.env.ABOUT_MAX_LENGTH || null),
    __I18N_ENABLED__: JSON.stringify(process.env.I18N_ENABLED || false),
    __ALLOW_SIGNUP_PATIENT__: JSON.stringify(process.env.ALLOW_SIGNUP_PATIENT || true),
    __ALLOW_PATIENT_CHANGE_EMAIL__: JSON.stringify(process.env.ALLOW_PATIENT_CHANGE_EMAIL || true),
    __ALLOW_PATIENT_CHANGE_PASSWORD__: JSON.stringify(process.env.ALLOW_PATIENT_CHANGE_PASSWORD || true),
    __HELP_LINK__: JSON.stringify(process.env.HELP_LINK || null),
    __ASSETS_URL__: JSON.stringify(process.env.ASSETS_URL || null),
    __HIDE_DONATE__: JSON.stringify(process.env.HIDE_DONATE || false),
    __HIDE_DEXCOM_BANNER__: JSON.stringify(process.env.HIDE_DEXCOM_BANNER || false),
    __HIDE_UPLOAD_LINK__: JSON.stringify(process.env.HIDE_UPLOAD_LINK || false),
    __BRANDING__: JSON.stringify(process.env.BRANDING || 'tidepool'),
    __DEV__: isDev,
    __TEST__: isTest,
    __DEV_TOOLS__: (process.env.DEV_TOOLS != null) ? process.env.DEV_TOOLS : (isDev ? true : false) //eslint-disable-line eqeqeq
  }),
  new HtmlWebpackPlugin({
    template: 'index.ejs',
    favicon: 'favicon.ico',
    minify: false, // Needed for config file
  }),
];

if (isDev) {
  plugins.push(new webpack.HotModuleReplacementPlugin());
}
if (isProduction) {
  plugins.push(new MiniCssExtractPlugin({
    filename: '[name].[contenthash].css',
    chunkFilename: '[id].[hash].css',
    ignoreOrder: false,
  }));
}

const entry = isDev
  ? [
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server',
    './app/main.js',
  ] : [
    './app/main.prod.js',
  ];

const output = {
  filename: 'bundle.js',
  path: path.join(__dirname, '/dist'),
  globalObject: `(typeof self !== 'undefined' ? self : this)`, // eslint-disable-line quotes
};

const resolve = {
  symlinks: false,
  modules: [
    path.join(__dirname, 'node_modules'),
    'node_modules',
  ],
};

const minimizer = [
  new TerserPlugin({
    test: /\.js(\?.*)?$/i,
    cache: true,
    parallel: true,
    sourceMap: !isProduction,
    extractComments: isProduction,
    terserOptions: {
      // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
      ie8: false,
      toplevel: true,
      warnings: false,
      passes: 2,
      compress: {},
      output: {
        comments: false,
        beautify: false
      }
    }
  }),
  new OptimizeCSSAssetsPlugin({}),
];

let devtool = _.get(process, 'env.WEBPACK_DEVTOOL', isDev ? 'source-map' : undefined);
if (isTest) {
  // Usefull for the coverage/error reporting
  devtool = 'inline-source-map';
}

module.exports = {
  devServer: {
    publicPath: output.publicPath,
    historyApiFallback: true,
    hot: isDev,
    clientLogLevel: 'info',
  },
  devtool,
  entry,
  mode: isProduction ? 'production' : 'development',
  module: {
    rules: [
      ...babelLoaderConfiguration,
      imageLoaderConfiguration,
      ...fontLoaderConfiguration,
      styleLoaderConfiguration,
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
};
