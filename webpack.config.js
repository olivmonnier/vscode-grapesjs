const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
	entry: "./public/src/js/app.js",
	output: {
		path: path.resolve(__dirname, 'public/build'),
		filename: 'app.bundle.js'
	},
	externals: {
		grapesjs: 'grapesjs'
	},
	module: {
		rules: [
			{
				test: /\.m?js$/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env']
					}
				}
			},
			{
				test: /\.css$/i,
				use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
			},
			{
				test: /\.(woff|woff2|eot|ttf|png|jp(e*)g|gif|svg)$/,
				use: 'url-loader'
			}
		]
	},
	plugins: [
    new CopyPlugin([
      'node_modules/grapesjs/dist'
    ]),
  ]
}