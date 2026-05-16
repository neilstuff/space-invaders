const path = require('path');

module.exports = {
  entry: {
    main: "./assets/scripts/index.js",
  },
  output: {
    path: __dirname,
    filename: "[name].bundle.js"
  },
  resolve: {
    resolveLoader: {
      root: path.join(__dirname, 'node_modules')
    },
    extensions: ['', '.js', '.json', '.css']
  }
};
