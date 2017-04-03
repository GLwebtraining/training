
const NODE_ENV = process.env.NODE_ENV || 'development';
const webpack = require('webpack');

console.log(process.env.NODE_ENV, NODE_ENV, NODE_ENV == process.env.NODE_ENV)

module.exports = {
	context: __dirname + '/frontend',

	entry: {
		app: './app'
	},

	output: {
		path: __dirname + '/public/js',
		publicPath: '/js/',
		filename: '[name].js'
	},

	watch: NODE_ENV == 'development',

	watchOptions: {
		aggregateTimout: 100
	},
	devtool: NODE_ENV == 'development' ? 'cheap-inline-module-source-map' : false,

	plugins: [
		new webpack.NoEmitOnErrorsPlugin()
	]
};