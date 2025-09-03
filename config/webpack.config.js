const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const DeployPlugin = require('./webpack.deploy-plugin');

module.exports = (env = {}) => {
  const isProduction = env.production;
  
  return {
    mode: isProduction ? 'production' : 'development',
    entry: {
      main: './frontend/assets/js/main.js',
      home: './frontend/assets/js/home.js',
      products: './frontend/assets/js/products.js',
      cart: './frontend/assets/js/cart.js',
      auth: './frontend/assets/js/auth.js',
      admin: './frontend/assets/js/admin.js',
      checkout: './frontend/assets/js/checkout.js',
      profile: './frontend/assets/js/profile.js',
      orders: './frontend/assets/js/orders.js',
      wishlist: './frontend/assets/js/wishlist.js',
      contact: './frontend/assets/js/contact.js',
      theme: './frontend/assets/js/theme.js'
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isProduction ? '[name].[contenthash].js' : '[name].js',
      clean: true
    },
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './frontend/index.html',
        filename: 'index.html',
        chunks: ['main', 'home', 'theme']
      }),
      new HtmlWebpackPlugin({
        template: './frontend/products.html',
        filename: 'products.html',
        chunks: ['main', 'products', 'theme']
      }),
      new HtmlWebpackPlugin({
        template: './frontend/cart.html',
        filename: 'cart.html',
        chunks: ['main', 'cart', 'theme']
      }),
      new HtmlWebpackPlugin({
        template: './frontend/login.html',
        filename: 'login.html',
        chunks: ['main', 'auth', 'theme']
      }),
      new HtmlWebpackPlugin({
        template: './frontend/register.html',
        filename: 'register.html',
        chunks: ['main', 'auth', 'theme']
      }),
      new HtmlWebpackPlugin({
        template: './frontend/admin.html',
        filename: 'admin.html',
        chunks: ['main', 'admin', 'theme']
      }),
      new HtmlWebpackPlugin({
        template: './frontend/admin-orders.html',
        filename: 'admin-orders.html',
        chunks: ['main', 'admin', 'theme']
      }),
      new HtmlWebpackPlugin({
        template: './frontend/checkout.html',
        filename: 'checkout.html',
        chunks: ['main', 'checkout', 'theme']
      }),
      new HtmlWebpackPlugin({
        template: './frontend/profile.html',
        filename: 'profile.html',
        chunks: ['main', 'profile', 'theme']
      }),
      new HtmlWebpackPlugin({
        template: './frontend/orders.html',
        filename: 'orders.html',
        chunks: ['main', 'orders', 'theme']
      }),
      new HtmlWebpackPlugin({
        template: './frontend/wishlist.html',
        filename: 'wishlist.html',
        chunks: ['main', 'wishlist', 'theme']
      }),
      new HtmlWebpackPlugin({
        template: './frontend/contact.html',
        filename: 'contact.html',
        chunks: ['main', 'contact', 'theme']
      }),
      new HtmlWebpackPlugin({
        template: './frontend/about.html',
        filename: 'about.html',
        chunks: ['main', 'theme']
      }),
      new HtmlWebpackPlugin({
        template: './frontend/faq.html',
        filename: 'faq.html',
        chunks: ['main', 'theme']
      }),
      // Add deploy plugin only in production mode
      ...(isProduction ? [new DeployPlugin({
        destination: 'server',
        backup: true
      })] : [])
    ],
    devtool: isProduction ? 'source-map' : 'inline-source-map',
    devServer: {
      static: './dist',
      open: true,
      hot: true,
      port: 3000
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
      },
    },
  };
};