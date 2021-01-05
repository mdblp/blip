/* eslint-disable @typescript-eslint/no-var-requires */
// @ts-check
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const SriWebpackPlugin = require('webpack-subresource-integrity');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const blipWebpack = require('./webpack.config.blip');
const buildConfig = require('../../server/config.app');
const pkg = require('./package.json');

// Compile mode
const mode = process.argv.indexOf("--mode=production") >= 0 || process.env.NODE_ENV === "production" ? "production" : "development";
const isTest = process.env.NODE_ENV === "test";
const isProduction = mode === "production";
const isDev = !isProduction;

if (buildConfig.BRANDING !== 'diabeloop') {
  throw new Error('Invalid branding');
}

console.log(`Compiling ${pkg.name} v${pkg.version} for ${mode}`);
console.log(`Branding: ${buildConfig.BRANDING}`);

const alias = {
  "branding/theme-base.css": path.resolve(__dirname, `../../branding/${buildConfig.BRANDING}/theme-base.css`),
  "branding/theme.css": path.resolve(__dirname, `../../branding/${buildConfig.BRANDING}/theme.css`),
  "branding/logo.png": path.resolve(__dirname, `../../branding/${buildConfig.BRANDING}/logo.png`),
  ...blipWebpack.resolve.alias,
};
// needed to remove type to have dev part enable
///** @type {webpack.Configuration} */
const webpackConfig = {
  entry: {
    main: "./app/index.ts",
  },
  output: {
    filename: "yourloops.[hash].js",
    path: path.resolve(__dirname, "dist"),
  },
  target: "web",
  mode,

  // Enable sourcemaps for debugging webpack's output.
  devtool: "source-map",
  // todo: enhance this part
  devServer: {
    publicPath: 'http://localhost:3001/',
    historyApiFallback: true,
    hot: true,
    clientLogLevel: 'info',
    disableHostCheck: true,
    before: (app /*, server, compiler */) => {
      app.get('/patient', (req, res) => {
        res.redirect('/');
      });
    },
  },

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions. , ".js", ".json", ".css", ".html"
    extensions: [".ts", ".tsx", ".js", ".css"],
    alias,
  },

  resolveLoader: {
    alias,
  },

  module: {
    rules: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
      { test: /\.tsx?$/, loader: "ts-loader", exclude: /node_modules/ },
      blipWebpack.babelLoaderConfiguration,
      blipWebpack.lessLoaderConfiguration,
      blipWebpack.cssLoaderConfiguration,
      // blipWebpack.imageLoaderConfiguration,
      // { test: /\.css$/, use: ["style-loader", "css-loader"] },
      { test: /\.(ttf|eot|woff2?)$/, use: ["file-loader"] },
      { test: /\.(png|svg|jpe?g|gif)$/, use: ["file-loader"] },

      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
      { test: /locales\/languages\.json$/, use: { loader: '../blip/locales-loader.js' } },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      BUILD_CONFIG: `'${JSON.stringify({ DEV: isDev, TEST: isTest })}'`,
    }),
    new MiniCssExtractPlugin({
      filename: isDev ? 'style.css' : 'style.[contenthash].css',
    }),
    new SriWebpackPlugin({
      hashFuncNames: ['sha512'],
      enabled: isProduction,
    }),
    new HtmlWebpackPlugin({
      title: "YourLoops",
      showErrors: !isProduction,
      template: path.resolve(__dirname, "../../templates/index.html"),
      scriptLoading: "defer",
      inject: "body",
      hash: false,
      favicon: path.resolve(__dirname, "../../branding/diabeloop/favicon.ico"),
      minify: false,
    }),
  ],
};

module.exports = webpackConfig;
