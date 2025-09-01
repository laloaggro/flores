const path = require('path');

module.exports = {
  entry: {
    main: './frontend/assets/js/main.js',
    vendor: './frontend/assets/js/vendor.js'
  },
  output: {
    path: path.resolve(__dirname, 'frontend/dist'),
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    }
  },
  devServer: {
    contentBase: path.join(__dirname, "frontend"),
    compress: true,
    port: 9000
  }
};