module.exports = function babelConfig(api) {
  const presets = [
    '@babel/preset-env',
    '@babel/preset-react',
    'babel-preset-react-app',
  ];

  const plugins = [
    // Disable the 'use strict', because it makes d3 crash.
    ['@babel/plugin-transform-modules-commonjs', { strictMode: false, }],
  ];

  const env = api.env();

  if (env === 'dev' && process.env.USE_WEBPACK_DEV_SERVER === 'true') {
    plugins.unshift(
      'react-hot-loader/babel',
    );
  }

  if (env === 'test') {
    plugins.unshift(
      ['babel-plugin-istanbul', {
        useInlineSourceMaps: false,
      }],
      'babel-plugin-rewire',
    );
  }

  api.cache(true);

  return {
    presets,
    plugins,
  };
};
