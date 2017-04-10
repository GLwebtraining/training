'use strict';

const rimraf = require('rimraf');

module.exports = {
	context: __dirname + '/app',
	entry: './app.ts',
	output: {
		path: __dirname + '/public',
		filename: 'build.js'
	},
	watch: true,
	watchOptions: {
		aggregateTimeout: 100
	},
	devtool: 'cheap-inline-module-source-map',
	resolve: {
		extensions: ['.ts', '.js']
	},
	module: {
		loaders: [
			{
				test: /\.ts$/,
				loader: 'awesome-typescript-loader'
			},
			{
				test: /\.scss$/,
				loader: 'style-loader!css-loader!sass-loader'
			}
		]
	},
	plugins: [
		{
			apply: function(compiler){
				rimraf.sync(compiler.options.output.path);
			}
		}
	]
};