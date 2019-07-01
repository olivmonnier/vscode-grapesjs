const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

module.exports = env => ({
  entry: {
    app: './src/ui/js/app.js'
  },
  output: {
    path: path.resolve(__dirname, 'out/ui'),
    filename: '[name].bundle.js'
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          enforce: true,
          chunks: 'initial'
        }
      }
    }
  },
  externals: {
    grapesjs: 'grapesjs'
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.css$/i,
        use: [{ loader: 'style-loader' }, { loader: 'css-loader' }]
      },
      {
        test: /\.(woff|woff2|eot|ttf|png|jp(e*)g|gif|svg)$/,
        use: 'url-loader'
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyPlugin([{ from: './node_modules/grapesjs/dist/grapes.min.js', to: './' }]),
    new webpack.DefinePlugin({
      PRODUCTION: env.production === true
    })
  ]
});
