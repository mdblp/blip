/* eslint-disable @typescript-eslint/no-var-requires */
// @ts-check
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const SriWebpackPlugin = require('webpack-subresource-integrity');
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

// const cssLoaderConfiguration = {
//   test: /\.css$/,
//   use: [
//     {
//       loader: 'css-loader',
//       options: {
//         importLoaders: 1,
//         sourceMap: true,
//       },
//     },
//     // {
//     //   loader: 'postcss-loader',
//     //   options: {
//     //     sourceMap: true,
//     //     ident: 'postcss',
//     //     config: {
//     //       path: __dirname,
//     //     }
//     //   },
//     // }
//   ],
// };

/** @type {boolean | "auto" | HtmlWebpackPlugin.MinifyOptions} */
let htmlWebpackPluginMimifyOptions = false;
// If prod mode:
if (isProduction) {
  htmlWebpackPluginMimifyOptions = {
    minifyCSS: true,
    minifyJS: true,
    removeComments: true,
    collapseWhitespace: true,
  };
}

console.log(`Compiling ${pkg.name} v${pkg.version} for ${mode}`);
console.log(`Branding: ${buildConfig.BRANDING}`);

const alias = {
  "branding/theme-base.css": path.resolve(__dirname, `../../branding/${buildConfig.BRANDING}/theme-base.css`),
  "branding/theme.css": path.resolve(__dirname, `../../branding/${buildConfig.BRANDING}/theme.css`),
  "branding/logo.png": path.resolve(__dirname, `../../branding/${buildConfig.BRANDING}/logo.png`),
};

/** @type {webpack.Configuration} */
const webpackConfig = {
  entry: {
    main: "./app/index.ts",
  },
  output: {
    filename: "yourloops.[contenthash].js",
    path: path.resolve(__dirname, "dist"),
  },
  target: "web",
  mode,

  // Enable sourcemaps for debugging webpack's output.
  devtool: "source-map",

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
      { test: /\.tsx?$/, loader: "ts-loader" },
      { test: /\.css$/, use: ["style-loader", "css-loader"] },
      { test: /\.(ttf|woff2?)$/, use: ["file-loader"] },
      { test: /\.(png|svg|jpg|gif)$/, use: ["url-loader"] },

      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
    ],
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
      title: "YourLoops",
      showErrors: !isProduction,
      template: path.resolve(__dirname, "../../server/templates/index.html"),
      scriptLoading: "defer",
      inject: "body",
      hash: false,
      favicon: path.resolve(__dirname, "../../branding/diabeloop/favicon.ico"),
      minify: htmlWebpackPluginMimifyOptions,
    }),
  ],
};

module.exports = webpackConfig;
