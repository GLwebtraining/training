
const NODE_ENV = process.env.NODE_ENV || 'development';
const webpack = require('webpack');

console.log(process.env.NODE_ENV, NODE_ENV, NODE_ENV == process.env.NODE_ENV)

//module.exports = [{}, {}, {}];

module.exports = {
	context: __dirname + '/frontend',

	entry: {
		home: './home',
		about: './about',
		common: ['./welcome', './common']
	},

	output: {
		path: __dirname + '/public',
		filename: '[name].js',
		library: '[name]'
	},

	watch: NODE_ENV == 'development',

	watchOptions: {
		aggregateTimout: 100
	},
	devtool: NODE_ENV == 'development' ? 'cheap-inline-module-source-map' : false,

	plugins: [
		new webpack.optimize.CommonsChunkPlugin({
			name: 'common',
			minChunks: 2
		}),
		new webpack.NoEmitOnErrorsPlugin(),
		new webpack.DefinePlugin({
			NODE_ENV: JSON.stringify(NODE_ENV)
		})
	],

	module: {
		loaders: [{
			test: /\.js$/,
			loader: 'babel-loader'
		}]
	}
};

if(NODE_ENV == 'production'){
	module.exports.plugins.push(new webpack.optimize.UglifyJsPlugin({
		compress: {
			warnings: false,
			drop_console: false,
			unsafe: false
		}
	}));
}