'use strict';

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const helpers = require('./src/helper');
const ENV = process.env.NODE_ENV = process.env.ENV = 'production';

module.exports = {
	entry: {
		'polyfills': './src/polyfills.ts',
		'vendor': './src/vendor.ts',
		'app': './src/main.ts'
	},

	output: {
		path: helpers.root('dist'),
		filename: '[name].[hash].js',
		chunkFilename: '[id].[hash].chunk.js'
	},

	devtool: 'cheap-inline-module-source-map',

	resolve: {
		extensions: ['.ts', '.js']
	},

	module: {
		rules: [
			{
		        test: /\.ts$/,
		        loader: 'awesome-typescript-loader'
			},
			{
		        test: /\.html$/,
		        loader: 'html-loader'
			},
			{
				test: /\.scss$/,
				loader: ExtractTextPlugin.extract({fallback: "style-loader", use: "css-loader!resolve-url-loader!sass-loader"})
			},
			{
				test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
				loader: 'file-loader?name=assets/[name].[hash].[ext]'
			}
		]
	},

	  plugins: [
	    // Workaround for angular/angular#11580
	    new webpack.ContextReplacementPlugin(
	      // The (\\|\/) piece accounts for path separators in *nix and Windows
	      /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
	      helpers.root('./src'), // location of your src
	      {} // a map of your routes
	    ),

	    new webpack.optimize.CommonsChunkPlugin({
	      name: ['app']
	    }),

	    new HtmlWebpackPlugin({
	      template: 'src/index.html'
	    }),
	    new webpack.NoEmitOnErrorsPlugin(),
	    new webpack.optimize.UglifyJsPlugin({ // https://github.com/angular/angular/issues/10618
	      mangle: {
	        keep_fnames: true
	      }
	    }),
	    new ExtractTextPlugin('[name].[hash].css'),
	    new webpack.DefinePlugin({
	      'process.env': {
	        'ENV': JSON.stringify(ENV)
	      }
	    }),
	    new webpack.LoaderOptionsPlugin({
	      htmlLoader: {
	        minimize: false // workaround for ng2
	      }
	    })
	  ]
};