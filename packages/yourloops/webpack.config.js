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
  'cartridge.png': path.resolve(__dirname, '../../branding/sitechange/cartridge.png'),
  'infusion.png': path.resolve(__dirname, '../../branding/sitechange/infusion.png'),
  'cartridge-vicentra.png': path.resolve(__dirname, '../../branding/sitechange/cartridge-vicentra.png'),
  ...blipWebpack.resolve.alias,
};
// needed to remove type to have dev part enable
///** @type {webpack.Configuration} */
const webpackConfig = {
  entry: {
    main: "./app/index.tsx",
  },
  output: {
    filename: isProduction ? "yourloops.[contenthash].js" : "yourloops.js",
    path: path.resolve(__dirname, "dist"),
    chunkFilename: '[id].[chunkhash].js',
    crossOriginLoading: 'anonymous',
  },
  target: "web",
  mode,
  stats: "minimal", // See https://webpack.js.org/configuration/stats/

  // Enable sourcemaps for debugging webpack's output.
  devtool: "source-map",
  // todo: enhance this part
  devServer: {
    publicPath: 'http://localhost:3001/',
    historyApiFallback: true,
    hot: true,
    clientLogLevel: 'debug',
    disableHostCheck: true,
    before: (app /*, server, compiler */) => {
      app.use('/*', (req, res, next) => {
        const dirname = path.dirname(req.baseUrl);
        const basename = path.basename(req.baseUrl);
        const now = (new Date()).toISOString();
        if (basename.indexOf('.') > 0 && dirname !== '/') {
          console.log(now, req.method, req.baseUrl, '=>', `/${basename}`);
          res.redirect(`/${basename}`);
          res.end();
          return;
        }
        console.log(now, req.method, req.baseUrl);
        next();
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
      blipWebpack.imageLoaderConfiguration,
      blipWebpack.fontLoaderConfiguration,

      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      { enforce: "pre", test: /\.(js|ts|tsx)$/, loader: "source-map-loader" },
      { test: /locales\/languages\.json$/, loader: './locales-loader.js' },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      BUILD_CONFIG: isTest || isProduction ? `'${JSON.stringify({ DEV: isDev, TEST: isTest })}'` : `'${JSON.stringify(buildConfig)}'`,
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
