const HtmlWebpackPlugin = require('html-webpack-plugin');

class DblpHtmlWebpackPlugin {
  apply (compiler) {
    compiler.hooks.compilation.tap('DblpHtmlWebpackPlugin', (compilation) => {
      console.log('Setting up zendesk javascript link...')

      // Static Plugin interface |compilation |HOOK NAME | register listener
      HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
        'DblpHtmlWebpackPlugin', // <-- Set a meaningful name here for stacktraces
        (data, cb) => {
          // Manipulate the content
          if (typeof process.env.HELP_LINK === 'string') {
            if (process.env.HELP_LINK !== "disable") {
              data.html = data.html.replace(/(<script id="ze-snippet" src="([^"]+)">)/, (match, p1, p2) => {
                return p1.replace(p2, process.env.HELP_LINK);
              });
            } else {
              data.html = data.html.replace(/(<script id="ze-snippet".*<\/script>)/, "");
            }
          }
          console.log(data.html);
          // Tell webpack to move on
          cb(null, data)
        }
      )
    })
  }
}

module.exports = DblpHtmlWebpackPlugin
