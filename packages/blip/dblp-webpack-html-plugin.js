/*
 * Modified from html-webpack-plugin example:
 * https://github.com/jantimon/html-webpack-plugin#afteremit-hook
 */
const HtmlWebpackPlugin = require('html-webpack-plugin');

class DblpHtmlWebpackPlugin {
  apply (compiler) {
    compiler.hooks.compilation.tap('DblpHtmlWebpackPlugin', (compilation) => {
      // Static Plugin interface |compilation |HOOK NAME | register listener
      if (process.env.WEBPACK_DEV_SERVER === 'true' && typeof process.env.HELP_LINK === 'string') {
        HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
          'DblpHtmlWebpackPlugin', // <-- Set a meaningful name here for stacktraces
          (data, cb) => {
            // Manipulate the content
            if (typeof process.env.HELP_LINK === 'string') {
              if (process.env.HELP_LINK === 'disabled') {
                console.log('\nRemoving zendesk javascript link...');
                data.html = data.html.replace(/(<script id="ze-snippet".*<\/script>)/, '');
              } else {
                console.log('\nSetting up zendesk javascript link...');
                data.html = data.html.replace(/(<script id="ze-snippet" src="([^"]+)">)/, (match, p1, p2) => {
                  return p1.replace(p2, process.env.HELP_LINK);
                });
              }
            }
            // Tell webpack to move on
            cb(null, data);
          }
        );
      }

      HtmlWebpackPlugin.getHooks(compilation).beforeAssetTagGeneration.tapAsync(
        'DblpHtmlWebpackPlugin',
        (data, cb) => {
          data.assets.js = DblpHtmlWebpackPlugin.scripts.concat(data.assets.js);
          data.assets.css = DblpHtmlWebpackPlugin.styles.concat(data.assets.css);
          cb(null, data);
        });
    });
  }
}

/** @type {string[]} */
DblpHtmlWebpackPlugin.scripts = [];
/** @type {string[]} */
DblpHtmlWebpackPlugin.styles = [];

// static methods: links between CopyWebpackPlugin & HtmlWebpackPlugin
DblpHtmlWebpackPlugin.transformJSPath = (targetPath /*, absolutePath */) => {
  console.log('Using external js:', targetPath);
  DblpHtmlWebpackPlugin.scripts.push(targetPath);
  return targetPath;
};

DblpHtmlWebpackPlugin.transformCSSPath = (targetPath /*, absolutePath */) => {
  const destPath = `css/${targetPath}`;
  console.log('Using external css:', destPath);
  DblpHtmlWebpackPlugin.styles.push(destPath);
  return destPath;
};

module.exports = DblpHtmlWebpackPlugin;
