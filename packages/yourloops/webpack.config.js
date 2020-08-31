/* eslint-disable @typescript-eslint/no-var-requires */
// @ts-check
const path = require('path');
const webpack = require('webpack');
// const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const SriWebpackPlugin = require('webpack-subresource-integrity');
// const genConfig = require('./public/config');
const pkg = require('./package.json');

// Compile mode
const mode = process.argv.indexOf("--mode=production") >= 0 || process.env.NODE_ENV === "production" ? "production" : "development";
const isTest = process.env.NODE_ENV === "test";
const isProduction = mode === "production";
const isDev = !isProduction;

/** @type {boolean | "auto" | HtmlWebpackPlugin.MinifyOptions} */
let htmlWebpackPluginMimifyOptions = false;
// If prod mode:
if (isProduction) {
  htmlWebpackPluginMimifyOptions = {
    minifyCSS: true,
    minifyJS: true,
    removeComments: true,
    collapseWhitespace: true
  };
}

console.log(`Compiling ${pkg.name} v${pkg.version} for ${mode}`);

module.exports = {
  entry: {
    main: "./app/index.ts"
  },
  output: {
    filename: "bundle.[contenthash].js",
    path: path.resolve(__dirname, "dist")
  },
  target: "web",
  mode,

  // Enable sourcemaps for debugging webpack's output.
  devtool: "source-map",

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions. , ".js", ".json", ".css", ".html"
    extensions: [".ts", ".tsx", ".js", ".css"]
  },

  module: {
    rules: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
      { test: /\.tsx?$/, loader: "ts-loader" },
      // { test: /\.css$/, use: ["style-loader", "css-loader"] },

      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },

      // Assets:
      { test: /\.(png|svg|jpg|gif)$/, use: ["file-loader"] }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      BUILD_CONFIG: `'${JSON.stringify({DEV: isDev, TEST: isTest})}'`,
    }),
    new SriWebpackPlugin({
      hashFuncNames: ['sha512'],
      enabled: isProduction,
    }),
    new HtmlWebpackPlugin({
      title: "Yourloops",
      showErrors: !isProduction,
      // template: `public/index.${isProduction ? "prod" : "dev"}.html`,
      scriptLoading: "defer",
      inject: "body",
      hash: false,
      minify: htmlWebpackPluginMimifyOptions,
    }),
  ],

  // // When importing a module whose path matches one of the following, just
  // // assume a corresponding global variable exists and use that instead.
  // // This is important because it allows us to avoid bundling all of our
  // // dependencies, which allows browsers to cache those libraries between builds.
  // externals: {
  //   "react": "React",
  //   "react-dom": "ReactDOM",
  //   "i18next": "i18next"
  // }
};
