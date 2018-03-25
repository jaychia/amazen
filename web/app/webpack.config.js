const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: __dirname + "/js/main.js",
    output: {
        path: __dirname + '/static',
        filename: "bundle.js"
    },
    module: {
      rules: [
          { test: /\.css$/,
            use: [
              { loader: "style-loader" },
              { loader: "css-loader" }
            ]
          },
          {
            test: /\.js?/,
            exclude: /node_modules/,
            use: 'babel-loader'
          },
          {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: "babel-loader"
          }
        ],
    }
}
